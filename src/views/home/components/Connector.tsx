import { AppContext } from '@/src/state';
import { sendMessage } from '@/src/utils/message';
import { Button, Switch } from 'antd';
import { MsgType } from '@/types';
import { useCallback, useContext, useEffect, useState } from 'react';

import '../style.less';
import { SettingFilled } from '@ant-design/icons';
function Connector() {
  const { state, dispatch } = useContext(AppContext);

  // 连接状态
  const [status, setStatus] = useState(0); // 0 未连接 1 连接成功 2 连接失败

  // 显示设置弹窗
  const [modalShow, setModalShow] = useState(false);

  const toggleModal = () => {
    setModalShow(!modalShow);
  };

  const [userInfo, setUserInfo] = useState({
    userName: '',
    userId: '',
    email: '',
  });

  // 连接服务器（获取用户信息、设置连接状态）
  const connect = useCallback(() => {
    sendMessage(MsgType.Connect).then((res) => {
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

  // 切换隐藏备注
  const toggleAliasHidden = (hidden: boolean) => {
    dispatch({
      type: 'settings',
      payload: ['aliasHidden', hidden],
    });
  };

  // 切换显示隐藏的属性
  const togglePropertiesShow = (show: boolean) => {
    dispatch({
      type: 'settings',
      payload: ['propertiesShow', show],
    });
  };

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
      <div className="connectBar">
        {getInfo()}
        <SettingFilled className="icon" onClick={toggleModal} />
      </div>
      <div className={`settingModal ${modalShow ? 'show' : ''}`}>
        <div className="setItem">
          <div>隐藏备注</div>
          <Switch onChange={toggleAliasHidden} size="small" />
        </div>
        <div className="setItem">
          <div>显示隐藏的属性</div>
          <Switch onChange={togglePropertiesShow} size="small" />
        </div>
      </div>
      <div className={`mask ${modalShow ? 'show' : ''}`} onClick={toggleModal}></div>
    </div>
  );
}

export default Connector;
