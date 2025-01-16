var wTime = 900; //15 min for each player
var bTime = 900;
var currentPlayer = '';
var pause = 0;
var timeAdjLog = '';
var castlingMove = 0;

var B_Queen = "&#9818;"; var W_Queen = "&#9812;";
var B_King = "&#9819"; var W_King = "&#9813";
var B_Rook = "&#9820"; var W_Rook = "&#9814";
var B_Bishop = "&#9821"; var W_Bishop = "&#9815";
var B_Knight = "&#9822"; var W_Knight = "&#9816";
var B_Pawn = "&#9823"; var W_Pawn = "&#9817";

var data = [
	['B_Rook','B_Knight','B_Bishop','B_Queen','B_King','B_Bishop','B_Knight','B_Rook'],
	['B_Pawn','B_Pawn','B_Pawn','B_Pawn','B_Pawn','B_Pawn','B_Pawn','B_Pawn'],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['','','','','','','',''],
	['W_Pawn','W_Pawn','W_Pawn','W_Pawn','W_Pawn','W_Pawn','W_Pawn','W_Pawn'],
	['W_Rook','W_Knight','W_Bishop','W_Queen','W_King','W_Bishop','W_Knight','W_Rook']
];
var undoCoordinates = [];
var deadComrades = [];
var deadGuy = "";

var div1 = [];
var div2 = [];

var t=0;
function Timer(){
	if(pause==0){
		t++;
		if(currentPlayer=='black') bTime--;
		else wTime--;
		ShowTime();
	}
}
function ShowTime(){
	document.getElementById('bh').innerHTML = Math.floor(bTime / 3600);
	document.getElementById('bm').innerHTML = Math.floor((bTime % 3600) / 60);
	document.getElementById('bs').innerHTML = (bTime % 60);
	document.getElementById('wh').innerHTML = Math.floor(wTime / 3600);
	document.getElementById('wm').innerHTML = Math.floor((wTime % 3600) / 60);
	document.getElementById('ws').innerHTML = (wTime % 60);
	document.getElementsByClassName('mtime')[0].innerHTML = "elasped "+String(t)+" seconds in "+currentPlayer;
}

function DivClick(item){
	cnc = ExtractData(item);
	//console.log(cnc);
	if(div1.length==0){
		div1 = cnc;
		item.style.backgroundColor = 'rgba(245,0,0,0.6)';
	} else if(div2.length==0 && (div1[0]!=cnc[0] || div1[1]!=cnc[1])) {
		div2 = cnc;
		item.style.backgroundColor = 'rgba(130,212,139,0.9)';
	} else if(div1[0]==cnc[0] && div1[1]==cnc[1]) {
		div1 = [];
		if(div2.length != 0)
			document.getElementById('box'+String(div2[0])+String(div2[1])).style = {};
		div2 = [];
		item.style = {};
	} else if(div2[0]==cnc[0] && div2[1]==cnc[1]) {
		div2 = [];
		item.style = {};
	}
}
function BtnClick(){
	if (data[div1[0]][div1[1]][0]==data[div2[0]][div2[1]][0]){
		alert("Move not possible");
	} else {
		deadGuy = "";
		undoCoordinates = [div1[0], div1[1], div2[0], div2[1]];
		if ([data[div1[0]][div1[1]][0], data[div2[0]][div2[1]][0]].sort()[1]) {
			deadGuy = data[div2[0]][div2[1]];
			deadComrades.push(data[div2[0]][div2[1]]);
			data[div2[0]][div2[1]] = data[div1[0]][div1[1]];
			data[div1[0]][div1[1]] = '';
		} else {
			undoCoordinates = [div1[0], div1[1], div2[0], div2[1]];
			temp = data[div1[0]][div1[1]];
			data[div1[0]][div1[1]] = data[div2[0]][div2[1]];
			data[div2[0]][div2[1]] = temp;
		}
		document.getElementById('box'+String(div1[0])+String(div1[1])).style = {};
		document.getElementById('box'+String(div2[0])+String(div2[1])).style = {};
		div1 = [];
		div2 = [];
		LoadData();
		t = 0;
		if(castlingMove==0){
			SwitchPlayer();
		} else {
			castlingMove++;
			if(castlingMove==3) {
				Castling();	SwitchPlayer();
			}
		}
	}
}
function RemovePiece(){
	console.log(data[div1[0]][div1[1]]);
	if(data[div1[0]][div1[1]]!=""){
		deadGuy = "Enp_"+data[div1[0]][div1[1]];
		deadComrades.push(data[div1[0]][div1[1]]);
		undoCoordinates = [div1[0], div1[1], "", ""];
		data[div1[0]][div1[1]]=""
		document.getElementById('box'+String(div1[0])+String(div1[1])).style = {};
		div1=[];
		LoadData();
	}
}
function Castling(){
	if(castlingMove==0){
		castlingMove = 1;
		document.getElementById('castle').style['background-color']='rgba(44,102,240,0.8)';
	} else {
		castlingMove = 0;
		document.getElementById('castle').style['background-color']='white';
	}
}
function Promote(){
	if(document.getElementById('dd').value){
		document.getElementById('box'+String(div1[0])+String(div1[1])).style = {};
		data[div1[0]][div1[1]] = data[div1[0]][div1[1]].slice(0,2) + document.getElementById('dd').value;
		div1 = [];
		LoadData();
	}
}

