function moveEventForm(){
//    alert("Div was clicked");
    document.getElementById("event-form-center").style.display="none";
    var side=document.getElementById('event-form-side');
    var center=document.getElementById('block-verb-verb-event');
    var form=document.getElementById('event-form');
    side.appendChild(form);
    form.appendChild(center);

}
function getVerbs(){
    document.getElementById("event-form-people").style.display="none";
    document.getElementById("event-form-map").style.display="none";
    document.getElementById("event-form-picker").style.display="none";
    document.getElementById("event-form-verb-list").style.display="block";
    document.getElementById("event-form-filter").style.display="none";
    document.getElementById("event-form-breadcrumb").style.display="none";
    document.getElementById("event-form-sidebar").innerHTML="";
    document.getElementById("event-form-verb-list").innerHTML=" ";
            $.post("?q=verb/get/verbs", {},
                function(data) {
				var temp_array = $.parseJSON(data);
				var i=0;
					while(i<temp_array.length){
						var button = document.createElement("div");
						document.getElementById("event-form-verb-list").appendChild(button);
						var image = document.createElement("img");
						image.setAttribute('src',temp_array[i].path);
						button.appendChild(image);
//						var element = document.createElement("input");
//						button.appendChild(element);
//						element.type="button";						
//						element.value=temp_array[i].name;
						button.name=temp_array[i].name;
                        button.id=temp_array[i].vid;
//						element.innerHTML=temp_array[i].name;
						button.setAttribute('onClick', 'fillVerb(this.name,this.id)');
                        button.setAttribute('style','box-shadow: 5px 5px 5px #ccc; width:200px; float:left;');
//						element.id="verb_"+temp_array[i].vid;

						i++;
						}
						});
                        //The "I Do What I Want" input box.  In progress.
//                        var other = document.createElement("div");
//                        document.getElementById("framecontentBottom").appendChild(other);
//                        var textbox = document.createElement("input");
//                        other.appendChild(textbox);
//                        textbox.type="text";
//                        textbox.value="I do what I want";
		}
		function fillVerb(name,id)
{

   document.getElementById("event-form-verb-list").style.display="none";
   document.getElementById("edit-something").value = id;
   document.getElementById("button1").innerHTML = name;
   getPeople();
  
}
function getPeople(){
    document.getElementById("event-form-people").style.display="block";
    document.getElementById("event-form-map").style.display="none";
    document.getElementById("event-form-picker").style.display="none";
    document.getElementById("event-form-verb-list").style.display="none";
    document.getElementById("event-form-filter").style.display="none";
    document.getElementById("event-form-breadcrumb").style.display="none";
	document.getElementById("event-form-people").innerHTML=" ";
    document.getElementById("event-form-sidebar").innerHTML="";
    var added = document.getElementById("edit-someone").value.split(',');
			$.post("/?q=verb/get/people", {},
   			function(data) {
				var temp_array = $.parseJSON(data);
                var i=0;
                var k=0;
					while(i<temp_array.length){
						var badge = document.createElement("div");
                        var left = document.createElement("div");left.id="badge-left";
                        var profile = document.createElement("div");profile.id="profile-pic";
                        var right = document.createElement("div");right.id="badge-right";
                        var name = document.createElement("div");
                        var pic = document.createElement("img");
                        pic.src = temp_array[i].path;
						document.getElementById("event-form-people").appendChild(badge);
                        badge.appendChild(left);
                        left.appendChild(profile);
                        profile.appendChild(pic);
                        badge.appendChild(right);
                        right.appendChild(name);
						name.innerHTML=temp_array[i].field_profile_first_name_value+" "+temp_array[i].field_profile_last_name_value;
						name.field_profile_first_name_value=temp_array[i].field_profile_first_name_value;
						badge.setAttribute('onClick', 'fillPeople("'+temp_array[i].field_profile_first_name_value+'",'+temp_array[i].uid+')');
						badge.setAttribute('class','person-badge');
                        name.id="person_"+temp_array[i].uid;
                        name.setAttribute('class', 'badge-name');
                        pic.setAttribute('class', 'picture');
						name.name=temp_array[i].field_profile_first_name_value;
                        badge.id="badge"+temp_array[i].uid;
                        while(k<added.length){
                            if(temp_array[i].uid==added[k]){
                                var side=document.getElementById('event-form-sidebar');
                                side.appendChild(badge);
                                badge.setAttribute('onClick', 'removePeople("'+temp_array[i].field_profile_first_name_value+'",'+temp_array[i].uid+')');
                                }//close if
                                k++;
                            }//close while k
                        k=0;
						i++;
						} // close while loop

						});
		} //close getPeople()
var whoArray = [];
var idArray = [];

