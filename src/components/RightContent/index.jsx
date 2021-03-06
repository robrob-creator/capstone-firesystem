import { Button, Dropdown, Menu, Space } from 'antd';
import { QuestionCircleOutlined, BellFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useModel, SelectLang, history } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIcon from '../NoticeIcon/NoticeIcon';
import fire from '@/services/firebase-config/api';
import './index.css';

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');
  const [notif, setNotif] = useState([]);
  const [warnCount, setWarnCount] = useState([]);

  useEffect(() => {
    countWarnings();
    notifications();
  }, []);

  const notifications = () => {
    const notifRef = fire.database().ref('Notifications');
    notifRef.on('value', (snapshot) => {
      const notif = snapshot.val();
      setNotif(notif);
    });
  };

  const countWarnings = () => {
    const warnRef = fire.database().ref('messages');
    warnRef.on('value', (snapshot) => {
      const warn = snapshot.val();
      const newData = Object.entries(warn);
      const warnList = [];
      for (let id in newData) {
        warnList.push({ id, ...newData[id].filter((e) => typeof e !== 'string') });
      }
      let secondData = warnList.map((data) => data[0]);
      let thirdData = secondData.flat();
      let fourthData = thirdData.map((data) => Object.entries(data));
      setWarnCount(fourthData);
    });
  };

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const menu = (
    <Menu
      items={[
        {
          label: (
            <a
              onClick={() => {
                history.push('/fire-reports');
              }}
            >
              Fire Reports (
              {Object.values(notif || {})
                .flat()
                .filter((n) => n.status === 0).length -
                notif?.Admin?.filter((n) => n.status === 0)?.length || 0}
              )
            </a>
          ),
        },
        {
          label: (
            <a
              onClick={() => {
                history.push('/warning-messages');
              }}
            >
              Messages({warnCount?.flat()?.filter((n) => n[1]?.details?.status === 0).length})
            </a>
          ),
        },
      ]}
    />
  );

  return (
    <Space className={className}>
      <menu />
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="????????????"
        defaultValue="umi ui"
        options={[
          {
            label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
            value: 'umi ui',
          },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]} // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      <span
        className={styles.action}
        onClick={() => {
          history.push('/fire-reports');
        }}
      >
        {' '}
      </span>
      <Dropdown overlay={menu} placement="topRight" arrow={{ pointAtCenter: true }}>
        <Button ghost type="link">
          {' '}
          <NoticeIcon
            count={
              warnCount?.flat()?.filter((n) => n[1]?.details?.status === 0).length +
                Object.values(notif || {})
                  .flat()
                  .filter((n) => n.status === 0).length -
                notif?.Admin?.filter((n) => n.status === 0)?.length || 0
            }
          />
        </Button>
      </Dropdown>

      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
