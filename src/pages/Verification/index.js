/* eslint-disable react/no-array-index-key */
import { EllipsisOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Avatar, Badge, Image, Tag, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { getUserById } from '@/services/user/api';
import { Tabs, Radio, Space } from 'antd';
import { getVerificationRequests } from '@/services/verification-requests/api';
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
  const [meta, setMeta] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState();
  const [currentId, setCurrentId] = useState();
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const intl = useIntl();

  const columns = [
    {
      title: <FormattedMessage id="pages.searchTable.titleProfile" defaultMessage="Profile" />,
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={() => {
              getUserById(dom).then((res) => {
                console.log(res);
                setCurrentRow(res);
                showDrawer();
              });
            }}
          >
            <Avatar shape="square" size={80} icon={<UserOutlined />} />
            <Tag color="blue" style={{ margin: 5 }}>
              View Profile
            </Tag>
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleFront" defaultMessage="Front Of ID" />,
      dataIndex: 'frontId',
      render: (dom, entity) => {
        return (
          <Image.PreviewGroup>
            <Image width={200} src={dom} />
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleBack" defaultMessage="Back of ID" />,
      dataIndex: 'backId',
      render: (dom, entity) => {
        return (
          <Image.PreviewGroup>
            <Image width={200} src={dom} />
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (dom, entity) => {
        return (
          <>
            {entity.status ? (
              <Tag color="green">Responded</Tag>
            ) : (
              <Tag color="red">Unresponded</Tag>
            )}
          </>
        );
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
            approveRequest(record?.id);
          }}
        >
          <FormattedMessage id="pages.searchTable.titleApprove" defaultMessage="Approve" />
        </a>,
        <a
          key="subscribeAlert"
          onClick={() => {
            setCurrentId(record?.id);
            setIsModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.searchTable.titleDecline" defaultMessage="Decline" />
        </a>,
      ],
    },
  ];

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange());
  });

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
    if (width <= 480) {
      setAvatarSize('small');
      setTabPosition('top');
    }
  };
  const approveRequest = (id) => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();

    const newReference = fire.database().ref(`users/${id}/verified`);
    newReference.set(true);
    const verReference = fire.database().ref(`verification-request/${id}/status`);
    verReference.set(1);
    const msgReference = fire.database().ref(`messages/Admin/${id}/convo`).push();
    msgReference.set({
      userId: 'Admin',
      user_message: 'Congratulations! your account has been verified',
      station: 'Admin',
      date: `${date}-${month}-${year}`,
      id: newReference.key,
      type: 'station',
      time: `${hours}:${min}:${sec}`,
    });
    history.push(`conversation/Admin/${id}`);
  };
  const handleOk = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();

    const newReference = fire.database().ref(`messages/Admin/${currentId}/convo`).push();
    newReference.set({
      userId: 'Admin',
      user_message: reason,
      station: 'Admin',
      date: `${date}-${month}-${year}`,
      id: newReference.key,
      type: 'station',
      time: `${hours}:${min}:${sec}`,
    });
    setReason('');

    history.push(`conversation/Admin/${currentId}`);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentId('');
  };
  return (
    <PageContainer loading={isLoading}>
      <Modal
        title="Reason for Declining"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <textarea style={{ width: '100%' }} onChange={(e) => setReason(e.target.value)} />
      </Modal>
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
            let res = await getVerificationRequests(params);
            setMeta(res);

            return {
              data: Object.values(res || [])
                ?.filter((item) => !item.status)
                .reverse(),
              success: true,
            };
          } catch (error) {}
        }}
        search={false}
        columns={columns}
      />

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

      <Drawer title="Profile" placement="right" onClose={onClose} visible={visible}>
        <p>Name: {currentRow?.userfname}</p>
        <p>Address: {currentRow?.address}</p>
        <p>Contact: {currentRow?.contactNumber}</p>
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
