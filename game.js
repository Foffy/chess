var local = true;
var debug = true;

// global variables
var c = document.getElementById('c');
ctx = c.getContext('2d');

c.width = window.innerWidth;
c.height = window.innerHeight;
var width = c.width;
var height = c.height;
var xDisp = 0; // if screen is too wide
var yDisp = 0; // if screen is too high
var mousePos = [0,0];
var mouseClicked = null;
resizeCanvas();
window.addEventListener('resize', resizeCanvas,false);
var imgPath = (local == true) ? "images/" : "/assets/images/";

// THESE ARE ALL UTILITY METHODS AND CONTAIN NO GAMEPLAY

// resizes the canvas to the current window parameters
// and calculates where to paint
function resizeCanvas(){
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	
	if(c.width <= c.height*(4/3)){
		width = c.width;
		height = (3/4)*width;
		xDisp = 0;
		yDisp = (c.height - height)/2;
	}else{
		height = c.height;
		width = (4/3)*height;
		yDisp = 0;
		xDisp = (c.width - width)/2;
	}
}

function setFont(pctFont, italic){
	if(italic){
		ctx.font = "italic "+pctOf(pctFont,width) + "px Kingthings";
	}else{
		ctx.font = pctOf(pctFont,width) + "px Kingthings";
	}
}

// clears the canvas for painting
var bgcolor = colorString([162,206,231]);

function clear(){
	ctx.fillStyle = bgcolor;
	ctx.beginPath();
	ctx.rect(0,0,c.width,c.height);
	ctx.closePath();
	ctx.fill();
}

// get mouse coordinates
function getMousePosition(evt){	
	var rect = c.getBoundingClientRect(), root = document.documentElement;
	var mouseX = evt.clientX - rect.top - root.scrollTop-c.offsetLeft;
	var mouseY = evt.clientY - rect.left - root.scrollLeft-c.offsetTop;
	mousePos[0] = mouseX;
	mousePos[1] = mouseY;
}

function getMouseClick(x, y, width, height){
	mouseClicked = [];
	mouseClicked[0] = xToPct(mousePos[0]);
	mouseClicked[1] = yToPct(mousePos[1]);
	if(typeof(x) == 'number'){
		if(mouseClicked[0] >= x && mouseClicked[0] <= (x+width) && mouseClicked[1] >= y && mouseClicked[1] <= (y+height)){
			return true;
		}
	}
	return false;
}

function getClickPosition(){
	var pos = [];
	mouseClicked = [];
	mouseClicked[0] = xToPct(mousePos[0]);
	mouseClicked[1] = yToPct(mousePos[1]);
	pos[0] = Math.floor(mouseClicked[0]/10)-1;
	pos[1] = Math.floor(mouseClicked[1]/10)-1;
	return pos;
}

// converts a percentage of the width to an exact x value
function pctToX(value){
	return xDisp + pctOf(value,width);
}

// converts a percentage of the height to an exact y value
function pctToY(value){
	return yDisp + pctOf(value,height);	
}

// converts a x value to a percentage of the height
function xToPct(value){
	return ((value-xDisp)/width)*100;
	//return value*100/width;
}

// converts a y value to a percentage of the height
function yToPct(value){
	return ((value-yDisp)/height)*100;
	//return value*100/height;
}

// simple method to get a percentage of something
function pctOf(value,total){
	return (total/100.0)*value;
}

// draw an image from the given position with the given width(in percentages),
// if sizeRatio is given, the height will be calculated from that.
// Otherwise the hight will be set to keep the aspect ratio as original.
// 
function drawImage(img, pctX, pctY, pctW, cropX, cropY, cropXWidth, cropYHeight, sizeRatio){
	//drawText("X="+pctToX(pctX)+" Y="+pctToY(pctY),5,5,0,2.5);
	var ratio = img.height/img.width;
	var width = pctToX(pctW)-xDisp;
	var alphaIE = 100;
	var alphaNS = 1;
	if(typeof(cropX)==='undefined'){
		ctx.drawImage(img, pctToX(pctX), pctToY(pctY),width,width*ratio);
	}
	else{
			if(typeof(sizeRatio === 'number')){
				var ratio = sizeRatio;
			}
		ctx.drawImage(img,cropX, cropY, cropXWidth, cropYHeight, pctToX(pctX), pctToY(pctY), width, width*ratio);
	}
}

