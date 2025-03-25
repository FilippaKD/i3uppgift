
/**
 * Instansierar övre menyn och undre menyn vid start
 * @constructor 
 * @class Main
 * @public
 */

function Main() {

    new LowerMeny();
    new UpperMeny();

}
window.addEventListener("load", function () {
    new Main();
});

