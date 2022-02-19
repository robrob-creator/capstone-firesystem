/* eslint-disable react/no-array-index-key */
import { EllipsisOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Avatar, Badge } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getNotifications } from '@/services/notifications/api';
import { getStations } from '@/services/stations/api';
import { Tabs, Radio, Space } from 'antd';
import { render } from 'enzyme';

const { TabPane } = Tabs;
const ColorList = [
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
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
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
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
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
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

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
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

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [stations, setStations] = useState([]);
  const [meta, setMeta] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [tabPosition, setTabPosition] = useState('left');
  const [avatarSize, setAvatarSize] = useState('large');
  const [isLoading, setIsLoading] = useState(false);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();

  const columns = [
    {
      title: <FormattedMessage id="pages.searchTable.titleMessage" defaultMessage="Description" />,
      dataIndex: 'warning_message',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleName" defaultMessage="Name" />,
      onFilter: true,
      filterMultiple: false,
      dataIndex: 'name',
      filters: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDate" defaultMessage="Date" />,
      dataIndex: 'date',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleTime" defaultMessage="TIme" />,
      dataIndex: 'time',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleLink" defaultMessage="Link" />,
      dataIndex: 'link',
      sorter: true,
      hideInForm: true,
      render: (dom, entity) => {
        return <a href={dom}>Click Here</a>;
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.default"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online" />
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="Edit" />
        </a>,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete" />
        </a>,
      ],
    },
  ];

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange());
    fetchStations();
  });

  const fetchStations = async () => {
    let res = await getStations();
    setStations(res);
  };
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
    if (width <= 480) {
      setAvatarSize('small');
      setTabPosition('top');
    }
  };
  console.log('isloading', isLoading);
  console.log('stations data:', stations);
  return (
    <PageContainer loading={isLoading}>
      <Tabs
        tabPosition={tabPosition}
        style={{
          height: '30hv',
          overflowY: 'scroll',
          overflowX: 'scroll',
          backgroundColor: 'white',
          padding: 10,
        }}
        defaultActiveKey={1}
      >
        {Object.keys(stations).map(function (Station_Name, sorting) {
          if (Station_Name !== 'Admin') {
            return (
              <React.Fragment key={sorting}>
                <TabPane
                  tab={
                    <span>
                      <Badge count={1} style={{ marginTop: 3 }}>
                        <Avatar
                          shape="square"
                          style={{
                            borderColor: 'green',
                            backgroundColor: ColorList[sorting],
                            verticalAlign: 'middle',
                          }}
                          size={avatarSize}
                        >
                          {Station_Name.charAt(0)}
                        </Avatar>
                      </Badge>
                      <span style={{ marginLeft: 5 }}>{Station_Name}</span>
                      <hr style={{ opacity: '10%' }} />
                    </span>
                  }
                  key={sorting}
                >
                  <ProTable
                    headerTitle={intl.formatMessage({
                      id: 'pages.searchTable.titleFireAlerts',
                      defaultMessage: 'Fire Alerts',
                    })}
                    actionRef={actionRef}
                    rowKey="key"
                    style={{ height: '10hv' }}
                    pagination={{
                      total: meta?.total ? meta?.total : 0,
                      defaultCurrent: meta?.current_page ? meta?.current_page : 1,
                      pageSize: parseInt(meta?.per_page, 10),
                    }}
                    request={async (props, sorter, filter) => {
                      let sort = Object.entries(sorter);
                      let params = {
                        ...props,
                        limit: props.pageSize,
                        page: props?.current,
                      };
                      delete params.pageSize;
                      delete params.current;
                      try {
                        let res = await getNotifications(params, Station_Name);
                        setMeta(res);

                        return {
                          data: res?.reverse(),
                          success: true,
                        };
                      } catch (error) {}
                    }}
                    search={false}
                    columns={columns}
                    rowSelection={{
                      onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                      },
                    }}
                  />
                </TabPane>
              </React.Fragment>
            );
          }
        })}
      </Tabs>
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
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
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);

          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
