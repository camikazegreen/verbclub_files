//define global variables
var map;
var markerArray=[];
var overlayArray=[];
var rectArray=[];
var wallArray=[];
var routeArray=[];
var markerBounds;

function followBreadcrumb(options){  
	makeMap({aid:options.aid,cid:options.cid,wid:options.wid,parent:options.parent});
    function remove(id){

	var thisOne = document.getElementById(id);
	var parentDiv = document.getElementById("event-form-breadcrumb");
	var nextDiv = thisOne.nextSibling;
	parentDiv.removeChild(nextDiv);
	remove(id);
	} //close remove
          if(options.aid){var id=options.aid}
        else if(options.cid){id=options.cid}
        else if(options.wid){id=options.wid} 
	remove(id);}
	
function addBreadcrumb(options){
        if(options.aid){var id=options.aid}
        else if(options.cid){var id=options.cid}
        else if(options.wid){var id=options.wid}
    	var button=document.createElement("div");
    	button.innerHTML=" "+options.title+" > ";
    	button.setAttribute('onClick', 'followBreadcrumb({aid:'+options.aid+',cid:'+options.cid+',wid:'+options.wid+',parent:'+options.parent+'})');
    	button.setAttribute('class','scribbly');
    	button.id=id;
	document.getElementById("event-form-breadcrumb").appendChild(button);    
	}
	
function SidebarItem(marker, opts){
  var tag = opts.sidebarItemType || "button";
  var row = document.createElement(tag);
  row.innerHTML = opts.sidebarItem+"  ( "+opts.count+" )";
  row.className = opts.sidebarItemClassName || "scribbly list";  
  row.style.display = "block";
  row.onclick = function(){	google.maps.event.trigger(marker, 'click');  }
  row.onmouseover = function(){	google.maps.event.trigger(marker, 'mouseover');  }
  row.onmouseout = function(){	google.maps.event.trigger(marker, 'mouseout');  }
  this.button = row;
}
SidebarItem.prototype.addIn = function(block){
  if (block && block.nodeType == 1)this.div = block;
  else
	this.div = document.getElementById(block)|| document.getElementById("event-form-sidebar")|| document.getElementsByTagName("body")[0];
  this.div.appendChild(this.button);
};
function makeMarker(options){
  options.center = options.center || options.position;
  if (options.aid) {var marker = new google.maps.Circle({map:map});}
  else if(options.bounds) {var marker = new google.maps.Rectangle({bounds:options.bounds,map:map});}
  else  {var marker = new google.maps.Marker({map:map});}
 	var Dark = {strokeColor: "black",strokeOpacity: 1,strokeWeight: 2,fillOpacity: 0  };
 	var Light = {strokeColor: "red"};
	
    marker.setOptions(options);
    google.maps.event.addListener(marker, "click", function(){
	    fillForm({aid:options.aid,cid:options.cid,wid:options.wid,title:options.title,parent:options.parent});
	    makeMap({aid:options.aid,cid:options.cid,wid:options.wid,parent:options.parent});
	    addBreadcrumb({aid:options.aid,cid:options.cid,wid:options.wid,parent:options.parent,title:options.title});})  	 
  google.maps.event.addListener(marker, "mouseover", function() {
   	marker.setOptions(Light);
    if(this.sidebarButton)this.sidebarButton.button.focus();
  });
  google.maps.event.addListener(marker, "mouseout", function() {
    marker.setOptions(Dark);
    if(this.sidebarButton)this.sidebarButton.button.blur();
  });
  if (options.sidebarItem){
	marker.sidebarButton = new SidebarItem(marker, options);
	marker.sidebarButton.addIn("sidebar");
  }

if (options.position){markerBounds.extend(options.position);}
else if (options.bounds){
    var ne= options.bounds.getNorthEast();
    var sw= options.bounds.getSouthWest();
    markerBounds.extend(ne);
    markerBounds.extend(sw);
}
map.fitBounds(markerBounds);  
  markerArray.push(marker);
  return marker;

}  
function firstMap(){
	document.getElementById("event-form-people").style.display="none";
	document.getElementById("event-form-map").style.display="block";
	document.getElementById("event-form-add-info").style.display="block";
	document.getElementById("event-form-filter").style.display="block";
	document.getElementById("event-form-breadcrumb").style.display="block";
	document.getElementById("event-form-picker").style.display="none";
	document.getElementById("event-form-verb-list").style.display="none";
	document.getElementById("event-form-sidebar").innerHTML="";

    var h = window.screen.availHeight;
    var box = document.getElementById("region-content");
    var height = h-112+"px";
    var width = box.offsetWidth+"px";
    document.getElementById("event-form-content").style.width=width ;
    document.getElementById("event-form-map").style.width=width ;
    document.getElementById("event-form-map").style.height=height;
    document.getElementById("event-form-sidebar").style.height="auto";
    var justForIE = document.namespaces;  
    var mapOpts = {
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      scaleControl: true,
      scrollwheel: true,
      center: new google.maps.LatLng(32.216232,-110.968051),
      zoom:10
      };
    map = new google.maps.Map(document.getElementById("event-form-map"), mapOpts);
    makeMap({parent:1,aid:'z'});
    }

