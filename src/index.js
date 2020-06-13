const consoleTableLength = 40;
const consoleTableLines = 8;
let consoleTableArray = [];
for(let x=0; x<consoleTableLines; x++){
    consoleTableArray.push([]);
}

const headingPArray = drawLetterP();
const headingIArray = drawLetterI();
const headingNArray = drawLetterN();
const titleId = "IDENTIFICATION";
const titleProgram = "PROGRAM";

// Render console table
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