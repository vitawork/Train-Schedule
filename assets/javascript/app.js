$(document).ready(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyCBXVOgIEqQAdtaaKPebh7cPnk9tU1aFHo",
    authDomain: "train-database-60ae1.firebaseapp.com",
    databaseURL: "https://train-database-60ae1.firebaseio.com",
    projectId: "train-database-60ae1",
    storageBucket: "",
    messagingSenderId: "133137950452",
    appId: "1:133137950452:web:d4a47c48e3e45161"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  $("#add").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var name = $("#inputTrainName")
      .val()
      .trim();
    var destination = $("#inputDestination")
      .val()
      .trim();
    var ftime = $("#inputFirstTime")
      .val()
      .trim();
    var frequency = $("#inputFrequency")
      .val()
      .trim();

    if (name !== "" && destination !== "" && ftime !== "" && frequency !== "") {
      // Creates local "temporary" object for holding train data
      var train = {
        name: name,
        destination: destination,
        first_time: ftime,
        frequency: frequency
      };

      // Uploads employee data to the database
      database.ref().push(train);

      // Clears all of the text-boxes
      $("#inputTrainName").val("");
      $("#inputDestination").val("");
      $("#inputFirstTime").val("");
      $("#inputFrequency").val("");
      $("#pval").text("");
    } else {
      $("#pval").text("Please fill all information");
    }
  });

  database.ref().on(
    "child_added",
    function(childSnapshot) {
      // Store everything into a variable.
      var name = childSnapshot.val().name;
      var destination = childSnapshot.val().destination;
      var first_time = childSnapshot.val().first_time;
      var frequency = childSnapshot.val().frequency;

      var firstTimeConverted = moment(first_time, "HH:mm").subtract(1, "years");

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

      var tMinutesTillTrain = frequency - (diffTime % frequency);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");

      // Create the new row
      var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(moment(nextTrain).format("hh:mm")),
        $("<td>").text(tMinutesTillTrain)
      );

      // Append the new row to the table
      $("#tbody1").append(newRow);
    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );
});
