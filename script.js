/*
 *	Binary Game by GMarabelli
 */
const START_TIME = 2000;
const TIMER_TIME = 5000;
const MAX_BITS = 8;
const NUM_TIMERS = 8;

const body = document.body;
const goalBanner = document.getElementById("goal");
const timersView = document.getElementById("timers");
const pad = document.getElementById("pad");

const hitEvent = new Event("hit");
const goalEvent = new Event("goal");
const timersEvent = new Event("timers");

let active;
let limit = 2;
let activeTimer = 3;
let goal = 0;
let timerLoop;

for(let i = 0; i < MAX_BITS; i++){
	let cell = document.createElement("button");
	pad.append(cell);
	cell.innerHTML = "0";
	cell.dataset.limit = Math.pow(2, MAX_BITS - i);
	if(i < MAX_BITS - 1){
		cell.classList.add("hidden");
	}
}

for(let i = 0; i < NUM_TIMERS; i++){
	let circleSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	timersView.append(circleSVG);
	circleSVG.innerHTML = '<circle cx="50%" cy="50%" r="45%" pathLength="1"></circle>';
}

const cells = document.getElementById("pad").children;
const timers = timersView.children;

startSequence();

function startSequence () {
	let i;
	for(i = 0; i <= activeTimer; i++){
		let timerClassList = timers[i].classList;
		timerClassList.add("animate-start");
		setTimeout(() => {timerClassList.add("full");}, 1);
		setTimeout(() => {
			timerClassList.remove("animate-start");
			timerClassList.add("animate");
		}, START_TIME);
	}

	setTimeout(newGoal, START_TIME);
	setTimeout(() => {
		for(let i = 0; i < MAX_BITS; i++){
			cells[i].addEventListener("hit", handleHit);
		}
		console.log("Game start");
	}, START_TIME);
}

function startTimers () {
	let i;
	for(i = 0; i <= activeTimer; i++){
		let timerClassList = timers[i].classList;
		timerClassList.add("animate");
		timerClassList.add("full");
	}
	for(; i < NUM_TIMERS; i++){
		let timerClassList = timers[i].classList;
		timerClassList.remove("animate");
		setTimeout(() => {timerClassList.remove("full");}, 1);
	}
	setTimeout(() => {timers[activeTimer].classList.remove("full");}, 10);
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
			console.log("YOU WON!!");
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
	cell.classList.toggle("black");
	cell.innerHTML = 1 - cell.innerHTML;
}

function emptyCell (cell) {
	cell.classList.remove("black");
	cell.innerHTML = 0;
}

function calcPad () {
	let n = 0;
	for(let i = 0; i < MAX_BITS; i++){
		n *= 2;
		n += + cells[i].innerHTML;
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