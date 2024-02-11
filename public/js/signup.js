const BASE_URL = "http://localhost:3000/api/user";

const form = document.getElementById("signup-form");

const handleSubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const role = document.getElementById("role").value;

  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        passwordConfirm,
        role,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      alert(`Error Signing Up: ${data.message}`);
      return;
    }

    const { token } = await response.json();

    // Set the token as a cookie
    document.cookie = `token=${token}; path=/`;

    // Redirect to home page after successful signup
    if (role === "user") {
      window.location.href = "/";
    } else {
      window.location.href = "/admin";
    }
  } catch (err) {
    console.error(err.message);
    alert("An unexpected error occurred.");
  }
};

form.addEventListener("submit", handleSubmit);
