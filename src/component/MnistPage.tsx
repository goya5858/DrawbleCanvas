import React from "react";
//import {InferenceSession, Tensor} from "onnxjs"
import DrawableCanvasF from "./DrawableCanvasF";
import FormImg from "./FormImg";


const MnistPage = () => {
    return (
        <div style={{margin: "24px"}}>
            <h1>Drow with Mouse !</h1>
            <FormImg/>
            <DrawableCanvasF
                style={{border: "1px solid black", margin: "8px"}}
                height={300}
                width={300}
                lineWidth={15}
            />
        </div>
    );
}

export default MnistPage;