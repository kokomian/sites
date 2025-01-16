data = []; //-1:mine
mask = []; //1:open 0:closed -1:flag
stack=[];
size = 0;
life = 1;
bombs = 0;
flags = 0;
box_i = null;
box_j = null;
timerObject = null;

t=0;
function Timer(){
	t++;
	ShowTime();
}
function ShowTime(){
	document.getElementById('h').innerHTML = (String(Math.floor(t/3600)).length==1?"0":"")+String(Math.floor(t / 3600));
	document.getElementById('m').innerHTML = (String(Math.floor((t%3600)/60)).length==1?"0":"")+Math.floor((t % 3600) / 60);
	document.getElementById('s').innerHTML = (String(t%60).length==1?"0":"")+(t % 60);
}
function setBox(m,n){
	box_i = m;
	box_j = n;
}
function unsetBox(){
	box_i = null;
	box_j = null;
}
function LoadGame(n){
	alert("INSTRUCTIONS:\n\n1. hover the mouse over the box\n2. press 'd' or left click to dig/mine\n3. press 'f' or right click to flag\n4. when there are sufficient flags around an opened box, mining the same will open boxes around it");
	result = "";
	life = 1;
	size = n;
	flags = 0;
	t=0;
	setInterval(Timer,1000);

	for(var i=0; i<size; i++){
		temp1=[];
		temp2=[];
		for(var j=0; j<size; j++){
			temp1.push(0);
			temp2.push(0);
			result += "<button class='box' id='"+String(i)+"-"+String(j)+"' onClick='OpenTile("+String(i)+", "+String(j)+")' onmouseenter='setBox("+String(i)+","+String(j)+")' onmouseleave='unsetBox()'><p class='hid'>-</p></button>";
		}
		data.push(temp1);
		mask.push(temp2);
		if(i==3)
			result += "<div id='timer'><p id='h'>-</p>:<p id='m'>-</p>:<p id='s'>-</p></div>";
		else if(i==4)
			result += "<div id='number'><b>Bombs:</b><p id='bombnum'>"+String(bombs)+"</p><b>Flags:</b><p id='flags'>0</p></div>"
		result += "<br/>";
	}
	document.getElementById('board').innerHTML = result;
	GenerateBombs();
	document.getElementById('bombnum').innerHTML = bombs;
}

function OpenTile(n,m){
	if(life==1){
		alert("First click opens surrounding boxes without exploding mines");
		life = 0;
		var indices = [[-1,-1], [-1,0], [-1,1], [0,-1],[0,0],[0,1], [1,-1],[1,0],[1,1]];
		for(var i=0; i<9; i++){
			[p,q]=[n+indices[i][0], m+indices[i][1]];
			try{
				if(data[p][q]!=-1){
					WriteOpenTile(p,q);
					if(data[p][q]==0) {stack.push([p,'-',q].toString()); ZeroExplode(p,q); stack=[];}
				} else{
					FlagTile(p,q,1);
				}
			} catch{
				console.log("used life");
			}
		}
	} else{
		id = String(n)+"-"+String(m);
		if(mask[n][m]==1){ //already opened box
			MineAround(n,m);
		} else{
			mask[n][m]=1;
			if(data[n][m]==-1){ //mine spotted
				document.getElementById(id).innerHTML = '<p>bomb</p>';
				document.getElementById(id).className = 'box bomb';
				alert('Game Over');
				RevealMines();
			} else{
				WriteOpenTile(n,m);
				if(data[n][m]==0) {stack.push([n,'-',m].toString()); ZeroExplode(n,m); stack=[];}
			}
		}
		CheckWon();
	}
}
function WriteOpenTile(p,q){
	id=String(p)+"-"+String(q);
	document.getElementById(id).innerHTML = "<p "+(data[p][q]==0?"class='hid'":"")+">"+String(data[p][q])+"</p>"
	document.getElementById(id).className = 'box open';
	mask[p][q] = 1;
}

