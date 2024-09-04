document.addEventListener("endIntro", () => {document.dispatchEvent(startTutorial);});
document.addEventListener("endTutorial", () => {document.dispatchEvent(startInstall);});
document.addEventListener("endInstall", () => {document.dispatchEvent(startGame);});