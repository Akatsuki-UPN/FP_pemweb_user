import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getDatabase,
  ref as dbRef,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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
  appId: "1:460540654838:web:b34b57e76e67c815dee8d7",
  measurementId: "G-L52V9YZDES",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);
const auth = getAuth(app);

const complaintForm = document.getElementById("complaintForm");

complaintForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const description = e.target.description.value;
  const photo = e.target.photo.files[0];

  if (!name || !description || !photo) {
    displayError("Please fill in all fields and upload a photo.");
    return;
  }

  // Check if user is logged in
  const user = auth.currentUser;
  if (!user) {
    displayError("You must be logged in to submit a complaint.");
    return;
  }

  try {
    // Upload photo to Firebase Storage
    const photoRef = storageRef(
      storage,
      `complaints/${user.uid}/${photo.name}`
    );
    await uploadBytes(photoRef, photo);
    const photoURL = await getDownloadURL(photoRef);

    // Save complaint data to Realtime Database
    const newComplaintRef = dbRef(db, `complaints/${user.uid}/${Date.now()}`);
    await set(newComplaintRef, {
      name,
      description,
      photoURL,
      timestamp: new Date().toISOString(),
      userId: user.uid,
    });

    alert("Complaint submitted successfully!");
    complaintForm.reset();
  } catch (error) {
    console.error("Error submitting complaint:", error);
    displayError("Error submitting complaint: " + error.message);
  }
});

function displayError(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.innerText = message;
}

// Check login status and redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "loginmenu.html"; // Redirect to login page if not logged in
  }
});