function colorString(array){
	if(typeof array == "undefined") return "black";
	if(typeof array == "string") return array;
	
	if(array.length > 3){
		return "rgba("+parseInt(array[0])+","+parseInt(array[1])+","+parseInt(array[2])+", "+parseInt(array[3])+")"
	}else{
		return "rgba("+parseInt(array[0])+","+parseInt(array[1])+","+parseInt(array[2])+", 255)"
	}
}

// draws a text starting with the upper left corner in the position given
// and width the given maximum width. It will break the text down if it
// is too wide and make new lines underneath. The font is also given relative
// to the screen size (width).
function drawText(text, pctX, pctY, pctW, pctFont, allign, wordwrap, color, italic){
	ctx.fillStyle = colorString(color);
	var fontH = pctOf(pctFont,width);
	setFont(pctFont,italic);
	
	if(pctW > 0){
		lines = wordwrap == false ? [text] : wordWrap(text, pctW, pctFont);
		var maxwidth = pctOf(pctW,width);
		var x = pctToX(pctX);
		var y = pctToY(pctY) + fontH;
		for(var i = 0; i < lines.length; i++){
			switch(allign){
				case "center":{
					ctx.fillText(lines[i],2+x+(maxwidth-ctx.measureText(lines[i]).width)/2,y);
					break;	
				}
				case "right":{
					ctx.fillText(lines[i],2+x+maxwidth-ctx.measureText(lines[i]).width,y);
					break;	
				}
				default:{
					ctx.fillText(lines[i],2+x,y);
				}
			}
			y += fontH;
		}
	}else{
		ctx.fillText(text, pctToX(pctX),pctToY(pctY) + fontH);
	}
}

function drawTextInBox(text, position){
	switch(position){
		case "header":{
			drawImage(imgBanner,35,25,30);
			drawText(text,36.5,26,28.5,4,"center");
			break;
		}
		case "flavor":{
			drawText('"'+text+'"',31,59,38,3,"center",true,"gray",true);
			break;
		}
		default:{ // which is "body"
			drawText(text,31,35,38,3,"center");		
		}
	}
	
}

// draws a filled rectangle at the given position with the given width,
// height and color.
function drawRect(pctX, pctY, pctW, pctH, color, border){
	ctx.beginPath();
	ctx.rect(pctToX(pctX),pctToY(pctY),pctToX(pctW)-xDisp,pctToY(pctH)-yDisp);
	ctx.fillStyle = colorString(color);
	ctx.fill();
	if(border){
		ctx.lineWidth = getBorderWidth();
		ctx.strokeStyle = "black";
		ctx.stroke();
	}
}

function drawCircle(pctX, pctY, pctR, color, border){
		ctx.beginPath();
		ctx.arc(pctToX(pctX),pctToY(pctY),pctOf(pctR,width),0,2*Math.PI,false);
		ctx.fillStyle = colorString(color);
		ctx.fill();
		
		if(border){
			ctx.lineWidth = getBorderWidth();
			ctx.strokeStyle = "black";
			ctx.stroke();
		}
}

