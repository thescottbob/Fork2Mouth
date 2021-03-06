// Hide the table headers for our API results on page load. They will be revealed once the Submut button is pressed.
window.onload = function() {
  $(".col").hide();
};

// Valid Diet filters (Edamam):           [balanced, high-protein, low-fat, low-carb]
// Valid Health/Allergy filters (Edamam): [vegan, vegetarian, sugar-conscious, peanut-free, tree-nut-free, alcohol-free]
// Valid Diet filters (OpenMenu): [vegan, vegetarian, halal, kosher, gluten-free]

let edamAppID = "ed77f616";
let edamApiKey = "976bea25ef3c24d77968f5c1879d9012";
let openMenuApiKey = "3d7fcbb4-c412-11e8-b19e-525400552a35";
let food = "";
let dietRestrictions = [];
let healthRestrictions = [];

// Make API calls when food search form is submitted
$("#foodSubmit").on("click", function(event) {
  event.preventDefault();

    // Do not submit if no logged-in user
    if (userData==undefined) {
        console.log("ERROR: NO USER SIGNED IN")
        return;
    }

    // Get info from food form
    food = $("#exampleFoodInput").val();

    // Do not submit if no text entered
    if (food.length<1) {
        console.log("ERROR: MUST ENTER FOOD TO SEARCH")
        return;
    }

  $(".col").show();

  
  if ($("#noNut").is(":checked")) {
    healthRestrictions.push("peanut-free");
  }
  if ($("#noTreeNut").is(":checked")) {
    healthRestrictions.push("tree-nut-free");
  }
  if ($("#noAlcohol").is(":checked")) {
    healthRestrictions.push("alcohol-free");
  }
  if ($("#vegan").is(":checked")) {
    healthRestrictions.push("vegan");
  }
  if ($("#vegetarian").is(":checked")) {
    healthRestrictions.push("vegetarian");
  }

  // Basic query
  let edamURL = `https://api.edamam.com/search?app_id=${edamAppID}&app_key=${edamApiKey}&q=${food}`;
  // Add additional flags as necessary
  if (healthRestrictions.length > 0) {
    if (healthRestrictions.includes("peanut-free")) {
      edamURL += "&health=" + "peanut-free";
    }
    if (healthRestrictions.includes("tree-nut-free")) {
      edamURL += "&health=" + "tree-nut-free";
    }
    if (healthRestrictions.includes("alcohol-free")) {
      edamURL += "&health=" + "alcohol-free";
    }
    if (healthRestrictions.includes("vegan")) {
      edamURL += "&health=" + "vegan";
    }
    if (healthRestrictions.includes("vegetarian")) {
      edamURL += "&health=" + "vegetarian";
    }
  }

  // Edamam API call
  $.ajax(edamURL, {
    method: "GET"
  }).then(function(stuff) {
    recipes = stuff.hits;
    console.log(recipes);

    // Push recipe info to Recipes tab
    $("#recipeData").empty();

    for (let i = 0; i < recipes.length; i++) {
      let r = recipes[i].recipe;
      console.log("-----------------------------");
      console.log(r.label);
      console.log(r.url);
      console.log(r.ingredients);
      console.log(r.healthLabels);
      // $("body").append( $("<img>").attr("src",r.image) )
      console.log("-----------------------------");

      // Create new table row
      let newRow = $("<div>").addClass("row recipeRow");

      // Add recipe image
      newRow.append(
        $("<img>")
          .addClass("col recipeImg")
          .attr({
            src: r.image,
            alt: r.label
          })
      );
      // Add recipe name with hyperlink to source
      newRow.append(
        $("<a>")
          .addClass("col recipeName")
          .text(r.label)
          .attr("href", r.url)
          .attr("target", "_blank")
      );
      // Add health/diet labels
      let healthDesc = r.healthLabels.join(", ");
      newRow.append(
        $("<div>")
          .addClass("col recipeHealthLabel")
          .text(healthDesc)
      );

      $("#recipeData").append(newRow);
    }
  });

    // Basic OpenMenu query
    var postalCode = userData.zipCode;
    console.log(userData.zipCode)
    let openMenuURL = `https://openmenu.com/api/v2/search.php?key=${openMenuApiKey}&s=${food}&mi=1&postal_code=${postalCode}&country=US`;
  
  // OpenMenu API call
  $.ajax(openMenuURL, {
    method: "GET"
  }).then(function(getRestaurantData) {
    let restaurants = getRestaurantData.response.result.items;
    console.log(getRestaurantData);

    // Push restaurant info to Restaurants tab
    $("#restaurantData").empty();

    for (let i = 0; i < restaurants.length; i++) {
      let res = restaurants[i];

      //Create new table row
      let newRow = $("<div>").addClass("row restaurantRow");

      let restaurantSearch = "https://www.google.com/search?q=" + res.restaurant_name;

      // Add restaurant name with hyperlink to restaurant website
      newRow.append(

        $("<a>")
        .addClass("col restaurantName")
            .attr("href", restaurantSearch)
            .attr("target", "_blank")
            .text(res.restaurant_name)
      );

      // Add restaurant cuisine type
      newRow.append(
        $("<div>")
          .addClass("col cuisineType")
          .text(res.cuisine_type_primary)
      );

      // Add menu item name
      newRow.append(
        $("<div>")
          .addClass("col menuItemName")
          .text(res.menu_item_name)
      );

      let mapSearch ="https://www.google.com/maps/place/" + res.address_1 + " " + res.city_town + " " + res.state_province;

      // Add restaurant address and make it into a hyperlink
      newRow.append(
        $("<div>")
          .addClass("col restaurantAddress")
          .append(
            $("<a>")
              .attr("href", mapSearch)
              .attr("target", "_blank")
              .text(res.address_1 + ", " + res.city_town + ", " + res.state_province)
          )
      );

      $("#restaurantData").append(newRow);
    }
  });
});

