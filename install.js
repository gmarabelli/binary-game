const installBanner = document.getElementById("install-banner");
const installInvite = document.getElementById("install-invite");
const installButton = document.getElementById("install-button");
const noinstallButton = document.getElementById("noinstall-button");
const closeinstallButton = document.getElementById("closeinstall-button");
const installInstructions = document.getElementById("install-instructions");

let deferredPrompt;

const startInstall = new Event("startInstall");
const endInstall = new Event("endInstall");

registerOffline();
document.addEventListener("startInstall", showInstall);

window.addEventListener("beforeinstallprompt", (event) => {
	event.preventDefault();
	deferredPrompt = event;
});

window.addEventListener("appinstalled", (event) => {
	hideInstall();
});

function showInstall(){
	if(window.matchMedia("(display-mode: browser)").matches){
		console.log("startInstall");
		installBanner.style.display = "block";
	}
}

function hideInstall(){
	installBanner.style.display = "none";
	console.log("endInstall");
	document.dispatchEvent(endInstall);
}

async function registerOffline(){
	try{
		const registration = await navigator.serviceWorker.register("offline.js");
		console.log("Service worker registration succeeded: ", registration);
	}catch(error){
		console.error("Cannot load service worker: ", error);
	}
}

installButton.addEventListener("click", async () => {
	try{
		deferredPrompt.prompt();
		const choice = await deferredPrompt.userChoice;
		deferredPrompt = null;
		if(choice == "accepted"){
			
		}else{
			hideInstall();
		}
	}catch{
		installInvite.style.display = "none";
		installInstructions.style.display = "block";
	}
});

noinstallButton.addEventListener("click", hideInstall);
closeinstallButton.addEventListener("click", hideInstall);