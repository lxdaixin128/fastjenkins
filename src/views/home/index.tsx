import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils/message';
import { MsgType } from '@/types/global';
import Connector from './components/Connector';
import JobItem from './components/JobItem';
import { Tabs, TabPane } from '@/src/components/Tab';
import { Job, SettingSyncMsg } from '@/src/types';
import { Input } from 'antd';
interface Tab {
  name: string;
  key: string;
  content: JSX.Element;
}

function Home() {
  const { state, dispatch } = useContext(AppContext);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [search, setSearch] = useState('');

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

  const searchChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSearch(value);
  };

  const tabs = useMemo<Tab[]>(() => {
    const favorJobs = jobs.filter((job: Job) => state.favors.includes(job.name));

    const searchJobs = jobs.filter((job: Job) => job.name.includes(search));

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
            {searchJobs.length ? (
              <>
                <div className="search">
                  <Input value={search} placeholder="检索" onChange={searchChange} />
                </div>
                {searchJobs.map((job: Job) => {
                  return <JobItem data={job} key={job.name} />;
                })}
              </>
            ) : (
              <div className="emptyJobs">暂无项目</div>
            )}
          </>
        ),
      },
    ];
  }, [jobs, state.favors, search]);

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
