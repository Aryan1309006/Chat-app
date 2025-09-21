const socket = io();
const username = prompt("Enter your name:") || "Anonymous";

const form = document.getElementById("chat-form");
const input = document.getElementById("msg");
const messages = document.getElementById("messages");
const notificationSound = document.getElementById("notification-sound");

// Request browser notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit("chatMessage", { username, message });
    input.value = "";
  }
});

socket.on("chatMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("chat-message");

  if (data.username === username) {
    div.classList.add("sent");
  } else {
    div.classList.add("received");

    // Play sound for incoming messages
    notificationSound.play();

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(`${data.username} says:`, { body: data.message });
    }
  }

  div.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