var filling = "";
function fillPeople(thing,id){
//    filling = document.getElementById(name).name;
//    alert(name);
/*	if (window.document.getElementById(name).class === "selected"){
		var unfilling = whoArray.indexOf(filling);
		alert(unfilling);
		whoArray.splice(unfilling,1);
		window.document.getElementById(name).setAttribute("class", "");
		}
	else*/
//{window.document.getElementById(name).setAttribute("class", "selected")};
var badge=document.getElementById('badge'+id);
var side=document.getElementById('event-form-sidebar');
side.appendChild(badge);
badge.setAttribute('onClick', 'removePeople("'+thing+'",'+id+')');

var name = thing;
	whoArray.push(name);
    idArray.push(id);
    
	if (whoArray.length==1){
	var thePeople = whoArray[0];
	}
	  else if (whoArray.length==2){
	var thePeople = whoArray[0] +" and "+whoArray[1];
  //    window.document.eventform.button2.value = whoArray[0],whoArray[1]
  } 
  else if (whoArray.length==3){
	  var thePeople = whoArray[0]+", "+whoArray[1]+" and "+whoArray[2];
	  }
	  else if (whoArray.length==4){
		  var thePeople = whoArray[0]+", "+whoArray[1]+", "+whoArray[2]+" and "+whoArray[3];
		  }
		  else if (4<whoArray.length<10){var thePeople = "some friends"}
	  else {var thePeople = "a bunch of people"}
	  document.getElementById("edit-someone").value = idArray;
	  document.getElementById("button2").innerHTML = thePeople; 
}
function removePeople(name,id){
    var badge=document.getElementById('badge'+id);
    var center=document.getElementById("event-form-people");
    center.appendChild(badge);
    var temp=idArray.indexOf(id);
    idArray.splice(temp,1);
    var temp2=whoArray.indexOf(name);
    whoArray.splice(temp2,1);
        if (whoArray.length==1){
	var thePeople = whoArray[0];
	}
	  else if (whoArray.length==2){
	var thePeople = whoArray[0] +" and "+whoArray[1];
  //    window.document.eventform.button2.value = whoArray[0],whoArray[1]
  } 
  else if (whoArray.length==3){
	  var thePeople = whoArray[0]+", "+whoArray[1]+" and "+whoArray[2];
	  }
	  else if (whoArray.length==4){
		  var thePeople = whoArray[0]+", "+whoArray[1]+", "+whoArray[2]+" and "+whoArray[3];
		  }
		  else if (4<whoArray.length<10){var thePeople = "some friends"}
	  else {var thePeople = "a bunch of people"}
	  document.getElementById("edit-someone").value = idArray;
	  document.getElementById("button2").innerHTML = thePeople;
      badge.setAttribute('onClick', 'fillPeople("'+name+'",'+id+')');
    }  
function whereArray(){
    if (document.getElementById('edit-something').value == "do something"){
        alert('What are you even doing? Pick your Verb first.');
        getVerbs();}
        else if(document.getElementById('edit-something').value == "6"){
//window.document.forms[FRM].elements[BTN].value="         ?         ";
        document.getElementById("event-form-filter").innerHTML='<div class="floating" id="toprope-block"><input type="checkbox" id="toprope" value="1">Top rope?</input></div><div id="style-block" class="floating"><input type="radio" name="style" value="1">Sport<br></input><input type="radio" name="style" value="0">Trad</input></div><br><br><br><div id="difficulty-block"></div><div id="5.6" class="floating" class="filter-checkbox">5.6<br><input type="radio" name="difficulty"  value="5.6"></div><div id="5.7" class="floating" class="filter-checkbox">5.7<br><input type="radio" name="difficulty"  value="5.7"></div><div id="5.8" class="floating" class="filter-checkbox">5.8<br><input type="radio" name="difficulty"  value="5.8"></div><div id="5.9" class="floating" class="filter-checkbox">5.9<br><input type="radio" name="difficulty"  value="5.9"></div><div id="5.10" class="floating" class="filter-checkbox">5.10<br><input type="radio" name="difficulty"  value="5.10"></div><div id="5.11" class="floating" class="filter-checkbox">5.11<br><input type="radio" name="difficulty"  value="5.11"></div><div id="5.12" class="floating" class="filter-checkbox">5.12<br><input type="radio" name="difficulty"  value="5.12"></div><div id="5.13" class="floating" class="filter-checkbox">5.13<br><input type="radio" name="difficulty"  value="5.13"></div></div>';

    firstMap();}
    else {
        var verb = document.getElementById('button1').innerHTML;
        alert("Looks like we don't have anything for "+verb+" yet, try Rock Climbing");}
    }

function getPicker(){
    document.getElementById("event-form-people").style.display="none";
    document.getElementById("event-form-map").style.display="none";
    document.getElementById("event-form-picker").style.display="block";
    document.getElementById("event-form-verb-list").style.display="none";
    document.getElementById("event-form-filter").style.display="none";
    document.getElementById("event-form-breadcrumb").style.display="none";
    document.getElementById("event-form-sidebar").innerHTML="";
    document.getElementById("date").focus();
    }
