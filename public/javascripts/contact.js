// Sticky navigation bar
window.onscroll = function(){
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


// map
function initMap() {
    var uluru = {lat: -34.9221, lng: 138.6079};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
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