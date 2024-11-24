function LogOutAllOptions() {
//Log out from all websites
	var r = confirm("You are about to logout out of ALL websites, are you sure?");
	if (r == true) {
			chrome.cookies.getAll({}, function(cookies) {
			for(var i=0; i<cookies.length;i++) {
				chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
			}
		});
	}
}

function LogOutSpecificSites(){
	
	var URLProvided=document.getElementById('NameOfWebsites').value
	if(document.getElementById("TimeInMins").value!="0"){
		//chrome.tabs.create({'url': chrome.extension.getURL('pages/popup.html')}, function(tab) {});
		var timeInMins=document.getElementById("TimeInMins").value;
		alert("You will be logged out of the site '"+URLProvided+"' in approximately "+timeInMins+" minute(s).");
		chrome.alarms.create(URLProvided,{delayInMinutes: 0,periodInMinutes:1 });
			
		chrome.alarms.onAlarm.addListener(function(alarm){
			  console.log("Alarm Elapsed Name "+alarm.name);
			  console.log("This is Over");
			  chrome.alarms.clear("My First Alarm");
			URLProvided=URLProvided.replace("www.","");
			URLProvided=URLProvided.replace("outlook.","");
			
			if(URLProvided.toLowerCase().indexOf("yahoo.com") > -1)
			{
				URLProvided="yahoo.com";
			}
			if(URLProvided.toLowerCase().indexOf("web.facebook.com")> -1 )
			{
				URLProvided="facebook.com";
			}
			if(URLProvided.toLowerCase().indexOf("mail.google.com")> -1 )
			{
				URLProvided="google.com";
			}
			if(URLProvided!=null || URLProvided!=""){
				var domainsProvided=ExtractDomain(URLProvided);
				chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
				  for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
					}
				  });
			chrome.alarms.clear(alarm.name);				  
			}
			  
		});
	}
	else if ( document.getElementById("NameOfWebsites").value!='' ) {
			URLProvided=URLProvided.replace("www.","");
			URLProvided=URLProvided.replace("outlook.","");
			if(URLProvided.toLowerCase().indexOf("yahoo.com") > -1)
			{
				URLProvided="yahoo.com";
			}
			if(URLProvided.toLowerCase().indexOf("web.facebook.com")> -1 )
			{
				URLProvided="facebook.com";
			}
			if(URLProvided.toLowerCase().indexOf("mail.google.com")> -1 )
			{
				URLProvided="google.com";
			}
			
			if(URLProvided!=null || URLProvided!=""){
				var domainsProvided=ExtractDomain(URLProvided);
				chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
				  for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
					}
				  });	
			}
			alert("You are now Logged out of the site : "+ URLProvided);
	}
}

/*chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);
});*/

function ExtractDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    domain = domain.split(':')[0];
	domain=domain.replace("undefined","");
    return domain;
}

/*
function createAlarm() {
     chrome.alarms.create(alarmName, {
       delayInMinutes: 0.1, periodInMinutes: 0.1});
}
*/

function onCreateofBrowser(){
		chrome.windows.getAll(function(windows) {
		if(localStorage["AutoLogoutAll"]=="Y" && windows.length==1)
		{
			chrome.cookies.getAll({}, function(cookies) {
				for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
				}
			});
		}
		else if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null && windows.length==1){
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					LogoutWebsitesUsingURL(AutoLogoutWebsitesList[i]);
				}
			}
		}
	});
}

function LoadCurrentTab(){
	//onCreateofBrowser();
	//localStorage["AutoLogoutAllWebSitesList"]+="Extension started"+";";
	document.getElementById('RemoveToLogOutList').style.display = 'none';
	chrome.tabs.getSelected(null, function(tab) {
		//debugger;
		var tabUrl = tab.url;
		tabUrl=ExtractDomain(tabUrl);
		//tabUrl="https://web.facebook.com/";//Sulman ,For testing Only
		document.getElementById("NameOfWebsites").value=tabUrl;
		var AutoLogoutWebsitesList=(localStorage["AutoLogoutAllWebSitesList"] || '').split(";");
		if(tabUrl!=""&&tabUrl!=null&&localStorage["AutoLogoutAllWebSitesList"]!=""&&localStorage["AutoLogoutAllWebSitesList"]!=null)
		{
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i].indexOf(ExtractDomain(tabUrl))>-1 && AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!="")
				{
					//debugger;
					document.getElementById('AddToLogOutList').style.display = 'none';
					//document.getElementById('RemoveToLogOutList').style.display = 'block';
					var yourUl = document.getElementById("RemoveToLogOutList");
					yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
				}
			}
		}
		});
		
    }
	

