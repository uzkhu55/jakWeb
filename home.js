document.addEventListener("DOMContentLoaded", function () {
  const homeSection = document.getElementById("home");
  const menuSection = document.getElementById("menu");
  const profileSection = document.getElementById("profile");
  const homeIntro = document.getElementById("home-intro");

  const homeBtn = document.getElementById("home-btn");
  const menuBtn = document.getElementById("menu-btn");
  const profileBtn = document.getElementById("profile-btn");

  const changePhotoBtn = document.getElementById("change-photo-btn");
  const changePasswordForm = document.getElementById("change-password-form");
  const logOffBtn = document.getElementById("log-off-btn");

  const addQuestionsBtn = document.getElementById("add-questions-btn");
  const leaderboardBtn = document.getElementById("leaderboard-btn");
  const playQuizBtn = document.getElementById("play-quiz-btn");
  const menuBody = document.getElementById("menu-body");

  function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Hide the home-intro section when switching sections
    homeIntro.classList.add("hidden");

    // Show the selected section
    const sectionToShow = document.getElementById(sectionId);
    sectionToShow.classList.add("active");

    // Show home-intro when switching back to home
    if (sectionId === "home") {
      homeIntro.classList.remove("hidden");
    }
  }

  function updateMenuBody(content) {
    menuBody.innerHTML = content;
  }

  homeBtn.addEventListener("click", function () {
    showSection("home");
  });

  menuBtn.addEventListener("click", function () {
    showSection("menu");
  });

  profileBtn.addEventListener("click", function () {
    showSection("profile");
  });

  addQuestionsBtn.addEventListener("click", function () {
    updateMenuBody(`
      <div class="add-question-container">
        <h3 class="add-question-title">Add Questions</h3>
        <form id="add-question-form" class="add-question-form">
          <div class="form-group">
            <label for="question" class="form-label">Question:</label>
            <input type="text" id="question" name="question" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="answer" class="form-label">Answer:</label>
            <input type="text" id="answer" name="answer" class="form-input" required>
          </div>
          <button type="submit" class="submit-button">Submit Question</button>
        </form>
      </div>
    `);

    // Add event listener for form submission
    const form = document.getElementById("add-question-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const question = document.getElementById("question").value;
      const answer = document.getElementById("answer").value;

      // Get existing questions from local storage
      let questions = JSON.parse(localStorage.getItem("questions")) || [];

      // Add the new question and answer to the array
      questions.push({ question, answer });

      // Save the updated array back to local storage
      localStorage.setItem("questions", JSON.stringify(questions));

      // Show the success modal
      showSuccessModal("Question added successfully!");

      // Optionally, clear the form fields
      form.reset();
    });

    function showSuccessModal(message) {
      const modal = document.getElementById("success-modal");
      const modalMessage = document.getElementById("modal-message");
      const closeBtn = document.querySelector(".close-btn");

      modalMessage.textContent = message;
      modal.classList.remove("hidden");

      closeBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
      });

      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.classList.add("hidden");
        }
      });
    }
  });

  leaderboardBtn.addEventListener("click", function () {
    // Retrieve the leaderboard from local storage or initialize it as an empty array
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    // Sort the leaderboard in descending order by score
    leaderboard.sort((a, b) => b.points - a.points);

    // Generate HTML for the leaderboard with delete buttons
    const leaderboardHTML = leaderboard
      .map(
        (entry, index) => `
      <li class="leaderboard-item">
        <span class="leaderboard-rank">${index + 1}</span>
        <span class="leaderboard-player">${entry.name}</span>
        <span class="leaderboard-score">${entry.points} points</span>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </li>
    `
      )
      .join("");

    // Update the menu body with the leaderboard
    updateMenuBody(`
      <div class="leaderboard-container">
        <h3 class="leaderboard-title">Leaderboard</h3>
        <ul class="leaderboard-list">
          ${leaderboardHTML}
        </ul>
      </div>
    `);

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");

        // Remove the player from the leaderboard
        leaderboard.splice(index, 1);

        // Save the updated leaderboard back to local storage
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        // Re-render the leaderboard
        leaderboardBtn.click();
      });
    });
  });
  playQuizBtn.addEventListener("click", function () {
    updateMenuBody(`
    <div class="quiz-container">
      <h3>Play Quiz</h3>
      <p>Get ready to start the quiz!</p>
      <button id="start-quiz-btn" class="start-quiz-button">Start Quiz</button>
      <div id="quiz-content" class="quiz-content hidden"></div>
      <div id="feedback-banner" class="feedback-banner hidden"></div>
    </div>
  `);

    const startQuizBtn = document.getElementById("start-quiz-btn");
    const quizContent = document.getElementById("quiz-content");
    const feedbackBanner = document.getElementById("feedback-banner");

    startQuizBtn.addEventListener("click", function () {
      // Retrieve questions from local storage
      let questions = JSON.parse(localStorage.getItem("questions")) || [];
      let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

      if (questions.length === 0) {
        quizContent.innerHTML = `<p>No questions available. Please add some questions first.</p>`;
        quizContent.classList.remove("hidden");
        return;
      }

      // Display a random question
      displayRandomQuestion();

      function displayRandomQuestion() {
        // Select a random question
        const randomIndex = Math.floor(Math.random() * questions.length);
        const questionObj = questions[randomIndex];

        quizContent.innerHTML = `
        <p class="quiz-question">${questionObj.question}</p>
        <input type="text" id="user-answer" placeholder="Your answer" class="quiz-input">
        <button id="submit-answer-btn" class="submit-answer-button">Submit Answer</button>
      `;
        quizContent.classList.remove("hidden");

        document
          .getElementById("submit-answer-btn")
          .addEventListener("click", function () {
            const userAnswer = document
              .getElementById("user-answer")
              .value.trim();

            if (userAnswer.toLowerCase() === questionObj.answer.toLowerCase()) {
              showFeedbackBanner("Correct!", true);

              // Display name input form
              setTimeout(() => {
                quizContent.innerHTML = `
                <div class="name-input-container">
                  <p class="congratulations-message">Congratulations!</p>
                  <p class="name-prompt">Please enter your name to add your score to the leaderboard:</p>
                  <input type="text" id="player-name" placeholder="Your name" class="name-input">
                  <button id="submit-name-btn" class="submit-name-button">Submit Name</button>
                </div>
              `;
                const nameInputContainer = document.querySelector(
                  ".name-input-container"
                );

                document
                  .getElementById("submit-name-btn")
                  .addEventListener("click", function () {
                    const playerName = document
                      .getElementById("player-name")
                      .value.trim();
                    if (playerName) {
                      // Check if player already exists in leaderboard
                      const playerIndex = leaderboard.findIndex(
                        (player) =>
                          player.name.toLowerCase() === playerName.toLowerCase()
                      );

                      if (playerIndex !== -1) {
                        // Player exists, update their score
                        leaderboard[playerIndex].points += 1000;
                      } else {
                        // Player does not exist, add new entry
                        leaderboard.push({ name: playerName, points: 1000 });
                      }

                      // Save the updated leaderboard back to local storage
                      localStorage.setItem(
                        "leaderboard",
                        JSON.stringify(leaderboard)
                      );

                      // Show the success modal
                      showSuccessModal(
                        "Your score has been added to the leaderboard!"
                      );

                      // Hide the name input container
                      nameInputContainer.classList.add("hidden");

                      // Optionally, you can clear the form fields
                      document.getElementById("player-name").value = "";
                    }
                    // Optionally, you can display another question or handle other actions here
                  });
              }, 2000); // 2-second delay before showing name input
            } else {
              showFeedbackBanner(
                `Incorrect! The correct answer was: ${questionObj.answer}`,
                false
              );
              setTimeout(() => displayRandomQuestion(), 2000); // 2-second delay before the next question
            }
          });
      }

      function showFeedbackBanner(message, isCorrect) {
        feedbackBanner.innerHTML = `<p>${message}</p>`;
        feedbackBanner.className = `feedback-banner ${
          isCorrect ? "correct" : "incorrect"
        }`;
        feedbackBanner.classList.remove("hidden");

        setTimeout(() => feedbackBanner.classList.add("hidden"), 2000); // Hide after 2 seconds
      }

      function showSuccessModal(message) {
        const modal = document.getElementById("success-custom-modal");
        const modalMessage = document.getElementById("custom-modal-message");
        const closeBtn = document.querySelector(".custom-close-btn");

        modalMessage.textContent = message;
        modal.classList.remove("hidden");

        closeBtn.addEventListener("click", function () {
          modal.classList.add("hidden");
        });

        window.addEventListener("click", function (event) {
          if (event.target === modal) {
            modal.classList.add("hidden");
          }
        });
      }
    });
  });

  logOffBtn.addEventListener("click", function () {
    // Implement log off functionality
    alert("Logged off successfully.");

    // Redirect to the login page
    window.location.href = "index.html"; // Replace "login.html" with the actual path to your login page
  });

  // Show the Home section by default
  showSection("home");
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleCurrentPasswordBtn = document.getElementById(
    "toggle-current-password"
  );
  const toggleNewPasswordBtn = document.getElementById("toggle-new-password");
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");

  function togglePasswordVisibility(input, button) {
    if (input.type === "password") {
      input.type = "text";
      button.textContent = "◎"; // Change icon to indicate password is visible
    } else {
      input.type = "password";
      button.textContent = "◉"; // Change icon back to indicate password is hidden
    }
  }

  toggleCurrentPasswordBtn.addEventListener("click", function () {
    togglePasswordVisibility(currentPasswordInput, toggleCurrentPasswordBtn);
  });

  toggleNewPasswordBtn.addEventListener("click", function () {
    togglePasswordVisibility(newPasswordInput, toggleNewPasswordBtn);
  });
});
document
  .getElementById("change-password-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const email = document.getElementById("email").value; // Assuming you have an email input field
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;

    // Check password length
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return; // Exit the function if the password does not meet the requirement
    }

    // Form a dynamic key using the email
    const key = `signupPassword_${email}`;

    // Retrieve the current value associated with the key
    const storedPassword = localStorage.getItem(key);

    // Check if the current password matches the stored value
    if (currentPassword === storedPassword) {
      // Update the local storage with the new password
      localStorage.setItem(key, newPassword);

      // Clear the input fields
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";

      alert("Password changed successfully.");
    } else {
      alert("Current password is incorrect.");
    }
  });
// Get elements
const changePhotoBtn = document.getElementById("changePhotoBtn");
const photoModal = document.getElementById("photoModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const importPhotoBtn = document.getElementById("importPhotoBtn");
const photoInput = document.getElementById("photoInput");
const profilePic = document.getElementById("profile-pic");

// Open the modal when the change photo button is clicked
changePhotoBtn.addEventListener("click", () => {
  photoModal.classList.remove("hidden");
});

// Close the modal when the close button is clicked
closeModalBtn.addEventListener("click", () => {
  photoModal.classList.add("hidden");
});

// Handle importing the photo
importPhotoBtn.addEventListener("click", () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePic.src = e.target.result; // Set the profile pic src to the imported image
    };
    reader.readAsDataURL(file);
    photoModal.classList.add("hidden"); // Close the modal after importing
  } else {
    alert("Please select a photo to import.");
  }
});
