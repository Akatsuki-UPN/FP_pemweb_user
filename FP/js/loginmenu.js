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
  const loginType = e.target.loginType.value;

  if (loginType === "admin") {
    if (!validateUsername(identifier)) {
      displayError("Please enter a valid username.");
      return;
    }
  } else {
    if (!validateEmail(identifier)) {
      displayError("Please enter a valid email address.");
      return;
    }
  }

  if (password.length < 6) {
    displayError("Password must be at least 6 characters long.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      identifier,
      password
    );
    const user = userCredential.user;
    const isAdmin = await checkIfAdmin(user);
    if (loginType === "admin" && !isAdmin) {
      displayError("You do not have admin privileges.");
      return;
    }
    window.location.href = "index.html";
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

function validateUsername(username) {
  return username.length > 0;
}