/************************************
 * Vanilla javascipt for login modal
 * ***********************************/
var logInModal = document.getElementById("login-modal");
var signUpModal = document.getElementById("sign-up-modal");

// When the user clicks anywhere outside of the logInModal or signUpModal, close it
window.onclick = function(event) {
  if (event.target == logInModal) {
    logInModal.style.display = "none";
  } else if (event.target == signUpModal) {
    signUpModal.style.display = "none";
  }
};

// Vanilla javascipt for tabs
function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}
// Get the element with id="defaultOpen" and click on it
$("#defaultOpen").click();

/***********************************************
 *
 * User authentication
 *
 **********************************************/

// Variable to store user data
var userData;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAuXYrTrmD1F3UToiV9MGGMuDoArVTOSp8",
  authDomain: "foodeaze-92954.firebaseapp.com",
  databaseURL: "https://foodeaze-92954.firebaseio.com",
  projectId: "foodeaze-92954",
  storageBucket: "foodeaze-92954.appspot.com",
  messagingSenderId: "549845192920"
};
firebase.initializeApp(config);

// Listener for signin/signout
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

      firebase.database().ref("/users/"+user.uid).once("value",function(snap) {
        userData = snap.val()
        console.log(`Welcome ${userData.fname} ${userData.lname}`)
        $("#nameDisplay").text(`Welcome ${userData.fname}!`)      
    })
    
    // Hide Sign Up/Login buttons
    $("#loginWrapper").hide();
    // Show user name message and Logout button
    $("#logOut").show();
  } else {
    // No user is signed in.
    $("#loginWrapper").show();
    $("#logOut").hide();
  }
});

// Function creates new user
function newUser(email, password, fName, lName, zipCode) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(ref) {
        console.log("SIGNUP THEN:")
        console.log(ref.user)

        firebase.database().ref('/users/'+ref.user.uid).set({
            // Placeholder values
            'fname': fName,
            'lname': lName,
            'zipCode': zipCode
        })

        // Clear sign-up form and hide it
        $("#email").val("")
        $("#signpassword").val("")
        $("#signfname").val("")
        $("#signlname").val("")
        $("#signzipCode").val("")

        $("#sign-up-modal").hide()
    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("SIGN-UP FAIL")
        console.log(errorCode)
        console.log(errorMessage)
    });
}

// Function signs in existing user
function signIn(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(ref) {
        console.log("LOGIN: SUCCESS")
        console.log(ref.user)

        // Hide login modal
        $("#login-modal").hide()
    }, function(error) {
        console.log("LOGIN: FAIL")
        console.log(error.code);
        console.log(error.message);
      }
    );
}

// Function signs out current user, if any
function signOut() {
    firebase.auth().signOut().then(function() {
        // Delete user data
        userData = undefined;

        console.log("Logged out!")
     }, function(error) {
        console.log(error.code);
        console.log(error.message);
      }
    );
}

// Listener on sign-up submit button to create new user
$("#signcreateUser").on("click", function() {
  event.preventDefault();

  // Get user info from form
  let email = $("#email").val();
  let password = $("#signpassword").val();
  let fName = $("#signfname").val();
  let lName = $("#signlname").val();
  let zipCode = $("#signzipCode").val();

    // Validate info
    let valid = true

    // First name field must be one characters or more
    if (fName.length<1) {
        valid = false;
        console.log("FAIL: FIRST NAME MUST BE AT LEAST ONE CHARACTER LONG")
    }

    // Last name field not required

    // Password must be 6 characters or more
    if (password.length<6) {
        valid = false;
        console.log("FAIL: PASSWORD MUST HAVE 6 OR MORE CHARACTERS")
    }

    // Postal code must be 5-digit US postal code
    if (zipCode.length!==5) {
        valid = false;
        console.log("FAIL: ZIP CODE MUST HAVE EXACTLY 5 DIGITS")
    } else if (isNaN(zipCode)) {
        valid = false;
        console.log("FAIL: ZIP CODES MAY CONSIST OF NUMBERS ONLY")
    }

    // Add user if valid
    if (valid) {
        // Add user to database
        newUser(email, password, fName, lName, zipCode)
    } else {
        console.log("SIGN-UP FAILED")
    }
})

$("#logsubmitUser").on("click", function() {
  event.preventDefault();

  let email = $("#logemail").val();
  let password = $("#logpassword").val();

  signIn(email, password);
});

$("#logoutBtn").on("click", signOut);
