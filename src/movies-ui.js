import Chart from "chart.js/auto";
import {
    calculMoyenneMatiere,
    moyenneBonus,
    moyenneCompetence,
    moyenneIntranet,
    moyenneTotale,
    totalCompetence,
    getNotes,
} from "./movies-api";

export const moyennes = {
    moyennesMatieres: [],
    moyennesCompetences: [],
};

/**
 * Change le color scheme du navigateur en fonction de la checkbox
 */
export function changeColorTheme() {
    if (document.getElementById("darkMode").checked) {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}

/**
 * Compte le nombre de compétences
 * @returns le nombre de compétences
 */
export function compterCompetences() {
    const competences = document.querySelectorAll(".ue");
    return competences.length;
}

/**
 * Affiche la moyenne d'une matière
 * @param lineId
 */
export function showMoyenneMatiere(lineId) {
    // Moyenne
    document.querySelector(`#${lineId} td:last-child`).innerHTML =
        calculMoyenneMatiere(compterCompetences(), lineId).toString();
}

/**
 * Affiche la moyenne générale du bulletin
 * @param totalCoefs
 * @param moyennesMatieres
 */
export function showMoyenneTotale(totalCoefs, moyennesMatieres) {
    const celluleMoyenne = document.querySelector("#moyenneGenerale");
    const moyenne = moyenneTotale(totalCoefs, moyennesMatieres);
    celluleMoyenne.innerHTML = `<abbr title='Moyenne du bulletin (Pondéré)'> ${
        Math.round(moyenne * 1000) / 1000
    }</abbr>`;

    if (moyenne >= 10) {
        celluleMoyenne.classList.add("good");
        celluleMoyenne.classList.remove("bad");
    } else {
        celluleMoyenne.classList.remove("good");
        celluleMoyenne.classList.add("bad");
    }
}

/**
 * Affiche la moyenne de l'intranet
 * @param moyennesMatieres
 */
export function showMoyenneIntranet(moyennesMatieres) {
    document.querySelector("#moy > td:last-child").innerHTML =
        `<abbr title='Moyenne de l&#x2019;intranet'> ${
            Math.round(moyenneIntranet(moyennesMatieres) * 1000) / 1000
        }</abbr>`;
}

/**
 * Affiche la moyenne d'une compétence
 * @param competenceId
 * @returns la moyenne de la compétence
 */
export function showMoyenneCompetence(competenceId) {
    const moyenne = Math.round(moyenneCompetence(competenceId) * 1000) / 1000;
    document.querySelector(`#moy > td:nth-child(${competenceId})`).innerHTML =
        moyenne.toString();
    return moyenne;
}

/**
 * Affiche la moyenne d'une compétence avec bonus
 * @param competenceId
 */
export function showMoyenneBonus(competenceId) {
    const moyenne = moyenneBonus(competenceId);
    const celluleMoyenne = document.querySelector(
        `#moyBonus > td:nth-child(${competenceId})`,
    );
    celluleMoyenne.innerHTML = moyenne;

    if (
        moyenne >= 10 &&
        document.querySelector(`#total > td:nth-child(${competenceId})`)
            .innerHTML !== "0"
    ) {
        celluleMoyenne.classList.add("good");
        celluleMoyenne.classList.remove("bad");
        celluleMoyenne.classList.remove("neutral");
    } else if (
        moyenne < 10 &&
        document.querySelector(`#total > td:nth-child(${competenceId})`)
            .innerHTML !== "0"
    ) {
        celluleMoyenne.classList.remove("good");
        celluleMoyenne.classList.add("bad");
        celluleMoyenne.classList.remove("neutral");
    } else {
        celluleMoyenne.classList.remove("good");
        celluleMoyenne.classList.remove("bad");
        celluleMoyenne.classList.add("neutral");
    }
}

/**
 *  Compte les colonnes de notes
 * @returns le nombre de colonnes de notes
 */
export function compterColonnesNotes() {
    const colonnes = document.querySelectorAll("table > thead > tr > th");
    let nbColonnes = 0;
    colonnes.forEach((colonne) => {
        if (colonne.innerHTML === "Note") {
            nbColonnes += 1;
        }
    });
    return nbColonnes;
}

/**
 * Ajoute une colonne de note et de coef
 * @returns
 */
export function ajouterColonneNoteCoef() {
    if (compterColonnesNotes() >= 7) {
        return;
    }
    // Ajouter les titre des colonnes avant la colonne de moyenne des matière
    const moyenneMatiere = document.querySelector(
        "table > thead > tr > th:last-child",
    );
    moyenneMatiere.insertAdjacentHTML("beforebegin", "<th>Note</th>");
    moyenneMatiere.insertAdjacentHTML("beforebegin", "<th>Coefficient</th>");

    // Ajouter les inputs avant la colonne de moyenne des matière
    const lignes = document.querySelectorAll(
        "table > tbody > tr:not(#moy, #moyBonus, #total)",
    );
    lignes.forEach((ligne) => {
        const ligneId = ligne.id;
        const moyenneDeMatiere = document.querySelector(
            `#${ligneId} > td:last-child`,
        );
        moyenneDeMatiere.insertAdjacentHTML(
            "beforebegin",
            "<td><input type='number' value='' min='0' max='100' step='1'></td>",
        );
        moyenneDeMatiere.insertAdjacentHTML(
            "beforebegin",
            "<td><input type='number' value='' min='0' max='20' step='0.01'></td>",
        );
    });

    // Ajouter des cellules vides dans la ligne de moyenne et total
    const moyenne = document.querySelector("#moy > td:last-child");
    moyenne.insertAdjacentHTML("beforebegin", "<td></td>");
    moyenne.insertAdjacentHTML("beforebegin", "<td></td>");
    const total = document.querySelector("#total > td:last-child");
    total.insertAdjacentHTML("beforebegin", "<td></td>");
    total.insertAdjacentHTML("beforebegin", "<td></td>");
}

/**
 * Supprime une colonne de note et de coef
 * @returns
 */
export function supprimerColonneNoteCoef() {
    if (compterColonnesNotes() <= 1) {
        return;
    }
    // Supprimer les titre des colonnes avant la colonne de moyenne des matière
    const colonnesASupprimer = document.querySelectorAll(
        "table > thead > tr > th:nth-last-child(-n+3):not(:last-child)",
    );
    colonnesASupprimer.forEach((colonne) => colonne.remove());
    // Supprimer les inputs avant la colonne de moyenne des matière
    const lignes = document.querySelectorAll(
        "table > tbody > tr:not(#moy, #moyBonus, #total)",
    );
    for (let i = 0; i < lignes.length; i += 1) {
        const ligne = lignes[i];
        const ligneId = ligne.id;
        const colonneASupprimer = document.querySelectorAll(
            `#${ligneId} > td:nth-last-child(-n+3):not(:last-child)`,
        );
        colonneASupprimer.forEach((colonne) => colonne.remove());
    }
    // Supprimer des cellules vides dans la ligne de moyenne et total
    const moyenne = document.querySelectorAll(
        "#moy > td:nth-last-child(-n+3):not(:last-child)",
    );
    const total = document.querySelectorAll(
        "#total > td:nth-last-child(-n+3):not(:last-child)",
    );
    for (let i = 0; i < moyenne.length; i += 1) {
        moyenne[i].remove();
        total[i].remove();
    }
}

/**
 * Calcul le total des coefficients d'une matière
 * @returns le total des coefficients de la matière
 * @param lineId
 */
export function calculTotalCoef(lineId) {
    let total = 0;
    const coef = document.querySelectorAll(
        `#${lineId} > td:nth-child(-n+${compterCompetences() + 1}) > input`,
    );
    // Transform coef to array
    coef.forEach((c) => {
        if (c.value !== "") {
            total += parseFloat(c.value.replace(",", "."));
        }
    });

    // A changer
    if (total === 0) {
        total = 1;
    }
    document.querySelector(`#${lineId} > .totalCoef`).innerHTML = total;
    return total;
}

export function showTotalCompetence(competenceId) {
    document.querySelector(
        `#total > td:nth-child(${competenceId}) > input`,
    ).value = totalCompetence(competenceId);
}

export function updateCharts(chartPanel) {
    if (moyennes.moyennesCompetences.length === 0) {
        return;
    }

    chartPanel.innerHTML = `
<div class="chart-container">
    <canvas id="competences-chart" style="height: 60vh;"></canvas>
</div>
<div class="chart-container">
    <canvas id="matieres-chart" style="height: 60vh;"></canvas>
</div>`;

    const options = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                suggestedMin: 0,
                suggestedMax: 20,
            },
        },
    };
    const ctxCompetences = document.getElementById("competences-chart");
    const ctxMatieres = document.getElementById("matieres-chart");
    const chartCompetences = new Chart(ctxCompetences, {
        type: "radar",
        options,
        data: {
            labels: moyennes.moyennesCompetences.map(
                (competence) => competence.nom,
            ),
            datasets: [
                {
                    label: "Moyennes par compétences",
                    data: moyennes.moyennesCompetences.map(
                        (competence) => competence.moyenne,
                    ),
                    fill: true,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgb(255, 99, 132)",
                    pointBackgroundColor: "rgb(255, 99, 132)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(255, 99, 132)",
                },
            ],
        },
    });
    console.log(
        moyennes.moyennesMatieres
            .map((competence) =>
                competence.nom === "bonus" ? null : competence.nom,
            )
            .filter((competence) => competence !== null),
    );
    const chartMatiere = new Chart(ctxMatieres, {
        type: "radar",
        options,
        data: {
            labels: moyennes.moyennesMatieres
                .map((competence) =>
                    competence.nom === "bonus" ? null : competence.nom,
                )
                .filter((competence) => competence !== null),
            datasets: [
                {
                    label: "Moyennes par matières",
                    data: moyennes.moyennesMatieres
                        .map((competence) =>
                            competence.nom === "bonus"
                                ? null
                                : competence.moyenne,
                        )
                        .filter((competence) => competence !== null),
                    fill: true,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgb(54, 162, 235)",
                    pointBackgroundColor: "rgb(54, 162, 235)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgb(54, 162, 235)",
                },
            ],
        },
    });
}

