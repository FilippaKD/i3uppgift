
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

        this.postItDiv.addEventListener('mousedown', function (e) {
            dragged = true;

            offsetX = e.clientX - this.postItDiv.offsetLeft;
            offsetY = e.clientY - this.postItDiv.offsetTop;

            this.postItDiv.style.zIndex = Math.floor(Date.now() / 1000);

        }.bind(this));

        document.addEventListener('mousemove', function (e) {
            if (dragged) {
                //this.postItDiv.style.position = 'absolute';
                this.postItDiv.style.left = e.clientX - offsetX + 'px';
                this.postItDiv.style.top = e.clientY - offsetY + 'px';
            }
        }.bind(this));

        document.addEventListener('mouseup', function () {
            dragged = false;
        }.bind(this));
    }


}