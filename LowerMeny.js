/**
 * Skapar den undre menyn som instansierar och hanterar post-its samt deras förhållande till vädrer
 * @constructor
 * @class LowerMeny
 * @public
 */
function LowerMeny() {

    /**
     * Array för alla skapade post-its
     * @type {Array<PostIt>}
     */
    this.allPostIts = [];

    this.lowerHolder = document.getElementById("lowerHolder");
    this.board = document.getElementById("board");

    /**
     * Knapp för att skapa post-its
     * @type {HTMLElement}
     */
    this.postItBtn = document.createElement("button");
    this.postItBtn.id = "postItBtn";
    this.postItBtn.innerText = "Ny post-it";
    this.lowerHolder.append(this.postItBtn);

    /**
     * Räknare för hur många post-ist som finns på tavlan
     * @type {HTMLElement}
     */
    this.counter = document.createElement("p");
    this.counter.id = "counter";
    this.lowerHolder.append(this.counter);

    /**
     * Soptunna för att kunna radera post-its
     * @type {HTMLElement}
     */
    this.trashCan = document.createElement("div");
    this.trashCan.id = "trashCan";
    this.lowerHolder.append(this.trashCan);


    this.loadSavedPostIts();
    this.updateCounter();
    this.postItMaker();

}


/**
 * @private
 * @returns {void}
 */
LowerMeny.prototype.postItMaker = function () {

    var boardRect = this.board.getBoundingClientRect();
    

    document.getElementById("postItBtn").addEventListener("click", function () {

        var popUp = document.getElementById("popupDiv")
        if (popUp) {
            return
        } else {

            /**
             * Div för popup ruta
             * @type {HTMLElement}
             */
            var popupDiv = document.createElement("div");
            popupDiv.id = "popupDiv";

            var popupForm = document.createElement("form");

            /**
             * Knapp för att stänga popup 
             * @type {HTMLElement}
             */
            var closeBtn = document.createElement("button");
            closeBtn.innerText = "X";
            closeBtn.className = "closePopUpBtn";
            closeBtn.setAttribute("type", "button");

            var h1 = document.createElement("h1");
            h1.innerText = "Skapa en post it";
            h1.id = "postItH1";

            var label = document.createElement("label");
            label.innerText = "Skriv ett litet meddelande!";

            /**
             * För att sätta innehållet i post-it
             * @type {HTMLElement}
             */
            var input = document.createElement("textarea");
            input.setAttribute("type", "text");
            input.setAttribute("rows", 2);
            input.setAttribute("maxlength", 25);

            var createBtn = document.createElement("button");
            createBtn.innerText = "Spara";
            createBtn.id = "createBtn";
            createBtn.setAttribute("type", "button");

            popupDiv.style.zIndex = Math.floor(Date.now() / 1000);
            popupDiv.style.position = "relative";
            popupForm.append(closeBtn, h1, label);
            label.append(input);
            popupDiv.append(popupForm, createBtn);
            document.body.append(popupDiv);
        }

        /**
         * Skapar en instans av post-it och sätter id, plats och innehåll samt sparar dessa
         */
        createBtn.addEventListener("click", function () {
            var content = input.value;
            if (content == "") {
                alert("Du kanske ska testa att skriva något innan du försöker trycka på spara");
            } else {
                var newPostIt = new PostIt(content);
                newPostIt.makeDraggable();
                this.allPostIts.push(newPostIt);
                var id = Math.floor(Date.now() / 1000);

                var margin = 80;

                var left = Math.random() * (boardRect.width - newPostIt.postItDiv.offsetWidth - margin * 2) + margin;
                var top = Math.random() * (boardRect.height - newPostIt.postItDiv.offsetHeight - margin * 2) + margin;

                newPostIt.postItDiv.style.position = "absolute";
                newPostIt.postItDiv.style.left = left + "px";
                newPostIt.postItDiv.style.top = top + "px";

                this.saveToLocalStorage(id, content, left, top);
                this.board.append(newPostIt.postItDiv);
                popupDiv.remove();
                this.updateCounter();
            }
        }.bind(this));

        closeBtn.addEventListener("click", function () {
            popupDiv.remove();
            this.updateCounter();
        }.bind(this));

        document.addEventListener("touchstart", function (e) {
            if (!popupDiv.contains(e.target) && e.target !== this.postItBtn) {
                popupDiv.remove();
            }
        }.bind(this))

    }.bind(this));

    this.movePostIt();

}


/**
 * Hanterar när en post-it flyttas 
 * @private
 * @returns {void}
 */