/**
 * Actualise les totaux et moyennes
 */
export function update() {
    moyennes.moyennesMatieres = [];
    moyennes.moyennesCompetences = [];
    // Parcours des colonnes des compétences
    const competences = document.querySelectorAll(
        `table > thead > tr:not(.option) > th:nth-child(-n+${
            compterCompetences() + 1
        }):not(:first-child)`,
    );
    competences.forEach((competence, id) => {
        showTotalCompetence(id + 2);
    });
    // Parcours de l'ensemble des lignes du tableau
    const lignes = document.querySelectorAll(
        "table > tbody > tr:not(#moy, #moyBonus, .option)",
    );

    const total = [];
    const moyenne = [];
    lignes.forEach((ligne) => {
        const ligneId = ligne.id;

        total.push(calculTotalCoef(ligneId));
        if (ligneId !== "total") {
            const moyenneMatiere = calculMoyenneMatiere(
                compterCompetences(),
                ligneId,
            );
            moyennes.moyennesMatieres.push({
                nom: ligneId,
                moyenne: moyenneMatiere,
            });
            moyenne.push(moyenneMatiere);
            showMoyenneMatiere(ligneId);
        }
    });
    showMoyenneTotale(total.slice(0, total.length - 1), moyenne);
    showMoyenneIntranet(moyenne);

    // Calcul de la moyenne par competence

    /*
    for (let i = 0; i < competences.length; i += 1) {
        moyenneCompetence(i + 2);
        moyenneBonus(i + 2);
    }
    */
    competences.forEach((competence, id) => {
        moyennes.moyennesCompetences.push({
            nom: competence.innerHTML,
            moyenne: showMoyenneCompetence(id + 2),
        });
        showMoyenneBonus(id + 2);
    });
    document
        .querySelectorAll("main input[type='checkbox']")
        .forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                // Get checkbox parent row
                const ligne = checkbox.parentNode.parentNode;
                if (checkbox.checked) {
                    ligne.classList.remove("option");
                } else {
                    ligne.classList.add("option");
                }
            });
        });

    const chartPanel = document.getElementById("chart-panel");
    updateCharts(chartPanel);
}

