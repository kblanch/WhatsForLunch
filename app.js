$(document).ready(function($) {


var config = {
    apiKey: "AIzaSyB0ECXU5TKSZzGXj8f13HwpSLgAJYSJYXQ",
    authDomain: "whats-for-lunch-2905e.firebaseapp.com",
    databaseURL: "https://whats-for-lunch-2905e.firebaseio.com",
    projectId: "whats-for-lunch-2905e",
    storageBucket: "whats-for-lunch-2905e.appspot.com",
    messagingSenderId: "826669516912"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

    var restaurant;
    var address;
    var city;
    var zipCode;
    var secretCode;
    var minutes; 

    $(document).on('click', "#submitButton", function(event) {
        event.preventDefault();

        window.location.href = "creator_confirm_page.html";

         restaurant = $("#restaurantInput").val();
         address = $("#addressInput").val();
         city = $("#cityInput").val();
         zipCode = $("#zipCodeInput").val();
         secretCode = $("#secretCodeInput").val();
         minutes = $("#minutesSelected").val();

        database.ref().push({
            restaurant: restaurant,
            address: address,
            city: city,
            zipCode: zipCode,
            secretCode: secretCode,
            minutes: minutes
        });

        

    });

    database.ref().on('child_added', function(snapshot) {

        $("#timeChosen").empty();
        $("#restaurantConfirm").empty();
        $("#secretCodeConfirm").empty();


        $("#timeChosen").append(snapshot.val().minutes);
        $("#restaurantConfirm").append(snapshot.val().restaurant);
        $("#secretCodeConfirm").append(snapshot.val().secretCode);

    });

    //   Countdown timer

    // function startTimer(duration, display) {
    //     var timer = duration,
    //         minutes, seconds;
    //     setInterval(function() {
    //         minutes = parseInt(timer / 60, 10);
    //         seconds = parseInt(timer % 60, 10);

    //         minutes = minutes < 10 ? "0" + minutes : minutes;
    //         seconds = seconds < 10 ? "0" + seconds : seconds;

    //         display.textContent = minutes + ":" + seconds;

    //         if (--timer < 0) {
    //             var timesUp = $("<h1>Times Up" + "<br><br>" + "<p>Times up. You are no longer able to order. Oh well</p>")
    //             $('#content').html(timesUp);
    //         }
    //     }, 1000);
    // }

    // var mins = 60 * minutes,
    //     display = document.querySelector('#timeLeft');

    // startTimer(mins, display);

});
