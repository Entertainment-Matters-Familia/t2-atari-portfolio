const consoleTableLength = 40;
const consoleTableLines = 8;
let consoleTableArray = [];
for(let x=0; x<consoleTableLines; x++){
    consoleTableArray.push([]);
}

const headingPArray = drawLetterP();
const headingIArray = drawLetterI();
const headingNArray = drawLetterN();

// Render console table
const consoleTable = document.getElementById("consoleTable");
for(let i=0; i<consoleTableArray.length; i++){
    const row = consoleTable.insertRow(i);
    for(let j=0; j<consoleTableLength; j++){
        const cell = row.insertCell(j);
        let indentLength = 0;
        if(i >= 0 && i <= headingPArray.length-1){
            consoleTableArray[i][j] = headingPArray[i][j];

            indentLength = indentLength + headingPArray.length + 2;
            consoleTableArray[i][j+indentLength] = headingIArray[i][j];

            indentLength = indentLength + headingNArray.length+3;
            consoleTableArray[i][j+indentLength] = headingNArray[i][j];
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
            array[i][0] = letter;
            array[i][colLength-1] = letter;
            if(i > 0 && i < colLength-1)
                array[i][i] = letter;
        }
    }
    return array;
}