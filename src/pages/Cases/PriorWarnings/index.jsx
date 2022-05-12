import { EllipsisOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Avatar, Badge, Tag, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getWarnings, editWarning, deleteWarning } from '@/services/prior-warnings/api';
import { getStations } from '@/services/stations/api';
import { Tabs, Radio, Space } from 'antd';
import { render } from 'enzyme';
import fire from '@/services/firebase-config/api';

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
  const hide = message.loading('Adding');

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
    await editWarning(fields.id, fields);
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

const handleRemove = async (record) => {
  const hide = message.loading('Deleteting');
  console.log('delelting', record);
  try {
    await deleteWarning(record.id, record);
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
  const [warn, setWarn] = useState({});
  const [msgData, setMsgData] = useState();
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();

  const warnings = () => {
    const warnRef = fire.database().ref('messages');
    warnRef.on('value', (snapshot) => {
      const warn = snapshot.val();
      console.log('warnings', warn);
      setWarn(warn);
    });
  };

  const view = (id, station) => {
    console.log(id);
    const msgRef = fire.database().ref(`messages/${station}/${id}/details/status`);
    msgRef.set(1);

    history.push(`conversation/${station}/${id}`);
  };

  const columns = [
    {
      title: <FormattedMessage id="pages.searchTable.titleMessage" defaultMessage="Description" />,
      dataIndex: 'user_message',
      render: (dom, entity) => entity?.details?.last_message,
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
            {entity?.details?.user_name}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDate" defaultMessage="Date" />,
      dataIndex: 'date',
      render: (dom, entity) => entity?.details?.date,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      render: (dom, entity) => {
        return !entity?.details?.status ? (
          <Tag color={'red'}>
            <FormattedMessage id="pages.searchTable.statusPending" defaultMessage="Active Case" />
          </Tag>
        ) : (
          <Tag color={'green'}>
            <FormattedMessage id="pages.searchTable.statusSeen" defaultMessage="Seen" />
          </Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="config" onClick={() => view(record?.details?.userId, record?.details?.station)}>
          <FormattedMessage id="pages.searchTable.view" defaultMessage="View" />
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
            handleRemove(record);
            actionRef.current.reload();
          }}
        >
          <a href="#">
            <FormattedMessage id="pages.searchTable.button.delete" defaultMessage="Delete" />
          </a>
        </Popconfirm>,
      ],
    },
  ];

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange());
    fetchStations();
    warnings();
  }, []);

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
          return (
            <React.Fragment key={sorting}>
              <TabPane
                tab={
                  <span>
                    <Badge
                      count={
                        Object.entries(warn[`${Station_Name}`] || {})?.length
                          ? Object.entries(warn[`${Station_Name}`] || {})?.filter(
                              (n) => n[1]?.details?.status === 0,
                            )?.length
                          : ''
                      }
                      style={{ marginTop: 3 }}
                    >
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
                      let res = await getWarnings(params, Station_Name);
                      setMeta(res);
                      return {
                        data: Object.values(res),
                        success: true,
                      };
                    } catch (error) {}
                  }}
                  search={false}
                  columns={columns}
                />
              </TabPane>
            </React.Fragment>
          );
        })}
      </Tabs>

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

      {updateModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.searchTable.updateForm.title.editDivision',
            defaultMessage: 'Edit division',
          })}
          destroyOnClose
          width="400px"
          visible={updateModalVisible}
          onVisibleChange={handleUpdateModalVisible}
          onFinish={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ProFormText name="id" hidden initialValue={currentRow && currentRow.id} />
          <ProFormText name="name" hidden initialValue={currentRow && currentRow.name} />
          <ProFormText
            name="warning_message"
            hidden
            initialValue={currentRow && currentRow.warning_message}
          />
          <ProFormText name="date" hidden initialValue={currentRow && currentRow.date} />
          <ProFormText name="time" hidden initialValue={currentRow && currentRow.time} />
          <ProFormText name="time" hidden initialValue={currentRow && currentRow.userId} />
          <ProFormText name="station" hidden initialValue={currentRow && currentRow.station} />
          <ProFormSelect
            label={
              <FormattedMessage
                id="pages.searchTable.updateForm.statusLabel"
                defaultMessage="Status"
              />
            }
            rules={[
              {
                required: true,
                message: 'Required',
              },
            ]}
            initialValue={currentRow && currentRow.status}
            name="status"
            options={[
              {
                value: 0,
                label: (
                  <FormattedMessage id="pages.searchTable.statusPending" defaultMessage="Pending" />
                ),
              },
              {
                value: 1,
                label: (
                  <FormattedMessage
                    id="pages.searchTable.statusRecieved"
                    defaultMessage="Recieved"
                  />
                ),
              },
            ]}
          />
        </ModalForm>
      )}
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
