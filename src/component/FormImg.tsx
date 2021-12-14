import React, {useState} from "react";

const FormImg = () => {
    const [fileURL, setFileURL] = useState("");
    function processImg(event: any) {
        const imgFile = event.target.files[0];
        const imgURL  = URL.createObjectURL(imgFile);
        console.log("==========", imgURL);
        setFileURL( imgURL );
    }
    return (
        <div>
            <form method="post" encType="multipart/form-data" action="https://neozbbmfag.execute-api.ap-northeast-1.amazonaws.com/testFunction">
                <input type="file" 
                       name="example" 
                       accept="image/*" 
                       onChange={processImg}
                />
                <img src={fileURL}/>
                <button type="submit">submit</button>
            </form>
            
        </div>
    )
}

export default FormImg;