import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
  ModalForm,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const UpdateForm = (props) => {
  const intl = useIntl();
  return (
    <>
      {props.updateModalVisible && (
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.searchTable.updateForm.title.editDivision',
            defaultMessage: 'Edit division',
          })}
          destroyOnClose
          width="400px"
          visible={props.updateModalVisible}
          onVisibleChange={props.handleUpdateModalVisible}
          onFinish={props.onSubmit}
        >
          <ProFormText name="id" hidden />
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
                message: <FormattedMessage id="errors.5003" defaultMessage="Is active required" />,
              },
            ]}
            name="is_active"
            options={[
              {
                value: 1,
                label: <FormattedMessage id="pages.tag.active" defaultMessage="Active" />,
              },
              {
                value: 0,
                label: <FormattedMessage id="pages.tag.inactive" defaultMessage="Inctive" />,
              },
            ]}
          />
        </ModalForm>
      )}
    </>
  );
};

export default UpdateForm;
