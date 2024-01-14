import Logo from "../public/img/log_big.png";
import Iut from "../public/img/logo_urca1.png";

export function addImages() {
    const logo = document.createElement("img");
    logo.alt = "Logo de Ouaf Notes";
    logo.classList.add("logo");
    logo.src = Logo;

    const iut = document.createElement("img");
    iut.alt = "iut-reims";
    iut.src = Iut;

    document
        .getElementById("logo-container")
        .insertBefore(logo, document.getElementById("title"));

    document
        .getElementById("onglet")
        .insertBefore(iut, document.getElementById("prevent"));
}
