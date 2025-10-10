const formTitle = document.getElementById("form-title");
const authForm = document.getElementById("auth-form");
const submitBtn = document.getElementById("submit-btn");
const toggleBtn = document.getElementById("toggle-btn");
const usernameField = document.getElementById("username-field");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formSubtitle = document.getElementById("form-subtitle");


let isLogin = true;
const users = JSON.parse(localStorage.getItem("dummyUsers")) || {};

function redirectToMainPage() {
  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "index.html"; // home page
}

const skipBtn = document.getElementById("skip-btn");
skipBtn.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "guest");
  window.location.href = "index.html";
});


toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleBtn.textContent = "New user? Sign up";
    formSubtitle.textContent = "Sign in to continue to Kala.ficial"; //update subtitle text
    usernameField.style.display = "none"; // hide username in login
    usernameInput.required = false;
  } else {
    formTitle.textContent = "Sign Up";
    formSubtitle.textContent = "Create your Kala.ficial account"; //update subtitle
    submitBtn.textContent = "Sign Up";
    toggleBtn.textContent = "Already have an account? Log in";
    usernameField.style.display = "block"; // show username in signup
    usernameInput.required = true;
  }
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email.includes("@gmail.com")) {
    Toastify({
      text: "Please use a valid Gmail address.",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4444",
      stopOnFocus: true
    }).showToast();
    return;
  }

  // ⬇️ ONLY APPLY PASSWORD RULES FOR SIGNUP (NEW ACCOUNTS) ⬇️
  if (!isLogin) { // This means it's SIGN UP
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      Toastify({
        text: "Password must include letters and numbers.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4444",
        stopOnFocus: true
      }).showToast();
      return;
    }
  }
  // ⬆️ NO PASSWORD FORMAT VALIDATION FOR LOGIN ⬆️

  if (isLogin) {
    // LOGIN - No password format validation
    if (users[email] && users[email].password === password) {
      Toastify({
        text: `Welcome back, ${users[email].username}! Redirecting...`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#00b09b",
        stopOnFocus: true
      }).showToast();
      setTimeout(redirectToMainPage, 2000);
    } else {
      Toastify({
        text: "Invalid email or password.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4444",
        stopOnFocus: true
      }).showToast();
    }
  } else {
    // SIGNUP - Password rules applied above
    if (users[email]) {
      Toastify({
        text: "Account already exists. Please log in.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4444",
        stopOnFocus: true
      }).showToast();
    } else {
      users[email] = { username, password };
      localStorage.setItem("dummyUsers", JSON.stringify(users));
      Toastify({
        text: `Signup successful! Welcome, ${username}! Redirecting...`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#00b09b",
        stopOnFocus: true
      }).showToast();
      setTimeout(redirectToMainPage, 2000);
    }
  }
});

function handleGoogleResponse(response) {
  const data = parseJwt(response.credential);
  console.log("Google User:", data);

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("userName", data.name);
  localStorage.setItem("userPicture", data.picture);

  Toastify({
    text: `Welcome ${data.name}! Redirecting...`,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#00b09b",
    stopOnFocus: true
  }).showToast();
  setTimeout(() => { window.location.href = "index.html"; }, 2000);
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
