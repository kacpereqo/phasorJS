interface Point {
    x: number
    y: number
  }

interface Vector{
    angle: number // in radians
    length : number
    color?: string
    children?: Vector[]
}

let angle = 0

const vector = 
    {angle: Math.PI/11, length: 200, children: [ {angle: Math.PI/2, length: 100}]}

export class Drawer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D 
    private width = 800
    private height = 600

    init(canvas : HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!

        if (!this.ctx || !this.canvas) {
            throw new Error('Canvas or context not found')
        }

    }

    getNewCtx(): CanvasRenderingContext2D {
        const ctx = this.canvas.getContext('2d')!
        ctx.translate(this.width / 2, this.height / 2)
        return ctx
    }

    resize(width: number, height: number): void {
        this.width = width
        this.height = height
        this.canvas.width = width
        this.canvas.height = height

        this.ctx = this.getNewCtx()

        this.draw()
    }

    drawVector( vec:Vector, start: Point = {x:0,y:0}): void {
        if (!this.ctx || !this.canvas) {
            throw new Error('Canvas or context not found')
        }

        const end = {
            x: vec.length * Math.cos(vec.angle + angle) + start.x,
            y: vec.length * Math.sin(vec.angle + angle) + start.y
        }

        this.drawLine(this.ctx, start, end)
        this.drawArrowhead(start, end)

        if (vec.children) {
            vec.children.forEach((child) => {
                this.drawVector(child,end)
            })
        }
    }

    drawArrowhead(start:Point, end:Point):void{
        const headlen = 10;   // length of head in pixels
        const angle = Math.atan2(end.y-start.y,end.x-start.x);
        this.ctx!.beginPath();
        this.ctx!.moveTo(end.x, end.y);
        this.ctx!.lineTo(end.x-headlen*Math.cos(angle-Math.PI/6),end.y-headlen*Math.sin(angle-Math.PI/6));
        this.ctx!.lineTo(end.x-headlen*Math.cos(angle+Math.PI/6),end.y-headlen*Math.sin(angle+Math.PI/6));
        this.ctx!.closePath();
        this.ctx!.fill();
    }

    clearCanvas(): void {
        if (!this.ctx || !this.canvas) {
            throw new Error('Canvas or context not found')
        }
        this.ctx.clearRect(-this.width / 2, -this.height / 2, this.width, this.height)
    }

    draw(): void {
        if (!this.ctx || !this.canvas) {
            throw new Error('Canvas or context not found')
        }
        this.clearCanvas()
        this.drawHorizontalAxis()
        this.drawVerticalAxis()
        this.drawVector(vector)

        angle += Math.PI/(360 * 60)

        requestAnimationFrame(() => this.draw())
      }

    drawLine(ctx: CanvasRenderingContext2D, start: Point, end: Point): void {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
      }

    drawHorizontalAxis(): void {
    this.drawLine(this.ctx, { x: -this.width / 2, y: 0 }, { x: this.width / 2, y: 0 })
    }
    
    drawVerticalAxis(): void {
    this.drawLine(this.ctx, { x: 0, y: this.height/2 }, { x: 0, y: -this.height/2 })
    }
}
