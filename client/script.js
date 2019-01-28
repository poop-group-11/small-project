/*List of Functions:
		1. doLogin()/auth() -
			Called upon clicking the login button. Captures login and password to
			.json to be sent to API. Password is hashed. Upon recieving response,
			either transfer to contacts screen or throw error if invalid login.
		2. signUpPrompt() -
			Called upon clicking sign up button. Changes login screen to signUp input.
			Displays password requirements.
		3. signUp() -
			Called upon creating a new account. Captures login and password to .json
			to be sent to the API. Password is hashed. Transfer to contacts screen on
			response.
		4. pullContacts() -
		  Called as needed for updates to contacts. Sends .json request for users
			contacts. Upon recieving response display contact info on contacts screen.
		5. createContactPrompt() -
		  Called upon clicking create contact option. Displays prompt for creating
			a new contact.
		6. createContact() -
		  Called upon creating a new contact. Captures contact info to .json to be
			sent to API. Returns to contact screen.
		7. updateContactPrompt() -
		  Called upon clicking update contact option. Displays prompt for updating
			an existing contact.
		8. updateContact() -
		  Called upon updating a contact. Captures changed info to .json to be sent
			to API. Returns to contact screen.
		9. deleteContactPrompt() -
		  Called upon clicking delete contact option. Displays prompt for deleting
			an existing contact.
		10.deleteContact() -
		  Called upon deleting a contact. Captures contact id into .json to be sent
			to API. Returns to contact screen.
		11.viewContact() -
		  Called upon clicking a contact. Displays contact info to user.
*/

var urlBase;
var extension;

function doLogin(){
	hideOrShow("logIn", false);
	hideOrShow("register", false);

    var user = document.getElementById("loginName").value; //Assign from user field.
    var pass = document.getElementById("loginPassword").value; //Assign from pass field.

    var url; //Generate url for POST call.

	//Create login json.
	var jsonSend = '{"login" : "' + user + '", "password" : "' + pass + '"}';

	//POST request
	//TODO
	
	//Take JWT token from jsonRecieve and store in cookie.
	var parsedJson = JSON.parse(jsonRecieve);
	document.cookie = "token=" + parsedJson[2].id;
	

}

function signUpPrompt(){
	hideOrShow("register", true);
	hideOrShow("logIn", false);
}

function signUp(){
	hideOrShow("register", false);
	hideOrShow("logIn", true);
	
	var username = document.getElementById("loginName").value; //WARNING id may change in future updates to html.
	var password = document.getElementById("loginPassword").value; //WARNING id may change in future updates to html.
	
	var url; //Generate url for POST call.
	
	//Generate createUser json.
	var jsonSend = '{"login" : "' + username +
	             '", "password" : "' + password + '"}';
	
	//POST request
	
	//Take JWT token from jsonRecieve and store in cookie.
	var parsedJson = JSON.parse(jsonRecieve);
	document.cookie = "token=" + parsedJson[2].id;
}

function getContacts(){
	//Get request
}

function createContactPrompt(){
}

function createContact(){
	
	var fname;
	var lname;
	var email;
	var phone;
	var address;
	
	var url;
	
	//Generate createContanct json.
	var jsonSend = '{"fname" : "' + fname +
	             '", "lname" : "' + lname +
	             '", "email" : "' + email +
	             '", "phone" : "' + phone +
	             '", "address" : "' + address + '"}';
	
	//POST request
}

function updateContactPrompt(){
}

function updateContact(){
	//POST request
}

function deleteContactPrompt(){
}

function deleteContact(){
	// Delete request
}

function viewContact(){
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

function get(url){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "Authorization: Bearer " + document.cookie"); //TODO: figure out what is supposed to go here.
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				var jsonRecieve = JSON.parse( xhr.responseText );
			}
		};
		xhr.send();
	}
	catch(err)
	{
		//TODO: Process err.message
	}
  return jsonRecieve;
}

function post(jsonSend, url){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "Authorization: Bearer " + document.cookie); //TODO: figure out what is supposed to go here.
	try{
		xhr.onreadystatechange = function(){
			if(this.readystate = 4 && this.status == 200){
				var jsonRecieve = JSON.parse(  xhr.responsetext );
			}
		};
		xhr.send(jsonSend);
	}
	catch(err)
	{
		//TODO: process err.message
	}
	return jsonRecieve;
}

function delete(jsonSend, url){
	var xhr = new XMLHttpRequest();
	xhr.open("DELETE", url, true);
	xhr.setRequestHeader("Content-Type", "Authorization: Bearer " + document.cookie);
	try{
		xhr.onreadystatechange = function(){
			if(this.readystate = 4 && this.status == 200){
				var jsonRecieve = JSON.parse(  xhr.responsetext );
			}
		};
		xhr.send();
	}
	catch(err)
	{
		//TODO: process err.message
	}
	return jsonRecieve;
}
