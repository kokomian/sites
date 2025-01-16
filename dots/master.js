previousBtn = "";
colors = {
	"":"white",
	"rgba(130, 212, 139, 0.9)":"green",
	"rgba(245, 0, 0, 0.6)":"red",
};
function InitializeGrid(){
	previousBtn = document.getElementById('count');
	result = "";
	addStyle = "";
	for(var i=0; i<11; i++){
		addStyle="style='top:"+String(-i*9)+"px'";
		for(var j=0; j<10; j++){
			result += "<button class='hline";
			if(j==0) result += " hline1";
			result += "'"+addStyle+" onClick='BorderClick(this)'></button>";
		}
		result += "<br/>";
		for(var j=0; j<10 && i<10; j++){
			result += "<button class='vline'"+addStyle+" onClick='BorderClick(this)'></button>"; 
		    result += "<button class='box'"+addStyle+" onClick='BtnClick(this)'></button>";
		}
		if(i<10)
			result += "<button class='vline'"+addStyle+" onClick='BorderClick(this)'></button><br/>";
	}
	document.getElementById('board').innerHTML = result;
}
function BorderClick(btn){
	if(btn.style['backgroundColor']=="")
		btn.style['backgroundColor']='black';
	else
		btn.style['backgroundColor']="";
	if(btn != previousBtn && previousBtn.style['backgroundColor'] != ""){
		previousBtn.disabled = true;
		previousBtn = btn;
	}else if(btn != previousBtn){
		previousBtn = btn;
	}
}
function BtnClick(btn){
	if(btn.style['backgroundColor']=="")
		btn.style['backgroundColor']='rgba(130, 212, 139, 0.9)';
	else if(btn.style['backgroundColor']=="rgba(130, 212, 139, 0.9)")
		btn.style['backgroundColor']="rgba(245, 0, 0, 0.6)";
	else if(btn.style['backgroundColor']=="rgba(245, 0, 0, 0.6)")
		btn.style['backgroundColor']="";
	if(btn != previousBtn && previousBtn.style['backgroundColor'] != ""){
		previousBtn.disabled = true;
		previousBtn = btn;
	}else if(btn != previousBtn){
		previousBtn = btn;
	}
}
function CountScores(){
	var scores={};
	var boxes = document.getElementsByClassName('box');
	for(var i=0; i<boxes.length; i++){
		color = boxes[i].style['backgroundColor'];
		if(scores.hasOwnProperty(color))
			scores[color]++;
		else
			scores[color]=1;
	}
	result = "";
	for(i in scores)
		result += "<i>"+colors[i]+": <b>"+String(scores[i])+"</b></i><br/>";
	document.getElementById('result').innerHTML = result;
}