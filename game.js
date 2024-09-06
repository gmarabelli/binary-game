/*
 *	Binary Game by GMarabelli
 */
const TIMER_TIME = 5000;
const GOAL_TIME = 500;

const hitEvent = new Event("hit");
const goalEvent = new Event("goal");
const timersEvent = new Event("timers");

let activeCell;
let limit = 2;
let goal = 0;
let timerLoop;

const startGame = new Event("startGame");
const endGame = new Event("endGame");

document.addEventListener("startGame", () => {
	console.log("startGame");
	newGoal();
	cells[MAX_BITS - 1].addEventListener("hit", handleHit);
});

function startTimers(){
	let i;
	for(i = 0; i < activeTimer; i++){
		timers[i].dataset.timer = "full";
	}
	timers[i].dataset.timer = "down";
	i++;
	for(; i < NUM_TIMERS; i++){
		timers[i].dataset.timer = "";
	}
	timerLoop = setInterval(() => {
		activeTimer--;
		if(activeTimer >= 0){
			timers[activeTimer].dataset.timer = "down";
			timers[activeTimer + 1].dataset.timer = "";
		}else{
			clearInterval(timerLoop);
			document.dispatchEvent(timersEvent);
		}
	}, TIMER_TIME);
}

function newGoal(){
	goal = Math.floor(Math.random() * (limit - 1));
	if(goal >= calcPad()){
		goal++;
	}
	goalBanner.innerHTML = goal;
	startTimers();
}

document.addEventListener("goal", () => {
	console.log("GOAL: ", goal);
	clearInterval(timerLoop);
	main.dataset.goal = "ok";
	setTimeout(() => {main.dataset.goal = "";}, GOAL_TIME);
	activeTimer++;
	if(activeTimer >= NUM_TIMERS){
		limit *= 2;
		let cell = pad.querySelector(`[data-limit='${limit}']`);
		if(cell == null){
			for(let i = 0; i < MAX_BITS; i++){
				cells[i].removeEventListener("hit", handleHit);
			}
			timers[NUM_TIMERS - 1].dataset.timer = "full";
			goalBanner.classList.add("wide");
			goalBanner.innerHTML = "YOU WON!!";
			console.log("endGame");
			document.dispatchEvent(endGame);
			return;
		}else{
			cell.classList.remove("hidden");
			cell.addEventListener("hit", handleHit);
			activeTimer = 1;
		}
	}
	newGoal();
});

document.addEventListener("timers", () => {
	if(limit > 2){
		main.dataset.goal = "no";
		setTimeout(() => {main.dataset.goal = "";}, GOAL_TIME);
		let cell = pad.querySelector(`[data-limit='${limit}']`);
		cell.dataset.bit = 0;
		cell.classList.add("hidden");
		cell.removeEventListener("hit", handleHit);
		limit /= 2;
		activeTimer = NUM_TIMERS - 1;
		newGoal();
	}
});

function handleHit(event){
	toggleCell(event.target);
	if(checkGoal()){
		document.dispatchEvent(goalEvent);
	}
}

function toggleCell(cell){
	activeCell = cell;
	cell.dataset.bit = 1 - cell.dataset.bit;
}

function calcPad(){
	let n = 0;
	for(let i = 0; i < MAX_BITS; i++){
		n *= 2;
		n += + cells[i].dataset.bit;
	}

	return n;
}

function checkGoal(){
	return calcPad() == goal;
}

body.addEventListener("touchmove", (event) => {
	const cell = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
	if(cell.tagName != "BUTTON" || cell.classList.contains("result")){
		activeCell = cell;
		return;
	}
	if(cell == activeCell){
		return;
	}
	cell.dispatchEvent(hitEvent);
});
body.addEventListener("mouseover", (event) => {
	const cell = document.elementFromPoint(event.clientX, event.clientY);
	if(cell.tagName != "BUTTON" || cell.classList.contains("result")){
		activeCell = cell;
		return;
	}
	if(cell == activeCell){
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
		activeCell = cell;
		return;
	}
	cell.dispatchEvent(hitEvent);
});