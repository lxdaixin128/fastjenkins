import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils';
import { MsgType } from '@/types/global';
import Connector from './components/Connector';
import JobItem from './components/JobItem';
import { Tabs, TabPane } from '@/src/components/Tab';
interface Tab {
  name: string;
  key: string;
  content: JSX.Element;
}
function Home() {
  const { state, dispatch } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    if (!state.connected) return;
    sendMessage(MsgType.JobList).then((res) => {
      console.log(res.data);
      setJobs(res.data);
    });
  }, [state.connected]);

  const tabs = useMemo<Tab[]>(() => {
    // console.log('jobs', jobs);
    const favorJobs = jobs.filter((job: any) => state.favors.includes(job.name));
    return [
      {
        name: '收藏',
        key: '0',
        content: (
          <>
            {favorJobs.length ? (
              favorJobs.map((job: any) => {
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
              jobs.map((job: any) => {
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
        <Tabs defaultActiveKey={state.favors.length ? '0' : '1'} onChange={callback}>
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
