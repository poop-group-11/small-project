function doLogin(){
	window.open('https://www.youtube.com', '_blank');
	hideOrShow("logIn", false);
	hideOrShow("register", false);
}

function signUp(){
	hideOrShow("register", true);
	hideOrShow("logIn", false);
}

function signedUp(){
	hideOrShow("register", false);
	hideOrShow("logIn", true);
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