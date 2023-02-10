 /**
  * done by titus^rabenauge
  */

class calcTile {
    columns = 0;
    rows = 0;
    charArray = [];

    calcRowAndColumns(width,height,gridX,gridY){
        this.columns = width/gridX;
        this.rows = height/gridY;
    }
    generateRandom(min = 0, max = 100) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor( rand * difference);
        rand = rand + min;
        return rand;
    }
    randomInt(max){
        return Math.floor(Math.random() * max);
    }
}

class font {
    tile = new calcTile();
    charArray = [];
    ignoreChars = [];

    constructor(imgWidth,imgHeight,gridX,gridY,ignorechars = []) {
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.gridX = gridX;
        this.gridY = gridY;
        this.ignoreChars = ignorechars;
        this.tile.calcRowAndColumns(this.imgWidth,this.imgHeight,this.gridX,this.gridY);
        this.createCharArray();
    }
    createCharArray(){
        let i = 0;
        for(let x = 0; x < this.tile.rows; x++){
            for(let y = 0; y < this.tile.columns; y++){

                if(!ignoreChars.includes(i)){
                    this.charArray.push([x,y]);
                }
                i++;
            }
        }
    }
    randomCharCoords(){
        let number = this.tile.generateRandom(0,this.charArray.length);
        return [this.charArray[number][0]*this.gridX,this.charArray[number][1]*this.gridY];
    }
}


const myImage = new Image();
myImage.src = "font.png";
const canvas= document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024; //size x preview
canvas.height = 1024; //size y preview

const gridW = 16, //
      gridH = 16,
      ignoreChars = [0,3,4,5,6,7,10,15,28,30,32,59] //just the plain number of the char to ignore
      ;




myFont = new font(myImage.width,myImage.height,gridW,gridH),ignoreChars;


myImage.addEventListener('load', function(){

    let targetCalc = new calcTile();
    targetCalc.calcRowAndColumns(canvas.width,canvas.height,gridH,gridW);

    let posX = 0;
    let posY = 0;


        for (let r = 0; r < targetCalc.rows; r++ ) {
            for (let c = 0; c < targetCalc.columns; c++ ) {
                rndTilePos = myFont.randomCharCoords(); 
                ctx.drawImage(myImage, rndTilePos[1], rndTilePos[0] ,gridW,gridH,c*gridW,r*gridH,gridW,gridH);
            }    
        }
});

