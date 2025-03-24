
/**
 * Skapar en post-it
 * @constructor
 * @class PostIt
 * @public
 * @param {string} content - Innehållet för post-it som användaren själv sätter
 */
function PostIt(content) {

    this.postItDiv = document.createElement("div");
    this.postItDiv.className = "postItDiv";

    this.pin = document.createElement("div");
    this.pin.className = "pin";

    /** 
     * Behållare för post-it inehåll
     * @type {HTMLElement} */
    this.postItContent = document.createElement("p");
    this.postItContent.innerText = content;
    this.postItContent.className = "postItContent";

    this.postItDiv.append(this.pin);
    this.postItDiv.append(this.postItContent);


    /**
     * Gör det möjligt att dra och flytta post-it
     * @returns {void}
     */
    this.makeDraggable = function () {

        /**
         * Håller koll på om post-it dras
         * @type {boolean}
         */
        var dragged = false;

        /**
         * X och Y offset när post-it dras
         *  @type {number} 
         */
        var offsetX, offsetY;

        this.postItDiv.addEventListener("touchstart", function (e) {
            dragged = true;

            var touch = e.touches[0];
            offsetX = touch.clientX - this.postItDiv.offsetLeft;
            offsetY = touch.clientY - this.postItDiv.offsetTop;

            this.postItDiv.style.zIndex = Math.floor(Date.now() / 1000);

            e.preventDefault();
        }.bind(this));

        document.addEventListener("touchmove", function (e) {
            if (dragged) {
                var touch = e.touches[0];
                //this.postItDiv.style.position = 'absolute';
                this.postItDiv.style.left = touch.clientX - offsetX + 'px';
                this.postItDiv.style.top = touch.clientY - offsetY + 'px';
            }
            e.preventDefault();
        }.bind(this));

        document.addEventListener("touchend", function () {
            dragged = false;
        }.bind(this));
    }


}