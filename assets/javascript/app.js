
var config = {
  apiKey: "AIzaSyBHbt3hd-f5yNykGnEnu-7bLEbKs-GEh4o",
  authDomain: "trainscheduler-1a67a.firebaseapp.com",
  databaseURL: "https://trainscheduler-1a67a.firebaseio.com",
  storageBucket: "trainscheduler-1a67a.appspot.com",
  messagingSenderId: "309691806229"
};
firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// Show current time
var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});


// Capture Button Click
$("#add-train").on("click", function() {

  // Grabbed values from text boxes
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#train-time").val().trim();
  frequency = $("#frequency").val().trim();
  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % childSnapshot.val().frequency;
  var minutesAway = frequency - tRemainder;
  var nextTrain = moment().add(minutesAway, "minutes");
  var nextArrival = moment(nextTrain).format("hh:mm a");

  var nextArrivalUpdate = function() {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
	
	
	
	
	
	
	/*
	var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");///*/

  }

  // Code for handling the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
  alert("Schedule submitted!");

  // Empty text input
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
  
  // Don't refresh the page!
  return false; 
});

// Delete function
// $(document).on("click", ".delete", function(){
//   var confirmDelete = confirm("Are you sure you want to delete this entry?");
  
//    if (confirmDelete){
//     var entry = $(this).attr("data-index");
//     database.ref().child(trainIDs[entry]).remove();
//     location.reload();
//    } else{
//      return false;
//    }
  
// });

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("child_added")
// This will only show the 25 latest entries
  database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {


    console.log("Train name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First train: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("Minutes away: " + snapshot.val().minutesAway);
    console.log("==============================");


  // Change the HTML to reflect
  $("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
   // "<td><button class='delete btn btn-default btn-sm' data-index='" + index + "'><span class='glyphicon glyphicon-trash'></span></button> " + 
   // "<button type='button' class='btn btn-default btn-sm'><span class='glyphicon glyphicon-edit'></span></button>" +
    "</td></tr>");

  index++;

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  //Gets the train IDs in an Array
  database.ref().once('value', function(dataSnapshot){ 
    var trainIndex = 0;

      dataSnapshot.forEach(
          function(childSnapshot) {
              trainIDs[trainIndex++] = childSnapshot.key();
          }
      );
  });

  console.log(trainIDs);
