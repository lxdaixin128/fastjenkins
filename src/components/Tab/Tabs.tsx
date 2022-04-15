import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import './style.less';

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultActiveKey?: string;
  children: React.ReactNode[];
  onChange?: (activeKey: string) => void;
}

function Tabs(props: TabsProps) {
  const tabsEl = useRef<HTMLDivElement | null>(null);
  const tabs = useMemo(
    () =>
      props.children?.map(({ key, props: { tab: name } }: any) => ({
        key,
        name,
      })),
    [props.children],
  );
  const defaultTab = useMemo(
    () => tabs.findIndex((e: any) => e.key === props.defaultActiveKey),
    [props.defaultActiveKey],
  );
  const [curTab, setCurTab] = useState(defaultTab === -1 ? 0 : defaultTab);

  // tabs容器宽度
  const [tabsWidth, setTabsWidth] = useState(0);

  useEffect(() => {
    setTabsWidth(tabsEl.current?.clientWidth || 0);
    window.onresize = () => {
      setTabsWidth(tabsEl.current?.clientWidth || 0);
    };
  }, []);

  const tabsPadding = 7;
  const sliderStyle = useMemo<CSSProperties>(() => {
    const tabWidth = (tabsWidth - 2 * tabsPadding) / tabs.length;
    const left = curTab * tabWidth;
    return {
      position: 'absolute',
      top: '0px',
      bottom: '0px',
      margin: 'auto 0',
      left: tabsPadding + left + 'px',
      height: `calc(100% - ${tabsPadding * 2}px)`,
      width: tabWidth + 'px',
      background: 'linear-gradient(#69c0ff, #40a9ff)',
      transition: 'left .3s',
      borderRadius: '6px',
      boxShadow: '0 0 4px #40a9ff',
    };
  }, [tabs, tabsWidth, curTab]);

  const changeTab = (index: number) => {
    setCurTab(index);
    const onChange = props.onChange;
    onChange && onChange(tabs[index].key);
  };
  return (
    <div react-component="Tabs">
      <div ref={tabsEl} className="tabs">
        {tabs.map((item: any, index: number) => {
          return (
            <div
              key={item.key}
              className="tab"
              onClick={() => changeTab(index)}
              style={{ color: curTab === index ? '#ffffff' : '#333333' }}
            >
              {item.name}
            </div>
          );
        })}
        <div style={sliderStyle}></div>
      </div>
      <div className="content">{props.children[curTab]}</div>
    </div>
  );
}

export default Tabs;
