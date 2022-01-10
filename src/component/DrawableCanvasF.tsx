import React, {useState, useRef, ComponentProps} from "react";

interface CanvasProps extends ComponentProps<any> {
    height: number,
    width: number,
    lineWidth?: number
};

// マウスとタッチ両方に対応するための位置を返すType・関数
type MouseOrTouchEventHandler<T = Element> = React.EventHandler< React.MouseEvent<T> | React.TouchEvent<T> >;

const offsetPosition =  (e : React.MouseEvent | React.TouchEvent) => {
    if (e.nativeEvent instanceof TouchEvent) {
      const rect = (e.target as any).getBoundingClientRect();      
      const offsetX = (e.nativeEvent.touches[0].clientX - window.pageXOffset - rect.left);
      const offsetY = (e.nativeEvent.touches[0].clientY - window.pageYOffset - rect.top);
      return { offsetX, offsetY };
    } else if (e.nativeEvent instanceof MouseEvent) {
      return { offsetX: e.nativeEvent.offsetX ,offsetY: e.nativeEvent.offsetY };
    }
};

// ここからが本体　Canvasを返す関数
const DrawableCanvasF = (props: CanvasProps) => {
    const [drawing, setDrawing] = useState(false);
    // 表示用のCanvasRef
    let canvas: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null)
    // データ取得時に一時的にリサイズしたデータを格納する
    let hidden_canvas: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null)

    // CanvasエレメントへのRefを入れると、対象のContextを返す関数
    const getContext = ( canvases: React.MutableRefObject<HTMLCanvasElement | null> ) => {
        let ctx: CanvasRenderingContext2D | null = null;
        if (canvases.current){
            ctx = canvases.current.getContext("2d");
            if (ctx && props.lineWidth) 
                { ctx.lineWidth = props.lineWidth; }
        }
        return ctx;
    };

    const startDrawing: MouseOrTouchEventHandler = (e) => {
        setDrawing(true);
        const position = offsetPosition(e);
        const ctx = getContext(canvas);
        if (position && ctx) { 
            const {offsetX: x, offsetY: y} = position;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const endDrawing = () => {
        setDrawing(false);
        const ctx = getContext(canvas);
        if (ctx){ ctx.closePath(); }
    };

    const draw: MouseOrTouchEventHandler = (e) => {
        if (!drawing) return;
        const position = offsetPosition(e);
        const ctx = getContext(canvas);
        if (position && ctx){
            const {offsetX: x, offsetY: y} = position;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const downloadImg = () => {
        if (canvas.current) {
            const dLink: any = document.createElement("a"); //ダウンロード用のエレメント作成
            dLink.href = canvas.current.toDataURL('image/png'); //画面データをpngに変換
            dLink.download = new Date().getTime() + '.png';; //DLするファイルの名前を設定
            dLink.click(); //クリックする = DLする
            dLink.remove();
        }
    };

    const setData= () => {
        //const ctx  = getContext(canvas);
        const hctx = getContext(hidden_canvas);
        const data = new Float32Array(28*28); //出力用の28*28=784の一次元データ
        if (hctx && canvas.current && hidden_canvas.current) {
            // hctxの初期化
            hctx.clearRect(0, 0, hidden_canvas.current.width, hidden_canvas.current.height);
            // 元画像をリサイズしてhidden_canvasに書き込み
            hctx.drawImage( canvas.current, 
                0, 0, props.width,                 props.height, //元画像の範囲指定=全体
                0, 0, hidden_canvas.current.width, hidden_canvas.current.height// 書き込み先の範囲指定=全体
                ); 
            const imgData = hctx.getImageData(0, 0, hidden_canvas.current.width, hidden_canvas.current.height); //pixelデータへ変換
            for (let i = 0; i < data.length; ++i) {
                data[i] = imgData.data[i * 4 + 3] / 255;
            }
        }
        console.log(data);
        return data;
    }

    const clearCanvas = () => {
        //downloadImg(); //キャンバス削除時に画像をダウンロード
        const ctx  = getContext(canvas);
        const hctx = getContext(hidden_canvas);
        if (canvas==null || ctx==null || hctx==null) return ;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        hctx.clearRect(0, 0, hctx.canvas.width, hctx.canvas.height);
    };

    return (
        <div>
            <canvas
                ref={canvas}
                width={props.width}
                height={props.height}
                onMouseDown={ startDrawing }
                onMouseUp={ endDrawing }
                onMouseLeave={ endDrawing }                
                onMouseMove={ draw }
                onTouchStart={ startDrawing }
                onTouchEnd={ endDrawing }
                onTouchMove={ draw }
                style={props.style}
                id="display-canvas"
            />
            <canvas
                ref={hidden_canvas}
                width={"28px"}
                height={"28px"}
                style={props.style}
                id="hidden-canvas"
            />
            <button onClick={clearCanvas}>clear</button>
            <button onClick={downloadImg}>Download</button>
            <button onClick={setData}>SetData</button>
        </div>
    )
};

export default DrawableCanvasF;