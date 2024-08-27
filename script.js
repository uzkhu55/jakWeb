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
  const inviteCode = document.getElementById("invite-code").value;

  // Retrieve the users array from local storage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find the user object that matches the provided email and password
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    if (inviteCode === user.inviteCode) {
      // Check invite code validity
      window.location.href = "home.html"; // Navigate to home.html in the same tab
    } else {
      showErrorBanner("Invalid invite code.");
    }
  } else {
    showErrorBanner("Incorrect email or password.");
  }
});

function showErrorBanner(message) {
  // Implement your function to display error messages to the user
  alert(message); // For simplicity, we're using an alert here
}

document.getElementById("signup").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const birthday = document.getElementById("signup-birthday").value;

  // Check if the password meets the minimum length requirement
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return; // Stop the signup process if the password is too short
  }

  // Set a default invite code
  const defaultInviteCode = "1234";
  localStorage.setItem("inviteCode", defaultInviteCode); // Save the invite code

  // Save signup information in local storage
  const user = {
    email: email,
    password: password,
    birthday: birthday,
    inviteCode: defaultInviteCode,
  };

  // Retrieve existing users array from local storage or create a new one
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Add the new user to the array
  users.push(user);

  // Save the updated users array back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  // Retrieve existing birthdays array from local storage or create a new one
  const birthdays = JSON.parse(localStorage.getItem("birthdays")) || [];

  // Add the new user's birthday and email to the array
  birthdays.push({
    birthday: birthday,
    email: email,
  });

  // Save the updated birthdays array back to local storage
  localStorage.setItem("birthdays", JSON.stringify(birthdays));

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
