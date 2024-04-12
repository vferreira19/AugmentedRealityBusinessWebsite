const nailDesignImg = new Image();
nailDesignImg.src = 'static/nail.png';
 

const video3 = document.getElementsByClassName('input_video3')[0];
const out3 = document.getElementsByClassName('output3')[0];

const controlsElement3 = document.getElementsByClassName('control3')[0];

const canvasCtx3 = out3.getContext('2d');
const fpsControl = new FPS();


// Function to draw the landmarks and overlay the nail design
function onResultsHands(results) {
  // Clear the canvas
  canvasCtx3.clearRect(0, 0, out3.width, out3.height);

  // Draw the background image or video frame
  canvasCtx3.drawImage(
      results.image, 0, 0, out3.width, out3.height
  );

  if (results.multiHandLandmarks && results.multiHandedness) {
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
          const classification = results.multiHandedness[index];
          const isRightHand = classification.label === 'Right';
          const landmarks = results.multiHandLandmarks[index];

          // Draw the approximate nail positions for each finger
          const nailLandmarks = [
              landmarks[4],  // Thumb tip
              landmarks[8],  // Index finger tip
              landmarks[12], // Middle finger tip
              landmarks[16], // Ring finger tip
              landmarks[20]  // Little finger (pinky) tip
          ];

          // Draw the nail landmarks
          drawLandmarks(canvasCtx3, nailLandmarks, {
              color: isRightHand ? '#00FF00' : '#FF0000',
              fillColor: isRightHand ? '#FF0000' : '#00FF00',
              radius: (x) => {
                  return lerp(x.from.z, -0.15, .1, 10, 1);
              }
          });

          // Draw the nail design image on top of each nail landmark
          for (const nailLandmark of nailLandmarks) {
              // Calculate the position and size of the nail design image
              const imageSize = 400; // Adjust the size of the nail design image as needed
              const imageX = nailLandmark.x - (imageSize / 2);
              const imageY = nailLandmark.y - (imageSize / 2);

              // Draw the nail design image on the canvas at the calculated position
              // canvasCtx3.drawImage(nailDesignImg, imageX, imageY, imageSize, imageSize);
          }
      }
  }

}



const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});

hands.onResults(onResultsHands);

const camera = new Camera(video3, {
  onFrame: async () => {
    await hands.send({image: video3});
  },
  width: 550,
  height: 480
});
camera.start();


    
  