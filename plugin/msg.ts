import MsgCenter from './lib/MsgCenter';
import { MsgType } from '@/types/global';
import { createService, getService } from './lib/JenkinsService';
import { workspace } from 'vscode';
let { service, settings } = getService();
const msgCenter = new MsgCenter();

/* 获取用户设置 */
msgCenter.subscribe(MsgType.UserSettings, function () {
  return Promise.resolve(settings);
});

/* 连接服务器 / 获取用户信息 */
msgCenter.subscribe(MsgType.Connect, function () {
  const jenkins = createService();
  service = jenkins.service;
  settings = jenkins.settings;
  return service!({
    url: `/user/${settings?.userId}/api/json`,
  }).then((res: any) => {
    res = res.data;
    const { fullName: userName, id: userId } = res;
    const email = res.property.find((e: any) => e._class === 'hudson.tasks.Mailer$UserProperty')?.address;
    return {
      userName,
      userId,
      email,
    };
  });
});

/* 获取Job列表 */
msgCenter.subscribe(MsgType.JobList, function () {
  const { propertyFilter } = workspace.getConfiguration('fastjenkins');
  const filterArray: string[] = propertyFilter?.replaceAll(' ', '').split(',') || [];

  return service!({
    url: `/api/json?tree=jobs[name,property[parameterDefinitions[description,defaultParameterValue[name,value]]],lastBuild[id,duration,estimatedDuration,timestamp,result]]`,
  }).then((res: any) => {
    res = res.data;
    console.log(filterArray, res.data);
    return res.jobs.map((job: any) => {
      const properties = job.property
        .find((e: any) => e._class === 'hudson.model.ParametersDefinitionProperty')
        ?.parameterDefinitions.map((e: any) => {
          return {
            description: e.description,
            name: e.defaultParameterValue.name,
            value: e.defaultParameterValue.value,
          };
        })
        .filter((e: any) => !filterArray.includes(e.name));
      return {
        name: job.name,
        lastBuild: job.lastBuild,
        properties,
      };
    });
  });
});

/* 构建 */
msgCenter.subscribe(MsgType.Build, function (data: any) {
  return service!({
    url: `/job/${data.jobName}/buildWithParameters`,
    method: 'POST',
    params: data.params,
  }).then((res: any) => {
    return res.data;
  });
});

/* 获取构建状态 */
msgCenter.subscribe(MsgType.BuildStatus, function (data: any) {
  return service!({
    url: `/job/${data.jobName}/wfapi/runs`,
    params: data.params,
  }).then((res: any) => {
    return res.data[0];
  });
});

export default msgCenter;
