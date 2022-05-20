import { LockOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Space, Tag, Avatar, Popconfirm, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import {
  getStations,
  deleteStation,
  createStation,
  createUser,
  createUsers,
} from '@/services/stations/api';
import { set } from 'lodash';
import ProList from '@ant-design/pro-list';
import { useHistory } from 'react-router-dom';
import Password from 'antd/lib/input/Password';

const ColorList = [
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
];
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');
  try {
    let res = await createUser({ ...fields });
    await createStation({ ...fields, res });
    hide();
    // await createUsers({ ...fields, res });
    message.success('Added successfully');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('Configuring');

  try {
    let res = await createStation({ ...fields });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (Station_Name) => {
  const hide = message.loading('正在删除');
  try {
    await deleteStation(Station_Name);
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    let { response } = error;
    console.log('response:', response);
    hide();
  }
};

const TableList = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  let history = useHistory();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [stations, setStations] = useState([]);
  const [currentToken, setCurrentToken] = useState();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    let res = await getStations();
    const data = Object.values(res);
    setStations(data);
  };
  console.log('stations data:', stations);
  const [state, setState] = useState({ visible: false });

  const showModal = (entity) => {
    console.log('passed value', entity);
    setCurrentToken(entity?.authorizations?.idToken);
    setState({
      visible: true,
    });
  };

  const hideModal = () => {
    setState({
      visible: false,
    });
  };
  console.log('currentRow', currentRow);
  return (
    <PageContainer>
      <ProList
        toolBarRender={() => {
          return [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                handleModalVisible(true);
              }}
            >
              {intl.formatMessage({ id: 'pages.searchTable.button.add' })}
            </Button>,
          ];
        }}
        actionRef={actionRef}
        onRow={(record) => {
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        rowKey="name"
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.titleStations',
          defaultMessage: 'Stations',
        })}
        tooltip="List Of Stations"
        dataSource={stations}
        showActions="hover"
        showExtra="hover"
        metas={{
          title: {
            dataIndex: 'Station_Name',
          },
          avatar: {
            dataIndex: 'Station_Name',
            render: (text, entity) => {
              return (
                <Avatar
                  style={{
                    borderColor: 'green',
                    backgroundColor: ColorList[1],
                    verticalAlign: 'middle',
                  }}
                  size="large"
                >
                  {entity.Station_Name.toString().charAt(0)}
                </Avatar>
              );
            },
          },
          description: {
            dataIndex: 'Station_Hotline',
            render: (item, entity) => {
              return (
                <span>
                  {`contact: ${entity.Station_Hotline}|| `}
                  <p>
                    idToken:<span onClick={() => showModal(entity)}> Click here to view</span>
                  </p>
                  <p>localId:{entity?.authorizations?.localId}</p>
                </span>
              );
            },
          },
          subTitle: {
            dataIndex: 'statues',
            render: (item, entity) => {
              if (entity.status === 1) {
                return (
                  <Space size={0}>
                    <Tag color="#5BD8A6">
                      {' '}
                      {intl.formatMessage({
                        id: 'pages.searchTable.tag.active',
                        defaultMessage: 'Active',
                      })}
                    </Tag>
                  </Space>
                );
              }
              return (
                <Space size={0}>
                  <Tag color="red">
                    {intl.formatMessage({
                      id: 'pages.searchTable.tag.inactive',
                      defaultMessage: 'Inctive',
                    })}
                  </Tag>
                </Space>
              );
            },
          },
          actions: {
            render: (text, row) => [
              <a
                onClick={() => {
                  handleUpdateModalVisible(true);
                  setState;
                  setCurrentRow(row);
                }}
                target="_blank"
                rel="noopener noreferrer"
                key="link"
              >
                {intl.formatMessage({
                  id: 'pages.searchTable.button.edit',
                })}
              </a>,
              <Popconfirm
                key="delete"
                title={intl.formatMessage({
                  id: 'pages.searchTable.areYouSure',
                  defaultMessage: 'Are you sure?',
                })}
                okText={intl.formatMessage({
                  id: 'pages.searchTable.yes',
                  defaultMessage: 'Yes',
                })}
                cancelText={intl.formatMessage({
                  id: 'pages.searchTable.no',
                  defaultMessage: 'No',
                })}
                onConfirm={() => {
                  handleRemove(row.Station_Name).then(() => {
                    history.push('/success', row.Station_Name);
                  });
                  actionRef.current?.reloadAndRest?.();
                }}
              >
                <a href="#">
                  <FormattedMessage id="pages.searchTable.button.delete" defaultMessage="Delete" />
                </a>
              </Popconfirm>,
            ],
          },
        }}
      />
      <Modal
        title="Token"
        tooltip="Copy the Token and paste it in the authorization page"
        visible={state.visible}
        onOk={hideModal}
        onCancel={hideModal}
        okText="Ok"
        cancelText="Cancel"
      >
        <p>{currentToken}</p>
      </Modal>
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.titleStation',
          defaultMessage: 'New Station',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormSelect
          label={
            <FormattedMessage id="pages.searchTable.createForm.status" defaultMessage="Status" />
          }
          rules={[
            {
              required: true,
              message: <FormattedMessage id="errors.5003" defaultMessage="Is active required" />,
            },
          ]}
          name="status"
          options={[
            {
              value: 1,
              label: <FormattedMessage id="pages..active" defaultMessage="Active" />,
            },
            {
              value: 0,
              label: <FormattedMessage id="pages.tag.inactive" defaultMessage="Inctive" />,
            },
          ]}
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          label={
            <FormattedMessage
              id="pages.searchTable.createForm.stationName"
              defaultMessage="Station Name"
            />
          }
          width="md"
          name="Station_Name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          label={
            <FormattedMessage
              id="pages.searchTable.createForm.stationHotline"
              defaultMessage="Station Hotline"
            />
          }
          width="md"
          name="Station_Hotline"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          label={
            <FormattedMessage
              id="pages.searchTable.createForm.stationSorting"
              defaultMessage="Sorting"
            />
          }
          width="md"
          name="sorting"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
            {
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Invalid Email',
            },
          ]}
          label={
            <FormattedMessage id="pages.searchTable.createForm.email" defaultMessage="Email" />
          }
          width="md"
          name="email"
        />
        <ProFormText.Password
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          label={
            <FormattedMessage
              id="pages.searchTable.createForm.password"
              defaultMessage="Password"
            />
          }
          width="md"
          name="password"
        />
      </ModalForm>
      {updateModalVisible && (
        <ModalForm
          title="Edit Station"
          width="400px"
          visible={updateModalVisible}
          onVisibleChange={handleUpdateModalVisible}
          onFinish={async (value) => {
            console.log(value);
            const success = await handleUpdate(value);

            if (success?.true) {
              handleUpdateModalVisible(false);
              history.push('/success');
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ProFormSelect
            initialValue={currentRow && currentRow.status}
            label={
              <FormattedMessage id="pages.searchTable.createForm.status" defaultMessage="Status" />
            }
            name="status"
            options={[
              {
                value: 1,
                label: <FormattedMessage id="pages..active" defaultMessage="Active" />,
              },
              {
                value: 0,
                label: <FormattedMessage id="pages.tag.inactive" defaultMessage="Inctive" />,
              },
            ]}
          />
          <ProFormText
            initialValue={currentRow && currentRow.Station_Name}
            label={
              <FormattedMessage
                id="pages.searchTable.createForm.stationName"
                defaultMessage="Station Name"
              />
            }
            width="md"
            name="Station_Name"
          />
          <ProFormText
            initialValue={currentRow && currentRow.Station_Hotline}
            label={
              <FormattedMessage
                id="pages.searchTable.createForm.stationHotline"
                defaultMessage="Station Hotline"
              />
            }
            width="md"
            name="Station_Hotline"
          />
          <ProFormText
            label={
              <FormattedMessage
                id="pages.searchTable.createForm.stationSorting"
                defaultMessage="Sorting"
              />
            }
            width="md"
            name="sorting"
            initialValue={currentRow && currentRow.sorting}
          />
          <ProFormText
            initialValue={currentRow && currentRow.email}
            label={
              <FormattedMessage id="pages.searchTable.createForm.email" defaultMessage="Email" />
            }
            width="md"
            name="email"
          />
          <ProFormText.Password
            hidden
            initialValue={(currentRow && currentRow.Password) || currentRow.key}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            label={
              <FormattedMessage
                id="pages.searchTable.createForm.password"
                defaultMessage="Password"
              />
            }
            width="md"
            name="password"
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default TableList;
