import axios from 'axios';
import {ChangeEvent, useState, useEffect} from "react";

const PostImgFile = () => {
  //const [rawData,    setRawData]    = useState<File>();
  const [submitData, setSubmitData] = useState<string>();
  const [imgURL,     setImgURL]     = useState<string>();
  const [replyImgURL,setReplyImgURL]   = useState<string>();
  //let new_Img = new Image();

  useEffect( ()=>{
    //console.log("submitData: ", submitData);
    console.log("IMG Loaded")
  }, [submitData] );

  // Inputが変更されるたびに表示&提出用のデータを更新
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    //console.log( typeof e.target.value );
    const _rawdata: File = e.target.files[0] //提出する生データ
    const imgURL:string  = URL.createObjectURL(e.target.files[0]);
    setImgURL( imgURL ); //読み込んだ画像を表示

    //// 生のtextデータをファイルデータへ変換 (確認のため)
    //const _rawdata = new File( [ e.target.value] , "text.txt",
    //                 {  type: "text/plain",
    //                    lastModified: 0} );

    // ファイルデータをBase64でエンコードして、submit_dataにセットする
    if (!_rawdata) return ; 
    const base64file  = await toBase64(_rawdata);
    const _submitdata = JSON.stringify( {
                  line_count: null,
                  text: base64file,
                } )
    setSubmitData( _submitdata );

    //console.log( "e.target.files[0]: ", e.target.files[0] );
    //console.log("_rawdata:", _rawdata);
    //console.log("imgURL: ", imgURL)
    //console.log("_submit-data:", _submitdata)
    //console.log("submit-data:", submitData)
  }

  const handleSubmitData = async() => {
    axios({
      method: 'post',
      url:    'https://txsei0q801.execute-api.ap-northeast-1.amazonaws.com/default/axiosFunction2',
      data:   submitData,
    })
    .then(res => {
      console.log(res)
      //new_Img.src = res.data;
      let new_Img:File      = createJpegFile4Base64( res.data, "new_img" )
      let newImgURL:string  = URL.createObjectURL( new_Img );
      setReplyImgURL( newImgURL );
      console.log(new_Img);
    })
    .catch(results => {
      console.log(results);
    });
  }

  return (
    <div>
      <input type="file" 
             name="example" 
             accept="image/*" 
             onChange={handleChange}
      />
      <img src={ imgURL } alt="description"/>
      <img src={ replyImgURL }  alt="description"/>
      <button type="button"
              onClick={handleSubmitData}
             >submit</button>
    </div>
  );
};

export default PostImgFile;

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

const createJpegFile4Base64 = function (base64: string, name: string) {
  // base64のデコード
  const bin = atob(base64.replace(/^.*,/, ''));
  // バイナリデータ化
  const buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
  }
  // ファイルオブジェクト生成(この例ではjpegファイル)
  return new File([buffer.buffer], name, {type: "image/jpg"});
};