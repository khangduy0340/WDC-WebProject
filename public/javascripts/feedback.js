function submitForm() {
    let formData = {
        fname: document.getElementById('name').value,
        femail: document.getElementById('email').value,
        ftext: document.getElementById('text').value
    };

    if (!formData.femail || !formData.ftext) {
        document.getElementById("error-message").innerText = "Please fill out all fields";
        return;
    }
    document.getElementById("error-message").innerText = "";
    // Server Request (check if variables match the database)
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            // redirect to the home page
            document.getElementsByClassName('tyimg').innerText = 'Thank you';
            window.location.href = "/feedback.html";
        }
    };

    req.open('POST', '/feedback');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(formData));
}

// Redirect to homepage
function Redirect() {
    location.href = '/login.html';
}
// Droplist feature
var c = 0;
function dropList() {
    if(c==0){
        document.getElementById("loginButton").style.padding = "20px";
        document.getElementById("loginButton").style.color = "white";
        document.getElementById("loginButton").style.backgroundColor = "black";
        document.getElementById("myDropdown").classList.toggle("show");
    c++;
    }else{
        document.getElementById("loginButton").style.padding = "0px";
        document.getElementById("loginButton").style.color = "black";
        document.getElementById("loginButton").style.backgroundColor = "white";
        document.getElementById("myDropdown").classList.remove("show");
        c=0;
    }
}
// Logout feature
function LogOut() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            window.location.href = "/";
        } else if (req.readyState === 4 && req.status === 403) {
            alert('Not logged in');
        }
    };
    req.open('POST', '/logout');
    req.send();
}
// Checking login status
function checkLoginStatus() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/loggedin', true);
    xhr.onreadystatechange = function (){
    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var loginButton = document.getElementById('loginButton');
        if (data.loggedIn) {
            var x = new XMLHttpRequest();
            x.open('GET','/getname',true);
            x.onreadystatechange = function(){
                if (x.status === 200){
                    var nameData = x.responseText;
                    loginButton.innerText = nameData + ' ';
                    loginButton.addEventListener('click', dropList);
                }else{
                    alert('Fail to get Username');
                }
            };
            x.send();
        } else {
            loginButton.innerText = 'Sign in ';
            loginButton.addEventListener('click', Redirect);
        }
    }
    };
    xhr.send();
};