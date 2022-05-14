import { Comment, Avatar, Form, Button, List, Input, Badge, PageHeader, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SendOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import fire from '@/services/firebase-config/api';
import { getUserById } from '@/services/user/api';

const { TextArea } = Input;

const Editor = ({ messageText, setMessageText, onSubmit, submitting, value, handleKeyPress }) => (
  <>
    <Form.Item>
      {/**  <TextArea rows={4} onChange={onChange} value={value} />*/}
      <Input
        size="large"
        placeholder="large size"
        onChange={(e) => setMessageText(e.target?.value)}
        value={messageText}
        onKeyPress={handleKeyPress}
        suffix={
          <Button htmlType="submit" onClick={onSubmit} type="primary">
            Send <SendOutlined />
          </Button>
        }
      />
    </Form.Item>
  </>
);

export default () => {
  const [state, setState] = React.useState({
    submitting: false,
    value: '',
  });
  const params = useParams();
  const { id, station } = params;
  const [messages, setMessages] = useState();
  const [messageText, setMessageText] = useState();
  const [profile, setProfile] = useState();
  const handleSubmit = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    if (messageText) {
      setState({
        ...state,
        submitting: true,
      });

      const newReference = fire.database().ref(`/messages/${station}/${id}/convo`).push();

      newReference.set({
        userId: station,
        user_message: messageText,
        station: station,
        date: `${date}-${month}-${year}`,
        id: newReference.key,
        type: 'station',
        time: `${hours}:${min}:${sec}`,
      });

      setMessageText('');
    }
  };

  useEffect(() => {
    getMsg();
    getProfille();
  }, []);

  const getMsg = () => {
    const convoRef = fire.database().ref(`messages/${station}/${id}`);
    convoRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setMessages(data);
    });
  };

  const getProfille = () => {
    getUserById(id).then((res) => setProfile(res));
  };
  console.log('here it is', profile);
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };
  return (
    <>
      <PageHeader
        title={profile?.userfname}
        className="site-page-header"
        subTitle={`Address: ${profile?.address}`}
        tags={
          <Tag color={profile?.verified ? 'green' : 'red'}>
            {profile?.verified ? 'Verified' : 'Unverified'}
          </Tag>
        }
        avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
      />
      <List
        reverse
        style={{
          height: '400px',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        itemLayout="horizontal"
        dataSource={Object.values(messages?.convo || [])}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <>
                  {item.type === 'user' ? (
                    <Badge
                      style={{
                        backgroundColor: profile?.verified ? '#52c41a' : '#f56a00',
                      }}
                      count={
                        <span style={{ color: 'white', padding: 2, margin: 4, borderRadius: 5 }}>
                          {profile?.verified ? 'verified' : 'unverified'}
                        </span>
                      }
                    >
                      <Avatar
                        style={{
                          backgroundColor: item?.type === 'user' ? '#61A4EC' : '#f56a00',
                          verticalAlign: 'middle',
                        }}
                        size="large"
                      >
                        {item?.type === 'user'
                          ? messages?.details?.user_name.charAt(0)
                          : station.charAt(0)}
                      </Avatar>
                    </Badge>
                  ) : (
                    <Avatar
                      style={{
                        backgroundColor: item?.type === 'user' ? '#61A4EC' : '#f56a00',
                        verticalAlign: 'middle',
                      }}
                      size="large"
                    >
                      {item?.type === 'user'
                        ? messages?.details?.user_name.charAt(0)
                        : station.charAt(0)}
                    </Avatar>
                  )}
                </>
              }
              title={item?.user_message}
              description={item?.date}
            />
          </List.Item>
        )}
      />
      <Comment
        style={{ position: 'fixed', bottom: 0, width: '80%' }}
        avatar={
          <Avatar
            style={{
              backgroundColor: '#f56a00',
              verticalAlign: 'middle',
            }}
            size="large"
          >
            {station.charAt(0)}
          </Avatar>
        }
        content={
          <Editor
            handleKeyPress={handleKeyPress}
            messageText={messageText}
            setMessageText={setMessageText}
            onSubmit={handleSubmit}
            submitting={state.submitting}
            value={state.value}
          />
        }
      />
    </>
  );
};
