import React, {useState, ComponentProps} from "react";

interface DrawableCanvasProps extends ComponentProps<any> {
    dataHeight: number,
    dataWidth: number,
    displayHeight: number,
    displayWidth: number,
    lineWidth?: number
}

export default class DrawableCanvas extends React.Component<DrawableCanvasProps> {
    state = {
        drawing: false
    }
    displayCanvas: HTMLCanvasElement | null = null;

    startDrawing = (x: number, y: number) => {
        this.setState({drawing: true});
        const ctx = this.displayCanvas?.getContext("2d");
        if (ctx != null) {
            ctx.beginPath();
            if (this.props.lineWidth) {
                ctx.lineWidth = this.props.lineWidth;
            }
            ctx.moveTo(x, y);
        }
    }
    endDrawing = () => {
        this.setState({drawing: false});
        const ctx = this.displayCanvas?.getContext("2d");
        if (ctx != null) {
            ctx.closePath();
        }
    }
    draw = (x: number, y: number) => {
        if (!this.state.drawing) {
            return;
        }
        const ctx = this.displayCanvas?.getContext("2d");
        if (ctx != null) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    clearCanvas() {
        const dCtx = this.displayCanvas?.getContext("2d");
        if (this.displayCanvas == null || dCtx == null) {
            return null;
        }
        dCtx.clearRect(0, 0, dCtx.canvas.width, dCtx.canvas.height);
    }

    render() {
        return (
            <div>
                <canvas
                    ref={e => this.displayCanvas = e}
                    width={this.props.displayWidth + "px"}
                    height={this.props.displayHeight + "px"}
                    id="display-canvas"
                    onMouseDown={e => this.startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                    onMouseUp={() => this.endDrawing()}
                    onMouseLeave={() => this.endDrawing()}
                    onMouseMove={e => this.draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                    style={this.props.style}
                />
            </div>
        );
    }
}