document.addEventListener("endIntro", () => {document.dispatchEvent(startTutorial);});
document.addEventListener("endTutorial", () => {document.dispatchEvent(startInstall);});