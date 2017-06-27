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
    var restaurantConfirm;

    $(document).on('click', "#add-order-line-btn", function(event) {
        event.preventDefault();

        

         restaurant = $("#restaurantInput").val();
         address = $("#addressInput").val();
         city = $("#cityInput").val();
         zipCode = $("#zipCodeInput").val();
         secretCode = $("#secretCodeInput").val();
         minutes = $("#minutesSelected").val();

         
         $("#timeChosen").html(minutes);
         $("#secretCodeConfirm").html(secretCode);



        var longitude;
        var latitude;
        var radius = 3000; //In meters
        
        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+city+zipCode+"&key=AIzaSyBlfREnpaS6btRbcuWrKDJQudacfPBf7SI";
        $.ajax({
          url: queryURL,
          method: 'GET'
        }).done(function(response) {
          // console.log(response);
          // console.log(response.results[0].geometry.location.lat);
          // console.log(response.results[0].geometry.location.lng);
          longitude = response.results[0].geometry.location.lat;
          latitude = response.results[0].geometry.location.lng;
         
        });
        var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/search?q=" + restaurant + "&count=5&lat=" + latitude + "lon=" + longitude + "&radius="+radius;
        $.ajax({
            url: zomatoQueryURL,
            headers: {
                'user-key':'b8910995d9facc1a087e4ef0101c4b60'
            },
            method: 'GET'
        }).done(function (data) {
            // console.log('succes: ' + data);
            // console.log(JSON.stringify(data.restaurants));
            var restaurantListDiv = $('<div>');
            for(var i = 0; i < data.restaurants.length; i++){
                var rInfoDiv = $('<div>');
               rInfoDiv.html("<input type=radio name=restaurant>"+"<div>" + data.restaurants[i].restaurant.name + "</div><div>" + data.restaurants[i].restaurant.location.address + "</div><div>" + data.restaurants[i].restaurant.location.city + "</div><div>" + data.restaurants[i].restaurant.location.zipcode + "</div><br>");//
                restaurantListDiv.append(rInfoDiv);

 
               // $('#restaurantConfirm').html(restaurantListDiv)

               $("#content").html(restaurantListDiv)

            };

            
            
        });



            // window.location.href = "creator_confirm_page.html";
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
