document.addEventListener("startTutorial", runTutorial);
let container, lens, explanation;

const startTutorial = new Event("startTutorial");
const endTutorial = new Event("endTutorial");

function runTutorial(){
	console.log("startTutorial");
	container = document.createElement("div");
	container.id = "tutorial";
	body.append(container);

	lens = document.createElement("div");
	lens.id = "tutorialLens";
	container.append(lens);

	explanation = document.createElement("div");
	explanation.id = "tutorialExplanation";
	container.append(explanation);

	setTimeout(() => {explainElement(goalBanner, "Qui è scritto in decimale il numero da comporre in binario");}, 0);
	setTimeout(() => {explainElement(timersView, "Passando il tempo si perdono punti, che si possono però guadagnare componendo correttamente i numeri");}, 2000);
	setTimeout(() => {explainElement(pad, "Qui appariranno tutti i bit per comporre i numeri in binario: basta premere o passare sopra ad uno di essi per modificarne il valore. Premi il bit per comporre il numero 1");}, 4000);
	setTimeout(() => {container.style.opacity = 0;}, 6000);
	setTimeout(() => {container.remove(); document.dispatchEvent(endTutorial); console.log("endTutorial");}, 6500);
}

function explainElement(element, text){
	let rect = element.getBoundingClientRect();
	lens.style.width = rect.width + "px";
	lens.style.height = rect.height + "px";
	lens.style.setProperty("--x", rect.left + "px");
	lens.style.setProperty("--y", rect.top + "px");

	let screenHeight = document.height;
	console.log(screenHeight);
	explanation.innerText = text;
	if(rect.top < 200){
		explanation.style.setProperty("--y", rect.bottom + "px");
	}else{
		explanation.style.setProperty("--y", rect.top + "px");
	}
}