/**
 * Affiche toutes les informations du bulletin
 * @param notesObj
 * @param ues
 * @param coefs
 */
export function displayNotes(notesObj, ues, coefs) {
    // Supprimer les entetes de UE
    const colonneUes = document.querySelectorAll("thead > tr > th.ue");

    if (colonneUes.length > 0) {
        for (let i = 0; i < colonneUes.length; i += 1) {
            colonneUes[i].remove();
        }
    }
    // Supprimer toutes les lignes de matières
    const allLignes = document.querySelectorAll("tbody > tr");
    if (allLignes.length > 0) {
        for (let i = 0; i < allLignes.length; i += 1) {
            allLignes[i].remove();
        }
    }

    // Compter le nombre max de notes par matière
    let maxEval = 0;
    notesObj.forEach((noteObj) => {
        if (noteObj.evaluations.length > maxEval) {
            maxEval = noteObj.evaluations.length;
        }
    });

    const nbColonnesNotes = compterColonnesNotes();

    // Ajouter ou supprimer des colonnes de notes et de coef
    if (maxEval > nbColonnesNotes) {
        for (let i = 0; i < maxEval - nbColonnesNotes; i += 1) {
            ajouterColonneNoteCoef();
        }
    } else if (maxEval < nbColonnesNotes) {
        for (let i = 0; i < nbColonnesNotes - maxEval; i += 1) {
            supprimerColonneNoteCoef();
        }
    }

    // Ajouter les entetes de UE
    ues.forEach((ue) => {
        const enteteUe = document.createElement("th");
        enteteUe.classList.add("ue");
        enteteUe.innerHTML = ue.name;
        const enteteTotal = document.querySelector("#totalCoef");
        enteteTotal.insertAdjacentElement("beforebegin", enteteUe);
    });

    // Ajouter la ligne des totaux et moyennes
    const nbCompetences = ues.length;
    const nbColonnesTotal = nbCompetences + compterColonnesNotes() * 2 + 2;
    const ligneTotal = document.createElement("tr");
    const ligneMoy = document.createElement("tr");
    ligneTotal.id = "total";
    ligneMoy.id = "moy";
    ligneTotal.innerHTML = "<th>Total</th>";
    ligneMoy.innerHTML = "<th>Moyenne</th>";
    for (let i = 0; i < nbColonnesTotal; i += 1) {
        if (i === nbCompetences) {
            ligneTotal.innerHTML += "<td class='totalCoef'></td>";
        } else {
            ligneTotal.innerHTML +=
                "<td><input type='number' value='' min='0' step='1'></td>";
        }
        ligneMoy.innerHTML += "<td></td>";
    }
    ligneTotal.lastChild.id = "moyenneGenerale";
    document.querySelector("table tbody").appendChild(ligneTotal);
    document.querySelector("table tbody").appendChild(ligneMoy);
    // Ajouter les colonnes de bonus
    const ligneMoyBonus = document.createElement("tr");
    ligneMoyBonus.innerHTML = "<th>+ Bonus</th>";
    for (let i = 0; i < nbCompetences; i += 1) {
        ligneMoyBonus.innerHTML += "<td></td>";
    }
    ligneMoyBonus.id = "moyBonus";
    document.querySelector("table tbody").appendChild(ligneMoyBonus);

    // Ajouter les lignes de matières
    // On récupère la matière Bonus
    const matiereBonus = notesObj.filter(
        (matiere) =>
            matiere.matiere.toUpperCase().includes("BONIFICATION") ||
            matiere.matiere.toUpperCase().includes("BONUS"),
    );

    notesObj.forEach((noteObj, i) => {
        const ligneMatiere = document.createElement("tr");
        if (noteObj.matiere.includes("Bonification")) {
            ligneMatiere.id = "bonus";
        } else {
            // Remplacer les caractères spéciaux par des _
            ligneMatiere.id = noteObj.matiere.replace(/[^a-zA-Z0-9]/g, "_");
        }
        ligneMatiere.innerHTML = `<th><input id='${i}' type='checkbox' checked/>${notesObj[i].matiere}</th>`;
        // Colonnes des coefficients
        for (let j = 0; j < ues.length; j += 1) {
            let w = 0;
            while (
                w < coefs.length &&
                !coefs[w].matiere.includes(noteObj.matiere)
            ) {
                w += 1;
            }
            let k = 0;
            while (
                k < coefs[w].coefs.length &&
                coefs[w].coefs[k].ue !== ues[j].id
            ) {
                k += 1;
            }

            if (k < coefs[w].coefs.length) {
                ligneMatiere.innerHTML += `<td> <input type='number' value='${coefs[w].coefs[k].coef}' min='0' step='1'></td>`;
            } else {
                ligneMatiere.innerHTML +=
                    "<td><input type='number' value='' min='0' step='1'></td>";
            }
        }
        // Colonnes du total des coefficients
        ligneMatiere.innerHTML += "<td class='totalCoef'></td>";
        // Si aucune note n'est renseignée, ajouter une colonne note=0 et coef=1 puis des colonnes vides
        if (noteObj.evaluations.length === 0) {
            // decoché la la case à chocher pour ne pas afficher la matière
            document.querySelector(
                `#${ligneMatiere.id} input[type=checkbox]`,
            ).checked = false;
            for (let j = 0; j < maxEval; j += 1) {
                ligneMatiere.innerHTML +=
                    "<td><input type='number' value='' min='0' max='20' step='0.01'></td>";
                ligneMatiere.innerHTML +=
                    "<td><input type='number' value='' min='0' max='100' step='1'></td>";
            }
        } else {
            // Colonnes des notes
            for (let j = 0; j < maxEval; j += 1) {
                if (noteObj.evaluations[j]) {
                    ligneMatiere.innerHTML += `<td><input type='number' value='${noteObj.evaluations[j].note}' min='0' max='20' step='0.01'></td>`;
                    ligneMatiere.innerHTML += `<td><input type='number'' value='${noteObj.evaluations[j].coefficient}' min='0' max='100' step='1'></td>`;
                } else {
                    ligneMatiere.innerHTML +=
                        "<td><input type='number' value='' min='0' max='20' step='0.01'></td>";
                    ligneMatiere.innerHTML +=
                        "<td><input type='number'' value='' min='0' max='100' step='1'></td>";
                }
            }
        }
        // Colonnes de la moyenne de la matière
        ligneMatiere.innerHTML += "<td></td>";

        // Ajouter la ligne au tableau, avant la ligne des totaux
        const ligneMoyenne = document.querySelector("#total");
        ligneMoyenne.insertAdjacentElement("beforebegin", ligneMatiere);
    });

    update();
}