function makeMap(options){
for (var i = 0; i < markerArray.length; i++){markerArray[i].setMap(null);}
markerArray=[];
markerBounds = new google.maps.LatLngBounds();
document.getElementById("event-form-sidebar").innerHTML="";
alert(options.parent);
//determing what kind of map we are making
    if(options.parent==1){var type="areas";var id=options.aid}
    else if(options.parent==0){type="crags";id=options.aid;}
    else if(options.cid){type="walls";id=options.cid}
    else if(options.wid){type="routes";id=options.wid}
//get the filter values    
if(document.getElementById("toprope").checked ===true){var toprope_value=1;}
else{vtoprope_value = 0;}
var style_value = "*";
for (i=0; i < 2; i++)
   {if (document.getElementsByName("style")[i].checked)
  	{style_value = document.getElementsByName("style")[i].value;}}
document.getElementsByName("style").checked;
var difficulty_value = 5;
for (i=0; i < 8; i++)
   {if (document.getElementsByName("difficulty")[i].checked){difficulty_value=document.getElementsByName("difficulty")[i].value;}}

var filters='/'+id+'/'+difficulty_value+'/'+toprope_value+'/'+style_value;
   $.get('/?q=verb/get/'+type+filters,{},
   function(data) {
        	var temp_array = $.parseJSON(data);
               	var i=0;
   		 if (temp_array==null){
   			 var z = map.getZoom();
   			 map.setCenter(position);
   			 map.setZoom = newZ;
   			 }
   				 while(i<temp_array.length){
var options=[]
var nextOpts=[]
options.title= temp_array[i].name;
options.sidebarItem= temp_array[i].name;
options.content= temp_array[i].description;
options.count= temp_array[i].count||temp_array[i].difficulty;
if(temp_array[i].aid){options.aid= temp_array[i].aid};nextOpts.aid= temp_array[i].aid;
if(temp_array[i].cid){options.cid= temp_array[i].cid};
if(temp_array[i].wid){options.wid= temp_array[i].wid};
if(temp_array[i].rid){options.rid= temp_array[i].rid};
if(temp_array[i].aid){options.radius= (temp_array[i].count*1+1)*100};
if(temp_array[i].latitude){options.position= new google.maps.LatLng(temp_array[i].latitude,temp_array[i].longitude)};
if(temp_array[i].parent){options.parent= temp_array[i].parent;nextOpts.push({parent: temp_array[i].parent})};
if(temp_array[i].multipitch){options.multi= temp_array[i].multipitch};
if(temp_array[i].toprope){options.toprope= temp_array[i].toprope};
if(temp_array[i].style){options.style= temp_array[i].style};
if(temp_array[i].pitches){options.pitches= temp_array[i].pitches};
if(temp_array[i].icon){options.icon= '/../sites/all/files/markers/light/'+temp_array[i].difficulty+'.png'};
if(temp_array[i].cid){options.image= temp_array[i].path};
if(temp_array[i].cid){
var ne= new google.maps.LatLng(temp_array[i].ne_bounds_lat,temp_array[i].ne_bounds_lon);
var sw= new google.maps.LatLng(temp_array[i].sw_bounds_lat,temp_array[i].sw_bounds_lon);
options.bounds= new google.maps.LatLngBounds(ne,sw);};
makeMarker(options);
//******************* Add this back once the content is loaded Cameron ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
//if(temp_array.length==1){makeMap(nextOpts);}
i++;}//close while loop
    });//close .get
    }//close makeMap
