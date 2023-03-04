import EventEmitter from "./EventEmitter.js";

console.log('pixel-fighting included.');

const DEFAULT_COLORS = new Map([
    ['white', 'black'],
    ['red', 'cyan'],
])

export const EVENT_WIN = 'WIN';

export const PixelFighting = function () {

    var color1, color2;
    var canvas, ctx;
    var interval;
    var width, height;
    var size,step;
    var Old, New, Neigh, Ratio1;
    var Sum_1;
    var isLog = false;

    this.setup = function(canvasId, col1, col2, _size = 5) {
        color1 = col1;
        color2 = col2;

        width = 500;
        height = 500;
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext("2d");
        size=_size;
        step=500/size;
        Sum_1=0;

        this.subscribe(EVENT_WIN, this.reset);

        this.initialize();
        interval = setInterval(this.run,2);

    }

    this.enableLogs = () => {
        isLog = true;
    }

    this.disableLogs = () => {
        isLog = false;
    }

    this.restart = () => {
        this.initialize();
        interval = setInterval(this.run,2);
    }

    this.reset = (winner) => {
        const color = winner ? color2 : color1;
        isLog && console.log(`%cWin is ${color}`, `color: ${color}`)
        clearInterval(interval);
    }

// Intiiales Setzen der Boards
    this.initialize = function() {
        Old = new Array (size);
        New = new Array (size);
        //Anzahl der Nachbarn
        Neigh = new Array (size);
        Ratio1 = new Array (size);

        var i, j;
        for (i = 0; i < Old . length; ++ i){
            Old [i] = new Array (size);
            New [i] = new Array (size);
            Neigh [i] = new Array (size);
            Ratio1 [i] = new Array (size);

        }
        for (i = 0; i < size; ++ i){
            for (j = 0; j < size; ++ j){
                Ratio1 [i][j]=0;
                Neigh[i][j]=8;
                if (i===0 || i===size-1) {
                    Neigh[i][j]=5;
                    if(j===0 || j===size-1) {
                        Neigh[i][j]=3
                    }
                }
                if (j===0 || j===size-1) {
                    Neigh[i][j]=5;
                    if(i===0 || i===size-1) {
                        Neigh[i][j]=3
                    }
                }


                if (i<size/2){
                    Old [i][j] = 1;
                    Sum_1+=1
                }
                else {
                    Old [i][j] = 0;
                }
                New [i][j] = Old [i][j];
            }
        }
        Sum_1=Sum_1/(size*size);
    }


    this.ratio = function() {
        var i, j;
        for (i = 0; i < size; ++ i){
            for (j = 0; j < size; ++ j){
                Ratio1[i][j]=0;
                if(i>0){
                    if(j>0){ 		Ratio1[i][j]+=Old[i-1][j-1];}
                    Ratio1[i][j]+=Old[i-1][j];
                    if(j<size-1){	Ratio1[i][j]+=Old[i-1][j+1];}
                }

                if(j>0){ 		Ratio1[i][j]+=Old[i][j-1];}
                if(j<size-1){	Ratio1[i][j]+=Old[i][j+1];}

                if(i<size-1){
                    if(j>0){ 		Ratio1[i][j]+=Old[i+1][j-1];}
                    Ratio1[i][j]+=Old[i+1][j];
                    if(j<size-1){	Ratio1[i][j]+=Old[i+1][j+1];}
                }

                Ratio1[i][j]=Ratio1[i][j]/Neigh[i][j];
            }
        }
        isLog && console.log(Neigh[1][1]);
        isLog && console.log(Ratio1[1][1]);
        isLog && console.log(Sum_1);

    }





    this.draw = function () {
        var i, j;
        for (i = 0; i < size; ++ i){
            for (j = 0; j < size; ++ j){
                ctx.fillStyle = color1;
                if(Old[i][j]===1){ctx.fillStyle = color2;}
                ctx.fillRect (i*step, j*step, step, step);
            }
        }
    }

    this.calculate = function() {
        var i, j;
        for (i = 0; i < size; ++ i){
            for (j = 0; j < size; ++ j){
                var help=Math.random();

                if ((Ratio1[i][j])>help){
                    Old[i][j]=1;
                } else{Old[i][j]=0;
                }
            }
        }


        Sum_1=0;
        for (i = 0; i < size; ++ i){
            for (j = 0; j < size; ++ j){
                if (Old[i][j]==1) Sum_1+=1;
            }
        }
        Sum_1=Sum_1/(size*size);


    }

    this.checkWin = () => {
        isLog && console.log('SUM', Sum_1);
        if (Sum_1 === 0 || Sum_1 === 1) {
            this.emit(EVENT_WIN, Sum_1)
        }
    }

    this.run = () => {
        this.checkWin();
        this.ratio();
        this.draw();
        this.calculate();
    }
};

PixelFighting.prototype = new EventEmitter();
