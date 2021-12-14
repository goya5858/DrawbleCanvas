import React, {ChangeEvent, useState} from "react";
import axios from 'axios';

const FormImg = () => {
    const [fileURL, setFileURL] = useState<any>();
    const [imgData, setImgData] = useState<File>();



    // 入力画像が変更されたときに、提出用のオブジェクトを変更
    const handleSetImg = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const imgFile: File = e.target.files[0];
        const imgURL  = URL.createObjectURL(imgFile);
        setImgData( imgFile );
        setFileURL( imgURL );
    }

    const handleSubmitData = async() => {
        //const formData = new FormData();
        if ( !imgData ) return;
        //formData.append( "submitImg", imgData );
        const subURL = "https://duw8yp1jr2.execute-api.ap-northeast-1.amazonaws.com/prob";
        //const headers = { "content-type": "multipart/form-data",};
        axios({
            method: 'post',
            url: subURL,
            data: fileURL
        })
        .then(res => { console.log(res); })
        .catch(res => { console.log(res) })
    }

    return (
        <div>
            <input type="file" 
                   name="example" 
                   accept="image/*" 
                   onChange={(e: ChangeEvent<HTMLInputElement>) => handleSetImg(e)}
            />
            <input type="text"
                   onChange={(e: ChangeEvent<HTMLInputElement>) => handleSetImg(e)}
            ></input>
            <img src={ fileURL }  alt="description"/>
            <button type="button"
                onClick={handleSubmitData}
            >submit</button>
            
        </div>
    )
}

export default FormImg;