function wordWrap(text, maxWidthPct, pctFont){	
	var wordsIndex = 0;
	var words = (""+text).split(" ");
	var results = [];
	var maxwidth = pctToX(maxWidthPct)-xDisp;
	
	var line = "";
	var nextWord = null;
	while(wordsIndex < words.length){
		nextWord = words[wordsIndex];
		if(ctx.measureText(line + nextWord).width <= maxwidth){ // cut word
			line += nextWord + " ";
			wordsIndex++;
		}else if(ctx.measureText(nextWord).width > maxwidth){ // cut word
			var end = nextWord.length - 1;
			while(ctx.measureText(line + nextWord.substring(0, end) + "-").width > maxwidth){ // see what we have space for
				end--;
			}
			results.push(line + nextWord.substring(0,end) + "-");
			line = "";
			words[wordsIndex] = words[wordsIndex].substring(end, words[wordsIndex].length - end); // let the remaining be
		}else{ // word doesn't fit, but its not too long
			results.push(line);
			line = "";
		}
	}
	results.push(line);
	
	return results;
}

// Return an image object with the specified file name.
// If debug == true, the local path will be used, otherwise
// the file path on the server will be used.
function addImage(fileName){
	var imgFile = new Image();
	imgFile.src = imgPath+fileName;
	return imgFile;
}

// THE ACTUAL GAME

// constants and stuff
var board = [
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			[[],[],[],[],[],[],[],[]],
			]

var squareSize = 10; // in percentages
var boardOffsetX = 10; // in percentages
var boardOffsetY = 10; // in percentages
var curState = null;
var newTimeout = 20;

// Image objects
var imgKingWhite = addImage("king_white.png");
var imgKingBlack = addImage("king_black.png");
var imgQueenWhite = addImage("queen_white.png");
var imgQueenBlack = addImage("queen_black.png");
var imgRookWhite = addImage("rook_white.png");
var imgRookBlack = addImage("rook_black.png");
var imgBishopWhite = addImage("bishop_white.png");
var imgBishopBlack = addImage("bishop_black.png");
var imgKnightWhite = addImage("knight_white.png");
var imgKnightBlack = addImage("knight_black.png");
var imgPawnWhite = addImage("pawn_white.png");
var imgPawnBlack = addImage("pawn_black.png");

var curPlayer = null;
var players = [];

// classes

// The player class
function Player(colour){
	this.colour = colour;
	this.pieces = [];

	// add a piece to the player
	this.addPiece = function(piece){
		this.pieces.push(piece);
	};
}
// The piece class
// Contains a piece object of a given type and with a given position [x,y].
function Piece(type, position, colour){
	this.type = type;
	this.pos = position;
	this.image = getImageByType(this.type, colour);
	this.colour = colour;
	
	// get the coordinates in pct for the players center
	this.getCoords = function(){
		var x,y;
		var coords = getCoordsByPosition(this.pos[0],this.pos[1]);
		return{
			 x: coords[0],
			 y: coords[1]
		};
	}
	
	// draw the piece on the board
	this.draw = function(){
		this.drawXY(this.pos[0],this.pos[1]);
	}

	// draw the piece at a given set of coordinates (in pct)
	this.drawXY = function(x, y){
		drawImageByPosition(this.image, x, y);
	}
}

// draw an image at a given position on the board in [x,y]
function drawImageByPosition(image, x, y){
	var pos = getCoordsByPosition(x,y);
	drawImage(image, pos[0]+1.5, pos[1], 7);
}

// return the coordinates of a given position on the board
function getCoordsByPosition(x,y){
	var pos = [];
	pos.push(x*squareSize+boardOffsetX);
	pos.push(y*squareSize+boardOffsetY);
	return pos;
}

// return the type's corresponding image
function getImageByType(type, colour){
	switch(type){
		case "king": return (colour == "white") ? imgKingWhite : imgKingBlack;
		case "queen": return (colour == "white") ? imgQueenWhite : imgQueenBlack;
		case "rook": return (colour == "white") ? imgRookWhite : imgRookBlack;
		case "bishop": return (colour == "white") ? imgBishopWhite : imgBishopBlack;
		case "knight": return (colour == "white") ? imgKnightWhite : imgKnightBlack;
		case "pawn": return (colour == "white") ? imgPawnWhite : imgPawnBlack;
	}
}

