function submitRegister() {
  let registerData = {
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value.trim()
  };

  if (!registerData.username || !registerData.email || !registerData.password || !document.getElementById('confirm-password').value.trim()) {
    document.getElementById("error-message").innerText = "Please fill out all fields";
    document.getElementById("error-message").classList.remove("hidden");
    return;
  }

  if (registerData.password !== document.getElementById('confirm-password').value.trim()) {
    document.getElementById("error-message").innerText = "Passwords do not match";
    document.getElementById("error-message").classList.remove("hidden");
    return;
  }

  // Server Request (store variables on server)
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      // redirect to the login page
      window.location.href = "/login.html";

    } else if (req.readyState === 4 && req.status === 401) {
      if (req.response === "Username or email already exists: please try a different username or email") {
        document.getElementById("error-message").innerText = req.responseText;
        document.getElementById("error-message").classList.remove("hidden");
      } else {
        document.getElementById("error-message").innerText = "Registration Failed";
        document.getElementById("error-message").classList.remove("hidden");
      }
    }
  };

  req.open('POST', '/register');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(registerData));
}

function googleRegister(response) {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
      // redirect to the login page
      window.location.href = "/login.html";

    } else if (req.readyState === 4 && req.status === 401) {
      if (req.response === "Username or email already exists: please try a different username or email") {
        document.getElementById("error-message").innerText = req.responseText;
        document.getElementById("error-message").classList.remove("hidden");
      } else {
        document.getElementById("error-message").innerText = "Registration Failed";
        document.getElementById("error-message").classList.remove("hidden");
      }
    }
  };

  req.open('POST', '/register');
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(response));
}
