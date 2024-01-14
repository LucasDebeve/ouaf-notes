import css from "./style.css";
import { displayNotes, updateEvents } from "./movies-ui";
import { addImages } from "./add-images";

if (process.env.NODE_ENV !== "production") {
    console.log("Looks like we are in development mode!");
}

addImages();
updateEvents();
// Verifie le color scheme du navigateur
const userPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
if (userPrefersDark) {
    document.getElementById("darkMode").checked = false;
    document.documentElement.setAttribute("data-theme", "dark");
} else {
    document.getElementById("darkMode").checked = true;
    document.documentElement.setAttribute("data-theme", "light");
}

// Vérifie le local storage pour récupérer les notes, coefs et ues
const notesJson = JSON.parse(localStorage.getItem("notes"));
let ueCount = 0;
if (
    notesJson &&
    notesJson.length === 3 &&
    notesJson[0].length > 0 &&
    notesJson[1].length > 0 &&
    notesJson[2].length > 0
) {
    displayNotes(notesJson[0], notesJson[1], notesJson[2]);
} else {
    ueCount = document.querySelectorAll("th.ue").length;
    const coefs = document.querySelectorAll(
        `tbody > tr:not(#moy, #moyBonus, #total, .option) > td:nth-child(n+${ueCount}${3}):nth-child(2n):not(:last-child)`,
    );
    const notes = document.querySelectorAll(
        `tbody > tr:not(#moy, #moyBonus, #total, .option) > td:nth-child(n+${ueCount}${3}):nth-child(2n-1):not(:last-child)`,
    );

    coefs.forEach((coef) => {
        coef.innerHTML = `<input type='number' value='${coef.innerHTML.replace(
            ",",
            ".",
        )}' min='0' max='100' step='1'>`;
    });
    notes.forEach((note) => {
        note.innerHTML = `<input type='number' value='${note.innerHTML.replace(
            ",",
            ".",
        )}' min='0' max='20' step='0.01'>`;
    });
    const formContainer = document.getElementById("formContainer");
    formContainer.style.display = "flex";
}