function RemoveURLFromList()
{			
		var r = confirm("Are you sure you want to remove this site to log out list?");
		if (r == true) {
		var URLList="";
		var tabUrl=document.getElementById("NameOfWebsites").value;
		var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
		for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
			if(AutoLogoutWebsitesList[i].indexOf(ExtractDomain(tabUrl))>-1)
			{
				//if any condition  required
			}
			else
		    {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!="")
				{
					URLList+=AutoLogoutWebsitesList[i]+";";
				}
			}
		}
		localStorage["AutoLogoutAllWebSitesList"]=URLList;	
}
		window.close();

}

var checkLoad = function() {   
    document.readyState !== "complete" ? setTimeout(checkLoad,11) : LoadCurrentTab();   
};  
checkLoad();  

chrome.windows.onCreated.addListener(function() {
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAll"]+";";
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAllWebSitesList"]+";";
		if(localStorage["AutoLogoutAll"]!=null && localStorage["AutoLogoutAll"]=="Y")
		{
			chrome.cookies.getAll({}, function(cookies) {
				for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
				}
			});
		}
		else if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null){
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					localStorage["AutoLogoutAllWebSitesList"]+="Start "+AutoLogoutWebsitesList[i]+";";
					LogoutWebsitesUsingURL(AutoLogoutWebsitesList[i]);
					localStorage["AutoLogoutAllWebSitesList"]+="Done "+AutoLogoutWebsitesList[i]+";";
				}
				
			}
			
		}
});

/*chrome.windows.onRemoved.addListener(function(windowId){
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAll"]+";";
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAllWebSitesList"]+";";
	
		if(localStorage["AutoLogoutAll"]!=null && localStorage["AutoLogoutAll"]=="Y")
		{
			chrome.cookies.getAll({}, function(cookies) {
				for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
				}
			});
		}
		else if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null){
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					localStorage["AutoLogoutAllWebSitesList"]+="Start "+AutoLogoutWebsitesList[i]+";";
					LogoutWebsitesUsingURL(AutoLogoutWebsitesList[i]);
					localStorage["AutoLogoutAllWebSitesList"]+="Done "+AutoLogoutWebsitesList[i]+";";
				}
				
			}
			
		}
	
});*/

function LogoutWebsitesUsingURL(URLProvided){
	URLProvided=URLProvided.replace("www.","");
	URLProvided=URLProvided.replace("outlook.","");
	if(URLProvided.toLowerCase().indexOf("yahoo.com") > -1)
	{
		URLProvided="yahoo.com";
	}
	if(URLProvided.toLowerCase().indexOf("web.facebook.com")> -1 )
	{
		URLProvided="facebook.com";
	}
	if(URLProvided.toLowerCase().indexOf("mail.google.com")> -1 )
	{
		URLProvided="google.com";
	}
	if(URLProvided!=null || URLProvided!=""){
		var domainsProvided=ExtractDomain(URLProvided);
		//localStorage["AutoLogoutAllWebSitesList"]+="Here to Destory : "+domainsProvided+";";
		chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
		//localStorage["AutoLogoutAllWebSitesList"]+="Total Count: "+cookies.length+";";
		for(var i=0; i<cookies.length;i++) {
			chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
			//localStorage["AutoLogoutAllWebSitesList"]+="current Count: "+i+";";
		}
		});	
	}	
}

function funcAddToLogOutList(){
	//debugger;
		if(localStorage["AutoLogoutAllWebSitesList"]!=null && localStorage["AutoLogoutAllWebSitesList"]!="")
		{
			localStorage["AutoLogoutAllWebSitesList"]+=document.getElementById('NameOfWebsites').value+";";
		}
		else{
			localStorage["AutoLogoutAllWebSitesList"]=document.getElementById('NameOfWebsites').value+";";
		}
		alert("Domain added.");
		window.close();
}

var elmLogoutAll = document.getElementById('LogoutAll');
var elmLogoutSpecific = document.getElementById('LogoutSpecific');
var elmAddToLogOutList = document.getElementById('AddToLogOutList');
var elmRemoveToLogOutList = document.getElementById('RemoveToLogOutList');

if (elmLogoutAll)
	elmLogoutAll.addEventListener('click', LogOutAllOptions);

if (elmLogoutSpecific)
	elmLogoutSpecific.addEventListener('click', LogOutSpecificSites);

if (elmAddToLogOutList)
	elmAddToLogOutList.addEventListener('click', funcAddToLogOutList);

if (elmRemoveToLogOutList)
	elmRemoveToLogOutList.addEventListener('click', RemoveURLFromList);
