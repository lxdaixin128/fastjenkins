import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils/message';
import Connector from './components/Connector';
import JobBlock from './components/JobBlock';
import { Tabs, TabPane } from '@/src/components/Tab';
import { Job } from '@/src/types';
import { MsgType } from '@/types';
import { Input } from 'antd';
import NProgress from 'nprogress';
NProgress.configure({ showSpinner: false });

interface Tab {
  name: string;
  key: string;
  content: JSX.Element;
}

function Home() {
  const { state, dispatch } = useContext(AppContext);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState<string>('');

  /*
   * 获取Jobs
   * 监听连接状态，想要刷新Jobs只需使连接状态加1
   */
  useEffect(() => {
    if (!state.connected) return;
    NProgress.start();
    sendMessage(MsgType.JobList).then((res) => {
      NProgress.done();
      setJobs(res.data);
    });
  }, [state.connected]);

  // 搜索框搜索
  const searchChange = (event: any) => {
    const value = event.target.value;
    setSearch(value);
  };

  const tabs = useMemo<Tab[]>(() => {
    jobs.forEach((job: Job) => {
      job.alia = state.alias[job.name];
    });
    const favorJobs = jobs.filter((job: Job) => state.favors.includes(job.name));
    const searchJobs = jobs.filter((job: Job) => {
      return job.name.includes(search) || job.alia?.includes(search);
    });

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
            <div className="search">
              <Input value={search} placeholder="搜索" onChange={searchChange} />
            </div>
            {searchJobs.length ? (
              searchJobs.map((job: Job) => {
                return <JobBlock data={job} key={job.name} />;
              })
            ) : (
              <div className="emptyJobs">暂无项目</div>
            )}
          </>
        ),
      },
    ];
  }, [jobs, state.favors, state.alias, search]);

  return (
    <div react-component="Home">
      <div className="tabContainer">
        <Tabs>
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
