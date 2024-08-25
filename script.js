document.getElementById("show-signup").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.remove("hidden");
});

document.getElementById("show-login").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
});

document.getElementById("login").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const inviteCode = document.getElementById("invite-code").value; // Get invite code from login form

  // Retrieve saved credentials and invite code from local storage
  const savedEmail = localStorage.getItem("signupEmail");
  const savedPassword = localStorage.getItem(`signupPassword_${savedEmail}`);
  const validInviteCode = localStorage.getItem("inviteCode"); // Retrieve stored invite code

  // Check if the provided credentials match the saved credentials and invite code
  if (email === savedEmail && password === savedPassword) {
    if (inviteCode === validInviteCode) {
      // Check invite code validity
      window.location.href = "home.html"; // Navigate to home.html in the same tab
    } else {
      showErrorBanner("Invalid invite code.");
    }
  } else {
    showErrorBanner("Incorrect login mail password.");
  }
});

document.getElementById("signup").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  // Check if the password meets the minimum length requirement
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return; // Stop the signup process if the password is too short
  }

  // Set a default invite code
  const defaultInviteCode = "1234";
  localStorage.setItem("inviteCode", defaultInviteCode); // Save the invite code

  // Save signup information in local storage
  localStorage.setItem("signupEmail", email);
  localStorage.setItem(`signupPassword_${email}`, password); // Save password with email as part of the key

  alert(`Signing up with Email: ${email}`);

  // Switch to the login form after successful sign-up
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
});

// Function to display an error banner
function showErrorBanner(message) {
  const banner = document.createElement("div");
  banner.className = "error-banner";
  banner.textContent = message;
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.remove();
  }, 3000); // Remove banner after 3 seconds
}
