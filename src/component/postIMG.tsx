import axios from 'axios';
//import * as React from 'react';
//import Dropzone from 'react-dropzone'

const Apps = () => {

  const handleSubmitData = async() => {
    axios({
      method: 'post',
      url:'https://a5gc3ic102.execute-api.ap-northeast-1.amazonaws.com/default/axiosFunction',
      data: {
        line_count: 2,
        text: "testssssss",
      },
    })
    .catch(results => {
      console.log(results);
    });
  }

  handleSubmitData()

  return (
    <div>
      テスト
    </div>
  );
};

export default Apps
