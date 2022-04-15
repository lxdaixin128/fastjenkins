import { getSessionStorage, setSessionStorage } from './sessionStorage';

const KEY = 'tasks';

export interface Task {
  name: string; // 任务名称
  startTime: number; // 开始时间
  estimatedDuration: number; // 任务预估持续时间
}

// 获取任务列表
export const getTasks = () => {
  let tasks: Task[] = getSessionStorage(KEY) || [];
  const curStamp = new Date().getTime();
  // 清除已到预估结束时间的任务
  tasks = tasks.filter((task: Task) => {
    return curStamp - task.startTime < task.estimatedDuration;
  });
  setSessionStorage(KEY, tasks);
  return tasks;
};

// 添加任务
export const addTask = (name: string, estimatedDuration: number) => {
  const curStamp = new Date().getTime();
  let tasks: Task[] = getSessionStorage(KEY) || [];
  tasks.push({
    name,
    startTime: curStamp,
    estimatedDuration,
  });
  setSessionStorage(KEY, tasks);
};

// 移除任务
export const removeTask = (name: string) => {
  let tasks: Task[] = getSessionStorage(KEY) || [];
  tasks = tasks.filter((task: Task) => task.name !== name);
  setSessionStorage(KEY, tasks);
};
