/*
 *	Binary Game by GMarabelli
 */
const SETUP_TIME = 250;
const TIMER_TIME = 5000;
const MAX_BITS = 8;
const NUM_TIMERS = 8;
const START_TIME = SETUP_TIME * (NUM_TIMERS - 1);

const body = document.body;
const goalBanner = document.getElementById("goal");
const timersView = document.getElementById("timers");
const pad = document.getElementById("pad");

const startEvent = new Event("start");
const hitEvent = new Event("hit");
const goalEvent = new Event("goal");
const timersEvent = new Event("timers");

let active;
let limit = 2;
let activeTimer = 3;
let goal = 0;
let timerLoop;

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
		circleSVG.classList.add("animate-start");
		circleSVG.innerHTML = '<circle cx="50%" cy="50%" r="45%" pathLength="1"></circle>';
	}
}

function startSequence () {
	let j = NUM_TIMERS;
	let startLoop = setInterval(() => {
		if(j < NUM_TIMERS){
			let timerClassList = timers[j].classList;
			timerClassList.remove("full");
			timerClassList.remove("animate-start");
			setTimeout(() => {timerClassList.add("animate");}, 20);
		}
		j--;
		let timerClassList = timers[j].classList;
		timerClassList.add("full");
		if(j == activeTimer){
			for(let i = 0; i <= activeTimer; i++){
				let timerClassList = timers[i].classList;
				setTimeout(() => {
					timerClassList.remove("animate-start");
					timerClassList.add("animate");
				}, SETUP_TIME);
			}
			body.dispatchEvent(startEvent);
			clearInterval(startLoop);
		}
	}, SETUP_TIME);
}

body.addEventListener("start", () => {
	newGoal();
	for(let i = 0; i < MAX_BITS; i++){
		cells[i].addEventListener("hit", handleHit);
	}
	console.log("Game start");
});

function startTimers () {
	let i;
	for(i = 0; i <= activeTimer; i++){
		let timerClassList = timers[i].classList;
		timerClassList.add("full");
	}
	for(; i < NUM_TIMERS; i++){
		let timerClassList = timers[i].classList;
		timerClassList.remove("full");
	}
	setTimeout(() => {timers[activeTimer].classList.remove("full");}, 20);
	timerLoop = setInterval(() => {
		activeTimer--;
		if(activeTimer >= 0){
			timers[activeTimer].classList.remove("full");
		}else{
			clearInterval(timerLoop);
			body.dispatchEvent(timersEvent);
		}
	}, TIMER_TIME);
}

function newGoal () {
	goal = Math.floor(Math.random() * (limit - 1));
	if(goal >= calcPad()){
		goal++;
	}
	goalBanner.innerHTML = goal;
	startTimers();
}

body.addEventListener("goal", () => {
	console.log("GOAL: ", goal);
	clearInterval(timerLoop);
	activeTimer++;
	if(activeTimer >= NUM_TIMERS){
		limit *= 2;
		let cell = pad.querySelector(`[data-limit='${limit}']`);
		if(cell == null){
			console.log("Win");
			for(let i = 0; i < MAX_BITS; i++){
				cells[i].removeEventListener("hit", handleHit);
			}
			timers[NUM_TIMERS - 1].classList.add("full");
			goalBanner.classList.add("wide");
			goalBanner.innerHTML = "YOU WON!!";
			return;
		}else{
			cell.classList.remove("hidden");
			activeTimer = 0;
		}
	}
	newGoal();
});

body.addEventListener("timers", () => {
	if(limit > 2){
		let cell = pad.querySelector(`[data-limit='${limit}']`);
		emptyCell(cell);
		cell.classList.add("hidden");
		limit /= 2;
		activeTimer = NUM_TIMERS - 1;
		newGoal();
	}
});

function handleHit (event) {
	toggleCell(event.target);
	if(checkGoal()){
		body.dispatchEvent(goalEvent);
	}
}

function toggleCell (cell) {
	active = cell;
	cell.dataset.bit = 1 - cell.dataset.bit;
}

function emptyCell (cell) {
	cell.classList.remove("black");
	cell.dataset.bit = 0;
}

function calcPad () {
	let n = 0;
	for(let i = 0; i < MAX_BITS; i++){
		n *= 2;
		n += + cells[i].dataset.bit;
	}

	return n;
}

function checkGoal () {
	return calcPad() == goal;
}

body.addEventListener("touchmove", (event) => {
	const cell = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
	if(cell.tagName != "BUTTON" || cell.classList.contains("result")){
		active = cell;
		return;
	}
	if(cell == active){
		return;
	}
	cell.dispatchEvent(hitEvent);
});
body.addEventListener("mouseover", (event) => {
	const cell = document.elementFromPoint(event.clientX, event.clientY);
	if(cell.tagName != "BUTTON" || cell.classList.contains("result")){
		active = cell;
		return;
	}
	if(cell == active){
		return;
	}
	if(event.buttons == 0){
		return;
	}
	cell.dispatchEvent(hitEvent);
});
body.addEventListener("pointerdown", (event) => {
	event.preventDefault();
	const cell = document.elementFromPoint(event.clientX, event.clientY);
	if(cell.tagName != "BUTTON" || cell.classList.contains("result")){
		active = cell;
		return;
	}
	cell.dispatchEvent(hitEvent);
});