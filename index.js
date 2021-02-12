const $continent = document.getElementById('continent'),
    $card = document.getElementById('card'),
    $close = document.getElementById('close');
const COUNTRIES = [];

//saving elements to update
const $flag = document.getElementById('flag'),
    $code = document.getElementById('code'),
    $name = document.getElementById('name'),
    $capital = document.getElementById('capital'),
    $population = document.getElementById('population'),
    $area = document.getElementById('area'),
    $languages = document.getElementById('languages'),
    $prefix = document.getElementById('prefix');

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

function setLanguages(array) {
    let languages = "";

    array.map(lang => {
        languages += `${lang.name}-`;
    });

    languages = languages.split('-').join(', ');
    languages = languages.slice(0, -2);
    return languages;
}

$continent.addEventListener("click", (e) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e => {
        //ignore states other than 4 (READY_STATE_COMPLETE)
        if(xhr.readyState !== 4) return;

        //if it's successful lets proceed
        if(xhr.status >= 200 && xhr.status < 300) {
            let json = JSON.parse(xhr.responseText);

            let { name, 
                alpha3Code, 
                capital, 
                population,
                area,
                flag,
                languages,
                callingCodes 
            } = json[0];

            let country = {
                name,
                alpha3Code, 
                capital, 
                population,
                area,
                flag,
                languages,
                callingCodes
            }

            addCountry(country);

            $flag.setAttribute('src', country.flag);
            $code.innerText = country.alpha3Code;
            $name.innerText = country.name;
            $capital.innerText = country.capital;
            $population.innerText = country.population;
            $area.innerText = country.area;
            $languages.innerText = setLanguages(country.languages);
            $prefix.innerText = `+${country.callingCodes}`;

            $card.style.opacity = 1;
            $card.style.zIndex = 1;
        }
    });

    xhr.open('GET', `https://restcountries.eu/rest/v2/name/${e.target.dataset.name}`);
    xhr.send();
});

$close.addEventListener('click', () =>  {
    $card.style.opacity = 0;
    $card.style.zIndex = -1
});