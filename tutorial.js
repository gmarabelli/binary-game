body.addEventListener("start", runTutorial);
let lens;

function runTutorial(){
	console.log("startTutorial!");
	lens = document.createElement("div");
	lens.id = "tutorialLens";
	body.append(lens);

	setTimeout(() => {goToTutorial(document.getElementById("goal"));}, 0);

	console.log("endTutorial!");
}

function goToTutorial(element){
	console.log(element);
	console.log(element.style);
	lens.style.width = "300px"; //element.style.width;
	lens.style.height = "300px"; //element.style.height;
	//lens.setProperty("--x") = element.getPosition();
	//lens.setProperty("--y") = element.getPosition();
}