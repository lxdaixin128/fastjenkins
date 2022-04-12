import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils/message';
import { MsgType } from '@/types/global';
import Connector from './components/Connector';
import JobItem from './components/JobItem';
import { Tabs, TabPane } from '@/src/components/Tab';
import { Job, SettingSyncMsg } from '@/src/types';
interface Tab {
  name: string;
  key: string;
  content: JSX.Element;
}

function Home() {
  const { state, dispatch } = useContext(AppContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!state.connected) return;
    sendMessage(MsgType.JobList).then((res) => {
      console.log('res', res);
      setJobs(res.data);
    });
  }, [state.connected]);

  useEffect(() => {
    const settingSyncMsg: SettingSyncMsg = {
      type: 'read',
      key: 'favors',
    };
    sendMessage(MsgType.SettingSync, settingSyncMsg).then((res: any) => {
      dispatch({
        type: 'favors',
        payload: res.data,
      });
    });
  }, []);

  const tabs = useMemo<Tab[]>(() => {
    const favorJobs = jobs.filter((job: Job) => state.favors.includes(job.name));
    return [
      {
        name: '收藏',
        key: '0',
        content: (
          <>
            {favorJobs.length ? (
              favorJobs.map((job: Job) => {
                return <JobItem data={job} key={job.name} />;
              })
            ) : (
              <div className="emptyJobs">暂无收藏</div>
            )}
          </>
        ),
      },
      {
        name: '全部',
        key: '1',
        content: (
          <>
            {jobs.length ? (
              jobs.map((job: Job) => {
                return <JobItem data={job} key={job.name} />;
              })
            ) : (
              <div className="emptyJobs">暂无项目</div>
            )}
          </>
        ),
      },
    ];
  }, [jobs, state.favors]);

  function callback(key: string) {
    // console.log(key);
  }

  return (
    <div react-component="Home">
      <div className="tabContainer">
        <Tabs onChange={callback}>
          {tabs.map(({ name, key, content }: Tab) => {
            return (
              <TabPane tab={name} key={key}>
                {content}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
      <Connector />
    </div>
  );
}
export default Home;
