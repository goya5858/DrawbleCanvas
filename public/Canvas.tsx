import React, {ReactEventHandler, useEffect, useRef, useState} from "react";


export type HandWritingAttribute = {
    width?: number,
    height?: number,
    lineWidth?: number,
    lineColor?: string,
    lineCap?: CanvasLineCap,
    clear?: boolean,
    onUpdateCanvas?: (e: HTMLCanvasElement) => void,
}

const HandWriting: React.FC<HandWritingAttribute> = (props) => {
    const canvas = useRef(null);
    const [drawing, setDrawing] = useState(false);

    //親コンポーネントでclearの値を変更すると実行される
    useEffect( () => {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        if (ctx){
            ctx.clearRect(0, 0, props.width, props.height);
            if (props.onUpdateCanvas) { props.onUpdateCanvas(canvas.current); }
        }
    }, [props.clear] );

    const getContext = () => {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        ctx.lineWidth = props.lineWidth;
        ctx.lineCap = props.lineCap;
        ctx.strokeStyle = props.lineColor;
        return ctx;
    }

    //描画処理開始 beginPathで新たなパスを開始
    const mouseDown: React.MouseEventHandler = (e) => {
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        setDrawing(true);
        const ctx = getContext();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    //マウスの位置に合わせて線を描画
    const mouseMove: React.MouseEventHandler = (e) => {
        if (!drawing) return;
        const { offsetX: x, offsetY: y } = e.nativeEvent;
        const ctx = getContext();
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // 描画の終了
    const endDrawing: ReactEventHandler = (e) => {
        setDrawing(false);
        if (props.onUpdateCanvas) { props.onUpdateCanvas(canvas.current); }
    }

    return (
        <canvas ref={canvas}
                width={props.width} height={props.height}
                onMouseDown={mouseDown}
                onMouseMove={mouseMove}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing} />
    )
};

// propsのデフォルト値を設定
HandWriting.defaultProps = {
    width: 500,
    height: 300,
    lineWidth: 10,
    lineColor: "rgb(100, 100, 100)",
    lineCap: "round",
};

export default HandWriting;