import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6d1UgqVmsuaX2kGVGxg2CPWUOv3wQ2X4",
  authDomain: "dbsipajuli.firebaseapp.com",
  databaseURL:
    "https://dbsipajuli-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dbsipajuli",
  storageBucket: "dbsipajuli.appspot.com",
  messagingSenderId: "460540654838",
  appId: "1:460540654838:web:2a67208d8b4eb130dee8d7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    document.getElementById("username").innerText =
      user.displayName || "No Name";
    document.getElementById("userEmail").innerText = user.email;
    document.getElementById("profile").src =
      user.photoURL || "default_profile_picture.jpg";
  } else {
    // User is signed out, redirect to login page
    window.location.href = "loginmenu.html";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  auth
    .signOut()
    .then(() => {
      window.location.href = "loginmenu.html"; // Redirect to login page
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});
