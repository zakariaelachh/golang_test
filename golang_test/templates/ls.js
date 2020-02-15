if (typeof(Storage) !== "undefined") {
// Store
localStorage.setItem("firstName", document.getElementById("firstName").innerHTML);
localStorage.setItem("lastname", document.getElementById("lastName").innerHTML);
localStorage.setItem("company", document.getElementById("company").innerHTML);
localStorage.setItem("email", document.getElementById("email").innerHTML);

// Retrieve get
document.getElementById("firstName").innerHTML = localStorage.getItem("firstName");
document.getElementById("lastName").innerHTML = localStorage.getItem("lastName");
document.getElementById("company").innerHTML = localStorage.getItem("company");
document.getElementById("email").innerHTML = localStorage.getItem("email");
  } else {
    // Sorry! No Web Storage support..
    console.log('local storage not supported ');
  }