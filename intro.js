/*
 *	Binary Game by GMarabelli
 */
const SETUP_TIME = 500;
const MAX_BITS = 8;
const NUM_TIMERS = 8;

const body = document.body;
const goalBanner = document.getElementById("goal");
const timersView = document.getElementById("timers");
const pad = document.getElementById("pad");

const startIntro = new Event("startIntro");
const endIntro = new Event("endIntro");

let activeTimer = 3;

console.log("startIntro");
setupHTML();
const cells = document.getElementById("pad").children;
const timers = timersView.children;
startSequence();

function setupHTML () {
	for(let i = 0; i < MAX_BITS; i++){
		let cell = document.createElement("button");
		pad.append(cell);
		cell.dataset.bit = 0;
		cell.dataset.limit = Math.pow(2, MAX_BITS - i);
		if(i < MAX_BITS - 1){
			cell.classList.add("hidden");
		}
	}

	for(let i = 0; i < NUM_TIMERS; i++){
		let circleSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		timersView.append(circleSVG);
		circleSVG.dataset.index = i;
		circleSVG.innerHTML = '<circle cx="50%" cy="50%" r="45%" pathLength="1"></circle>';
	}
}

function startSequence () {
	let j = -1;
	let startLoop = setInterval(() => {
		if(j >= 0 && j < activeTimer){
			timers[j].dataset.timer = "full";
		}
		if(j == activeTimer){
			timers[j].dataset.timer = "full";
			clearInterval(startLoop);
			setTimeout(() => {console.log("endIntro"); document.dispatchEvent(endIntro);}, SETUP_TIME);
		}
		j++;
		if(j <= activeTimer){
			timers[j].dataset.timer = "start";
		}
	}, SETUP_TIME);
}