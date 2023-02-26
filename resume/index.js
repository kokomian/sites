function loadjson(file,callback){
  var xhr=new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET",file,true);
  xhr.onreadystatechange=function(){
    if(xhr.readyState===4 && xhr.status=="200"){
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}
loadjson("https://raw.githubusercontent.com/igrisdata/jsons/main/resume-task.json",function(text){
  let data=JSON.parse(text);
  console.log(data);
  basic(data.details);
  second(data.fam);
  third(data.edu);
  fourth(data.info);
})

var child1=document.querySelector(".child1");

var child2=document.querySelector(".child2");

var child3=document.querySelector(".child3");

var child4=document.querySelector(".child4");

var child5=document.querySelector(".child5");

function basic(det){
  child1.classList.add("container");
  var divi=document.createElement("div");
  divi.setAttribute("class","row row-header");
  child1.appendChild(divi);
  var divii1=document.createElement("div");
  divii1.setAttribute("class","col-12 col-md-3 offset-md-3 align-self-center")
  divi.appendChild(divii1);
  var img=document.createElement("img");
  img.src=det.image;
  img.setAttribute("class","img-fluid");
  img.setAttribute("style","width:9rem");
  img.setAttribute("alt","photo");
  divii1.appendChild(img);

  var divii2=document.createElement("div");
  divii2.setAttribute("class","col-12 col-md-6 align-self-center");
  divi.appendChild(divii2);
  var addr=document.createElement("address");
  addr.innerHTML=det.address;
  divii2.appendChild(addr);

}


function second(fami){
  child2.classList.add("row");
  child2.classList.add("justify-content-center");
  var div=document.createElement("div");
  div.setAttribute("class","col-auto");
  child2.appendChild(div);
  var tab=document.createElement("table");
  tab.setAttribute("class","table table-responsive table-hover table-striped");
  div.appendChild(tab)
  tabledata="";
  for(i=0;i<fami.length;i++){
    tabledata+="<tr><th>"+fami[i].role+"'s name</th><td>"+fami[i].name+"</td></tr>"
  }
  tab.innerHTML=tabledata;
}

function third(ed){
  child3.classList.add("row");
  child3.classList.add("justify-content-center");
  var div=document.createElement("div");
  div.setAttribute("class","col-auto");
  child3.appendChild(div);
  var tab=document.createElement("table");
  tab.setAttribute("class","table table-responsive table-hover table-striped");
  div.appendChild(tab);
  tabledata="";
  tabledata+="<legend>Educational Qualifications</legend>";
  tabledata+="<thead><tr><th>S.no.</th><th>Study</th><th>branch</th><th>Institution</th><th>Year of study</th><th>% or GPA</th></tr></thead>";
  for(i=0;i<ed.length;i++){
    tabledata+="<tr><td>"+ed[i].sno+"</td><td>"+ed[i].study+"</td><td>"+ed[i].branch+"</td><td>"+ed[i].inst+"</td><td>"+ed[i].year+"</td><td>"+ed[i].per+"</td></tr>";
  }
  tab.innerHTML=tabledata;
}
function fourth(info){
  child4.classList.add("row");
  child4.classList.add("justify-content-center");
  var div=document.createElement("div");
  div.setAttribute("class","col-auto");
  child4.appendChild(div);
  var tab=document.createElement("table");
  tab.setAttribute("class","table table-responsive table-hover table-striped");
  div.appendChild(tab);
  tabledata="";
  tabledata+="<legend>Additional Info.</legend>";
  for(i=0;i<info.length;i++){
    tabledata+="<tr><th>"+info[i].q+"</th>";
    tabledata+="<td>"+info[i].s+"</td></tr>";
  }
  tab.innerHTML=tabledata;
}
