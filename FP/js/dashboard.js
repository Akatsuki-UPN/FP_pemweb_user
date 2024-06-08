import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js"; // Import Firebase Storage
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
const db = getDatabase(app);
const storage = getStorage(app); // Get Firebase Storage reference

// Function to fetch and display users from Firebase Authentication
function fetchUsers() {
  const usersRef = ref(db, "users"); // Assuming you have a "users" collection in Firestore
  onValue(usersRef, (snapshot) => {
    const usersData = snapshot.val();
    if (usersData) {
      const usersTableBody = document.getElementById("usersTableBody");
      usersTableBody.innerHTML = ""; // Clear existing table rows

      for (const userId in usersData) {
        const userData = usersData[userId];
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${userId}</td>
          <td>${userData.name}</td>
          <td>${userData.email}</td>
          <!-- Add more cells as needed -->
        `;
        usersTableBody.appendChild(row);
      }
    }
  });
}

// Function to show sections based on sidebar clicks
window.showSection = (sectionId) => {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
};

// Fetch and display data
function fetchData() {
  const complaintsRef = ref(db, "complaints");
  onValue(complaintsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const complaintsTableBody = document.getElementById(
        "complaintsTableBody"
      );
      complaintsTableBody.innerHTML = "";

      let totalComplaints = 0;
      let sortedComplaints = [];

      for (const userId in data) {
        for (const complaintId in data[userId]) {
          const complaint = data[userId][complaintId];
          sortedComplaints.push({
            id: complaintId,
            userId: userId, // Add user ID here
            timestamp: complaint.timestamp,
            name: complaint.name,
            description: complaint.description,
            photoURL: complaint.photoURL,
          });
          totalComplaints++;
        }
      }

      // Sort complaints by timestamp (newest to oldest)
      sortedComplaints.sort((a, b) => b.timestamp - a.timestamp);

      sortedComplaints.forEach((complaint) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${complaint.id}</td>
          <td>${new Date(complaint.timestamp).toLocaleString()}</td>
          <td>${complaint.userId}</td> <!-- Display user ID -->
          <td>${complaint.name}</td>
          <td>${complaint.description}</td>
          <td><img src="${complaint.photoURL}" alt="Complaint Image"></td>
        `;
        complaintsTableBody.appendChild(row);
      });

      document.getElementById(
        "totalComplaints"
      ).innerText = `Total: ${totalComplaints}`;
    }
  });
}

/// Function to sort complaints based on selected option
function sortComplaints() {
  const sortSelect = document.getElementById("sortSelect");
  const selectedOption = sortSelect.value;

  const complaintsTableBody = document.getElementById("complaintsTableBody");
  const rows = complaintsTableBody.querySelectorAll("tr");

  const sortedRows = Array.from(rows)
    .slice(1)
    .sort((a, b) => {
      const aTimestamp = new Date(a.cells[1].innerText).getTime();
      const bTimestamp = new Date(b.cells[1].innerText).getTime();

      if (selectedOption === "newestFirst") {
        return bTimestamp - aTimestamp; // Sort newest first
      } else {
        return aTimestamp - bTimestamp; // Sort oldest first
      }
    });

  complaintsTableBody.innerHTML = ""; // Clear existing rows

  const headerRow = rows[0]; // Get header row
  complaintsTableBody.appendChild(headerRow); // Append header row back

  sortedRows.forEach((row) => {
    complaintsTableBody.appendChild(row); // Append sorted rows
  });
}

// Check authentication and fetch data including users
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchData();
    fetchUsers(); // Fetch and display users
  } else {
    window.location.href = "loginmenu.html";
  }
});

// Example usage to upload an image and display its URL
const fileInput = document.getElementById("fileInput"); // Assuming you have a file input in your HTML
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const imageURL = await uploadImage(file);
  console.log("Image URL:", imageURL); // You can use this URL to display the image in your dashboard
});
