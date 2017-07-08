$(document).ready(function() {


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

// -------------Creators Page JS---------------
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
             if (data.restaurants.length > 0) {
            for (var i = 0; i < data.restaurants.length; i++) {
                var rInfoDiv = $('<div>');
                // rInfoDiv.html("<input class='form-check-input' type='radio' name='restaurantRadio' class='radioButton' value=" + i + ">" + "<ul id='restaurantList' style='list-style: none;''>" + "<li>" + data.restaurants[i].restaurant.name + "</li><li>" + data.restaurants[i].restaurant.location.address + "</li><li>" + data.restaurants[i].restaurant.location.city + "</li><li>" + data.restaurants[i].restaurant.location.zipcode + "</li></ul>");

                rInfoDiv.html("<input class='form-check-input' type='radio' name='restaurantRadio' data-required='true' data-parsley-error-message='Please Choose a Restaurant' required class='radioButton' value=" + i + ">" + "<div id='restaurantList'>" + data.restaurants[i].restaurant.name + "<br>" + data.restaurants[i].restaurant.location.address + "<br>" + data.restaurants[i].restaurant.location.city + "<br><br></div>");

                restaurantListDiv.append(rInfoDiv);
            };



            var btn = $('<button class="btn btn-warning" id="modalSubmit">Submit</button>');
            restaurantListDiv.append(btn);
            $("#restaurantContent").html(restaurantListDiv);}
  //new two line
            else {restaurantListDiv.html("No Results Found");
            $("#restaurantContent").html(restaurantListDiv);
        };
        });
    }

    $(document).on('click', '#modalSubmit', function(event) {
        event.preventDefault();

        $('#restaurantContent').parsley().validate()

        if (!$('#restaurantContent').parsley().isValid()) {
            return
        }

        $('#myModal').modal('show');
    });


    $(document).on('click', "#submit", function(event) {

        event.preventDefault();

        $('#creatorForm').parsley().validate()

        if (!$('#creatorForm').parsley().isValid()) {
            return
        }

        restaurant = $("#restaurantInput").val();
        address = $("#addressInput").val();
        city = $("#cityInput").val();
        zipCode = $("#zipCodeInput").val();

        // if (isNaN(zipCode) || zipCode < 10000 || zipCode > 99999) {
        //     $("#zipCode").append("<br>" + "<p class='zipCodeError'>*Please Input a Valid Zip Code*</p>");
        //     return;
        // };

        // $(".zipCodeError").hide();



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

        $('#secretCodeValidate').parsley().validate()
        if (!$('#secretCodeValidate').parsley().isValid()) {
            return
        }

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
            '<p id="secretCodeConfirm" class="confirmP"></p>' + '<br>' +
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

        database.ref('orders').child(secretCode).set({
            //     restaurantChoice: 'chipotle',
            //     timeSelected: '11:00'
            // });
            //     database.ref().push({
            restaurantChoice: restaurantChoice,
            secretCode: secretCode,
            timeSelected: timeSelected,
        });

    });

// ----------------------------Add Order Page JS-------------------------------------------

    $(document).on('click', '#submitCode', function(event) {
        event.preventDefault();

        $('#addOrderSecretCode').parsley().validate()

        if (!$('#addOrderSecretCode').parsley().isValid()) {
            return
        }

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


    var code;// = $('#confirmCode').val();
      var div;
      var found;

      // database.ref('orders').child().equalTo('tfy').once('value',function (snapshot) {








      var name;
        var item;
        var qty;

        function addOrderLine(){

            event.preventDefault();

        $('#orderForm').parsley().validate()

        if (!$('#orderForm').parsley().isValid()) {
            return
        }

        $('#myModal1').modal('show');


            name = $('#order-line-name-input').val().trim();
            item = $('#order-line-item-input').val().trim();
            qty = $('select').val();


        database.ref('orders/'+ code + '/lines').child(name + '-' + item + '-' + qty).set({
           name: name,
           item: item,
           qty: qty
        });



        $('#order-line-name-input').val('');
        $('#order-line-item-input').val('');
        $('select').val('1');

        console.log(name);
        console.log(item);
        console.log(qty);

        $('#order-name').html(name);
        $('#order-item').html(item);
        $('#order-qty').html(qty);


        }

        $(document).on("click",'#add-order-line-btn', addOrderLine);


    var secretCodeInputVal ='';

    $(document).on('click', '#submitCode', function(event) {

        $('#addOrderSecretCode').parsley().validate()

        if (!$('#addOrderSecretCode').parsley().isValid()) {
            return
        }

      secretCodeInputVal = $('#confirmCode').val();
      // console.log(secretCodeInputVal);
      checkSecretCodeFB();
      // if(found){
      //   console.log('Found It!');
      // }
      // else{
      //   console.log('not found');
      // }

       event.preventDefault();
      // confirmCode = $("#confirmCode").val();
       // console.log(code);
      $("#popup").hide();
    });

    function checkSecretCodeFB(){
      // console.log(secretCodeInputVal);
      database.ref('orders').orderByChild('secretCode').equalTo(secretCodeInputVal).once('value',function (snapshot) {
        var key;
        snapshot.forEach(function (childSnapshot){
          key = childSnapshot.key;
          return true;
        });

        if(key){
          code = $("#confirmCode").val();
          found = true;

 




          console.log("Found user: " + key);
          grabSecretCodeInfo();
        }
        else{
          found = false;
         console.log("User not found.");
        }
      });
    }


    function grabSecretCodeInfo(){
      database.ref('orders/'+code).on("value", function(snapshot) {
        var r = snapshot.val().restaurantChoice;
        // console.log(r);
        div = $('<div>');

        div.html(r);
        $('.jumbotron').html(r);
        //$('.jumbotron').append(div);
      });



    //starting Nat's code!
    var query = firebase.database().ref("orders/" + code +"/lines").orderByValue();
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
   
            var key = childSnapshot.key;
            var childDataQty = childSnapshot.val().qty;
            var childDataName = childSnapshot.val().name;
            var childDataItem = childSnapshot.val().item

            console.log(childDataQty);
            console.log(childDataName);
            console.log(childDataItem);
            div2 = $('<div>');
            $('#confirmation').append(childDataName);

            $("#confirm-table").append("<tr> <td>" + childDataName +
            " </td><td> " + childDataItem +
            " </td><td> " + childDataQty +"</td></tr>");
      });
    });
  //end Nat's code!




        // var confirmCode;
    }

    //starting Nat's code!
    // var query = firebase.database().ref("orders/" + code +"/lines").orderByValue();
    // query.once("value").then(function(snapshot) {
    //     snapshot.forEach(function(childSnapshot) {
   
    //         var key = childSnapshot.key;
    //         var childDataQty = childSnapshot.val().qty;
    //         var childDataName = childSnapshot.val().name;
    //         var childDataItem = childSnapshot.val().item

    //         console.log(childDataQty);
    //         console.log(childDataName);
    //         console.log(childDataItem);
    //         div2 = $('<div>');
    //         $('#confirmation').append(childDataName);

    //         $("#confirm-table").append("<tr> <td>" + childDataName +
    //         " </td><td> " + childDataItem +
    //         " </td><td> " + childDataQty +"</td></tr>");
    //   });
    // });
  //end Nat's code!



});
