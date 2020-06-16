import { sha256 } from 'js-sha256';

const audioCompleted = document.getElementById("audioCompleted");
audioCompleted.volume = 0.3;

const consoleTableHint = document.getElementById("consoleTableHint");

const consoleTableLength = 40;
const consoleTableLines = 8;
let consoleTableArray = [];
for(let x=0; x<consoleTableLines; x++){
    consoleTableArray.push([]);
}
// Index 0 of Line, Index 0 of Column
let currentInputCoordinates = [0, 0];

const headingPArray = drawLetterP();
const headingIArray = drawLetterI();
const headingNArray = drawLetterN();
const titleId = "IDENTIFICATION";
const titleProgram = "PROGRAM";
// Index 5 of Line, Last Index of Column
currentInputCoordinates = [consoleTableLines - 3, 40];

// PIN
const pinLength = 4;
let pin = "9003";
let hashedPin = hashPin(pin);

// Render entry page of identification program
const consoleTable = document.getElementById("consoleTable");
for(let i=0; i<consoleTableArray.length; i++){
    const row = consoleTable.insertRow(i);
    for(let j=0; j<consoleTableLength; j++){
        const cell = row.insertCell(j);
        if(i >= 0 && i < 6){
            // Set heading P
            if(headingPArray[i][j])
                consoleTableArray[i][j] = headingPArray[i][j];

            // Set heading I
            const headingIOffsetIndex = headingPArray[0].length + 2;
            if(headingIArray[i][j])
                consoleTableArray[i][j + headingIOffsetIndex] = headingIArray[i][j];

            // Set heading N
            const headingNOffsetIndex = headingIOffsetIndex + headingIArray[0].length + 3;
            if(headingNArray[i][j])
                consoleTableArray[i][j + headingNOffsetIndex] = headingNArray[i][j];

            // Set title IDENTIFICATION
            const titleIdOffsetIndex = headingNOffsetIndex + headingNArray[0].length + 1;
            if(titleId && i == 1 && j < titleId.length)
                consoleTableArray[i][j + titleIdOffsetIndex] = titleId[j];

            // Set title PROGRAM
            const titleProgramOffsetIndex = headingNOffsetIndex + headingNArray[0].length + 3;
            if(titleProgram && i == 3 && j < titleProgram.length)
                consoleTableArray[i][j + titleProgramOffsetIndex] = titleProgram[j];
        }
        if(consoleTableArray[i][j])
            cell.innerHTML = consoleTableArray[i][j];
    }
}
outputLine();
output("Strike a key when ready ...");
pause(() => {
    matchHashedPin();
});

function hashPin(pin = String(pin)){
    return sha256(pin);
}

// Match the hashed pin from 9999 to 0000
function matchHashedPin(){
    showConsoleTableHint();
    let i = 10000;
    const intervalHandle = setInterval(() => {
        i--;
        const tempPin = formatIntegerToPinLengthString(i);
        const hashedTempPin = hashPin(tempPin);
        output(hashedTempPin);
        endLine();
        output(tempPin);
        if(hashedTempPin == hashedPin){
            hideConsoleTableHint();
            clearInterval(intervalHandle);
            outputLine();
            output("PIN IDENTIFICATION NUMBER: " + pin);
            audioCompleted.play();

            // Let's hack again!
            const timeoutHandle = setTimeout(() => {
                clearTimeout(timeoutHandle);                
                outputLine();
                output("Let's hack again.");
                endLine();
                inputPin();
            }, 1500);
        }        
    }, 1);
    
    // Matching hashed pin process will stop when user presses some keys
    listenStopEvent(() => {
        clearInterval(intervalHandle);
        hideConsoleTableHint();
        outputLine();
        output("Let's hack again.");
        endLine();
        inputPin();
    });
}

function formatIntegerToPinLengthString(integer){
    return String(integer).padStart(pin.length, "0");
}

function inputPin(){
    output("Please enter another PIN: ");

    pin = "";
    const intervalHandle = cursorInterval();
    const enterPinEvent = (e) => {
        if(e.key.match(/[0-9]/g) != null && pin.length < pinLength){
            pin += e.key;
            hideCursor();
            output(e.key);
        }
        // Backspace
        if(e.keyCode == 8 && pin.length > 0){
            pin = pin.slice(0, -1);
            hideCursor();
            removeConsoleChar();
        }
        // Enter
        if(e.keyCode == 13){
            hideCursor();
            clearInterval(intervalHandle);
            document.removeEventListener("keyup", enterPinEvent);
            endLine();

            // If pin length does not match, input again
            if(pin.length != pinLength){
                inputPin();
            }
            else{
                hashedPin = hashPin(pin);
                matchHashedPin();
            }
        }
    };
    document.addEventListener("keyup", enterPinEvent);
}

// Output text in console
function output(text = String(text)){
    for(let i=0; i<text.length; i++){
        addConsoleChar(text[i]);
    }
}

