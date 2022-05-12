/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { IndexColumn } from '@ant-design/pro-table';
import { getStations } from '@/services/stations/api';
import { getNotifications } from '@/services/notifications/api';
import { Avatar, Button, Card, message, Modal, Tag } from 'antd';
import fire from '@/services/firebase-config/api';
import { history, useIntl } from 'umi';
import classes from './home.module.css';
import {
  AlertOutlined,
  CloudOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FireOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Meta } from 'antd/lib/list/Item';

const ColorList = [
  '#7265e6',
  '#f56a00',
  '#ffbf00',
  '#00a2ae',
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
];

const gridStyle = {
  width: '25%',
  textAlign: 'center',
};

const Index = () => {
  const [stations, setStations] = useState([]);
  const [notif, setNotif] = useState([]);
  const [warn, setWarn] = useState({});
  const [state, setState] = useState({ visible: false });
  const [displayText, setDisplayText] = useState(true);
  const [modalData, setModalData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [prefilterdData, setPreData] = useState({});
  const [data, setData] = useState({});
  const [warnCount, setWarnCount] = useState([]);
  const intl = useIntl();

  const showModal = (Station_Name, message, type) => {
    if (type === 'message') {
      setModalData(Object.entries(warn[`${Station_Name}`] || {})?.filter((n) => n[1].status === 0));
    } else {
      setModalData(
        notif[Station_Name]?.filter(
          (station) => station.warning_message === message && station.status === 0,
        ),
      );
    }
    console.log('the type:', modalData);
    setState({
      visible: true,
    });
  };

  const hideModal = () => {
    setState({
      visible: false,
    });
  };

  useEffect(() => {
    fetchStations();
    countWarnings();
    notifications();
    warnings();
    calculations();
    window.addEventListener('resize', handleWindowSizeChange());
  }, []);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
    if (width <= 480) {
      setDisplayText(false);
    }
  };

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

  const warnings = () => {
    const warnRef = fire.database().ref('messages');
    warnRef.on('value', (snapshot) => {
      const warn = snapshot.val();
      console.log('warnings', warn);
      setWarn(warn);
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

  const calculations = () => {
    let array = Object.fromEntries(warnCount);
    console.log(array);
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
            onClick={() => {
              history.push('/fire-reports');
            }}
          >
            {intl.formatMessage({
              id: 'pages.button.viewCases',
              defaultMessage: 'View Cases',
            })}
          </Button>
        }
      >
        <Card
          cover={
            <div
              style={{
                objectFit: 'cover',
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.958420868347339) 14%, rgba(159,60,47,0.45702030812324934) 52%, rgba(226,109,42,0.26094187675070024) 70%, rgba(230,230,230,0.23573179271708689)100%),url("https://arescuer.com/wp-content/uploads/2016/01/Fire-Fighting.jpg") no-repeat top center',
                height: '180px',
                width: '100%',
                color: 'white',
                font: 'bold 2.5em/1em monospace',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {displayText ? 'Respond / Protect' : ''}
            </div>
          }
        >
          <Meta
            avatar={
              <Avatar src="/logo.svg" style={{ borderStyle: 'solid', borderColor: 'green' }} />
            }
            title={intl.formatMessage({
              id: 'pages.title.monitorNotifications',
              defaultMessage: 'Monitor Notifications',
            })}
            description={
              <>
                {' '}
                {intl.formatMessage({
                  id: 'pages.label.activeFireReports',
                  defaultMessage: 'Active Fire Reports',
                })}{' '}
                : &nbsp;
                {Object.values(notif || {})
                  .flat()
                  .filter((n) => n?.warning_message === '\nFire Detected!' && n?.status === 0)
                  .length -
                  notif?.Admin?.filter(
                    (n) => n.warning_message === '\nFire Detected!' && n.status === 0,
                  )?.length}{' '}
                &nbsp;||&nbsp;
                {intl.formatMessage({
                  id: 'pages.label.activeSmokeReports',
                  defaultMessage: 'Active Smoke Reports',
                })}{' '}
                : &nbsp;
                {Object.values(notif)
                  .flat()
                  .filter((n) => n.warning_message === '\nSmokeDetected!' && n.status === 0)
                  .length -
                  notif?.Admin?.filter(
                    (n) => n.warning_message === '\nSmokeDetected!' && n.status === 0,
                  )?.length}
                &nbsp;||&nbsp;
                {intl.formatMessage({
                  id: 'pages.label.activePriorWarning',
                  defaultMessage: 'Active Prior Warnings',
                })}{' '}
                : &nbsp;
                {warnCount.flat().filter((n) => n[1]?.details?.status === 0).length}
              </>
            }
          />
        </Card>
      </ProCard>
      {Object.keys(stations).map(function (Station_Name, sorting) {
        if (Station_Name !== 'Admin') {
          return (
            <React.Fragment key={sorting}>
              <ProCard
                title={
                  <>
                    <Avatar
                      shape="square"
                      style={{
                        borderColor: 'green',
                        backgroundColor: ColorList[sorting],
                        verticalAlign: 'middle',
                      }}
                    >
                      {Station_Name.charAt(0)}
                    </Avatar>
                    &nbsp;{Station_Name}
                  </>
                }
                ghost
                gutter={8}
                collapsible
                scroll={{ x: 1300 }}
              >
                <ProCard
                  layout="center"
                  bordered
                  actions={[
                    <EyeOutlined
                      key="edit"
                      onClick={() => {
                        if (
                          notif[`${Station_Name}`]?.filter(
                            (station) =>
                              station.warning_message === '\nFire Detected!' &&
                              station.status === 0,
                          ).length === undefined ||
                          notif[`${Station_Name}`]?.filter(
                            (station) =>
                              station.warning_message === '\nFire Detected!' &&
                              station.status === 0,
                          ).length === 0
                        ) {
                          message.error('No Alerts Available');
                        } else {
                          showModal(Station_Name, '\nFire Detected!', 'alert');
                        }
                      }}
                    />,
                    <EllipsisOutlined
                      onClick={() => {
                        history.push('/fire-reports');
                      }}
                      key="ellipsis"
                    />,
                  ]}
                  style={{
                    backgroundColor:
                      notif[`${Station_Name}`]?.filter(
                        (station) =>
                          station.warning_message === '\nFire Detected!' && station.status === 0,
                      ).length === undefined ||
                      notif[`${Station_Name}`]?.filter(
                        (station) =>
                          station.warning_message === '\nFire Detected!' && station.status === 0,
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
                      (station) =>
                        station.warning_message === '\nFire Detected!' && station.status === 0,
                    ).length
                  }
                </ProCard>
                <ProCard
                  layout="center"
                  bordered
                  actions={[
                    <EyeOutlined
                      key="edit"
                      onClick={() => {
                        if (
                          notif[`${Station_Name}`]?.filter(
                            (station) => station.warning_message === '\nSmokeDetected!',
                          ).length === undefined ||
                          notif[`${Station_Name}`]?.filter(
                            (station) => station.warning_message === '\nSmokeDetected!',
                          ).length === 0
                        ) {
                          message.error('No Alerts Available');
                        } else {
                          showModal(Station_Name, '\nSmokeDetected!', 'alert');
                        }
                      }}
                    />,
                    <EllipsisOutlined
                      onClick={() => {
                        history.push('/fire-reports');
                      }}
                      key="ellipsis"
                    />,
                  ]}
                  style={{
                    backgroundColor:
                      notif[`${Station_Name}`]?.filter(
                        (station) =>
                          station.warning_message === '\nSmokeDetected!' && station.status === 0,
                      ).length === undefined ||
                      notif[`${Station_Name}`]?.filter(
                        (station) =>
                          station.warning_message === '\nSmokeDetected!' && station.status === 0,
                      ).length === 0
                        ? '#38b000'
                        : '#fb8500',
                    borderRadius: 10,
                    fontSize: '30px',
                    color: 'white',
                  }}
                >
                  <AlertOutlined />
                  {
                    notif[`${Station_Name}`]?.filter(
                      (station) =>
                        station.warning_message === '\nSmokeDetected!' && station.status === 0,
                    ).length
                  }
                </ProCard>
                <ProCard
                  layout="center"
                  bordered
                  actions={[
                    <EyeOutlined
                      key="edit"
                      onClick={() => {
                        showModal(Station_Name, '\nSmokeDetected!', 'message');
                      }}
                    />,
                    <EllipsisOutlined
                      onClick={() => {
                        history.push('/warning-messages');
                      }}
                      key="ellipsis"
                    />,
                  ]}
                  style={{
                    backgroundColor: '#00b4d8',
                    borderRadius: 10,
                    fontSize: '30px',
                    color: 'white',
                  }}
                >
                  <MessageOutlined />{' '}
                  {Object.entries(warn[`${Station_Name}`] || {})?.length
                    ? Object.entries(warn[`${Station_Name}`] || {})?.filter(
                        (n) => n[1]?.details?.status === 0,
                      )?.length
                    : ''}
                </ProCard>
              </ProCard>
            </React.Fragment>
          );
        }
      })}

      <Modal
        title={
          <p>
            <Avatar style={{ backgroundColor: '#f94144' }}>A</Avatar>&nbsp;Alerts
          </p>
        }
        tooltip="Copy the Token and paste it in the authorization Modal"
        visible={state.visible}
        onOk={hideModal}
        onCancel={hideModal}
        okText="Ok"
        cancelText="Cancel"
      >
        {modalData.map((item, index) => {
          return (
            <Card avatar={<Avatar>A</Avatar>} style={{ width: '100%', margin: 5 }} key={index}>
              <Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={item?.name ? item?.name : item[1]?.name}
                description={
                  <>
                    <p>
                      <Tag color="#fb8500">
                        {' '}
                        {item.warning_message ? item.warning_message : item[1].warning_message}{' '}
                      </Tag>
                      ||{' '}
                      {intl.formatMessage({
                        id: 'pages.label.date',
                        defaultMessage: 'Date',
                      })}{' '}
                      {item.date ? item.date : item[1].date} ||{' '}
                      {intl.formatMessage({
                        id: 'pages.label.time',
                        defaultMessage: 'Time',
                      })}{' '}
                      {item.time} ||{' '}
                      {intl.formatMessage({
                        id: 'pages.label.location',
                        defaultMessage: 'Location',
                      })}
                      {intl.formatMessage({
                        id: 'pages.label.click',
                        defaultMessage: 'click',
                      })}{' '}
                      <a href={item.link}>
                        {' '}
                        {intl.formatMessage({
                          id: 'pages.label.here',
                          defaultMessage: 'Here',
                        })}
                      </a>{' '}
                      ||{' '}
                      {intl.formatMessage({
                        id: 'pages.label.open',
                        defaultMessage: 'Open',
                      })}{' '}
                      {item.warning_message === '\nFire Detected!' ||
                      item.warning_message === '\nSmokeDetected!' ? (
                        <a
                          onClick={() => {
                            history.push('/fire-reports');
                          }}
                        >
                          {intl.formatMessage({
                            id: 'pages.label.fireReports',
                            defaultMessage: 'Fire Reports',
                          })}
                        </a>
                      ) : (
                        <a
                          onClick={() => {
                            history.push('/warning-messages');
                          }}
                        >
                          {intl.formatMessage({
                            id: 'pages.label.priorWarning',
                            defaultMessage: 'Prior Warnings',
                          })}
                        </a>
                      )}
                    </p>
                  </>
                }
              />
            </Card>
          );
        })}
      </Modal>
    </>
  );
};

export default Index;