function ZeroExplode(p,q){
	var indices = [[-1,-1], [-1,0], [-1,1], [0,-1],[0,1], [1,-1],[1,0],[1,1]];
	for(var k=0; k<8; k++){
		try{
			[i,j]=[p+indices[k][0], q+indices[k][1]];
			WriteOpenTile(i,j);
			safe=1;
			for(x in stack){
				if(stack[x]==[i,'-',j].toString())
					{safe=0; break;}
			}
			if(data[i][j]==0 && safe==1){
				stack.push([i,'-',j].toString());
				ZeroExplode(i,j);
			}
		} catch{
			console.log("zero explosion running");
		}
	}
}

function MineAround(i,j){
	var idx = [[-1,-1], [-1,0], [-1,1], [0,-1],[0,1], [1,-1],[1,0],[1,1]];
	noOfFlags = 0;
	opens = [];
	for(var k=0; k< idx.length; k++){
		try{
			idx[k][0] += i;
			idx[k][1] += j;
			if(mask[idx[k][0]][idx[k][1]]==-1)
				noOfFlags++;
			else if(mask[idx[k][0]][idx[k][1]]==0)
				opens.push(k);
		}catch{
			idx = [idx.slice(0,k), idx.slice(k+1)];
			idx = idx.flat();
			k--;
		}
	}
	if(noOfFlags==data[i][j]){
		for(k=0; k<opens.length; k++){
			OpenTile(idx[opens[k]][0], idx[opens[k]][1]);
		}
	}
}

function FlagTile(n,m,p){
	id = String(n)+"-"+String(m);
	if(p==1 || (p==-1 && mask[n][m]==0)){
		mask[n][m]=-1;
		flags++;
		//document.getElementById(id).innerHTML = '<p>flag</p>';
		document.getElementById(id).innerHTML = "<p>\U0001f6a9<//p>";
		document.getElementById(id).className = 'box flag';
	} else if(p==0 || (p==-1 && mask[n][m]==-1)){
		mask[n][m]=0;
		flags--;
		document.getElementById(id).innerHTML = "<p class='hid'>-</p>";
		document.getElementById(id).className = 'box';
	} 
	document.getElementById('flags').innerHTML = flags;
}

function CheckWon(){
	flag = 1;
	for(var i=0; i<size; i++)
	for(var j=0; j<size; j++)
		if(data[i][j]!=-1 && mask[i][j]==0)
			{flag=0;break;}
	if(flag==1){
		RevealMines();
		alert('Game Won');
	}
}
function RevealMines(){
	for(var i=0; i<size; i++)
	for(var j=0; j<size; j++)
		if(data[i][j]==-1){
			id = String(i)+"-"+String(j);
			document.getElementById(id).innerHTML = '<p>bomb</p>';
			document.getElementById(id).className = 'box bomb';
		}
}
function UpdateMines(mines){
	for(i in mines){
		data[mines[i][0]][mines[i][1]] = -1;
	}
	indices = [[-1,-1], [-1,0], [-1,1], [0,-1],[0,1], [1,-1],[1,0],[1,1]];
	for(var i=0; i<size; i++)
	for(var j=0; j<size; j++){
		if(data[i][j]!=-1){
			count = 0;
			for(var k=0; k<8; k++){
				[n,m]=[i+indices[k][0], j+indices[k][1]];
				try{
					if(data[n][m]==-1)
						count++;
				} catch{
					count = count;
				}
			}
			data[i][j]=count;
		}
	}
}
function GenerateBombs(){
	count = 0;
	if(size<14) count = Math.floor(size * 2);
	else count = Math.floor(size*3);
	mines = [];
	for(var i=0; i<count; i++){
		row = Math.floor(Math.random(Date.now)*size);
		col = Math.floor(Math.random(Date.now)*size);
		flag = 0;
		for(i in mines){
			if(mines[i].toString()==[row,col].toString())
				{flag=1; break;}
		}
		if(flag)
			i--;
		else
			mines.push([row,col]);
	}
	bombs = mines.length;
	UpdateMines(mines);
}
