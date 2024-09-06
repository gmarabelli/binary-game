document.addEventListener("startTutorial", runTutorial);
let container, lens, explanation;

const startTutorial = new Event("startTutorial");
const endTutorial = new Event("endTutorial");

let phase;
const tutorial = [
	{
		element: goalBanner,
		text: "Qui è scritto in decimale il numero da comporre in binario"
	},
	{
		element: timersView,
		text: "Passando il tempo si perdono punti timer, che si possono però guadagnare componendo correttamente i numeri\n> Allo scadere dei timer si perdono bit\n> Completando i timer si guadagnano bit"
	},
	{
		element: pad,
		text: "Qui appariranno tutti i bit per comporre i numeri in binario: basta premere o passare sopra a ciascuno di essi per modificarne il valore"
	},
];

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

	phase = -1;
	nextTutorial();
	body.addEventListener("pointerdown", nextTutorial);
}

function explainElement(element, text){
	let rect = element.getBoundingClientRect();
	lens.style.width = rect.width + "px";
	lens.style.height = rect.height + "px";
	lens.style.setProperty("--x", rect.left + "px");
	lens.style.setProperty("--y", rect.top + "px");

	let screenHeight = document.height;
	explanation.innerText = text;
	if(rect.top < 200){
		explanation.style.setProperty("--y", rect.bottom + "px");
		explanation.style.setProperty("--line", 1);
	}else{
		explanation.style.setProperty("--y", rect.top + "px");
		explanation.style.setProperty("--line", -1);
	}
}

function nextTutorial(){
	phase++;
	if(phase < tutorial.length){
		explainElement(tutorial[phase].element, tutorial[phase].text);
	}else{
		body.removeEventListener("pointerdown", nextTutorial);
		container.style.opacity = 0;
		setTimeout(() => {container.remove(); console.log("endTutorial"); document.dispatchEvent(endTutorial);}, 500);
	}
}