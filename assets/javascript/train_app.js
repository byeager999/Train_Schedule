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
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // captures user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFirst = moment($("#firstArrive-input").val().trim(), "hh:mm a").format("X");
    var trainFreq = $("#frequency-input").val().trim();

    if (trainName.length < 1) {
        $("#train-name-input").after('<span class="error">This field is required</span>');
    }
    if (trainDest.length < 1) {
        $("#destination-input").after('<span class="error">This field is required</span>');
    }
    if (trainFirst === "Invalid date") {
        $("#firstArrive-input").after('<span class="error">This field is required</span>');
    }
    if (trainFreq.length < 1) {
        $("#frequency-input").after('<span class="error">This field is required</span>');
    } 
    else {
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
        console.log("Train Name: " + newTrain.name);
        console.log("Train Destination: " + newTrain.destination);
        console.log("First Train Time: " + newTrain.firstArrive);
        console.log("Train Frequency: " + newTrain.frequency);


        // clears text boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#firstArrive-input").val("");
        $("#frequency-input").val("");

        $(".error").remove();


    }





});




// firebase event for adding new train to the db and a row in the html when user adds a train
database.ref().on("child_added", function (childSnapshot) {

    // storing into a variable
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().firstArrive;
    var trainFreq = childSnapshot.val().frequency;

    // convert the first train time back one year so it comes before the current time
    var firstTrainConverted = moment(trainFirst, "X").subtract(1, "years");
    console.log("Converted First Train Time: " + firstTrainConverted);

    // Current time
    var currentTime = moment();
    console.log("Current time is: " + currentTime);

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("Difference in minutes: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log("Time Remainder: " + tRemainder);

    // Minutes until next train
    var minsTillTrain = trainFreq - tRemainder;
    console.log("Minutes until next train: " + minsTillTrain);

    // Next train
    var nextTrain = moment().add(minsTillTrain, "minutes").format("hh:mm a");
    console.log("Arrival time: " + nextTrain);



    // create new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(minsTillTrain),
    );

    $("#train-table > tbody").append(newRow);


});

