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
$("#foodSubmit").on("click", function (event) {
    event.preventDefault();

    // Get info from food form
    food = $("#exampleFoodInput").val()

    if ( $("#noNut").is(":checked") ) {
        healthRestrictions.push("peanut-free")
    }
    if ( $("#noAlcohol").is(":checked") ) {
        healthRestrictions.push("alcohol-free")
    }
    if ( $("#vegan").is(":checked") ) {
        healthRestrictions.push("vegan")
    }
    if ( $("#vegetarian").is(":checked") ) {
        healthRestrictions.push("vegetarian")
    }
    
    // Basic query
    let edamURL = `https://api.edamam.com/search?app_id=${edamAppID}&app_key=${edamApiKey}&q=${food}`
    // Add additional flags as necessary
    if (healthRestrictions.length>0) {
        // Only supporting Peanut allergy for now
        if (healthRestrictions.includes("peanut-free")){
            edamURL += "&health="+"peanut-free"
        }
    }

    // Edamam API call
    $.ajax(edamURL, {
        method: "GET"
    }).then(function(stuff) {
        recipes = stuff.hits
        console.log(recipes)

        // Push recipe info to Recipes tab
        $("#recipeData").empty()
        
        for (let i=0; i<recipes.length; i++) {
            let r = recipes[i].recipe
            console.log("-----------------------------")
            console.log(r.label)
            console.log(r.url)
            console.log(r.ingredients)
            console.log(r.healthLabels)
            // $("body").append( $("<img>").attr("src",r.image) )
            console.log("-----------------------------")

            // Create new table row
            let newRow = $("<div>").addClass("row recipeRow")

            // Add recipe image
            newRow.append($("<img>").addClass("col recipeImg").attr({
                src: r.image,
                alt: r.label
            }))
            // Add recipe name with hyperlink to source
            newRow.append($("<a>").addClass("col recipeName").text(r.label).attr("href", r.url))
            // Add health/diet labels
            let healthDesc = r.healthLabels.join(", ")
            newRow.append($("<div>").addClass("col recipeHealthLabel").text(healthDesc))

            $("#recipeData").append(newRow)
        }
    })

    // Basic OpenMenu query
    // var postalCode = $("#zipCode").val();
    var postalCode = 98105;
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

      // Create new table row
      let newRow = $("<div>").addClass("row restaurantRow");

      
      newRow.append(
        $("<div>")
          .addClass("col menuItemName")
          .text(res.menu_item_name)
        //   .attr("href", website_url)
      );

      // Add restaurant name with hyperlink to source
      newRow.append(
        $("<a>")
          .addClass("col restaurantName")
          .text(res.restaurant_name)
        //   .attr("href", website_url)
      );

      $("#restaurantData").append(newRow);
    }
  });
})

/************************************
 * Vanilla javascipt for login modal
 * ***********************************/
var logInModal = document.getElementById('login-modal');
var signUpModal = document.getElementById('sign-up-modal');

// When the user clicks anywhere outside of the logInModal or signUpModal, close it
window.onclick = function(event) {
    if (event.target == logInModal) {
        logInModal.style.display = "none";
    }
    else if (event.target == signUpModal) {
        signUpModal.style.display = "none";
    }
}
   
// Vanilla javascipt for tabs
function openPage(pageName,elmnt,color) {
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
document.getElementById("defaultOpen").click();


/***********************************************
 * 
 * User authentication
 * 
 **********************************************/

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
    } else {
      // No user is signed in.
    }
});

// Function creates new user
function newUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
}

// Function signs in existing user
function signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
     });
}

// Function signs out current user, if any
function signOut() {
    firebase.auth().signOut().then(function() {
        console.log("Logged out!")
     }, function(error) {
        console.log(error.code);
        console.log(error.message);
     });
}

$("#signcreateUser").on("click", function() {
    event.preventDefault()
})