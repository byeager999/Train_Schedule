// initialize Firebase
// Your web app's Firebase configuration
var config = {
    apiKey: "AIzaSyAQn3ix5RxyJqdOPPE-OqhY6Z-vm2hJv9E",
    authDomain: "train-schedule-59ce8.firebaseapp.com",
    databaseURL: "https://train-schedule-59ce8.firebaseio.com",
    projectId: "train-schedule-59ce8",
    storageBucket: "",
    messagingSenderId: "636841096373",
    appId: "1:636841096373:web:58ef5e5f4de5d023"
};
// Initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();

// button for adding trains
$("#add-train-btn").on("click", function(event){
    event.preventDefault();

    // captures user input
    // NEED WAY TO CAPTURE 24 HR TIME OR CONVERT TIME TO 24 HR
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    // THIS IS PROBABLY WRONG
    var trainFirst = moment($("#firstArrive-input").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#frequency-input").val().trim();


    // temp object for holding input data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        firstArrive: trainFirst,
        frequency: trainFreq
    };

    // uploads train data to db
    database.ref().push(newTrain);

    // logs to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstArrive);
    console.log(newTrain.frequency);

    alert("Train successfully added")

    // clears text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstArrive-input").val("");
    $("#frequency-input").val("");
});

// firebase event for adding new train to the db and a row in the html when user adds a train
database.ref().on("child_added", function(childSnapshot){
    console.log(childSnapshot.val());

    // storing into a variable
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().firstArrive;
    var trainFreq = childSnapshot.val().frequency;

    // logs to console
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);

    // format first train

    // calculate next train arrival time


    var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
    console.log(trainFirstConverted);

    // current time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    // difference between times
    var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    // time apart
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    // minutes away
    var minsTillTrain = trainFreq - tRemainder;
    console.log("Minutes till train: " + minsTillTrain);

    // next train
    var trainNext = moment().add(minsTillTrain, "minutes");
    console.log("Arrival time: " + moment(trainNext).format("hh:mm"));

    // create new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(trainNext),
        $("<td>").text(minsTillTrain),
    );

    $("#train-table > tbody").append(newRow);


});