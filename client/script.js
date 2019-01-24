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

function doLogin(){
	hideOrShow("logIn", false);
	hideOrShow("register", false);
}

function signUpPrompt(){
	hideOrShow("register", true);
	hideOrShow("logIn", false);
}

function signUp(){
	hideOrShow("register", false);
	hideOrShow("logIn", true);
}

function pullContacts(){
}

function createContactPrompt(){
}

function createContact(){
}

function updateContactPrompt(){
}

function updateContact(){
}

function deleteContactPrompt(){
}

function deleteContact(){
}

function viewContact(){
}

function hideOrShow( elementId, showState )
{
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
