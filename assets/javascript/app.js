
var config = {
  apiKey: "AIzaSyBHbt3hd-f5yNykGnEnu-7bLEbKs-GEh4o",
  authDomain: "trainscheduler-1a67a.firebaseapp.com",
  databaseURL: "https://trainscheduler-1a67a.firebaseio.com",
  storageBucket: "trainscheduler-1a67a.appspot.com",
  messagingSenderId: "309691806229"
};
var name ='';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyHolder = '';
var getKey = '';

firebase.initializeApp(config);
var database = firebase.database();
var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});
$(document).ready(function() {

     $("#add-train").on("click", function() {
     	
     	name = $('#train-name').val().trim();
     	destination = $('#destination').val().trim();
     	firstTrainTime = $('#train-time').val().trim();
     	frequency = $('#frequency').val().trim();
          firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          tRemainder = diffTime % frequency;
          minutesTillTrain = frequency - tRemainder;
          nextTrain = moment().add(minutesTillTrain, "minutes");
          nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// Code for the push
     	keyHolder = database.ref().push({
     		name: name,
     		destination: destination,
     		firstTrainTime: firstTrainTime,  // 2:22 in my example
     		frequency: frequency,
            nextTrainFormatted: nextTrainFormatted,
            minutesTillTrain: minutesTillTrain
     	});alert("added schedule succesfully!!!");
        $('#train-name').val('');
     	$('#destination').val('');
     	$('#train-time').val('');
     	$('#frequency').val('');

     	return false;
     });
  
     database.ref().on("child_added", function(childSnapshot) {
		$('#new-train').append("<tr class='table-row' id=" + "'" + childSnapshot.key + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + 
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain + 
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");

}, function(errorObject){

});

$("body").on("click", ".remove-train", function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     database.ref().child(getKey).remove();
});

}); 
