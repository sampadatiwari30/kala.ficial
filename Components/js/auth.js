// -------------------- DOM Elements --------------------
const formTitle = document.getElementById("form-title");
const authForm = document.getElementById("auth-form");
const submitBtn = document.getElementById("submit-btn");
const toggleBtn = document.getElementById("toggle-btn");
const usernameField = document.getElementById("username-field");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const googleBtn = document.getElementById("google-signin-btn");

// -------------------- State --------------------
let isLogin = false; // false = Sign Up, true = Login
const users = JSON.parse(localStorage.getItem("dummyUsers")) || {};

// -------------------- Redirect Function --------------------
function redirectToMainPage() {
  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "index.html";
}

// -------------------- Toggle Login/Signup --------------------
toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleBtn.textContent = "New user? Sign up";
    usernameField.style.display = "none";
    usernameInput.required = false;
  } else {
    formTitle.textContent = "Sign Up";
    submitBtn.textContent = "Sign Up";
    toggleBtn.textContent = "Already have an account? Log in";
    usernameField.style.display = "block";
    usernameInput.required = true;
  }
});

// -------------------- Handle Login/Signup Form Submission --------------------
authForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email.includes("@gmail.com")) {
    alert("Please use a valid Gmail address.");
    return;
  }

  // Password validation ONLY for signup
  if (!isLogin) {
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      alert("Password must include letters and numbers.");
      return;
    }
  }

  if (isLogin) {
    // LOGIN
    if (users[email] && users[email].password === password) {
      alert(`Welcome back, ${users[email].username}! Redirecting...`);
      redirectToMainPage();
    } else {
      alert("Invalid email or password.");
    }
  } else {
    // SIGNUP
    if (users[email]) {
      alert("Account already exists. Please log in.");
    } else {
      users[email] = { username, password };
      localStorage.setItem("dummyUsers", JSON.stringify(users));
      alert(`Signup successful! Welcome, ${username}! Redirecting...`);
      redirectToMainPage();
    }
  }
});

// -------------------- Firebase Google Sign-In --------------------
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth();
const provider = new GoogleAuthProvider();

googleBtn.addEventListener("click", async () => {
  googleBtn.disabled = true; // Prevent multiple clicks
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.displayName);
    localStorage.setItem("userPicture", user.photoURL);

    alert(`Welcome ${user.displayName}! Redirecting...`);
    redirectToMainPage();
  } catch (error) {
    console.error("Google sign-in error:", error);

    if (error.code === "auth/cancelled-popup-request") {
      alert("Popup was canceled. Please try again.");
    } else if (error.code === "auth/unauthorized-domain") {
      alert("This domain is not authorized. Add your domain in Firebase console.");
    } else {
      alert("Sign-in failed. Check console for details.");
    }
  } finally {
    googleBtn.disabled = false;
  }
});
