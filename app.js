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

        var timesUp = $('<h1 class="timesUp"> Times Up! You Are No Longer Able To Order.</h1>');
        $('#wrapper').html(timesUp);
        $("#myModal").modal('hide');
        $("#myModal2").modal('hide');
    }

    function zomatoData(longitude, latitude, radius, restaurant) {
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

            var restaurantListDiv = $('<div class="rInfoDiv">');
            for (var i = 0; i < data.restaurants.length; i++) {
                var rInfoDiv = $('<div>');
                // rInfoDiv.html("<input class='form-check-input' type='radio' name='restaurantRadio' class='radioButton' value=" + i + ">" + "<ul id='restaurantList' style='list-style: none;''>" + "<li>" + data.restaurants[i].restaurant.name + "</li><li>" + data.restaurants[i].restaurant.location.address + "</li><li>" + data.restaurants[i].restaurant.location.city + "</li><li>" + data.restaurants[i].restaurant.location.zipcode + "</li></ul>");

                rInfoDiv.html("<input class='form-check-input' type='radio' name='restaurantRadio' class='radioButton' value=" + i + ">" + "<div id='restaurantList'>" + data.restaurants[i].restaurant.name +"<br>" + data.restaurants[i].restaurant.location.address + "<br>" + data.restaurants[i].restaurant.location.city + "<br><br></div>");

                restaurantListDiv.append(rInfoDiv);
           };   

           

            var btn = $('<button class="btn btn-warning" data-toggle="modal" data-target="#myModal">Submit</button>');
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

        if (isNaN(zipCode) || zipCode < 10000 || zipCode > 99999) {
            $("#zipCode").append("<br>" + "<p class='zipCodeError'>*Please Input a Valid Zip Code*</p>");
            return;
        };

        $(".zipCodeError").hide();

        var longitude;
        var latitude;
        var radius = '3000'; //In meters

        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + city + zipCode + "&key=AIzaSyBlfREnpaS6btRbcuWrKDJQudacfPBf7SI";
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).done(function(response) {
            // console.log(response);
            // console.log(response.results[0].geometry.location.lat);
            // console.log(response.results[0].geometry.location.lng);
            longitude = JSON.stringify(response.results[0].geometry.location.lng);
            latitude = JSON.stringify(response.results[0].geometry.location.lat);

            zomatoData(longitude, latitude, radius, restaurant);
        });
    });


    $(document).on('click', '#add-order-line-btn2', function(event) {
        event.preventDefault();

        timeSelected = $("#timeSelected :selected").val();
        restaurantChoice = $('#restaurantList').html();

        secretCode = $("#secretCodeInput").val();

        $("#wrapper").html('<div>' +
            '<h1 class="creatorHeader">Confirmation Page</h1>' +
            '<div id="confirmWrapper">' +
            '<h3 class="confirmHeaders">Time Left: </h3>' +
            '<p id="timeLeft" class="confirmP"></p>' +
            '<h3 class="confirmHeaders">Restaurant: </h3>' +
            '<p id="restaurantConfirm" class="confirmP"></p>' +
            '<h3 class="confirmHeaders">Secret Code: </h3>' +
            '<p id="secretCodeConfirm" class="confirmP"></p>' +
            '<a href="addOrderLine.html"><button type="button" class="btn btn-warning">Add Order</button></a>' +
            '</div>' +
            '</div>')

        $("#myModal").modal('hide');
        $("#restaurantConfirm").html(restaurantChoice);
        $("#secretCodeConfirm").html(secretCode);

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

        database.ref().push({
            restaurantChoice: restaurantChoice,
            secretCode: secretCode,
            timeSelected: timeSelected,
        });

    });

    $(document).on('click', '#submitCode', function(event) {
        event.preventDefault();
        confirmCode = $("#confirmCode").val();
        console.log(confirmCode);


        $("#popup").hide();
        var rootRef = database.ref().child('-Knx-JqNFcQLQZRzLfnT');
        rootRef.on('child_added', snap => {
            var name = snap.child('secretCode').val();
            console.log(name);
        });
    });

    $(document).on('click', '#createOrderBtn', function(event) {

        window.location.href = "creators_page.html";
    });
});