export function exportAsPdf() {
    window.print();
}

export function displayChart() {
    const chart = document.getElementById("chart-panel");
    chart.classList.toggle("hidden");
    document.querySelector("main > table").classList.toggle("hidden");
}

export async function updateEvents() {
    const chartPanel = document.getElementById("chart-panel");
    document.getElementById("export").addEventListener("click", exportAsPdf);

    document.getElementById("darkMode").addEventListener("change", () => {
        changeColorTheme();
    });

    document.getElementById("get-notes").addEventListener("click", () => {
        getNotes().then((note) => {
            displayNotes(note[0], note[1], note[2]);
            document.querySelector(".loader-container").classList.add("hidden");

            const formContainer = document.getElementById("formContainer");
            formContainer.style.display = "none";
        });
    });

    document.getElementById("update").addEventListener("click", () => {
        update();
    });

    document.getElementById("ajouter").addEventListener("click", () => {
        ajouterColonneNoteCoef();
    });
    document.getElementById("supprimer").addEventListener("click", () => {
        supprimerColonneNoteCoef();
    });

    document.getElementById("chart").addEventListener("click", () => {
        displayChart();
    });

    document.getElementById("showFormButton").addEventListener("click", () => {
        const formContainer = document.getElementById("formContainer");
        formContainer.style.display = "flex";
    });

    document.getElementById("CloseFormButton").addEventListener("click", () => {
        const formContainer = document.getElementById("formContainer");
        formContainer.style.display = "none";
    });

    document.querySelectorAll("input[type='number']").forEach((input) => {
        input.addEventListener("change", update);
    });
}
