import { loaderUrl, config, canvas, loadingBar } from "./unityconfig";
import * as handTrack from "handtrackjs";

var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  })
    .then((unityInstance) => {
      CameraSetup();
      loadingBar.style.display = "none";
      fullscreenButton.onclick = () => {
        unityInstance.SetFullscreen(1);
      };
    })
    .catch((message) => {
      alert(message);
    });
};
document.body.appendChild(script);

const defaultParams = {
  flipHorizontal: true,
  outputStride: 16,
  imageScaleFactor: 1,
  maxNumBoxes: 20,
  iouThreshold: 0.2,
  scoreThreshold: 0.6,
  modelType: "ssd320fpnlite",
  modelSize: "large",
  bboxLineWidth: "2",
  fontSize: 17,
};

async function CameraSetup() {

  const video = document.getElementById("videoid");
  handTrack.startVideo(video);

  video.addEventListener("loadeddata", async () => {
    const model = await handTrack.load(defaultParams);
    const width = video.getAttribute("width");
    const height = video.getAttribute("height");

    setInterval(async () => {
      const predictions = await model.detect(video);
      const filterFaces = predictions.filter(e => e.label != "face")
      const map = filterFaces.map(e => {
        let xCenter = (e.bbox[0] + e.bbox[2]) / 2;
        xCenter = e.bbox[0] / width;
        let yCenter = (e.bbox[1] + e.bbox[3]) / 2;
        yCenter = 1 - e.bbox[1] / height;
        return `${xCenter}, ${yCenter}`
      })
      console.log(map);
    }, 200 )

    video.style.width = width / 2 + "px";
    video.style.height = height / 2 + "px";
  })
}

function Test() {
  console.log("CAMERA STUFF WORKING")
}