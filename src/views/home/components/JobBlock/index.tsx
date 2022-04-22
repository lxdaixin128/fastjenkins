import { AppContext } from '@/src/state';
import { Job, Property } from '@/src/types';
import { MsgType } from '@/types';
import { formatTime } from '@/src/utils';
import { sendMessage } from '@/src/utils/message';
import { DownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { CSSProperties, memo, useContext, useEffect, useMemo, useRef, useState, ChangeEvent } from 'react';
import EditableBlock from './EditableBlock';
import Favor from './Favor';
import { addTask, getTasks, removeTask, Task } from '@/src/utils/tasks';
import PropertyBlock from './PropertyBlock';
const failedColor = '#cf1322';
const successColor = '#389e0d';

interface JobBlockProps {
  data: Job;
}

function JobBlock(props: JobBlockProps) {
  const { state, dispatch } = useContext(AppContext);
  const name = props.data.name;
  const alia = useMemo(() => {
    return (!state.settings.aliasHidden && props.data.alia) || name;
  }, [state.settings.aliasHidden, state.alias]);

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
    name: 'init...',
    percent: 0,
    status: 'IN_PROGRESS',
    durationMillis: '',
  };

  // 定时器容器
  const interval = useRef<NodeJS.Timeout | null>(null);

  // 初始化时查询任务列表并重现任务
  useEffect(() => {
    const taskFinded = getTasks().find((task: Task) => task.name === name);
    if (taskFinded) {
      getBuildStatus();
      setIsBuilding(true);
    }
    return () => {
      // 组件卸载时清除定时器
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  // 进度条
  const [progress, setProgress] = useState(progressInit);
  // 控制属性折叠
  const [collapse, setCollapse] = useState(true);
  // 属性
  const [properties, setProperties] = useState<Property[]>(props.data.properties);
  // 构建状态
  const [isBuilding, setIsBuilding] = useState(false);

  useEffect(() => {
    let _properties = props.data.properties.map((_p: Property) => {
      _p.isHidden = state.hiddenProperties.includes(_p.name);
      return _p;
    });

    if (!state.settings.propertiesSwitchShow) {
      _properties = properties.filter((_p: Property) => !_p.isHidden);
    }

    setProperties(_properties);
  }, [state.hiddenProperties, state.settings.propertiesSwitchShow]);

  // 停止构建
  const stopBuilding = () => {
    setIsBuilding(false);
    removeTask(name);
  };

  /*
   * Job属性编辑
   */
  const propertyValueChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
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
            clearInterval(interval.current!);
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
            clearInterval(interval.current!);
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
            clearInterval(interval.current!);
            stopBuilding();
          }
        }
      });
    };
    interval.current = setInterval(
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
      {/* 标题 */}
      <div className="header">
        <EditableBlock value={alia} jobName={name} editable={!state.settings.aliasHidden} trigger="dblclick" />
        <div className="icon" onClick={toggleCollapse}>
          {isBuilding ? (
            <ThunderboltOutlined className="loadingThunder" />
          ) : (
            <DownOutlined style={{ transform: collapse ? 'rotateX(0deg)' : 'rotateX(180deg)' }} />
          )}
        </div>
      </div>
      {/* 属性 */}
      <div className="collapseSection" style={{ height: collapse ? '0px' : 20 + 64 * properties?.length + 'px' }}>
        <div style={{ padding: '10px' }}>
          {!collapse &&
            properties.map((_p: Property, index: number) => {
              return (
                <PropertyBlock
                  data={_p}
                  key={index}
                  onValueChange={(event: ChangeEvent<HTMLInputElement>) => propertyValueChange(index, event)}
                />
              );
            })}
        </div>
      </div>
      {/* 操作 */}
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

export default memo(JobBlock);
