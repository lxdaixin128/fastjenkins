import { AppContext } from '@/src/state';
import { Job, Property } from '@/src/types';
import { MsgType } from '@/types';
import { formatTime } from '@/src/utils';
import { sendMessage } from '@/src/utils/message';
import { DownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { CSSProperties, useContext, useEffect, useMemo, useState } from 'react';
import EditableBlock from './EditableBlock';
import Favor from './Favor';
import { addTask, getTasks, removeTask, Task } from '@/src/utils/tasks';
const failedColor = '#cf1322';
const successColor = '#389e0d';

interface JobBlockProps {
  data: Job;
}

function JobBlock(props: JobBlockProps) {
  const { state, dispatch } = useContext(AppContext);
  const name = props.data.name;
  const alia = props.data.alia || name;
  // 设置备注
  const setAlia = (value: string) => {
    const payload = { ...state.alias };
    payload[name] = value;
    dispatch({
      type: 'alias',
      payload,
    });
  };

  const lastBuild = Object.assign(
    {
      id: '-1',
      estimatedDuration: 60,
      result: 'SUCCESS',
      timestamp: 0,
    },
    props.data.lastBuild,
  );

  const progressInit = {
    name: '初始化中...',
    percent: 0,
    status: 'IN_PROGRESS',
    durationMillis: '',
  };

  // 初始化时查询任务列表并重现任务
  useEffect(() => {
    const taskFinded = getTasks().find((task: Task) => task.name === name);
    if (taskFinded) {
      getBuildStatus();
      setIsBuilding(true);
    }
  }, []);

  // 进度条
  const [progress, setProgress] = useState(progressInit);
  // 控制属性折叠
  const [collapse, setCollapse] = useState(true);
  // 属性
  const [properties, setProperties] = useState<Property[]>(props.data.properties);
  // 构建状态
  const [isBuilding, setIsBuilding] = useState(false);

  // 停止构建
  const stopBuilding = () => {
    setIsBuilding(false);
    removeTask(name);
  };

  /*
   * Job属性编辑
   */
  const inputChange = (index: number, event: any) => {
    const {
      target: { value },
    } = event;
    setProperties((properties: Property[]) => {
      properties[index].value = value;
      return [...properties];
    });
  };

  /*
   * JobBlock折叠切换
   */
  const toggleCollapse = () => {
    if (isBuilding) {
      return;
    }
    setCollapse(!collapse);
  };

  /*
   * 获取构建进度（定时器循环）
   */
  const getBuildStatus = () => {
    interface BuildStatusParams {
      _: number;
      since?: string;
    }
    const params: BuildStatusParams = {
      _: 0,
    };
    const startTime = new Date().getTime();
    const progressGoStep = () => {
      params._ = new Date().getTime();
      sendMessage(MsgType.BuildStatus, { jobName: name, params }).then((res: any) => {
        res = res.data;
        params.since = res.name;
        const isNewBuild = res.id !== lastBuild.id;
        if (isNewBuild) {
          const lastStage = res.stages.at(-1);
          const newProgress = { ...progressInit };
          const estimatedDuration = lastBuild.estimatedDuration;
          const durationMillis = res?.durationMillis || 0;
          let percent = durationMillis / estimatedDuration;
          percent = percent > 1 ? 0.95 : percent;
          newProgress.percent = percent;
          newProgress.durationMillis = (durationMillis / 1000).toFixed(1) + 's';
          newProgress.status = res.status;
          lastStage?.name && (newProgress.name = lastStage?.name);
          if (res.status === 'SUCCESS') {
            // 刷新状态
            dispatch({
              type: 'connected',
              payload: state.connected + 1,
            });
            clearInterval(interval);
            newProgress.percent = 1;
            newProgress.name = '构建完成';
            setTimeout(() => {
              setProgress({ ...progressInit });
              stopBuilding();
            }, 3000);
          }
          if (res.status === 'FAILED') {
            // 刷新状态
            dispatch({
              type: 'connected',
              payload: state.connected + 1,
            });
            clearInterval(interval);
            newProgress.percent = 1;
            newProgress.name = '构建失败';
            setTimeout(() => {
              setProgress({ ...progressInit });
              stopBuilding();
            }, 3000);
          }
          setProgress({ ...newProgress });
        } else {
          const stepTime = params._;
          if (stepTime - startTime > 10000) {
            // 刷新状态
            dispatch({
              type: 'connected',
              payload: state.connected + 1,
            });
            clearInterval(interval);
            stopBuilding();
          }
        }
      });
    };
    const interval = setInterval(
      (() => {
        // 立即触发一次
        progressGoStep();
        return progressGoStep;
      })(),
      2000,
    );
  };

  /*
   * 进度条样式
   */
  const stageBarStyle = useMemo<CSSProperties>(() => {
    const { percent, status } = progress;
    let color = '#40a9ff'; // IN_PROGRESS
    switch (status) {
      case 'SUCCESS':
        color = successColor;
        break;
      case 'FAILED':
        color = failedColor;
        break;
    }
    return {
      width: `calc(${30 + 70 * percent}% - 12px)`,
      backgroundColor: color,
      boxShadow: `0 0 4px ${color}`,
    };
  }, [progress]);

  const build = () => {
    setIsBuilding(true);
    addTask(name, lastBuild.estimatedDuration);
    setCollapse(true);

    const params: any = {};
    properties?.forEach((property: Property) => {
      if (property.value !== '') {
        params[property.name] = property.value;
      }
    });
    sendMessage(MsgType.Build, { jobName: name, params }).then((res: Message) => {
      if (res.status !== 200) {
        stopBuilding();
      } else {
        getBuildStatus();
      }
    });
  };
  return (
    <div react-component="JobBlock">
      <div className="header">
        <EditableBlock value={alia} default={name} trigger="dblclick" onChange={setAlia} />
        <div className="icon" onClick={toggleCollapse}>
          {isBuilding ? (
            <ThunderboltOutlined className="loadingThunder" />
          ) : (
            <DownOutlined style={{ transform: collapse ? 'rotateX(0deg)' : 'rotateX(180deg)' }} />
          )}
        </div>
      </div>
      <div className="collapseSection" style={{ height: collapse ? '0px' : 20 + 64 * properties?.length + 'px' }}>
        <div style={{ padding: '10px' }}>
          {properties.map((_p: Property, index: number) => {
            return (
              <div className="property" key={index}>
                <div className="name">{_p.name}</div>
                <Input value={_p.value} onChange={(event) => inputChange(index, event)} />
                <div className="desc">{_p.description}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="operation">
        <div className="lastBuild">
          {lastBuild.id !== '-1' ? (
            <>
              <div
                className="tag"
                style={{ backgroundColor: lastBuild.result === 'SUCCESS' ? successColor : failedColor }}
              >
                #{lastBuild.id}
              </div>
              <div className="tag">{formatTime(lastBuild.timestamp, '{y}-{m}-{d}')}</div>
            </>
          ) : (
            <div className="tag">暂无构建</div>
          )}
        </div>
        <div className="favor">
          <Favor name={name} />
        </div>
        <div className={`buildBar ${isBuilding ? 'build' : ''}`}>
          {isBuilding ? (
            <div className="stageBar" style={stageBarStyle}>
              <div className="name">{progress.name}</div>
              {/* <div>{(progress.percent * 100).toFixed(1)}%</div> */}
              <div>{progress.durationMillis}</div>
            </div>
          ) : (
            <div className="buildBtn" onClick={build}>
              开始构建
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobBlock;
