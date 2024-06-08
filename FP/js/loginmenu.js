import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6d1UgqVmsuaX2kGVGxg2CPWUOv3wQ2X4",
  authDomain: "dbsipajuli.firebaseapp.com",
  projectId: "dbsipajuli",
  storageBucket: "dbsipajuli.appspot.com",
  messagingSenderId: "460540654838",
  appId: "1:460540654838:web:b34b57e76e67c815dee8d7",
  measurementId: "G-L52V9YZDES",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

async function checkIfAdmin(user) {
  const docRef = doc(db, "adminUsers", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
// Handle form submission
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const identifier = e.target.identifier.value;
  const password = e.target.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      identifier,
      password
    );
    const user = userCredential.user;

    // Check if the user is admin@gmail.com with password 1234567
    if (identifier === "admin@gmail.com" && password === "1234567") {
      // Redirect to dashboard.html directly
      window.location.href = "dashboard.html";
      return; // Exit the function to prevent further execution
    }

    const isAdmin = await checkIfAdmin(user);
    if (!isAdmin) {
      displayError("You do not have admin privileges.");
      return;
    }
    // Redirect to dashboard.html if user is an admin
    window.location.href = "dashboard.html";
  } catch (error) {
    displayError("Login failed: " + error.message);
  }
});

// Handle Google login
const googleLoginBtn = document.getElementById("google-login-btn");
googleLoginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in with Google:", user);
      window.location.href = "index.html";
    })
    .catch((error) => {
      displayError("Google login failed: " + error.message);
    });
});

function displayError(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerText = message;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
