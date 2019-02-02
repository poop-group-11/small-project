//const urlBase = "http://localhost:3001/";
const urlBase = "https://poopgroup11.xyz/"; //For use on the production server (plz make sure this is uncommented when you push)
var extension;
var USERNAME;
var CONTACTS;
var currentIndex;

/* doLogin() : Called either on registration or login.
  Sends username and password to server with POST request.
	Stores JWT token in cookies.
*/
function doLogin(username, password){
	hideOrShow("register", false);

	if(!username || !password)
	{
		username = document.getElementById("loginName").value; //Assign from user field.
		password = document.getElementById("loginPassword").value; //Assign from pass field.
	}

	USERNAME = username;
	//Create JSON body.
	let body = {
		"username": username,
		"password": password
	}

	$.post(urlBase + "api/login", body)
		.done(function(data) {
			if(data.success === false){
				alert("Could not login: \n" + data.message );
			}
			else{
				console.log(data);
				if(data.token)
					document.cookie = "USER=" + data.token;
					document.cookie = "USERNAME=" + username;
					document.cookie = "PASSWORD=" + password;
				hideOrShow("Front Page", false);
				hideOrShow("contactPage", true);
				getContacts();
			}

		})
		.fail(function(err) {
			console.log(err);
			alert("Could not login: \n" + err);
		})
}

function pradBullshit(elementId, showState){
	var vis = "visible";
	var dis = "inline-block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

function doTester(){
	hideOrShow("Front Page", false);
	hideOrShow("contactPage", true);
}

function signUpPrompt(){
	hideOrShow("register", true);
	hideOrShow("logIn", false);
}

function addContactPrompt(){
	pradBullshit("currentContact", false);
	pradBullshit("NewFriends", true);
}

function displayContact(index){
	pradBullshit("currentContact", true);
	pradBullshit("NewFriends", false);
	$("#name").html(CONTACTS[index].fname + " " + CONTACTS[index].lname);
	$("#email").html(CONTACTS[index].email);
	$("#phone").html(CONTACTS[index].numbers);
	$("#address").html(CONTACTS[index].address);
}

/* signUp() - Called upon account creation.
  Sends POST request to create account. If Successful calls doLogin() to
	immediately login.
*/
function signUp(){
	hideOrShow("register", false);
	hideOrShow("logIn", true);

	var username = document.getElementById("signinName").value; //WARNING id may change in future updates to html.
	var password = document.getElementById("signPassword").value; //WARNING id may change in future updates to html.

	//Create JSON Body.
	let body = {
		"username": username,
		"password": password
	}

	$.ajax({
	    url: urlBase + 'api/createUser',
	    type: 'post',
	    data: JSON.stringify(body),
	    headers: { "Content-Type": "application/json" },
	    dataType: 'json',
	    success: function (data) {
	        console.log(data);
	        doLogin(body.username, body.password);
	    },
		error: function (error){
			console.log("ERROR CREATING USER: ");
    		console.log(error);
		}
	});
}

/* getContacts() - called upon login. *maybe other times not sure*
  Sends GET request for contacts. Displays contacts to contacts screen.
*/
function getContacts(){
	//Get request
	var contactsList;
	$.ajax({
	    url: urlBase + 'api/getContacts',
	    type: 'get',
	    headers: { "Authorization": "Bearer " + getCookie("USER") },
	    dataType: 'json',
	    success: function (res) {
	        console.log(res);
	        CONTACTS = res.data;
	        var i =0;
			contactsList = res.data.map((contact) => {
				return '<li><div id="contact" onClick=\"displayContact('+ i++ +')\">' + contact.fname  +  " " + contact.lname + '</div></li>';
			});
			console.log(contactsList);
			$("#contactList").html(function(){
				return "<ul>" + contactsList.join("") + "</ul>";
			});
	    },
		error: function (error){
			console.log("ERROR GETTING CONTACTS: ");
    		console.log(error);
		}
	});
}

/* createContact() - Called upon contact creation.
  Sends a POST request. Displays new contact to screen.
*/
function createContact(){

	var fname = document.getElementById("newFirstName").value;
	var lname = document.getElementById("newLastName").value;
	var email = document.getElementById("newEmail").value;
	var phone = document.getElementById("newPhone").value;
	var address = document.getElementById("newAddress").value;

	//Generate createContact json.
	let body = {
		fname : fname,
		lname : lname,
		email : email,
		phone : phone,
		address : address
	}

	$.ajax({
		url: urlBase + 'api/createContact',
	    type: 'post',
	    data: JSON.stringify(body),
	    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getCookie("USER") },
	    dataType: 'json',
	    success: function (data) {
	    	console.log(data);
	        if(data.success === false){
				alert("Could not Create Contact: \n" + data.error._message );
			}
			else{
				getContacts();
			}
	    },
		error: function (error){
			console.log("ERROR CREATING USER: ");
    		console.log(error);
		}
	});


}

/* updateContact() - Called upon updating a contact.
  Sends a POST request containing update information. Displays updated info.
*/
function updateContact(){
}

/* deleteContact() - Called upon deleting a contact.
  Sends a DELETE request. Removes contact display.
*/
function deleteContact(){
	if(!confirm("Are you sure you want to delete this contact?")){
		return;
	}
	body = {
		id: CONTACTS[currentIndex]._id
	}

	$.ajax({
		url: urlBase + 'api/deleteContact',
			type: 'delete',
			data: JSON.stringify(body),
			headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getCookie("USER") },
			dataType: 'json',
			success: function (data) {
				console.log(data);
					if(data.success === false){
				alert("Could not Delete Contact: \n" + data.error._message );
			}
			else{
				getContacts();
			}
			},
		error: function (error){
			console.log("ERROR DELETING USER: ");
				console.log(error);
		}
	});
}

function hideOrShow( elementId, showState ){
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

//helper function to get cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}