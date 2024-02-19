// Doc https://www.youtube.com/watch?v=UnKvDZ7wqUY - 36:33

// Main maze object from canvas
const canvas = document.getElementById("maze");
const c = canvas.getContext("2d");

let current;
class Maze {
    constructor(size, row, columns) {
        this.size = size;
        this.rows = row;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++){
            let row = []
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(this.size, this.grid, this.rows, this.columns, r, c)
                row.push(cell)
            }
            this.grid.push(row)
        }
        current = this.grid[0][0]
    }

    draw() {
        canvas.width = this.size
        canvas.height = this.size
        canvas.style.paddingTop = "10px"
        canvas.style.paddingBottom = "10px"
        canvas.style.paddingRight = "10px"
        canvas.style.paddingLeft = "10px"

        canvas.style.background = "black"

        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.show()
            })
        })

        this.DFSMaze()
        
        requestAnimationFrame(() => {
            this.draw()
        })
    }

    DFSMaze() {
        current.visited = true;
        let next = current.getRandNeighbour()
        if (next) {
            console.log(next)
            next.visited = true;
            this.stack.push(current)
            current.removeWalls(current, next)
            current = next
        } else if (this.stack.length > 0) {
            let parentCell = this.stack.pop()
            current = parentCell
        }

        if (this.stack.length == 0) {
            return
        }
    }
}


class Cell{
    constructor(parentSize, parentGrid, rows, cols, rowNum, colNum){
        this.parentSize = parentSize;
        this.parentGrid = parentGrid;
        this.rows = rows;
        this.cols = cols;
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.size = parentSize / rows;
        this.Walls = {
            topWall: true,
            buttomWall: true,
            leftWall: true,
            rightWall: true,
        };
        this.visited = false;
        this.neighbours = []
    }

    drawLine(fromX, fromY, toX, toY) {
        c.lineWidth = 1;
        c.strokeStyle = "white"
        // if  (this.colNum == current.colNum && this.rowNum == current.rowNum) {
        //     // c.fillRect(fromX + this.size, fromY +this.size, this.size, this.size)
        //     c.fillStyle = '#FFF';
        //     c.fillRect(fromX, fromY, this.size, this.size)
        //     c.strokeStyle = "blue"
            
        // } else {
        //     c.strokeStyle = "white"
        // }
        c.beginPath()
        c.moveTo(fromX, fromY)
        c.lineTo(toX, toY)
        c.stroke()
    }

    drawWalls() {
        // let pad = 6
        let fromX = 0;
        let fromY = 0;
        let toX = 0;
        let toY = 0;
        if (this.Walls.topWall) {
            fromX = this.colNum * this.size
            fromY = this.rowNum * this.size

            toX = fromX + this.size;
            toY = fromY
            this.drawLine(fromX, fromY, toX, toY)
        }
        if (this.Walls.buttomWall) {
            fromX = this.colNum * this.size
            fromY = (this.rowNum * this.size) + this.size

            toX = fromX + this.size // _
            toY = fromY // |
            this.drawLine(fromX, fromY, toX, toY)
        }
        if (this.Walls.rightWall) {
            fromX = (this.colNum * this.size) + this.size
            fromY = this.rowNum * this.size

            toX = fromX
            toY = fromY + this.size
            this.drawLine(fromX, fromY, toX, toY)
        }
        if (this.Walls.leftWall) {
            fromX = this.colNum * this.size
            fromY = this.rowNum * this.size

            toX = fromX
            toY = fromY + this.size
            this.drawLine(fromX, fromY, toX, toY)
        }
    }
    getRandNeighbour() {
        this.setNeighbours()
        if (this.neighbours.length == 0) return undefined
        let rand = Math.floor(Math.random() * this.neighbours.length)
        return this.neighbours[rand]
    }
    setNeighbours() {
        this.neighbours = [] // clear the neighbours each time we wanna get the current cell neighbours
        let y = this.rowNum
        let x = this.colNum
        let left = this.colNum !== 0 ? this.parentGrid[y][x - 1] : undefined
        let right = this.colNum !== this.cols ? this.parentGrid[y][x + 1] : undefined
        let top = this.rowNum !== 0 ? this.parentGrid[y - 1][x] : undefined
        let bottom = this.rowNum !== this.rows-1 ? this.parentGrid[y + 1][x] : undefined

        if (left && !left.visited) {this.neighbours.push(left)}
        if (right && !right.visited) {this.neighbours.push(right)}
        if (top && !top.visited) {this.neighbours.push(top)}
        if (bottom && !bottom.visited) {this.neighbours.push(bottom)}
    }
    show() {
        this.drawWalls()
        // add color feature

        
    }
    removeWalls(cell1, cell2) {
        console.log(cell1.walls, cell2.Walls)
        let Xdiff = cell2.colNum - cell1.colNum
        if (Xdiff == 1) {
            cell1.Walls.rightWall = false;
            cell2.Walls.leftWall = false;
        } else if (Xdiff == -1) {
            cell2.Walls.rightWall = false;
            cell1.Walls.leftWall = false;
        }
        let Ydiff = cell2.rowNum - cell1.rowNum
        if (Ydiff == 1) {
            cell1.Walls.buttomWall = false;
            cell2.Walls.topWall = false;
        } else if (Ydiff == -1) {
            cell2.Walls.buttomWall = false;
            cell1.Walls.topWall = false;
        }
    }
}

let maze = new Maze(600, 10, 10)
maze.setup()
maze.draw()
console.log(maze.grid)