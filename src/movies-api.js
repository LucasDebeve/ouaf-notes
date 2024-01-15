/**
 * Calcul le total des coefficients d'une compétence
 * @param {*} competenceId id de la colonne de la compétence
 * @returns le total des coefficients de la compétence
 */
export function totalCompetence(competenceId) {
    const lignes = document.querySelectorAll(
        "table > tbody > tr:not(#moy, #moyBonus, #total, .option)",
    );
    let total = 0;
    for (let i = 0; i < lignes.length; i += 1) {
        const ligne = lignes[i];
        const ligneId = ligne.id;
        const cellule = document.querySelector(
            `#${ligneId} > td:nth-child(${competenceId}) > input`,
        );
        if (cellule.value !== "") {
            total += parseFloat(cellule.value);
        }
    }
    return total;
}

/**
 * Récupère les notes depuis l'API
 * @param {*} url url de l'API
 * @param {*} data paramètres de la requête
 * @returns les notes, coefs et ues
 */
export async function fetchNotes(url, data = {}) {
    const body = Object.keys(data)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`,
        )
        .join("&");
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded", // x-www-form-urlencoded
            Accept: "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body,
    });
    // return await response.json();
    return response.json();
}

/**
 * Récupère les notes depuis l'API et les affiche
 * @returns
 */
export async function getNotes() {
    const loader = document.querySelector(".loader-container");
    loader.classList.remove("hidden");

    // Recupérer le username et password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const notesJson = await fetchNotes(
        "https://api-notes-dev.vercel.app/notes",
        {
            username,
            password,
        },
    );

    if (notesJson.err) {
        loader.classList.add("hidden");
        alert(notesJson.err);
    } else if (
        notesJson[0].length === 0 ||
        notesJson[0][0].matiere === "Aucune note n'a été saisie"
    ) {
        notesJson[0] = [];

        loader.classList.add("hidden");
        alert("Aucune note trouvée");
    } else if (notesJson[1].length === 0) {
        loader.classList.add("hidden");
        alert("Aucune compétence trouvée");
    } else {
        // Mémoriser les notes, coefs et ues dans le local storage
        localStorage.setItem("notes", JSON.stringify(notesJson));
        return notesJson;
        /*
        display_notes(notesJson[0], notesJson[1], notesJson[2]);

        loader.classList.add("hidden");

        const formContainer = document.getElementById("formContainer");
        formContainer.style.display = "none";
        */
    }
    return null;
}

/**
 * Calcul la moyenne d'une matière
 * @param ueCount
 * @param {*} lineId id de la ligne de la matière
 * @returns la moyenne de la matière
 */
export function calculMoyenneMatiere(ueCount, lineId) {
    // Si le nombre de competences est paire, il faut ajouter 1 pour avoir le bon nombre de colonnes
    const occurences = ["2n+1", "2n"];
    if (ueCount % 2 !== 0) {
        occurences.reverse();
    }
    const notes = document.querySelectorAll(
        `#${lineId} td:nth-child(n+${ueCount + 2}):nth-child(${
            occurences[0]
        }):not(:last-child) > input`,
    );
    const coefs = document.querySelectorAll(
        `#${lineId} td:nth-child(n+${ueCount + 3}):nth-child(${
            occurences[1]
        }):not(:last-child) > input`,
    );
    const notesVides = Array.from(notes).filter((note) => note.value === "");
    if (notesVides.length === notes.length) {
        document.querySelector(`#${lineId} input[type=checkbox]`).checked =
            false;
        document.querySelector(`#${lineId}`).classList.add("option");
        return 0;
    }
    // Somme des notes * coef
    let sommeNotesCoef = 0;
    let sommeCoef = 0;
    notes.forEach((note, id) => {
        if (note.value !== "" && coefs[id].value !== "") {
            sommeNotesCoef +=
                parseFloat(note.value.replace(",", ".")) *
                parseFloat(coefs[id].value.replace(",", "."));
            sommeCoef += parseFloat(coefs[id].value.replace(",", "."));
        } else {
            sommeCoef += 0;
        }
    });
    return Math.round((sommeNotesCoef / sommeCoef) * 1000) / 1000;
}

/**
 * Calcul la moyenne générale du bulletin
 * @param {int} totalCoefs Somme des coefficients de chaque matière
 * @param {array} moyennesMatieres Moyenne de chaque matière
 * @returns la moyenne générale du bulletin
 */
export function moyenneTotale(totalCoefs, moyennesMatieres) {
    let somme = 0;
    totalCoefs.forEach((coef, id) => {
        somme += coef * moyennesMatieres[id];
    });
    return (
        Math.round((somme / totalCoefs.reduce((a, b) => a + b, 0)) * 1000) /
        1000
    );
}

/**
 * Calcul la moyenne de l'intranet
 * @param {*} moyennesMatieres  Moyenne de chaque matière
 * @returns la moyenne de l'intranet
 */
export function moyenneIntranet(moyennesMatieres) {
    let somme = 0;
    moyennesMatieres.forEach((moyenne, id) => {
        somme += moyennesMatieres[id];
    });
    return somme / moyennesMatieres.length;
}

/**
 * Calcul la moyenne d'une compétence
 * @param {*} competenceId id de la colonne de la compétence
 * @returns la moyenne de la compétence
 */
export function moyenneCompetence(competenceId) {
    const lignes = document.querySelectorAll(
        "table > tbody > tr:not(#moy, #moyBonus, #total, .option)",
    );
    let somme = 0;
    lignes.forEach((ligne) => {
        const ligneId = ligne.id;
        const cellule = document.querySelector(
            `#${ligneId} > td:nth-child(${competenceId}) > input`,
        );
        if (cellule.value !== "") {
            const coef = parseFloat(cellule.value);
            const moyenne = parseFloat(
                document.querySelector(`#${ligneId} > td:last-child`).innerHTML,
            );
            somme += coef * moyenne;
        }
    });
    return somme !== 0 ? somme / totalCompetence(competenceId) : 0;
}

/**
 * Calcul la moyenne d'une compétence avec bonus
 * @param competenceId
 * @return bonus
 */
export function moyenneBonus(competenceId) {
    const moyenne = parseFloat(
        document.querySelector(`#moy > td:nth-child(${competenceId})`)
            .innerHTML,
    );
    // Si la ligne de bonus existe
    const ligneBonus = document.querySelector("#bonus");
    let bonus = 0;
    if (ligneBonus) {
        bonus =
            document.querySelector("#bonus").classList[0] !== "option"
                ? parseFloat(
                      document.querySelector("#bonus > td:last-child")
                          .innerHTML,
                  )
                : 0;
    }

    return Math.min(
        Math.max(Math.round((moyenne + 0.5 * (bonus / 20)) * 1000) / 1000, 0),
        20,
    );
}
