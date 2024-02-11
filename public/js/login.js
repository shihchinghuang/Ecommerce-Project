const BASE_URL = "http://localhost:3000/api/user";

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");

const handleSubmit = async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const email = emailInput.value;

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const { token } = await response.json();

    // After login, set the token in cookies
    document.cookie = `token=${token}; path=/`;
    window.location.href = "/";
  } catch (err) {
    alert("Error: " + err.message);
    if (err.message === "Password incorrect.") {
      passwordInput.value = "";
    } else {
      usernameInput.value = "";
      passwordInput.value = "";
      emailInput.value = "";
    }
  }
};

form.addEventListener("submit", handleSubmit);
