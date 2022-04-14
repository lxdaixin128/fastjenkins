import { AppContext } from '@/src/state';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { CSSProperties, useContext, useMemo } from 'react';

function Favor(props: any) {
  const { state, dispatch } = useContext(AppContext);
  const favors: string[] = state.favors;
  const name = props.name;
  const addFavor = () => {
    dispatch({
      type: 'favors',
      payload: [...favors, name],
    });
  };

  const removeFavor = () => {
    const index = favors.findIndex((e) => e === name);
    favors.splice(index, 1);
    dispatch({
      type: 'favors',
      payload: [...state.favors],
    });
  };

  const iconStyle = useMemo<CSSProperties>(() => {
    return {
      fontSize: '20px',
    };
  }, []);
  return (
    <div style={{ marginRight: '24px' }} onClick={props.onChange}>
      {favors.includes(name) ? (
        <HeartFilled style={{ ...iconStyle, color: '#f759ab' }} onClick={removeFavor} />
      ) : (
        <HeartOutlined style={{ ...iconStyle }} onClick={addFavor} />
      )}
    </div>
  );
}

export default Favor;
