var content = {0:"_", 1:"Head", 2:"Body", 3:"Gun", 4:"Dead"};
//var content = {0:"_", 1:"\U0001f636", 2:"\U0001f636\U0001f6b6", 3:""\U0001f449", 4:"\u2620"};
var players = [];
var nextClickIsKill = 0;
var killer = 0;
var playerNames = [];
var playerStatus = [];
var nofPlayers = 0;
var currentPlayerIndex = 0;
var rolled = 0;
var n = 0;
class Player {
	name;
	states=[0,0,0,0,0];
	scores = [0,0,0,0,0];
	constructor(n){
		this.name = n;
	}
	NextState(idx){
		if(String(currentPlayerIndex)==this.name){
			if(String(idx) == n)
				{this.states[idx]++; return "good";}
			else
				{alert("choose correct number"); return "";}
		} else {
			alert("Player mismatch");
			return "";
		}
	}
	KillPlayer(idx, victim, victimIdx){
		if(this.name==victim.name){
			alert("Self kill not possible");
			//console.log("self kill not possible");
			return "selfkill";
		}
		this.scores[idx]++;
		victim.GetKilled(victimIdx);
		return "";
	}
	GetKilled(idx){
		this.states[idx]=4;
	}
	GetPlayerStatus(){
		var total = this.states[0]+this.states[1]+this.states[2]+this.states[3]+this.states[4];
		if(total==20)
			return 0;
		else 
			return 1;
	}
	GetTotalScore(){
		return (this.scores[0]+this.scores[1]+this.scores[2]+this.scores[3]+this.scores[4]);
	}
}

function BtnClick(btnId){
	if(!rolled)
		{alert("please roll the dice"); return "";}
	if(nextClickIsKill)
		BtnKill(btnId);
	else{
		btnId = btnId.split("");
		if(btnId.length==9){
			row = btnId[6]+btnId[7];
			col = btnId[8];
		} else{
			row = btnId[6];
			col = btnId[7];
		}
		if(currentPlayerIndex == row && players[row].states[col]==3){
			//console.log("next is kill");
			nextClickIsKill = 1;
			killer = [row, col];
			document.getElementsByClassName("bullet")[0].innerHTML = "Bullet";
		} else{
			if(players[row].NextState(col)!=""){
				currentPlayerIndex = (currentPlayerIndex + 1) % nofPlayers;
				updateDice();
				rolled = 0;
			}
		}
		updateBtn(row,col);
	}
}
function BtnKill(btnId){
	btnId = btnId.split("");
	if(btnId.length==9){
		row = btnId[6]+btnId[7];
		col = btnId[8];
	} else{
		row = btnId[6];
		col = btnId[7];
	}
	if( players[killer[0]].KillPlayer(killer[1], players[row], col) == ""){
		nextClickIsKill = 0;
		playerStatus[row] = players[row].GetPlayerStatus();
		updateBtn(killer[0], killer[1]);
		updateBtn(row,col);
		document.getElementById("player"+String(killer[0])+String(killer[1])).style.border = "solid steelblue 1px";
		document.getElementById("player"+row+col).style.border = "none";
		document.getElementsByClassName("bullet")[0].innerHTML = "JS";
		currentPlayerIndex = (currentPlayerIndex + 1) % nofPlayers;
		CheckWin();
		updateDice();
		rolled = 0;
	}
}
function updateBtn(row,col){
	var result = content[players[row].states[col]];
	document.getElementById("player"+row+col).style.border = "solid steelblue 1px";
	var btn = document.getElementById("player"+row+col);
	if(players[row].scores[col]!=0)
		result += " "+String(players[row].scores[col]);
	btn.innerHTML = result;
	if(players[row].states[col]==4){
		btn.disabled = true;
		btn.className = "dead";
	}
}
function CheckWin(){
	console.log("in check win");
	flag = 2;
	winner = 0;
	for(var i=0; i<nofPlayers; i++)
		if(players[i].GetPlayerStatus()==1 && flag!=0)
			{flag--; winner = i;}
	if(flag==1){
		alert("Game Finished with player \""+playerNames[winner]+"\" being alive till the end!");
		result = "<ul id='final'>";
		for(var i=0; i<nofPlayers; i++){
			result += "<li>"+playerNames[i]+" : "+String(players[i].GetTotalScore())+"</li>"
		}
		document.getElementById('finaldiv').innerHTML = result + "</ul>";
		console.log(result);
	}
}
function updateDice(){
	while(playerStatus[currentPlayerIndex]!=1){
		currentPlayerIndex = (currentPlayerIndex + 1)%nofPlayers;
	}
	document.getElementById('current').innerHTML = playerNames[currentPlayerIndex];
	nextPlayerIndex = (currentPlayerIndex + 1)%nofPlayers;
	while(playerStatus[nextPlayerIndex]!=1){
		nextPlayerIndex = (nextPlayerIndex + 1)%nofPlayers;
	}
	document.getElementById('next').innerHTML = playerNames[nextPlayerIndex];
}
function RollDice(){
	if(rolled){
		alert("Please update changes to the game from previous roll or use kill if any");
	} else {
		rolled = 1;
		n = Math.floor(Math.random()*10);
		if (n%2==1) n -= 1;
		n /= 2;
		if(players[currentPlayerIndex].states[n]==4){
			currentPlayerIndex = (currentPlayerIndex + 1) % nofPlayers;
			alert("player's number is dead");
			updateDice();
			rolled = 0;
		} else {
			document.getElementById("player"+String(currentPlayerIndex)+String(n)).style.border = "dashed blueviolet 2px";
		}
	}
}
function InitializeGrid(num, names){
	var result = '';
	nofPlayers = num;
	names = names.trim().split(" ");
	if(names.length==1 && names[0]=="") names = []
	if(names.length!=num){
		for(var i=names.length; i<num; i++){
			names.push("player "+String(i+1));
		}
	}
	playerNames = names;
	for(i=0; i<num; i++){
		players.push(new Player(String(i)));
		playerStatus.push(1);
	}
	for(var i=0; i<6; i++){
		if(i==0)
			result += "<button class='empty bullet'>JS</button>";
		else
			result += "<button class='number'>"+String(i*2-2)+"</button>";
		for(var j=0; j<num; j++){
			if(i==0)
				result += "	<button class='name'>"+names[j]+"</button>";
			else
				result += "	<button class='element' id='player"+String(j)+String(i-1)+"' onClick='BtnClick("+"\"player"+String(j)+String(i-1)+"\")'>_</button>";
		}
		result += "<br/>";
	}
	var rollresult = '';
	rollresult += "<p>current player: <b id='current'>"+names[0]+"</b></p><p>next player: <span id='next'>"+names[1]+"</span></p>";
	rollresult += "<button class='empty' onClick='RollDice()'>Roll</button>"
	document.getElementById('init').innerHTML = "";
	document.getElementById('board').innerHTML = result;
	document.getElementById('roll').innerHTML = rollresult;
}
