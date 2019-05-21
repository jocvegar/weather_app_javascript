window.addEventListener('load', () => {
    let long;
    let lat;
    const key = 'e884029d14e690a308f904dc6e7a0dd7'

    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureNumber      = document.querySelector('.temperature-number');
    let temperatureSection     = document.querySelector('.temperature-degree');
    let temperatureUnit        = document.querySelector('.temperature-unit');
    let temperatureTitle       = document.querySelector('.location-title');
    let temperatureIcon        = document.querySelector('.location-icon');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // console.log(position);
            long = position.coords.longitude;
            lat  = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/'
            const api   = `${proxy}https://api.darksky.net/forecast/${key}/${lat},${long}`;

            fetch(api)
            .then((result) => {
                if (result.ok) {
                    return result.json();
                }
                throw new Error('Request failed!');
            }, networkError => console.log(networkError.message))
            .then((result) => {
                console.log(result);
                let { temperature, summary, icon} = result.currently;
                temperatureNumber.textContent = temperature;
                temperatureDescription.textContent = summary;
                temperatureTitle.textContent = result.timezone;
                setIcons(icon, temperatureIcon);
                changeTemperature(temperature);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
        });
    }

    setIcons = (icon, iconId) => {
        const skycons     = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconId, Skycons[currentIcon]);
    }

    changeTemperature = (temperature) => {
        temperatureSection.addEventListener('click', () => {
            if (temperatureUnit.textContent === 'F') {
                temperatureUnit.textContent = 'C';
                temperatureNumber.textContent = (Math.round((temperature - 32) * (5 / 9)*100) / 100);
            } else {
                temperatureUnit.textContent = 'F';
                temperatureNumber.textContent = temperature
            }
        })
    }
});