function UndoMove(){
	timeAdjLog = [currentPlayer, bTime, wTime, t];
	if(currentPlayer=='white'){
		bTime -= t; wTime += t; currentPlayer='black';
	} else{
		wTime -= t; bTime += t; currentPlayer='white';
	}
	if (deadGuy == "") {
		temp = data[undoCoordinates[0]][undoCoordinates[1]];
		data[undoCoordinates[0]][undoCoordinates[1]] = data[undoCoordinates[2]][undoCoordinates[3]];
		data[undoCoordinates[2]][undoCoordinates[3]] = temp;
	} else {
		if(deadGuy.startsWith('Enp_')){
			data[undoCoordinates[0]][undoCoordinates[1]] = deadComrades.pop();
		} else {
			data[undoCoordinates[0]][undoCoordinates[1]] = data[undoCoordinates[2]][undoCoordinates[3]];
			temp = deadComrades.pop();
			data[undoCoordinates[2]][undoCoordinates[3]] = temp;
		}
	}
	t = 0;
	deadGuy = "";
	undoCoordinates = [];
	LoadData();
}
function ExtractData(item){
	//console.log(item.name);
	return [item.id[3], item.id[4], item.name]
}

function InitializeBoard(){
	Instructions();
	result = "";
	toggle = false;
	for(var i=0; i<8; i++){
		for(var j=0; j<8; j++){
			result += "<button style='' onClick='DivClick(this)' class='box";
			if(toggle) result += " black"; 
			else result += " white";
			result += "' id='box"+String(i)+String(j)+"'></button>";
			toggle = !toggle;
		}
		if(i==0){
			result += "<button class='choose' onClick='chooseFirst(\"black\")'>Black</button><button onClick='chooseFirst(\"white\")' class='choose'>White</button>";
		} else if(i==1){
			result += "<button id='pause' onClick='PauseGame()'>Pause Game</button>"
		} else if(i==3){
			result += "<button onClick='BtnClick()'>Confirm</button>";
		} else if (i==4){
			result += "<button onClick='RemovePiece()' class='choose'>Remove piece(enpassent)</button><button onClick='Castling()' id='castle' class='choose'>Castling</button>";
		} else if (i==5){
			result += "<input type='list' list='pieces' id='dd'><datalist id='pieces' contextmenu='queen'><option id='queen'>Queen</option><option>Rook</option><option>Knight</option><option>Bishop</option></datalist>"
		} else if (i==6){
			result += "<button onClick='Promote()'>Promote</button>";
		} else if(i==7){
			result += "<button onClick='UndoMove()'>Undo</button>";
		}
		toggle = !toggle;
		result += "<br/>";
	}
	result += "<div class='btime'>BLACK <p id='bh'>-</p>:<p id='bm'>-</p>:<p id='bs'>-</p></div>"
	result += "<div class='wtime'>WHITE <p id='wh'>-</p>:<p id='wm'>-</p>:<p id='ws'>-</p></div>"
	result += "<div class='mtime'></div><div class='dtime'></div>"
	document.getElementById('board').innerHTML = result;
	LoadData();
}

function LoadData(){
	for(var i=0; i<8; i++){
		for(var j=0; j<8; j++){
			var x = document.getElementById('box'+String(i)+String(j));
			if(data[i][j].startsWith('B') || data[i][j].startsWith('W')){
				x.innerHTML = eval(data[i][j]);
				x.name = data[i][j];
			}
			else{
				x.innerHTML = "<span class='hyphen'>-</span>";
				x.name = "";
			}
		}
	}
}
function PauseGame(){
	if(pause==0){
		Instructions();
		temp ="**Time Adjustment log for recent undo move\n\n";
		if(timeAdjLog[0]=='white'){
			temp+="player \"BLACK\" performed undo action\n";
			temp+="              WHITE   BLACK\n";
			temp+="before undo:  "+String(timeAdjLog[2])+"  "+String(timeAdjLog[1]);
			temp+="\nafter undo :  "+String(timeAdjLog[2]+timeAdjLog[3])+"  "+String(timeAdjLog[1]-timeAdjLog[3]);
			temp+="\ntime wasted by black is added to black & white's time is counted back";
		} else{
			temp+="player \"WHITE\" performed undo action\n";
			temp+="				WHITE	BLACK\n";
			temp+="before undo:  "+String(timeAdjLog[2])+"  "+String(timeAdjLog[1]);
			temp+="\nafter undo :  "+String(timeAdjLog[2]-timeAdjLog[3])+"  "+String(timeAdjLog[1]+timeAdjLog[3]);
			temp+="\ntime wasted by white is added to white & black's time is counted back";
		}
		alert(temp);
		pause = 1;
		document.getElementById('pause').innerHTML = 'resume game';
	} else {
		pause = 0;
		document.getElementById('pause').innerHTML = 'pause game';
	}
}
function chooseFirst(p){
	console.log("choosing first player");
	document.getElementsByClassName('choose')[0].disabled = true;
	document.getElementsByClassName('choose')[1].disabled = true;
	document.getElementsByClassName('choose')[0].style['background-color'] = 'white';
	document.getElementsByClassName('choose')[1].style['background-color'] = 'white';
	document.getElementsByClassName('choose')[0].style['color'] = 'black';
	document.getElementsByClassName('choose')[1].style['color'] = 'black';
	currentPlayer = p;
	setInterval(Timer, 1000);
}
function Instructions(){
	alert("INSTRUCTIONS\n\n1.do not refresh\n2.moving a piece: select your piece(red), select destination box(green), click 'Confirm'\n3.killing a piece: destination box contains enemy piece\n4.promote soilder by choosing a rank in text box(click textbox & then down arrow) and click 'Promote'\n\n5.For timer to start, choose who is starting the game between Black & White with buttons in 1st row\n6.Enpassent:select the piece you want to remove & click enpassent, before moving your pawn(for timer support)\n7.turn on castling before doing the 1st move of castling(for timer support)\n8.you can PAUSE game for instructions & information about time adjustment for undo move");
}
function SwitchPlayer(){
	if(currentPlayer=='black') currentPlayer='white';
	else currentPlayer='black';
}