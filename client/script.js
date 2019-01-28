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

const urlBase = "https://localhost:3001/";
var extension;

function doLogin(){
	hideOrShow("logIn", false);
	hideOrShow("register", false);

    var user = document.getElementById("loginName"); //Assign from user field.
    var pass = document.getElementByPass("loginName"); //Assign from pass field.

    var url; //Generate url for POST call.

	//Create login cookie.
	document.cookie = "user=" + user + ",pass=" + pass;

	//Create login json.
	var jsonSend = '{"username":"' + login '", "password":"' + password + '"}';

	//POST request
	//TODO

}

function signUpPrompt(){
	hideOrShow("register", true);
	hideOrShow("logIn", false);
}

function signUp(){
	hideOrShow("register", false);
	hideOrShow("logIn", true);
	//POST request
	let username.getElementById("loginName");
	let password = document.getElementById("loginPassword");

	let body = {
		username: username,
		password: password
	}

	let method = "POST";
	headers = { 'Content-type: application/json' };

	fetch(urlBase + "api/createUser", {
		method: method,
		body: body, 
		headers: headers
	}).then(res => {
		console.log(res.json());
	});

}

function getContacts(){
	//Get request
}

function createContactPrompt(){
}

function createContact(){
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

function get(url, request){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); //TODO: figure out what is supposed to go here.
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

function post(jsonSend, url, request){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); //TODO: figure out what is supposed to go here.
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

function delete(jsonSend, url, request){
	var xhr = new XMLHttpRequest();
	xhr.open("DELETE", url, true);
	xhr.setRequstHeader("Content-Type", "application/json; charset=UTF-8");
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
