import { db, ref, set, onValue } from "./firebase.js";

let room = "";
let startTime = 0;
let running = false;

// STATUS
function updateStatus(text) {
  document.getElementById("status").innerText = text;
}

// CREATE ROOM
window.createRoom = () => {
  room = Math.floor(Math.random() * 1000).toString();
  document.getElementById("roomId").value = room;
  updateStatus("Room Created: " + room);
};

// JOIN ROOM
window.joinRoom = () => {
  room = document.getElementById("roomId").value;
  updateStatus("Connected to Room " + room);
  listenRoom();
};

// START
window.startRace = () => {
  set(ref(db, "rooms/" + room), {
    started: true,
    time: Date.now()
  });
};

// LISTENER
function listenRoom() {
  const roomRef = ref(db, "rooms/" + room);

  onValue(roomRef, (snapshot) => {
    const data = snapshot.val();

    if (data?.started && !running) {
      running = true;
      startTime = data.time;

      updateStatus("Race Started!");
      startTimer();
      startCamera();
    }
  });
}

// TIMER
function startTimer() {
  const timerEl = document.getElementById("timer");

  setInterval(() => {
    if (running) {
      let t = (Date.now() - startTime) / 1000;
      timerEl.innerText = t.toFixed(2) + "s";
    }
  }, 50);
}

// CAMERA
async function startCamera() {
  const video = document.getElementById("camera");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    updateStatus("Camera Error");
  }
}