LowerMeny.prototype.movePostIt = function () {

    /**
     * För att spara positionen innan post-its dras
     */
    document.addEventListener("touchstart", function () {

        for (var i = 0; i < this.allPostIts.length; i++) {
            var postIt = this.allPostIts[i];
            postIt.originalX = postIt.postItDiv.offsetLeft;
            postIt.originalY = postIt.postItDiv.offsetTop;
        }


    }.bind(this))

    /**
     * Raderar pos-it om den är över soptunnan och flyttar tillbaka den om den dras och släpps utanför tavlan
     */
    document.addEventListener("touchend", function () {

        var trashRect = this.trashCan.getBoundingClientRect();
        var boardRect = this.board.getBoundingClientRect();

        for (var i = 0; i < this.allPostIts.length; i++) {
            var postIt = this.allPostIts[i];
            var postRect = postIt.postItDiv.getBoundingClientRect();

            if (!(postRect.right < trashRect.left ||
                postRect.left > trashRect.right ||
                postRect.bottom < trashRect.top ||
                postRect.top > trashRect.bottom)) {
                this.removeFromLocalStorage(postIt.id);
                postIt.postItDiv.remove();
                this.allPostIts.splice(i, 1);
                this.updateCounter();
                break;
            }
            this.updatePosition(postIt);

            if ((postRect.left < boardRect.left ||
                postRect.right > boardRect.right ||
                postRect.top < boardRect.top ||
                postRect.bottom > boardRect.bottom)) {
                
                postIt.postItDiv.style.left = postIt.originalX + "px";
                postIt.postItDiv.style.top = postIt.originalY + "px";
                this.updatePosition(postIt);
                break;
            }
        }
    }.bind(this));

    this.wheatherHandler();

}


/**
 * Används både för att uppdatera räknare och stänga av post-it knapp när gränsen nås
 * @private
 * @return {void}
 */
LowerMeny.prototype.updateCounter = function () {

    this.counter.innerText = this.allPostIts.length + "/20";

    if (this.allPostIts.length >= 20) {
        this.postItBtn.disabled = true;
    } else {
        this.postItBtn.disabled = false;
    }
}



/**
 * Sparar post-it till localstorage, returnerar en tom array om det inte finns några
 * @param {number} id - för att hålla koll på specifik instans av post-it
 * @param {string} content - textinnehåll för post-it
 * @param {number} left - horisontell position
 * @param {number} top - vertikal position
 * @returns {void}
 */
LowerMeny.prototype.saveToLocalStorage = function (id, content, left, top) {

    var postIts = JSON.parse(localStorage.getItem("postIts")) || [];
    postIts.push({ id: id, text: content, left: left, top: top });
    localStorage.setItem("postIts", JSON.stringify(postIts));
}



/**
 * Hämtar alla sparade post-its, returnerar en tom array om det inte finns några
 * @returns {void}
 */
LowerMeny.prototype.loadSavedPostIts = function () {
    var postIts = JSON.parse(localStorage.getItem("postIts")) || [];

    for (var i = 0; i < postIts.length; i++) {
        var postIt = postIts[i];
        var makeSavedPostIts = new PostIt(postIt.text);
        makeSavedPostIts.id = postIt.id;

        makeSavedPostIts.postItDiv.style.position = "absolute";
        makeSavedPostIts.postItDiv.style.left = postIt.left + "px";
        makeSavedPostIts.postItDiv.style.top = postIt.top + "px";

        this.board.append(makeSavedPostIts.postItDiv);
        this.allPostIts.push(makeSavedPostIts);
        makeSavedPostIts.makeDraggable();
    }

}

/**
 * Tar bort post-it
 * @param {number} id - för att hålla koll på specifik instans av post-it
 * @returns {void}
 */
LowerMeny.prototype.removeFromLocalStorage = function (id) {
    var postIts = JSON.parse(localStorage.getItem("postIts"));

    for (var i = 0; i < postIts.length; i++) {
        if (postIts[i].id == id) {
            postIts.splice(i, 1);
            break;
        }
    }

    localStorage.setItem("postIts", JSON.stringify(postIts));
}


/**
 * Updaterar post-its position
 * @param {object} postIt - själva post-it objektet
 * @returns {void}
 */
LowerMeny.prototype.updatePosition = function (postIt) {

    var postIts = JSON.parse(localStorage.getItem("postIts"));

    for (var i = 0; i < postIts.length; i++) {
        if (postIts[i].id == postIt.id) {
            postIts[i].left = parseFloat(postIt.postItDiv.style.left);
            postIts[i].top = parseFloat(postIt.postItDiv.style.top);
            break;
        }
    }
    localStorage.setItem("postIts", JSON.stringify(postIts));
}


/**
 * Hanterar post-its utifrån vädret
 * @returns {void}
 */
LowerMeny.prototype.wheatherHandler = function () {

    var blowing = localStorage.getItem("wind");
   
    var raining = localStorage.getItem("rain");

    /**
     * Simulering av väder
     *  var blowing = 0;
        var raining = 0;
     * 
     */
   

    var background = document.getElementById("holder");

    if (blowing > 5) {
        localStorage.clear();
        background.style.background = "rgb(104, 132, 143)";
        this.allPostIts = [];
        this.updateCounter();
    }

    if (raining > 0) {
        background.style.background = "rgb(104, 132, 143)";
        for (var i = 0; i < this.allPostIts.length; i++) {
            this.allPostIts[i].postItDiv.classList.add("rainyPost");
        }
    }


}
