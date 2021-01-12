const { ipcRenderer } = require("electron");

let activeMode = undefined;
let displayedStatus = "";
let displayedImage = "";
let rotation = 0;

const setMode = (newMode) => {
  if (activeMode === newMode) {
    return;
  }

  switch (newMode) {
    case "status":
      document.body.innerHTML = `
      <article>
        <p class="status" id="status">${displayedStatus}</p>
      </article>
      `;
      break;
    case "image":
      document.body.innerHTML = `
        <div id="image"/>
      `;
      break;
    default:
      throw new Error(`Unknown mode: ${newMode}`);
  }

  activeMode = newMode;
};

const setStatus = (status) => {
  if (displayedStatus === status) {
    return;
  }

  document.getElementById("status").innerHTML = status;
  displayedStatus = status;
};

const setImageStyle = () => {
  let style = `
    background: #444444 url(data:image/png;base64,${displayedImage}) center/contain no-repeat;
  `;
  if (rotation === 90) {
    style += `
      transform: rotate(${rotation}deg) translateY(-100%);
      transform-origin: top left;
      height: 100vw;
      width: 100vh;
    `;
  } else if (rotation === 180) {
    style += `
      transform: rotate(${rotation}deg) translateX(-100%) translateY(-100%);
      transform-origin: top left;
      height: 100vh;
      width: 100vw;
    `;
  } else if (rotation === 270) {
    style += `
      transform: rotate(${rotation}deg) translateX(-100%) ;
      transform-origin: top left;
      height: 100vw;
      width: 100vh;
    `;
  } else {
    style += `
      height: 100vh;
      width: 100vw;
    `;
  }
  document.getElementById("image").setAttribute("style", style);
};

const setImage = (image) => {
  if (displayedImage === image) {
    return;
  }

  displayedImage = image;
  setImageStyle();
};

const rotate90 = () => {
  if (activeMode !== "image") {
    return;
  }

  rotation += 90;
  if (rotation > 270) {
    rotation = 0;
  }

  setImageStyle();
};

document.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.send("window-ready");
});

ipcRenderer.on("show-status", (event, status) => {
  setMode("status");
  setStatus(status);
});

ipcRenderer.on("show-image", (event, image) => {
  setMode("image");
  setImage(image);
});

document.addEventListener("click", () => {
  rotate90();
});