function createPlayers(){
	players.push(new Player("white"));
	players.push(new Player("black"));
}

function createPieces(){
	// black pieces first
	for(var i = 0; i < 8; i++){
		board[i][1] = new Piece("pawn", [i,1], "black");
	}

	board[0][0] = new Piece("rook", [0,0], "black");
	board[7][0] = new Piece("rook", [7,0], "black");
	board[1][0] = new Piece("knight", [1,0], "black");
	board[6][0] = new Piece("knight", [6,0], "black");
	board[2][0] = new Piece("bishop", [2,0], "black");
	board[5][0] = new Piece("bishop", [5,0], "black");
	board[3][0] = new Piece("queen", [3,0], "black");
	board[4][0] = new Piece("king", [4,0], "black");

	// ...then white pieces
	for(var i = 0; i < 8; i++){
		board[i][6] = new Piece("pawn", [i,6], "white");
	}
	
	board[0][7] = new Piece("rook", [0,7], "white");
	board[7][7] = new Piece("rook", [7,7], "white");
	board[1][7] = new Piece("knight", [1,7], "white");
	board[6][7] = new Piece("knight", [6,7], "white");
	board[2][7] = new Piece("bishop", [2,7], "white");
	board[5][7] = new Piece("bishop", [5,7], "white");
	board[4][7] = new Piece("queen", [4,7], "white");
	board[3][7] = new Piece("king", [3,7], "white");

	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			if(board[i][j].colour == "black"){
				players[0].addPiece[board[i][j]];
			}else{
				players[1].addPiece[board[i][j]];
			}
		}
	}
}

// all the possible states in the game
State = {
	CHOOSE : "1: To Choose",
	MOVE : "2: To Move",
	PLACE : "3: To Place"
}

// the main gameloop function
function GameLoop(){
	clear();
	if(curState != null) takeInput();
	drawboard();
	if(curState != null) drawState(); 

	setTimeout(GameLoop, newTimeout);
}

// draws the basic parts of the board that shall be visible
// in all states
function drawboard(){

	// Draw the squares for the board itself
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			if((i+j) % 2 == 0){
				drawRect(i*squareSize+boardOffsetX,j*squareSize+boardOffsetY, squareSize, squareSize,[255,255,255]);
			}else{
				drawRect(i*squareSize+boardOffsetX,j*squareSize+boardOffsetY, squareSize, squareSize,[150,90,0]);
			}
		}
	}

	// Draw all the 
	for(var i = 0; i < 8; i++){
		for(var j = 0; j < 8; j++){
			if(board[i][j].length != 0){
				board[i][j].draw();
			}
		}
	}
}

// draws extra gui depending on the current game state
var debugging = "";
function drawState(){
	if(debug) drawText("State: "+curState,1,1,0,2.5);
	if(debug) drawText(""+debugging,1,4,0,2.5,"left");

	switch(curState){
		case State.CHOOSE:{
			break;
		}
		case State.MOVE:{
			break;
		}
		case State.PLACE:{
			break;
		}
	}
}

function takeInput(){
	if(mouseClicked == null) return; // no new click waiting
	
	switch(curState){
		case State.CHOOSE:{
			var pos = getClickPosition();
			if(board[pos[0]][pos[1]].length != 0){
				debugging = "Clicked on "+pos+" - occupied by "+board[pos[0]][pos[1]].colour+" "+board[pos[0]][pos[1]].type;
			}else{
				debugging = "Clicked on "+pos+" - occupied by nothing"
			}
			break;
		}
		case State.MOVE:{
			break;
		}
		case State.PLACE:{
			break;
		}
	}
	
	mouseClicked = null; // click consumed
}

// INITIALISATION
createPlayers();
createPieces();
curPlayer = players[0];
GameLoop();

// ... and we're on!

curState = State.CHOOSE;
c.addEventListener('mousemove',getMousePosition,false);
c.addEventListener('click',getMouseClick,false);