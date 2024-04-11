function submitLogin() {
    let loginData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim()
    };

    if (!loginData.email || !loginData.password) {
        document.getElementById("error-message").innerText = "Please fill out all fields";
        document.getElementById("error-message").classList.remove("hidden");
        return;
    }

    // Server Request (check if variables match the database)
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            // redirect to the home page
            window.location.href = "/";

        } else if (req.readyState === 4 && req.status === 401) {
            if (req.response === "Username or password is incorrect") {
                document.getElementById("error-message").innerText = req.responseText;
                document.getElementById("error-message").classList.remove("hidden");
            } else {
                document.getElementById("error-message").innerText = "Login Failed";
                document.getElementById("error-message").classList.remove("hidden");
            }
        }
    };

    req.open('POST', '/login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(loginData));
}

function googleLogin(response) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            // redirect to the home page
            window.location.href = "/";

        } else if (req.readyState === 4 && req.status === 401) {
            if (req.response === "account not created: please register an account first") {
                document.getElementById("error-message").innerText = req.responseText;
                document.getElementById("error-message").classList.remove("hidden");
            } else {
                document.getElementById("error-message").innerText = "Login Failed";
                document.getElementById("error-message").classList.remove("hidden");
            }
        }
    };

    req.open('POST', '/login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(response));
}
