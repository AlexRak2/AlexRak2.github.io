// All elements needed
const baseURL = 'https://spi-nodejs.onrender.com/';

const container = document.getElementById("simulation-container");
const waterLevel = document.getElementById("water-level");
const pipeElements = document.getElementsByClassName("pump");
const waterLevelValue = document.getElementById('water-level-number');
const flowValues = document.getElementsByClassName('flow-number');

var dataJson = {
    "PumpCount": 3,
    "Pump1Stat": 3,
    "Pump2Stat": 2,
    "Pump3Stat": 1,
    "Level": 4.2,
    "Flow": 31
};



createPipe();
updateValues();
waterLevelAnimation();


// Create each pipe dynamically
function createPipe() {
    const pumpContainer = document.querySelector(".pump-container");
    const pipeContainer = document.querySelector(".pipe-container");
    const pipeTitleContainer = document.querySelector(".bottom-container");

    for (let i = 0; i < dataJson.PumpCount; i++) {
        const pumpElement = document.createElement("div");
        pumpElement.classList.add("pump");
        pumpContainer.appendChild(pumpElement);

        const pipeElemet = document.createElement("div");
        pipeElemet.classList.add("pipe");
        pipeContainer.appendChild(pipeElemet);

        const pumpTitle = document.createElement("div");
        pumpTitle.classList.add("pipe-title");
        pumpTitle.textContent = 'Pump ' + (i + 1);
        pipeTitleContainer.appendChild(pumpTitle);
    }
}

// Update all number values as visual representation
var previousWaterLevel = 0;
function updateValues() {

    const roundedValue = dataJson.Level.toFixed(1);
    waterLevelValue.textContent = roundedValue;

    for (let i = 0; i < flowValues.length; i++) {
        flowValues[i].textContent = dataJson.Flow;
    }

    setColor(pipeElements[0], dataJson.Pump1Stat);
    setColor(pipeElements[1], dataJson.Pump2Stat);
    setColor(pipeElements[2], dataJson.Pump3Stat);

    if(dataJson.Level != previousWaterLevel)
    {
        setWaterLevelHeight(dataJson.Level);        
        previousWaterLevel = dataJson.Level;
    }
}

// Set pipe color based on status
function setColor(pumpElement, status) {
    switch (status) {
        case 1:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--running-color');
            break;
        case 2:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--alarm-red-color');
            break;
        case 3:
            pumpElement.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--alarm-yellow-color');
            break;
    }
}

// Set water height
function setWaterLevelHeight(level) {
    const maxHeight = 10; // Maximum water level height in FT
    const containerHeight = container.offsetHeight;
    const waterLevelHeight = (level / maxHeight) * containerHeight;
    waterLevel.style.height = waterLevelHeight + "px";
}

// Water animation to simulate fake waves
function waterLevelAnimation() {
    const minHeight = 0.5; // Minimum water level height in FT
    const maxHeight = 10; // Maximum water level height in FT
    const levelRange = 0.5; // Range around the level value
    const interval = 1000; // Animation interval in milliseconds

    setInterval(() => {
        const randomLevel = dataJson.Level + (Math.random() * levelRange * 2 - levelRange);
        const clampedLevel = Math.max(minHeight, Math.min(maxHeight, randomLevel)); // Clamp the value within the height range
        setWaterLevelHeight(clampedLevel);
    }, interval);
}


async function getInfo() {
    const res = await fetch(baseURL + 'getData', {
        method: 'GET'
    });

    if (res.ok) {

        const resJSON = await res.json(); // Extract JSON content from the response
        dataJson = resJSON;

        updateValues();
    } else {
        console.log('Failed to fetch data');
    }
}

setInterval(getInfo, 3000);