function fillForm(options){
        if(options.aid){var type="somewhere";var id=options.aid}
        else if(options.cid){type="crag";id=options.cid}
        else if(options.wid){type="wall";id=options.wid} 
   document.getElementById("edit-"+type).value = id;
   document.getElementById("button3").innerHTML = "to "+options.title;
   document.getElementById("button3").setAttribute('onClick','makeMap('+{aid:options.aid,cid:options.cid,wid:options.wid,title:options.title,parent:options.parent}+")");
}
var addmarker
var addcragbox
var html
function addContentArea(){
html=document.getElementById('event-form-add-info').innerHTML;
	document.getElementById('event-form-add-info').innerHTML='<p>Drag marker to place Area</p></br><input type="button" value="Add Area" onClick="addArea()"></input><input type="button" value="Cancel" onClick="cancelAdd()"></input>'
	var location = map.getCenter();
	addmarker = new google.maps.Marker({map:map,draggable:true});
	addmarker.setPosition(location);
	}
function addArea(){
	var Lat = addmarker.position.lat();
	var Lng = addmarker.position.lng();
	var parent = document.getElementById("event-form-breadcrumb").lastChild.id;
	window.location = "/area/add?lat="+Lat+"&lng="+Lng+"&parent="+parent;
	}
function addContentCrag(){
html=document.getElementById('event-form-add-info').innerHTML
	document.getElementById('event-form-add-info').innerHTML='<p>Drag corners to change the size and shape.</p></br><input type="button" value="Add Crag" onClick="addCrag()"></input><input type="button" value="Cancel" onClick="cancelAdd()"></input>'
	map.setMapTypeId('SATELLITE');
	var location = map.getCenter();
	var NElat = location.lat()+.0003;
	var NElng = location.lng()+.0003;
	var SWlat = location.lat()-.0003;
	var SWlng = location.lng()-.0003;
	var NE = new google.maps.LatLng(NElat,NElng);
	var SW = new google.maps.LatLng(SWlat,SWlng);
	var cragbounds = new google.maps.LatLngBounds(SW,NE);
	addcragbox = new google.maps.Rectangle({map:map,bounds:cragbounds,editable:true});
	}
function addCrag(){
	var bounds = addcragbox.getBounds();
    var NE = bounds.getSouthWest();
    var NElat = NE.lat();
    var NElng = NE.lng();
    var SW = bounds.getSouthWest();
    var SWlat = SW.lat();
    var SWlng = SW.lng();
    var parent = document.getElementById("event-form-breadcrumb").lastChild.id;
window.location = "/crag/add?NElat="+NElat+"&NElng="+NElng+"&SWlat="+SWlat+"&SWlng="+SWlng+"&parent="+parent;
}
function addContentWall(){
html=document.getElementById('event-form-add-info').innerHTML
    document.getElementById('event-form-add-info').innerHTML='<p>Drag marker to place Wall</p></br><input type="button" value="Add Wall" onClick="addWall()"></input><input type="button" value="Cancel" onClick="cancelAdd()"></input>'
	var location = map.getCenter();
	addmarker = new google.maps.Marker({map:map,draggable:true});
	addmarker.setPosition(location);
	}
function addWall(){
    var Lat = addmarker.position.lat();//why doesn't this work?
    var Lng = addmarker.position.lng();
	var parent = document.getElementById("event-form-breadcrumb").lastChild.id;
	window.location = "/wall/add?lat="+Lat+"&lng="+Lng+"&parent="+parent;
	}

function addContentRoute(){
html=document.getElementById('event-form-add-info').innerHTML
    document.getElementById('event-form-add-info').innerHTML='<p>Drag marker to place Route</p></br><input type="button" value="Add Route" onClick="addRoute()"></input><input type="button" value="Cancel" onClick="cancelAdd()"></input>'
    var location = map.getCenter();
	addmarker = new google.maps.Marker({map:map,draggable:true});
	addmarker.setPosition(location);
	}
function addRoute(){
    var Lat = addmarker.position.lat();
    var Lng = addmarker.position.lng();
    var parent = document.getElementById("event-form-breadcrumb").lastChild.id;
	window.location = "/route/add?lat="+Lat+"&lng="+Lng+"&parent="+parent;
	}    
function cancelAdd(){
	document.getElementById("event-form-add-info").innerHTML=html;
    addmarker.setMap(null);
    addcragbox.setMap(null);
	}