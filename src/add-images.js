import Logo from "../public/img/log_big.png";
import Iut from "../public/img/logo_urca1.png";
import icon from "../public/img/ouafnotes.ico";

export function addImages() {
    const logo = document.createElement("img");
    logo.alt = "Logo de Ouaf Notes";
    logo.classList.add("logo");
    logo.src = Logo;

    const iut = document.createElement("img");
    iut.alt = "iut-reims";
    iut.src = Iut;

    const iconIco = document.createElement("link");
    iconIco.rel = "shortcut icon";
    iconIco.type = "image/x-icon";
    iconIco.href = icon;

    document.querySelector("head").appendChild(iconIco);

    document
        .getElementById("logo-container")
        .insertBefore(logo, document.getElementById("title"));

    document
        .getElementById("onglet")
        .insertBefore(iut, document.getElementById("prevent"));
}
