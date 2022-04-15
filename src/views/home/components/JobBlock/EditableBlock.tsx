import { Input } from 'antd';
import { useEffect, useRef, useState, FocusEvent, ChangeEvent, KeyboardEvent } from 'react';

interface EditableBlockProps {
  value: string;
  trigger?: 'click' | 'dblclick';
  default: string;
  onChange?: (value: string) => void;
}

function EditableBlock(props: EditableBlockProps) {
  const [value, setValue] = useState(props.value);

  const trigger = props.trigger || 'click';

  const blockRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<any>(null);

  const [editable, setEditable] = useState(false);
  useEffect(() => {
    blockRef.current?.addEventListener(trigger, () => {
      setEditable(true);
    });
  }, []);

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

  const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    setEditable(false);
    const postValue = event.target.value;
    if (postValue === '') {
      setValue(props.default);
    }
    if (postValue !== props.value && props.onChange) {
      props.onChange(event.target.value);
    }
  };

  // 回车
  const onInputPressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEditable(false);
    const postValue = (event.target as any).value;
    if (postValue === '') {
      setValue(props.default);
    }
    if (postValue !== props.value && props.onChange) {
      props.onChange((event.target as any).value);
    }
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

export default EditableBlock;
