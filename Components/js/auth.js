const formTitle = document.getElementById("form-title");
const authForm = document.getElementById("auth-form");
const submitBtn = document.getElementById("submit-btn");
const toggleBtn = document.getElementById("toggle-btn");
const usernameField = document.getElementById("username-field");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

let isLogin = false;
const users = JSON.parse(localStorage.getItem("dummyUsers")) || {};

function redirectToMainPage() {
  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "index.html"; // home page
}

toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleBtn.textContent = "New user? Sign up";
    usernameField.style.display = "none"; // hide username in login
    usernameInput.required = false;
  } else {
    formTitle.textContent = "Sign Up";
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
    alert("Please use a valid Gmail address.");
    return;
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    alert("Password must include letters and numbers.");
    return;
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
function handleGoogleResponse(response) {
  const data = parseJwt(response.credential);
  console.log("Google User:", data);

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", data.email);
  localStorage.setItem("userName", data.name);
  localStorage.setItem("userPicture", data.picture);

  alert(`Welcome ${data.name}! Redirecting...`);
  window.location.href = "index.html";
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
