/**
 * Skapar den övre menyn och visar antingen Växjös väderinfomation eller för användarens nuvarande plats
 * @constructor
 * @class UpperMeny
 * @public
 */
function UpperMeny() {

    this.upperHolder = document.getElementById("upperHolder");
    this.currentDiv = document.createElement("div");
    this.currentDiv.id = "currentDiv";

    /**
    * Visar den aktuella platsen
    * @type {HTMLElement}
    */
    this.currentLocation = document.createElement("h1");
    this.currentLocation.innerText = "Laddar";

    /**
    * Visar den aktuella temperaturen 
    * @type {HTMLElement}
    */
    this.currentTemp = document.createElement("h1");
    this.currentTemp.innerText = "..."

    this.upperHolder.append(this.currentDiv);
    this.currentDiv.append(this.currentLocation);
    this.currentDiv.append(this.currentTemp);

    /**
     * Kollar om geoLocation finns på webbläsaren och hämtar platsinformation
     */
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {

            this.lat = position.coords.latitude.toFixed(4);
            this.lon = position.coords.longitude.toFixed(4);

            this.fetchWheater(this.lat, this.lon);

        }.bind(this),
       
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {

                    alert("Om du inte tillåter att webbläsaren automatiskt hittar din plats kommer Växjö sättas, ångrar du dig? Starta om sidan och tillåt platsinformation");

                    this.lat = 56.8776;
                    this.lon = 14.8090;

                    this.fetchWheater(this.lat, this.lon);
                }
                if (error.code === error.POSITION_UNAVAILABLE) {

                    alert("Ett fel inträffade när din position skulle hämtas, testa att starta om webbläsaren");
                }

            }.bind(this))
    } else {
        alert("Geolocation stöds inte i denna webbläsaren testa en annan webbläsare om du vill använda automatisk position");
    }


    this.hamburgerMeny = document.createElement("div");
    this.hamburgerMeny.id = "hamburgerMeny";
    for (var i = 0; i < 3; i++) {
        this.bars = document.createElement("div");
        this.bars.className = "bars";
        this.hamburgerMeny.append(this.bars);
    }

    this.upperHolder.append(this.hamburgerMeny);
    this.displayWheather();

}



