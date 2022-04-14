import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils/message';
import Connector from './components/Connector';
import JobBlock from './components/JobBlock';
import { Tabs, TabPane } from '@/src/components/Tab';
import { Job } from '@/src/types';
import { MsgType } from '@/types';
import { Input } from 'antd';
import { getStorage } from '@/src/utils/storage';
interface Tab {
  name: string;
  key: string;
  content: JSX.Element;
}

function Home() {
  const { state, dispatch } = useContext(AppContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState<string>('');

  // 获取Jobs
  useEffect(() => {
    if (!state.connected) return;
    sendMessage(MsgType.JobList).then((res) => {
      setJobs(res.data);
    });
  }, [state.connected]);

  // 搜索框搜索
  const searchChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSearch(value);
  };

  const tabs = useMemo<Tab[]>(() => {
    jobs.forEach((job: Job) => {
      job.alia = state.alias[job.name];
    });
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
                return <JobBlock data={job} key={job.name} />;
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
                  <Input value={search} placeholder="搜索" onChange={searchChange} />
                </div>
                {searchJobs.map((job: Job) => {
                  return <JobBlock data={job} key={job.name} />;
                })}
              </>
            ) : (
              <div className="emptyJobs">暂无项目</div>
            )}
          </>
        ),
      },
    ];
  }, [jobs, state.favors, state.alias, search]);

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
