'use strict';

const $continent = document.getElementById('continent'),
    $card = document.getElementById('card'),
    $close = document.getElementById('close');

//saving DOM elements to update
const $flag = document.getElementById('flag'),
    $code = document.getElementById('code'),
    $name = document.getElementById('name'),
    $capital = document.getElementById('capital'),
    $population = document.getElementById('population'),
    $area = document.getElementById('area'),
    $languages = document.getElementById('languages'),
    $prefix = document.getElementById('prefix');

const COUNTRIES = [];

function addCountry(country) {
    let exists = false;

    //if there's countries check if the name already exists
    if(COUNTRIES.length >= 1) {
        COUNTRIES.map(c => {
            if(c.name === country.name) {
                exists = true;
                return;
            }
        });
    }

    //if the country doesn't exists push on the array
    if(exists) {
        return;
    } else {
        COUNTRIES.push(country);
    }
}

//to format the property language because xhr returns an array
function setLanguages(array) {
    let languages = "";

    array.map(lang => {
        languages += `${lang.name}-`;
    });

    languages = languages.split('-').join(', ');
    languages = languages.slice(0, -2);
    return languages;
}

function getInfo(country) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        //ignore states other than 4 (READY_STATE_COMPLETE)
        if(xhr.readyState !== 4) return;

        //if it's successful lets proceed
        if(xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);

            let countryInfo = {
                id: country,
                name: json[0].name,
                alpha3Code: json[0].alpha3Code, 
                capital: json[0].capital, 
                population: json[0].population,
                area: json[0].area,
                flag: json[0].flag,
                languages: setLanguages(json[0].languages),
                callingCodes: json[0].callingCodes
            }

            addCountry(countryInfo);

            renderModal(countryInfo);
        }
    });

    xhr.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
    xhr.send();
}

//to render the modal window of the country
function renderModal(country) {
    $flag.setAttribute('src', country.flag);
    $code.innerText = country.alpha3Code;
    $name.innerText = country.name;
    $capital.innerText = country.capital;
    $population.innerText = country.population;
    $area.innerText = country.area;
    $languages.innerText = country.languages;
    $prefix.innerText = `+${country.callingCodes}`;
}

//to close the modal window in mobile
$close.addEventListener('click', () =>  {
    $card.style.opacity = 0;
    $card.style.zIndex = -1;
});

//to listen to the clicks

$continent.addEventListener("click", (e) => {
    let country = e.target.dataset.name;
    let exists = false;

    //check if the country already exists within the COUNTRIES array
    COUNTRIES.map(c => {
        if(c.id === country) {
            exists = true;
            return;
        }
    });

    //if the country exists within the COUNTRIES array
    //it is not necessary to make another request
    if(exists) {
        let countryInfo = COUNTRIES.filter(c => c.id === country);
        renderModal(countryInfo[0]);
    } else {
        getInfo(country);
    }

    $card.style.opacity = 1;
    $card.style.zIndex = 1;
});