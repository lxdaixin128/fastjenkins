import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils/message';
import { Button } from 'antd';
import { MsgType } from '@/types';
import { useCallback, useContext, useEffect, useState } from 'react';
import NProgress from 'nprogress';
import '../style.less';
function Connector() {
  const { state, dispatch } = useContext(AppContext);

  const [status, setStatus] = useState(0); // 0 未连接 1 连接成功 2 连接失败
  const [userInfo, setUserInfo] = useState({
    userName: '',
    userId: '',
    email: '',
  });

  // 连接服务器（获取用户信息、设置连接状态）
  const connect = useCallback(() => {
    NProgress.start();
    sendMessage(MsgType.Connect).then((res) => {
      NProgress.done();
      if (res.status === 200) {
        setStatus(1);
        setUserInfo(res.data);
        dispatch({
          type: 'userInfo',
          payload: res.data,
        });
        // 刷新Jobs
        dispatch({
          type: 'connected',
          payload: state.connected + 1,
        });
      } else {
        setStatus(2);
        dispatch({
          type: 'connected',
          payload: 0,
        });
      }
    });
  }, []);

  // 初始化时自动连接
  useEffect(connect, []);

  function getInfo() {
    switch (status) {
      case 0:
        return <div>连接中...</div>;
      case 1:
        return (
          <div>
            <span className="success">连接成功! </span>
            欢迎: {userInfo.userName}
          </div>
        );
      case 2:
        return (
          <div>
            <span className="failed">连接失败! </span>
            请检查配置和网络
            <Button size="small" type="link" onClick={connect}>
              重新连接
            </Button>
          </div>
        );
    }
  }
  return (
    <div react-component="Connector">
      <div className="blank"></div>
      <div className="fixedBot">
        <div className="connectBar">{getInfo()}</div>
      </div>
    </div>
  );
}

export default Connector;
