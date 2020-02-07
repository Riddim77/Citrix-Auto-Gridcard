function getGridCardDataFromForm() {
  let data = {};
  for (let row = 1; row <= 5; row++) {
    for (let col = 97; col <= 106; col++) {
      let inputData = document.querySelector(
        "#gc-" + row + String.fromCharCode(col)
      ).value;
      inputData = inputData.toUpperCase();
      data[row + String.fromCharCode(col)] = inputData;
    }
  }
  return data;
}

function saveSettings(e) {
  const gcdata = getGridCardDataFromForm();
  browser.storage.local.set({
    gcdata: gcdata
  });
  showMessage("Saved!", "success");
  e.preventDefault();
}

function loadSavedSettings() {
  browser.storage.local.get("gcdata").then(res => {
    const gcdata = res.gcdata;
    for (let inputField in gcdata) {
      document.querySelector("#gc-" + inputField).value =
        gcdata[inputField] || "";
    }
  });
}

function resetGridData(e) {
  const confirmed = window.confirm(
    "Do you really want to delete your gridcard data?"
  );
  if (confirmed) {
    document.querySelector("#gcdata").reset();
    saveSettings();
  }
}

function showMessage(message, type = "") {
  switch (type) {
    case "error":
      message = '<span class="error">' + message + "</span>";
      break;
    case "success":
      message = '<span class="success">' + message + "</span>";
  }
  document.querySelector("#gc-message").innerHTML = message;
  setTimeout(() => {
    document.querySelector("#gc-message").innerHTML = "";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", loadSavedSettings);
document.querySelector("#gcdata").addEventListener("submit", saveSettings);
document.querySelector("#gc-reset").addEventListener("click", resetGridData);
