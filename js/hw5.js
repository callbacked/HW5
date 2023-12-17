/*
GUI Assignment: Homework 4
Date: 12/14/2023
Name: Alexander Vasquez Romero Jr
Email: alexander_vasquez1@student.uml.edu
Description: My hw5.js file, contains the foundation of my scrabble implementation, without the dictionary checks or bonus scoring logic.
*/

$(function () {
    var score = 0; // Initialize score
    var lettersPlaced = {}; // Track letters placed on the board

    // Load defined scrabble pieces from a JSON file
    $.getJSON('pieces.json', function(data) {
        pieces = data.pieces; // store data
        // console.log(pieces) debug
        setupBoardAndTiles(); // calls the function below
    });
/*
Cited:
https://www.geeksforgeeks.org/read-json-file-using-javascript/
https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/
https://stackoverflow.com/questions/34789321/js-read-json-file-and-use-as-an-object
*/

    // Setup the board and tiles for the game
    function setupBoardAndTiles() {
        createBoard(); // Create the board
        refreshRack(); // Refresh tiles in the rack
    }

    // Function to create the board squares
    function createBoard() {
        for (var i = 0; i < 15; i++) {
            var $boardSquare = makeBoardSquare(i); // Create individual board square
            $("#board").append($boardSquare); // Add the square to the board
        }
    }

    // Function to create an individual board square for tile placement
    function makeBoardSquare(index) {
        return $("<div>")
            .addClass("board-square") // Add class for styling
            .css("left", index * 75 + "px") // Position the square
            .droppable({
                accept: ".tile", // Accept only tiles
                drop: handleTileDrop // Handle tile drop
            });
    }

    // Handle the tile drop on the board
    function handleTileDrop(event, ui) {
        var letter = ui.draggable.data("letter"); // Get the letter of the tile
        var value = ui.draggable.data("value"); // Get the value of the tile
        var squareIndex = $(this).index(); // Get the index of the square
        updateScore(value); // Update the score
        finalizeTilePlacement(ui.draggable, $(this)); // Finalize tile placement
        move(letter, squareIndex); // saves the movement to be shown
    }

    // Function to update the game score
    function updateScore(value) {
        score += value; // Add value to the score
        $("#score").text("Score: " + score); // Display updated score
    }

    // Function to finalize tile placement on the board
    function finalizeTilePlacement($tile, $square) {
        $tile.draggable("option", "revert", false) // Disable revert
             .position({ of: $square, my: "center", at: "center" }) // Position tile in the center of the square
             .draggable("disable"); // Disable further dragging of the tile
    }

    // Function to refresh tiles in the rack
    function refreshRack() {
        $("#rack").empty(); // Clear the rack
        for (var i = 0; i < 7; i++) { // places 7 tiles
            var piece = getRandomPiece(); // Get a random piece
            var $tile = createTile(piece).css("left", i * 33 + "px"); // positions newly created tile
            $("#rack").append($tile); // Add tile to the rack div
        }
    }

    // Function to create a new draggable tile, maps the referenced tile piece from the images to the scrabble tiles data
    function createTile(piece) {
        var imagePath = `Scrabble_Tiles/Scrabble_Tile_${piece.letter}.jpg`; // Get image path for the tile
        return $('<img>', {
            "src": imagePath, // Set image source
            "class": "tile", // Add class for styling
            "data-letter": piece.letter, // Store letter data
            "data-value": piece.value // Store value data
        }).draggable({
            revert: "invalid", // Revert if not placed correctly 
            cursor: "move" // Cursor style
        });
    }

    // Function to get a random piece from available pieces
    function getRandomPiece() {
        var randomIndex = Math.floor(Math.random() * pieces.length); // Choose a random index
        return pieces[randomIndex]; // Return the piece at the random index
    }
/*
Cited:
https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
*/

    // Function that log movement of a tile
    function move(letter, position) {
        $("#moves").append($("<p>").text(`Placed letter ${letter} at position ${position}.`)); // Log move
    }
/*
Cited:
https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
*/

    // Event handlers for reset and new round buttons
    $("#newTiles").click(function () {
        resetGame(); // Reset the game
    });

    $("#newWord").click(function () {
        newWord(); // Start a new round
    });

    // Function to reset the game
    function resetGame() {
        score = 0; // Reset score
        updateScore(0); // Update score display
        newWord(); // Start a new round (a.k.a a new round)
    }

    // Function to start a new round
    function newWord() {
        $("#moves").empty();
        $(".tile").remove();
        refreshRack();
    }
});