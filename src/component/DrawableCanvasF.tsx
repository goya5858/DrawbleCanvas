import React, {useState, useRef, ComponentProps} from "react";

interface CanvasProps extends ComponentProps<any> {
    height?: number,
    width?: number,
    lineWidth?: number
};

// マウスとタッチ両方に対応するための位置を返すType・関数
type MouseOrTouchEventHandler<T = Element> = React.EventHandler< React.MouseEvent<T> | React.TouchEvent<T> >;

const offsetPosition =  (e : React.MouseEvent | React.TouchEvent) => {
    if (e.nativeEvent instanceof TouchEvent) {
        const rect = (e.target as any).getBoundingClientRect();      
        const offsetX = (e.nativeEvent.touches[0].clientX - window.pageXOffset - rect.left);
        const offsetY = (e.nativeEvent.touches[0].clientY - window.pageYOffset - rect.top);
        return { offsetX: offsetX, offsetY: offsetY };
    } else if (e.nativeEvent instanceof MouseEvent) {
      return { offsetX: e.nativeEvent.offsetX ,offsetY: e.nativeEvent.offsetY };
    }
};

// ここからが本体　Canvasを返す関数
const DrawableCanvasF = (props: CanvasProps) => {
    const [drawing, setDrawing] = useState(false);
    let canvas: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null)

    const getContext = () => {
        let ctx: CanvasRenderingContext2D | null = null;
        if (canvas.current){
            ctx = canvas.current.getContext("2d");
            if (ctx && props.lineWidth) 
                { ctx.lineWidth = props.lineWidth; }
        }
        return ctx;
    }

    const startDrawing: MouseOrTouchEventHandler = (e) => {
        setDrawing(true);
        const position = offsetPosition(e);
        const ctx = getContext();
        if (position && ctx) { 
            const {offsetX: x, offsetY: y} = position;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const endDrawing = () => {
        setDrawing(false);
        const ctx = getContext();
        if (ctx){
            ctx.closePath();
        }
    };

    const draw: MouseOrTouchEventHandler = (e) => {
        if (!drawing) return;
        const position = offsetPosition(e);
        const ctx = getContext();
        if (position && ctx){
            const {offsetX: x, offsetY: y} = position;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const clearCanvas = () => {
        const ctx = getContext();
        if (canvas==null || ctx==null) return ;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    return (
        <div>
            <canvas
                ref={canvas}
                width={props.width}
                height={props.height}
                id="display-canvas"
                onMouseDown={ startDrawing }
                onMouseUp={ endDrawing }
                onMouseLeave={ endDrawing }                
                onMouseMove={ draw }
                style={props.style}
            />
            <button onClick={clearCanvas}>clear</button>
        </div>
    )
};

export default DrawableCanvasF;