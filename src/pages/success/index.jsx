import { Result, Button } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';

const TableList = () => {
  let history = useHistory();

  console.log('dummy data:', location);
  return (
    <Result
      status="success"
      title="Operation Successful!"
      subTitle="The Operation was successful."
      extra={[
        <Button type="primary" onClick={() => history.goBack()}>
          Go Back
        </Button>,
      ]}
    />
  );
};

export default TableList;
