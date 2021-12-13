import React, {useState, useRef, ComponentProps} from "react";

interface CanvasProps extends ComponentProps<any> {
    height?: number,
    width?: number,
    lineWidth?: number
}

const DrawableCanvasF = (props: CanvasProps) => {
    const [drawing, setDrawing] = useState(false);
    let canvas: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null)

    const startDrawing = (x: number, y: number) => {
        setDrawing(true);
        if (canvas.current){
            const ctx = canvas.current.getContext("2d");
            if (ctx){
                ctx.beginPath();
                if (props.lineWidth){
                    ctx.lineWidth = props.lineWidth;
                }
                ctx.moveTo(x, y);
            }
        }
    };

    const endDrawing = () => {
        setDrawing(false);
        if (canvas.current){
            const ctx = canvas.current.getContext("2d");
            if (ctx!=null) {
                ctx.closePath();
            }
        }
    };

    const draw = (x: number, y: number) => {
        if (!drawing) return;
        if (canvas.current){
            const ctx = canvas.current.getContext("2d");
            if (ctx!=null){
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    };

    const clearCanvas = () => {
        if (canvas.current){
            const ctx = canvas.current.getContext("2d");
            if (canvas==null || ctx==null) return ;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }

    return (
        <div>
            <canvas
                ref={canvas}
                width={props.width}
                height={props.height}
                id="display-canvas"
                onMouseDown={ e => startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY) }
                onMouseUp={ () => endDrawing() }
                onMouseLeave={ () => endDrawing() }                
                onMouseMove={ e => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY) }
                style={props.style}
            />
            <button onClick={clearCanvas}>clear</button>
        </div>
    )
};

export default DrawableCanvasF;