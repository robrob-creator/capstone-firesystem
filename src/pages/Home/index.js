import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { IndexColumn } from '@ant-design/pro-table';
import { getStations } from '@/services/stations/api';
import { getNotifications } from '@/services/notifications/api';
import { Avatar, Button } from 'antd';
import fire from '@/services/firebase-config/api';
import classes from './home.module.css';
import {
  CloudOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FireOutlined,
  FolderOpenOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Meta } from 'antd/lib/list/Item';

const Index = () => {
  const [stations, setStations] = useState([]);
  const [notif, setNotif] = useState([]);

  useEffect(() => {
    fetchStations();
    notifications();
  }, []);

  const fetchStations = async () => {
    let res = await getStations();
    setStations(res);
  };
  const notifications = () => {
    const notifRef = fire.database().ref('Notifications');
    notifRef.on('value', (snapshot) => {
      const notif = snapshot.val();
      console.log(notif);
      setNotif(notif);
    });
  };
  return (
    <>
      <ProCard
        title="Fire System Server"
        headerBordered
        collapsible
        onCollapse={(collapse) => console.log(collapse)}
        extra={
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            提交
          </Button>
        }
      >
        内容
      </ProCard>
      {Object.keys(stations).map(function (Station_Name, sorting) {
        if (Station_Name !== 'Admin') {
          return (
            <React.Fragment key={sorting}>
              <ProCard
                title={`${Station_Name} Alerts`}
                ghost
                gutter={8}
                collapsible
                scroll={{ x: 1300 }}
              >
                <ProCard
                  layout="center"
                  bordered
                  actions={[<EyeOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
                  style={{
                    backgroundColor:
                      notif[`${Station_Name}`]?.filter(
                        (station) => station.warning_message === '\nFire Detected!',
                      ).length === undefined ||
                      notif[`${Station_Name}`]?.filter(
                        (station) => station.warning_message === '\nFire Detected!',
                      ).length === 0
                        ? '#38b000'
                        : '#fb8500',
                    borderRadius: 10,
                    fontSize: '30px',
                    color: 'white',
                  }}
                >
                  <FireOutlined />
                  {
                    notif[`${Station_Name}`]?.filter(
                      (station) => station.warning_message === '\nFire Detected!',
                    ).length
                  }
                </ProCard>
                <ProCard
                  layout="center"
                  bordered
                  actions={[<EyeOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
                  style={{
                    backgroundColor:
                      notif[`${Station_Name}`]?.filter(
                        (station) => station.warning_message === '\nSmokeDetected!',
                      ).length === undefined ||
                      notif[`${Station_Name}`]?.filter(
                        (station) => station.warning_message === '\nSmokeDetected!',
                      ).length === 0
                        ? '#38b000'
                        : '#fb8500',
                    borderRadius: 10,
                    fontSize: '30px',
                    color: 'white',
                  }}
                >
                  <CloudOutlined />
                  {
                    notif[`${Station_Name}`]?.filter(
                      (station) => station.warning_message === '\nSmokeDetected!',
                    ).length
                  }
                </ProCard>
                <ProCard
                  layout="center"
                  bordered
                  actions={[<EyeOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
                  style={{
                    backgroundColor: '#778da9',
                    borderRadius: 10,
                    fontSize: '30px',
                    color: '#8ea3bf',
                  }}
                >
                  <FolderOpenOutlined />{' '}
                  {notif[`${Station_Name}`]?.length != undefined ? 'OPEN CASES' : ''}
                </ProCard>
              </ProCard>
            </React.Fragment>
          );
        }
      })}
    </>
  );
};

export default Index;
