document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const closeMenuBtn = document.getElementById("close-menu-btn");
  const navbar = document.querySelector(".navbar");

  menuBtn.addEventListener("click", () => {
    navbar.classList.add("show-mobile-menu");
  });

  closeMenuBtn.addEventListener("click", () => {
    navbar.classList.remove("show-mobile-menu");
  });

  // Check login status and update navbar accordingly
  const loginLogoutBtn = document.getElementById("loginLogoutBtn");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      loginLogoutBtn.innerHTML = '<a href="#" id="logoutBtn">Logout</a>';
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", () => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            alert("Logged out successfully.");
            window.location.reload(); // Refresh page after logout
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      });
    } else {
      loginLogoutBtn.innerHTML = '<a href="loginmenu.html">Login</a>';
    }
  });
});
