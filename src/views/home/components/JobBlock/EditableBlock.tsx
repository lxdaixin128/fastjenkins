import { AppContext } from '@/src/state';
import { Input } from 'antd';
import { useEffect, useRef, useState, FocusEvent, ChangeEvent, KeyboardEvent, memo, useContext } from 'react';

interface EditableBlockProps {
  value: string;
  trigger?: 'click' | 'dblclick';
  jobName: string;
  editable: boolean;
  onChange?: (value: string) => void;
}

function EditableBlock(props: EditableBlockProps) {
  const { state, dispatch } = useContext(AppContext);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const trigger = props.trigger || 'click';

  const blockRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<any>(null);

  const [editable, setEditable] = useState(false);

  const editEvent = useRef(() => {
    setEditable(true);
  });

  useEffect(() => {
    if (props.editable) {
      blockRef.current?.addEventListener(trigger, editEvent.current);
    } else {
      blockRef.current?.removeEventListener(trigger, editEvent.current);
    }
  }, [props.editable]);

  useEffect(() => {
    if (editable) {
      inputRef.current!.focus({
        cursor: 'all',
      });
    }
  }, [editable]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // 输入框失去焦点
  const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    setEditable(false);
    const postValue = event.target.value;
    if (postValue === '') {
      setValue(props.jobName);
    }
    if (postValue !== props.value) {
      setAlia(event.target.value);
    }
  };

  // 回车
  const onInputPressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEditable(false);
    const postValue = (event.target as any).value;
    if (postValue === '') {
      setValue(props.jobName);
    }
    if (postValue !== props.value) {
      setAlia((event.target as any).value);
    }
  };

  // 设置备注
  const setAlia = (value: string) => {
    const payload = { ...state.alias };
    payload[props.jobName] = value;
    dispatch({
      type: 'alias',
      payload,
    });
  };

  return (
    <div ref={blockRef} className="title">
      {editable ? (
        <Input
          ref={inputRef}
          value={value}
          onBlur={onInputBlur}
          onPressEnter={onInputPressEnter}
          onChange={onInputChange}
        />
      ) : (
        <span title="双击修改备注">{value}</span>
      )}
    </div>
  );
}

export default memo(EditableBlock);
