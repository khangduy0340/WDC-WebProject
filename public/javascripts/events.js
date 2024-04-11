// Sticky navigation bar


window.onscroll = function () {
  var navbar = document.querySelector("header");
  var sticky = navbar.offsetTop;
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
};
// Toggle menu icon
let menu = document.querySelector('.menuicons');
let navlist = document.querySelector('.navlist');
menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navlist.classList.toggle('open');
};

function getEvents(currentDate) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', '/event', true);
  xhttp.onreadystatechange = function () {
    if (xhttp.status === 200) {
      var events = JSON.parse(xhttp.responseText);
      var evList = document.getElementById('eventlist');
      evList.innerHTML = '';
      // Starting to attached it
      for (var i = 0; i < events.length; i++) {
        if (currentDate === events[i].event_time.substr(0, 10)) {
          var evDiv = document.createElement("div");
          evDiv.innerHTML = `<h2>${events[i].title}</h2>
            <h4>${events[i].name}  (${events[i].event_time.substr(0, 10)})</h4>
            <h4>${events[i].description}</h4>`;
          evList.appendChild(evDiv);
        }
      }
      if(evList.innerHTML===''){evList.innerHTML=`<h2>No Events</h2>`;};
    }
  };
  xhttp.send();
}



$(document).ready(function () {
  // Display the current date will enter the website
  var currentDate = moment().format('YYYY-MM-DD');
  getEvents(currentDate);
  $('#calendar').fullCalendar({
    // make the calendar selectable
    selectable: true,
    dayClick: function (date, jsEvent, view) {
      // change the date of the div when date is clicked
      var selectedDate = date.format('YYYY-MM-DD');
      //document.getElementById('selectedDate').innerHTML = selectedDate;
      getEvents(selectedDate);
    }
  });
});

// Redirect to homepage
function Redirect() {
  location.href = '/login.html';
}
// Droplist feature
var c = 0;
function dropList() {
  if (c == 0) {
    document.getElementById("loginButton").style.padding = "20px";
    document.getElementById("loginButton").style.color = "white";
    document.getElementById("loginButton").style.backgroundColor = "black";
    document.getElementById("myDropdown").classList.toggle("show");
    c++;
  } else {
    document.getElementById("loginButton").style.padding = "0px";
    document.getElementById("loginButton").style.color = "black";
    document.getElementById("loginButton").style.backgroundColor = "white";
    document.getElementById("myDropdown").classList.remove("show");
    c = 0;
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
  xhr.onreadystatechange = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var loginButton = document.getElementById('loginButton');
      if (data.loggedIn) {
        var x = new XMLHttpRequest();
        x.open('GET', '/getname', true);
        x.onreadystatechange = function () {
          if (x.status === 200) {
            var nameData = x.responseText;
            loginButton.innerText = nameData + ' ';
            loginButton.addEventListener('click', dropList);
          } else {
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


