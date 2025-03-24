
/**
 * Instansierar övre menyn och undre menyn vid start
 * @constructor 
 * @class Main
 * @public
 */

function Main() {

    new LowerMeny();
    new UpperMeny();

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").then (
            (registration) => {
                console.log("Det gick");
            },
            (error) => {
                console.log("Det gick inte");
            },
        );
    }

}
window.addEventListener("load", function () {
    new Main();
});

