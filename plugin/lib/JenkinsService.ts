import axios, { AxiosInstance } from 'axios';
import { workspace } from 'vscode';
// 关闭证书校验
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
interface UserSettings {
  userId: string;
  apiToken: string;
  domain: string;
}

interface JenkinsService {
  service: AxiosInstance | null;
  settings: UserSettings | null;
}

const jenkins: JenkinsService = {
  service: null,
  settings: null,
};

/**
 * 参数处理
 * @param {*} params  参数
 */
function tansParams(params: any) {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + '=';
    if (value !== null && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof value[key] !== 'undefined') {
            const params = propName + '[' + key + ']';
            const subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  return result;
}

export function createService() {
  const { userId, apiToken, domain } = workspace.getConfiguration('fastjenkins');
  if (userId && apiToken && domain) {
    jenkins.settings = {
      userId,
      apiToken,
      domain,
    };
  }

  // 创建axios实例
  jenkins.service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: domain,
    // 超时
    timeout: 5000,
    auth: {
      username: userId,
      password: apiToken,
    },
  });

  // request拦截器
  jenkins.service.interceptors.request.use(
    (config) => {
      // get请求映射params参数
      if (config.params) {
        let url = `${config.url}?${tansParams(config.params)}`;
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  // 响应拦截器
  jenkins.service.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return jenkins;
}

export function getService() {
  return jenkins.service ? jenkins : createService();
}