/**
 * Hämtar väderdata och reversar lat och lon till ett platsnamn
 * @private
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
UpperMeny.prototype.fetchWheater = function (lat, lon) {

    /**
     * URL för SMHI:s API för väderdata
     * @type {string}
     */
    var SMHIurl = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;

    /**
     * URL för openstreetmaps API för att hitta platsnamn
     * @type {string}
     */
    var openStreetMapurl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    fetch(SMHIurl)
        .then(response => response.json())
        .then(data => {
            var forecast = data.timeSeries[0];

            /**
             * Temperatur 
             * @type {number}
             */
            var temperature = forecast.parameters.find(p => p.name == "t").values[0];
    
            document.getElementById("sideMenyTemp").innerText = Math.round(temperature) + "°C";

            /**
             * Vindkraft i meter per sekund
             * @type {number}
             */
            var wind = forecast.parameters.find(p => p.name == "ws").values[0];

            /**
             * Regn i milimeter
             * @type {number}
             */
            var rain = forecast.parameters.find(p => p.name == "pmean").values[0];

            /**
             * Molnighet
             * @type {number}
             */
            var cloudy = forecast.parameters.find(p => p.name == "tcc_mean").values[0];

            localStorage.setItem("wind", wind);
            localStorage.setItem("rain", rain);

            /* för simulering av väder
            var temperature = 0;
            var wind = 0;
            var rain = 0;
            var cloudy = 0;
            */

            var descripton;
            var postItDanger;
            var wheatherEmoji;

            /**
             * Definerar väderstatus och post-it status
             */
            if (wind > 5) {
                descripton = "Det blåser";
                postItDanger = " och dina post-its har blåsit bort";
                wheatherEmoji = "🌪️";
            } else if (rain > 0) {
                descripton = "Det regnar";
                postItDanger = " och dina post-its är blöta";
                wheatherEmoji = "🌧️";
            } else if (cloudy > 4) {
                descripton = "Det är molnigt";
                postItDanger = " och dina post-its är säkra";
                wheatherEmoji = "☁️";
            } else {
                descripton = "Det är soligt";
                postItDanger = " och dina post-its är säkra";
                wheatherEmoji = "☀️";
            }


            document.getElementById("rainAndWind").innerText = descripton + postItDanger;
            document.getElementById("wheatherImg").innerText = wheatherEmoji;

            this.currentTemp.innerText = Math.round(temperature) + "°C" + wheatherEmoji;
    
            var wheatherScroll = document.getElementById("wheatherScroll");
            wheatherScroll.innerText = "";

            /**
             * Loopar för att se de kommande 10-timmars väderdata samma som ovan fast för varje timme
             */
            for (let i = 0; i < 10; i++) {

                var forecastPerHour = data.timeSeries[i];
                var time = new Date(forecastPerHour.validTime);
                var hour = time.getHours().toString().padStart(2, "0");
                var temperaturePerHour = forecastPerHour.parameters.find(p => p.name == "t").values[0];
                var windPerHour = forecastPerHour.parameters.find(p => p.name == "ws").values[0];
                var rainPerHour = forecastPerHour.parameters.find(p => p.name == "pmean").values[0];
                var cloudsPerHour = forecastPerHour.parameters.find(p => p.name == "tcc_mean").values[0];


                if (windPerHour > 5) {
                    hourEmoji = "🌪️";
                } else if (rainPerHour > 0) {
                    hourEmoji = "🌧️";
                } else if (cloudsPerHour > 4) {
                    hourEmoji = "☁️";
                } else {
                    hourEmoji = "☀️";
                }

                /**
                 * Behållare för väderdatan och timme
                 */
                var wheatherBoxs = document.createElement("div");
                wheatherBoxs.className = "wheatherBoxs";
                var wheatherDiv = document.createElement("div");
                wheatherDiv.className = "wheatherDivs";
                wheatherDiv.innerText = hour + ":00 " + Math.round(temperaturePerHour) + "°C " + hourEmoji;

                document.getElementById("wheatherScroll").append(wheatherBoxs);
                wheatherBoxs.append(wheatherDiv);
            }

        })
        .catch(error => console.error(error));

    fetch(openStreetMapurl)
        .then(response => response.json())
        .then(data => {
            if (data) {
                /**
                 * Uppdaterar platsinfomation beroende på vad som hittas 
                 */
                this.currentLocation.innerHTML = data.address.city || data.adress.county || data.adress.country;
            } else {
                this.currentLocation.innerHTML = "Okänd plats";
            }
        })
        .catch(error => console.error(error));
}



/**
 * Skapar och visar menyn för väderinfomation 
 * @private
 * @returns {void}
 */
UpperMeny.prototype.displayWheather = function () {

    var sideMeny = document.createElement("div");
    sideMeny.id = "sideMeny";
    sideMeny.style.display = "none";
    document.body.append(sideMeny);
    

    this.hamburgerMeny.addEventListener("click", function () {
        sideMeny.style.display = "block";
    });

    document.addEventListener("touchstart", function (e) {
        if (!sideMeny.contains(e.target) && e.target !== document.getElementById("hamburgerMeny")) {
            sideMeny.style.display = "none";
            sideMeny.style.zIndex = Math.floor(Date.now() / 1000);
        }
    })

    /**
     * Knapp för att stänga menyn
     * @type {HTMLElement}
     */
    var back = document.createElement("button");
    back.id = "back";
    back.innerText = "X";
    sideMeny.append(back);

    back.addEventListener("click", function () {
        sideMeny.style.display = "none";
    })

    var wheatherImg = document.createElement("div");
    wheatherImg.id = "wheatherImg";
    sideMeny.append(wheatherImg);

    var sideMenyTemp = document.createElement("div");
    sideMenyTemp.id = "sideMenyTemp";
    sideMeny.append(sideMenyTemp);

    var rainAndWind = document.createElement("div");
    rainAndWind.id = "rainAndWind";
    sideMeny.append(rainAndWind);

    var wheatherScroll = document.createElement("div");
    wheatherScroll.id = "wheatherScroll";
    sideMeny.append(wheatherScroll);

}
