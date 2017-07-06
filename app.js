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
    var timeSelected;
    var restaurantConfirm;
    var restaurantChoice;
    var restaurantSelected;


     function timesUp() {

        var timesUp = $('<h1> Times Up! You Are No Longer Able To Order.</h1>');
        $('#wrapper').html(timesUp);
        $("#myModal").modal('hide');
        $("#myModal2").modal('hide');

    }

    function zomatoData (longitude, latitude, radius, restaurant) {
        var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/search?q=" + restaurant + "&count=5&lat=" + latitude + "&lon=" + longitude + "&radius=" + radius + "&sort=real_distance&order=asc";
        $.ajax({
            url: zomatoQueryURL,
            headers: {
                'user-key': 'b8910995d9facc1a087e4ef0101c4b60'
            },
            method: 'GET'
        }).done(function(data) {
            // console.log('succes: ' + data);
            // console.log(JSON.stringify(data.restaurants));
            console.log(zomatoQueryURL)
            var restaurantListDiv = $('<div>');
            for (var i = 0; i < data.restaurants.length; i++) {
                var rInfoDiv = $('<div>');
                rInfoDiv.html("<input class='form-check-input' type='radio' name='restaurantRadio' class='radioButton' value=" + i + ">" + "<ul id='restaurantList' style='list-style: none;''>" + "<li>" + data.restaurants[i].restaurant.name + "</li><li>" + data.restaurants[i].restaurant.location.address + "</li><li>" + data.restaurants[i].restaurant.location.city + "</li><li>" + data.restaurants[i].restaurant.location.zipcode + "</li></ul>"); //
                restaurantListDiv.append(rInfoDiv);

           };


            var btn = $('<button id="add-order-line-btn" type="button" class="btn btn-default" data-toggle="modal" data-target="#myModal">Submit</button>');
            restaurantListDiv.append(btn);
            $("#restaurantContent").html(restaurantListDiv);

        });
    }


    $(document).on('click', "#submit", function(event) {

        event.preventDefault();

        restaurant = $("#restaurantInput").val();
        address = $("#addressInput").val();
        city = $("#cityInput").val();
        zipCode = $("#zipCodeInput").val();
        

        var longitude;
        var latitude;
        var radius = '3000'; //In meters

        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + city + zipCode + "&key=AIzaSyBlfREnpaS6btRbcuWrKDJQudacfPBf7SI";
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
            console.log(response);
            console.log(response.results[0].geometry.location.lat);
            console.log(response.results[0].geometry.location.lng);
            longitude = JSON.stringify(response.results[0].geometry.location.lng);
            latitude = JSON.stringify(response.results[0].geometry.location.lat);

            zomatoData(longitude,latitude,radius,restaurant);


        });
        

    });


    $(document).on('click', '#add-order-line-btn2', function(event) {
        event.preventDefault();

        secretCode = $("#secretCodeInput").val();
        timeSelected = $("#timeSelected :selected").val();
        restaurantChoice = $('#restaurantList').html();
        $("#wrapper").html('<div>'+
                        '<h1>Confirmation Page</h1>'+
                        '<div>'+
                            '<h3>Time Left: </h3>' +
                            '<p id="timeLeft"></p>' +
                            '<h3>Restaurant: </h3>' +
                            '<p id="restaurantConfirm"></p>' +
                            '<h3>Secret Code: </h3>' +
                            '<p id="secretCodeConfirm"></p>' +
                         '</div>' +
                    '</div>')

        $("#myModal").modal('hide');
        console.log(restaurantChoice)

        $(".radioButton").hide();
        $("#secretCodeConfirm").html(secretCode);
        $("#restaurantConfirm").html(restaurantChoice);
        

         function startTimer(duration, display) {
        var timer = duration,
            minutes, seconds;
        setInterval(function() {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                    timesUp();
                }
            
        }, 1000);
    }

    var mins = 60 * timeSelected,
        display = document.querySelector('#timeLeft');

    startTimer(mins, display);

    });


});
