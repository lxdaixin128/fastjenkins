import { AppContext } from '@/src/state';
import { Property } from '@/src/types';
import { Input } from 'antd';
import { memo, ChangeEvent, useContext, useMemo } from 'react';

interface PropertyBlockProps {
  data: Property;
  onValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function PropertyBlock(props: PropertyBlockProps) {
  const { state, dispatch } = useContext(AppContext);

  const _hp = state.hiddenProperties;

  const _p = props.data;

  const hideProperty = () => {
    _hp.push(_p.name);
    dispatch({
      type: 'hiddenProperties',
      payload: [...new Set(_hp)],
    });
  };

  const showProperty = () => {
    const idx = _hp.findIndex((name: string) => name === _p.name);
    _hp.splice(idx, 1);
    dispatch({
      type: 'hiddenProperties',
      payload: [...new Set(_hp)],
    });
  };

  return (
    <div className="property">
      <div className="name">
        <div>{_p.name}</div>
        <div>
          {state.settings.propertiesSwitchShow &&
            (_p.isHidden ? (
              <div className="hideBtn" onClick={showProperty}>
                恢复显示
              </div>
            ) : (
              <div className="hideBtn" onClick={hideProperty}>
                全局隐藏
              </div>
            ))}
        </div>
      </div>
      <Input value={_p.value} onChange={props.onValueChange} />
      <div className="desc">{_p.description}</div>
    </div>
  );
}

export default memo(PropertyBlock);
