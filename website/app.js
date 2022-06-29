// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


/* Global Variables */
const generate = document.getElementById("generate");
const zip = document.getElementById("zip");
const feelings = document.querySelector("#feelings");
const content = document.querySelector("#content");
const temp = document.querySelector("#temp");
const date = document.querySelector("#date");
const city = document.querySelector("#city");


// API Variables
const mainURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=ad6bd78811a690809dfaa47008dcfd2e&units=imperial';


//Event Listener function for the generate button
generate.addEventListener("click", (evt) => {
    evt.preventDefault(); //prevents the form from submitting itself and refreshing the page
    const customURL = `${mainURL}${zip.value}${apiKey}`;//url generator
    getData(customURL) //collects the data from the OpenWeatherMap API
        .then((data) => {
            assembleData(data) //Callback function that extracts only the required data
                .then((info) => {
                    sendData("/add", info) //Call function that converts the data to JSON and sends it to the server
                        .then(() => {
                            retrieveData("/all") //Callback function that retrieves the data from the server
                                .then((data) => {
                                    updateUI(data); //Updates the interface with the data asynchronously
                                });
                        });
                });
        });
});

//Async function that collects the data from the OpenWeatherMap API
const getData = async (url) => {
    try {
        const result = await fetch(url);
        const data = await result.json();
        if (data.cod === 200) {
            return (data);
        }
    }
    catch (err) {
        console.error("Error found : " + err);
    }
}

//Async function that extracts only the required data
const assembleData = async (data) => {
    await data;
    try {
        if (data) {
            const icon = data.weather[0].icon;
            const info = {
                date: newDate,
                feelings: feelings.value,
                temp: `${Math.round(data.main.temp)}°`,
                weather: data.weather[0].description,
                icon: icon,
                humidity: `${data.main.humidity}%`,
                pressure: `${data.main.pressure}pa`,
                wind: `${data.wind.deg}°`,
                name: data.name
            }
            return (info);
        }
        else {
            return data;
        };
    }
    catch (err) {
        console.error("Error found" + err);
    }
};

//Async function that converts the data to JSON and sends it to the server
const sendData = async (url = "", data = {}) => {
    try {
        const value = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return value;
    }
    catch (err) {
        console.error("Error found " + err)
    }
}

//Async function that retrieves data from the server
const retrieveData = async (url) => {
    const data = await fetch(url);
    try {
        const res = await data.json();
        return res;
    }
    catch (err) {
        console.error("Error found " + err);
    }
}

//Async function that updates the browser interface with the data dynamically
const updateUI = async (data) => {
    try {
        const response = await data;
        if (response.date) {
            date.innerHTML = response.date;
            temp.innerHTML = response.temp;
            content.innerHTML = response.feelings;
            city.innerHTML = response.name;
        } else {
            alert("Input Error!\nCheck zip code and try again...")
        }
    }
    catch (err) {
        console.error("Error : " + err);
    }
}