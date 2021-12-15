import axios from 'axios';
import {ChangeEvent, useState} from "react";

const PostTxtFile = () => {
  const [textData, setTextData] = useState<string>();
  const [textDataFile, setTextDataFile] = useState<string>();

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log( typeof e.target.value );
    //console.log( e.target.files );
    setTextData( e.target.value );

    const newfile = new File( [ e.target.value] , "text.txt",
                     {  type: "text/plain",
                        lastModified: 0} );
    //const textURL  = URL.createObjectURL(newfile);

    const result = await toBase64(newfile);
    const textURL = JSON.stringify( {
                                      line_count: null,
                                      text: result,
                                    } )
    setTextDataFile( textURL );
  }

  const handleSubmitData = async() => {
    axios({
      method: 'post',
      url:'https://a5gc3ic102.execute-api.ap-northeast-1.amazonaws.com/default/axiosFunction',
      data: textDataFile,
    })
    .then(res => {
      console.log(res)
    })
    .catch(results => {
      console.log(results);
    });
  }

  return (
    <div>
      <p>テキストを入力</p>
      <input type="text" onChange={handleChange}></input>
      <p>text: { textData }</p>
      <button type="button"
                onClick={handleSubmitData}
            >submit</button>
    </div>
  );
};

export default PostTxtFile;

const fileToBase64 = async (file: File) => {
    return new Promise(resolve => {
      const reader = new FileReader();
  
      // Read file content on file loaded event
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      
      // Convert data to base64 
      reader.readAsDataURL(file);
    });
};

const toBase64 = async (file: File) => {
    return fileToBase64(file).then((result: any) => {
      return result;
    });
}