// Output a line in console
function outputLine(){
    let [l, c] = currentInputCoordinates;
    c = 0;
    if(l >= consoleTableLines - 2){
        l = consoleTableLines - 1;
        consoleTableArray.shift();
        consoleTableArray.shift();
        consoleTableArray.push([]);
        consoleTableArray.push([]);
    }
    else{
        consoleTableArray[l+1] = [];
        l = l + 2;
    }
    updateConsoleTable();
    currentInputCoordinates = [l, c];
}

// End a line in console
function endLine(){
    let [l, c] = currentInputCoordinates;
    c = 0;
    if(l >= consoleTableLines - 1){
        l = consoleTableLines - 1;
        consoleTableArray.shift();
        consoleTableArray.push([]);
    }
    else{
        consoleTableArray[l+1] = [];
        l = l + 1;
    }
    updateConsoleTable();
    currentInputCoordinates = [l, c];
}

// Remove a character in console
function removeConsoleChar(){
    let [l, c] = currentInputCoordinates;
    c--;
    consoleTableArray[l][c] = '';
    consoleTable.rows[l].cells[c].innerHTML = consoleTableArray[l][c];
    currentInputCoordinates = [l, c];
}

// Output a character in console
function addConsoleChar(char = ""){
    let [l, c] = currentInputCoordinates;
    consoleTableArray[l][c] = char;
    consoleTable.rows[l].cells[c].innerHTML = consoleTableArray[l][c];
    c++;
    // If the character has passed the length of a line
    if(c >= consoleTableLength){
        c = 0;
        // If the current line is at the last line
        if(l == consoleTableLines - 1){
            l = consoleTableLines - 1;
            consoleTableArray.shift();
            consoleTableArray.push([]);
            updateConsoleTable();
        }
        else{
            l++;
        }
    }
    currentInputCoordinates = [l, c];
}

function updateConsoleTable(){
    for(let i=0; i<consoleTableArray.length; i++){
        for(let j=0; j<consoleTableLength; j++){
            if(consoleTableArray[i][j])
                consoleTable.rows[i].cells[j].innerHTML = consoleTableArray[i][j];
            else
                consoleTable.rows[i].cells[j].innerHTML = "";
        }
    }
}

// Set cursor interval, return setInterval handle
function cursorInterval(){
    const [l, c] = currentInputCoordinates;
    let allowCursor = true;
    return setInterval(() => {
        if(allowCursor){
            showCursor();
            allowCursor = false;
        }
        else{
            hideCursor();
            allowCursor = true;
        }
    }, 500);
}

function showCursor(){
    const [l, c] = currentInputCoordinates;
    consoleTable.rows[l].cells[c].style.background = "black";
}

function hideCursor(){
    const [l, c] = currentInputCoordinates;
    consoleTable.rows[l].cells[c].style.background = "none";
}

function showConsoleTableHint(){
    consoleTableHint.style.display = "flex";
}

function hideConsoleTableHint(){
    consoleTableHint.style.display = "none";
}

// Pause the console, press any key to continue
function pause(callbackFn){
    const intervalHandle = cursorInterval();
    const continueEvent = (e) => {
        // If key code is not F11, F12
        if(e.keyCode != 122 && e.keyCode != 123){
            document.removeEventListener("keyup", continueEvent);
            clearInterval(intervalHandle);
            hideCursor();
            callbackFn();
        }
    };
    document.addEventListener("keyup", continueEvent);
}

// Stop a process when user presses some keys
function listenStopEvent(callbackFn){
    const stopEvent = (e) => {
        // ESC or Ctrl + C
        if(e.keyCode == 27 || (e.ctrlKey && e.keyCode == 67)){
            document.removeEventListener("keyup", stopEvent);
            callbackFn();
        }
    };
    document.addEventListener("keyup", stopEvent);
}

function drawLetterP(){
    const letter = 'P';
    const rowLength = 6;
    const colLength = 6;
    let array = [];
    for(let i=0; i<rowLength; i++){
        array.push([]);
        for(let j=0; j<colLength; j++){
            array[i][j] = "";
            if((i == 0 || i == 3) && j < colLength-1)
                array[i][j] = letter;
            if((i == 1 || i == 2) && (j == 0 || j > 3))
                array[i][j] = letter;
            if((i == 4 || i == 5) && j == 0)
                array[i][j] = letter;
        }
    }
    return array;
}

function drawLetterI(){
    const letter = 'I';
    const rowLength = 6;
    const colLength = 7;
    let array = [];
    for(let i=0; i<rowLength; i++){
        array.push([]);
        for(let j=0; j<colLength; j++){
            array[i][j] = "";
            if(i == 0 || i == rowLength-1)
                array[i][j] = letter;
            if(i > 0 && i < rowLength-1 && j == 3)
                array[i][j] = letter;
        }
    }
    return array;
}

function drawLetterN(){
    const letter = 'N';
    const rowLength = 6;
    const colLength = 6;
    let array = [];
    for(let i=0; i<rowLength; i++){
        array.push([]);
        for(let j=0; j<colLength; j++){
            array[i][j] = "";
            array[i][0] = letter;
            array[i][colLength-1] = letter;
            if(i > 0 && i < colLength-1)
                array[i][i] = letter;
        }
    }
    return array;
}