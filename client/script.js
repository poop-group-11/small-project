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
	pradBullshit("UpdateFriends", false);
	pradBullshit("NewFriends", true);
}

function updateContactPrompt(){
	pradBullshit("currentContact", false);
	pradBullshit("UpdateFriends", true);
	pradBullshit("NewFriends", false);
	document.getElementById("freshFirstName").value = CONTACTS[currentIndex].fname;
  document.getElementById("freshLastName").value = CONTACTS[currentIndex].lname;
  document.getElementById("freshEmail").value = CONTACTS[currentIndex].email;
  document.getElementById("freshPhone").value = CONTACTS[currentIndex].phone;
  document.getElementById("freshAddress").value = CONTACTS[currentIndex].address;
}

function displayContact(index){
	pradBullshit("currentContact", true);
	pradBullshit("NewFriends", false);
	pradBullshit("UpdateFriends", false);
	$("#name").html(CONTACTS[index].fname + " " + CONTACTS[index].lname);
	$("#email").html(CONTACTS[index].email);
	$("#phone").html(CONTACTS[index].numbers);
	$("#address").html(CONTACTS[index].address);
	currentIndex = index;
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
					if(data.success){
						doLogin(body.username, body.password);
					}
	    },
		error: function (error){
			console.log("ERROR CREATING USER: ");
    		console.log(error);
		}
	});
}

/* signOut() - Called upon signing out.
  Purges all local data from cookies and html. Returns to login screen.
*/
function signOut(){
  var contactList = document.getElementById("contactList");
	var contacts = document.getElementsByClassName("contactHead");
	var length = contacts.length;
	var contact;
	//Clear Cookies.
	document.cookie = "USER=" + "";
	document.cookie = "USERNAME=" + "";
	document.cookie = "PASSWORD=" + "";
	//Reload Page.
	location.reload();s
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
				return '<li><button id="contact'+ i +'" class="contactHead" onClick=\"displayContact('+ i++ +')\">' + contact.fname  +  " " + contact.lname + '</button></li>';
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

	var cfname = CONTACTS[currentIndex].fname;
	var clname = CONTACTS[currentIndex].lname;
	var cemail = CONTACTS[currentIndex].email;
	var cphone = CONTACTS[currentIndex].phone;
	var caddress = CONTACTS[currentIndex].address;

	var fname = document.getElementById("freshFirstName").value;
	var lname = document.getElementById("freshLastName").value;
	var email = document.getElementById("freshEmail").value;
	var phone = document.getElementById("freshPhone").value;
	var address = document.getElementById("freshAddress").value;


	let update = {}
	if (cfname != fname) {
		update.fname = fname;
	}
	if (clname != lname) {
		update.lname = lname;
	}
	if (cemail != email) {
		update.email = email;
	}
	if (cphone != phone) {
		update.phone = phone;
	}
	if (caddress != address) {
		update.address = address;
	}

	let body = {
		id: CONTACTS[currentIndex]._id,
		update: update
	}

	$.ajax({
		url: urlBase + 'api/updateContact',
			type: 'post',
			data: JSON.stringify(body),
			headers: { "Content-Type": "application/json", "Authorization": "Bearer " + getCookie("USER") },
			dataType: 'json',
			success: function (data) {
				console.log(data);
					if(data.success === false){
				alert("Could not Update Contact: \n" + data.error._message );
			}
			else{
				getContacts();
			}
			},
		error: function (error){
			console.log("ERROR UPDATING USER: ");
				console.log(error);
		}

	});

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

/* search() - Called upon typing in the search field.
  Filters the contacts.
*/
function search(){
	var search = document.getElementById("searchBar").value.toLowerCase();
	var length = CONTACTS.length;
	var contactHeads = document.getElementsByClassName("contactHead");
	var contactFName;
	var contactLName;
	var contactPhone;
	var contactEmail;
	var contactAddress;

	for(i = 0; i < length; i++){
		//Get contact info
		contactFName = CONTACTS[i].fname;
		contactLName = CONTACTS[i].lname;
		contactPhone = CONTACTS[i].numbers;
		contactEmail = CONTACTS[i].email;
		contactAddress = CONTACTS[i].address
    //If it is in any field display.
		if(contactFName.includes(search) ||
	     contactLName.includes(search) ||
		   contactPhone.toString().includes(search) ||
		   contactEmail.includes(search) ||
		   contactAddress.includes(search)){
			hideOrShow(contactHeads[i].id, true);
		} else {
			hideOrShow(contactHeads[i].id, false);
		}
	}
}

/* autoLogin() - Called upon loading the page.
  If the user has a login cookie stored login using credentials.
*/
function autoLogin(){
	var username = getCookie("USERNAME");
	var password = getCookie("PASSWORD");
  if( !username || !password){
		return;
	} else {
		doLogin(username, password);
	}
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
