(function() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  document.getElementById("response").value = "";

  const challengeElement = document.querySelector("#dialogueStr");
  if (!challengeElement) {
    alert("Challenge string not found!");
    return;
  }

  function getChallengeFromPage() {
    var matches = challengeElement.innerHTML.match(/[A-Z][1-5](?=\])/g);
    var result = matches.map(function(match) {
      return match
        .split("")
        .reverse()
        .join("")
        .toLowerCase();
    });
    return result;
  }

  async function getGridcardData(challenge) {
    const res = await browser.storage.local.get("gcdata");
    const fields = res["gcdata"];
    let result = "";
    for (gcField in challenge) {
      result += fields[challenge[gcField]] || "";
    }
    return result.length === 6 ? result : false;
  }

  function writeResultToPage(result) {
    document.querySelector("#response").value = result;
  }

  function getButtonStyle(imgName) {
    const iconUrl = browser.extension.getURL("icons/" + imgName + ".png");
    const style =
      "background: rgb(102, 102, 102) url(" +
      iconUrl +
      ") no-repeat scroll 50% 50%; background-size: 40px 40px; width: 42px; height: 42px; margin-left: 0.2rem; min-width: 42px; display: block; float: right; border: 0; cursor: pointer;";
    return style;
  }

  function addButtonsToPage() {
    let settingsBtn = document.createElement("button");
    settingsBtn.type = "button";
    settingsBtn.style = getButtonStyle("settings-48w");
    let solveBtn = document.createElement("button");
    solveBtn.type = "button";
    solveBtn.style = getButtonStyle("grid-48w");
    const container = document.querySelector("#response").parentNode;
    container.appendChild(settingsBtn);
    container.appendChild(solveBtn);
    solveBtn.addEventListener("click", ev => {
      solveChallenge();
      ev.preventDefault();
    });
    settingsBtn.addEventListener("click", ev => {
      browser.runtime.sendMessage({ action: "openOptionsPage" });
      ev.preventDefault();
    });
  }

  async function solveChallenge() {
    const challenge = getChallengeFromPage();
    const challengeResult = await getGridcardData(challenge);
    if (!challengeResult) {
      alert(
        "Gridcard data is missing, please add data in AddOn preferences first."
      );
      browser.runtime.sendMessage({ action: "openOptionsPage" });
    } else {
      writeResultToPage(challengeResult);
    }
  }
  addButtonsToPage();
})();
