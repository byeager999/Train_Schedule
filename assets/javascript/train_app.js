// initialize Firebase
var config = {
    apiKey: "",
    authDomain: "train-schedule-59ce8.firebaseio.com",
    database: "https://train-schedule-59ce8.firebaseio.com",
    storageBucket: "train-schedule-59ce8.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();

// button for adding trains

$("#add-train-btn").on("click", function(event){
    event.preventDefault();

    // captures user input
    // NEED WAY TO CAPTURE 24 HR TIME OR CONVERT TIME TO 24 HR
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFirst = $("#firstArrive-input").val().trim(), 
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
    var tFrequency = 5;

    var firstTime = "02:00";

    var firstTimeConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // current time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));

    // difference between times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    // time apart
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // minutes away
    var minsTillTrain = tFrequency - tRemainder;
    console.log("Minutes till train: " + minsTillTrain);

    // next train
    var nextTrain = momment().add(minsTillTrain, "minutes");
    console.log("Arrival time: " + moment(nestTrain).format("hh:mm"));

    // create new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(trainNext),
        $("<td>").text(trainMinAway),
    );

    $("#train-table > tbody").append(newRow);


});