// Vérifie le local storage pour récupérer les notes, coefs et ues
const notes_json = JSON.parse(localStorage.getItem("notes"));
if (
  notes_json &&
  notes_json.length === 3 &&
  notes_json[0].length > 0 &&
  notes_json[1].length > 0 &&
  notes_json[2].length > 0
) {
  display_notes(notes_json[0], notes_json[1], notes_json[2]);
} else {
  const coefs = document.querySelectorAll(
    "tbody > tr:not(#moy, #moyBonus, #total) > td:nth-child(n+9):nth-child(2n):not(:last-child)"
  );
  const notes = document.querySelectorAll(
    "tbody > tr:not(#moy, #moyBonus, #total) > td:nth-child(n+9):nth-child(2n-1):not(:last-child)"
  );

  coefs.forEach((coef) => {
    coef.innerHTML =
      "<input type='number' value='" +
      coef.innerHTML.replace(",", ".") +
      "' min='0' max='100' step='1'>";
  });
  notes.forEach((note) => {
    note.innerHTML =
      "<input type='number' value='" +
      note.innerHTML.replace(",", ".") +
      "' min='0' max='20' step='0.01'>";
  });
}

/**
 * Calcul le total des coefficients d'une matière
 * @param {*} line_id id de la ligne de la matière
 * @returns le total des coefficients de la matière
 */
function calculTotalCoef(line_id) {
  let total = 0;
  const coef = document.querySelectorAll(
    "#" + line_id + " > td:nth-child(-n+" + (compterCompetences() + 1) + ")"
  );
  for (var i = 0; i < coef.length; i++) {
    if (coef[i].innerHTML !== "") {
      total += parseFloat(coef[i].innerHTML);
    }
  }
  if (total === 0) {
    total = 1;
  }
  document.querySelector("#" + line_id + " > .totalCoef").innerHTML = total;
  return parseInt(total);
}

/**
 * Calcul la moyenne d'une matière
 * @param {*} line_id id de la ligne de la matière
 * @returns la moyenne de la matière
 */
function calculMoyenneMatiere(line_id) {
  const Notes = document.querySelectorAll(
    "#" +
      line_id +
      " td:nth-child(n+9):nth-child(2n-1):not(:last-child) > input"
  );
  const coefs = document.querySelectorAll(
    "#" + line_id + " td:nth-child(n+9):nth-child(2n):not(:last-child) > input"
  );
  // Somme des notes * coef
  let sommeNotesCoef = 0;
  let sommeCoef = 0;
  for (var i = 0; i < Notes.length; i++) {
    if (Notes[i].value !== "" && coefs[i].value !== "") {
      sommeNotesCoef +=
        parseFloat(Notes[i].value.replace(",", ".")) *
        parseFloat(coefs[i].value.replace(",", "."));
      sommeCoef += parseFloat(coefs[i].value.replace(",", "."));
    } else {
      sommeCoef += 0;
    }
  }
  // Moyenne
  document.querySelector("#" + line_id + " td:last-child").innerHTML =
    Math.round((sommeNotesCoef / sommeCoef) * 1000) / 1000;

  return Math.round((sommeNotesCoef / sommeCoef) * 1000) / 1000;
}

/**
 * Calcul la moyenne générale du bulletin
 * @param {int} totalCoefs Somme des coefficients de chaque matière
 * @param {array} moyennesMatieres Moyenne de chaque matière
 * @returns la moyenne générale du bulletin
 */
function moyenneTotale(totalCoefs, moyennesMatieres) {
  let somme = 0;
  for (var i = 0; i < totalCoefs.length; i++) {
    somme += totalCoefs[i] * moyennesMatieres[i];
  }
  const moyenne =
    Math.round((somme / totalCoefs.reduce((a, b) => a + b, 0)) * 1000) / 1000;
  const celluleMoyenne = document.querySelector("#moyenneGenerale");
  celluleMoyenne.innerHTML =
    "<abbr title='Moyenne du bulletin (Pondéré)'> " +
    Math.round(moyenne * 1000) / 1000 +
    "</abbr>";

  if (moyenne >= 10) {
    celluleMoyenne.classList.add("good");
    celluleMoyenne.classList.remove("bad");
  } else {
    celluleMoyenne.classList.remove("good");
    celluleMoyenne.classList.add("bad");
  }

  return moyenne;
}

/**
 * Calcul la moyenne de l'intranet
 * @param {*} moyennesMatieres  Moyenne de chaque matière
 */
function moyenneIntranet(moyennesMatieres) {
  let somme = 0;
  for (var i = 0; i < moyennesMatieres.length; i++) {
    somme += moyennesMatieres[i];
  }
  const moyenne = somme / moyennesMatieres.length;
  document.querySelector("#moy > td:last-child").innerHTML =
    "<abbr title='Moyenne de l&#x2019;intranet'> " +
    Math.round(moyenne * 1000) / 1000 +
    "</abbr>";
}

/**
 * Calcul le total des coefficients d'une compétence
 * @param {*} competence_id id de la colonne de la compétence
 * @returns le total des coefficients de la compétence
 */
function totalCompetence(competence_id) {
  const lignes = document.querySelectorAll(
    "table > tbody > tr:not(#moy, #moyBonus, #total)"
  );
  let total = 0;
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    const ligne_id = ligne.id;
    const cellule = document.querySelector(
      "#" + ligne_id + " > td:nth-child(" + competence_id + ")"
    );
    if (cellule.innerHTML !== "") {
      total += parseFloat(cellule.innerHTML);
    }
  }
  document.querySelector(
    "#total > td:nth-child(" + competence_id + ")"
  ).innerHTML = total;
  return total;
}

/**
 * Calcul la moyenne d'une compétence
 * @param {*} competence_id id de la colonne de la compétence
 */
function moyenneCompetence(competence_id) {
  const lignes = document.querySelectorAll(
    "table > tbody > tr:not(#moy, #moyBonus, #total)"
  );
  let somme = 0;
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    const ligne_id = ligne.id;
    const cellule = document.querySelector(
      "#" + ligne_id + " > td:nth-child(" + competence_id + ")"
    );
    if (cellule.innerHTML !== "") {
      const coef = parseFloat(cellule.innerHTML);
      const moyenne = parseFloat(
        document.querySelector("#" + ligne_id + " > td:last-child").innerHTML
      );
      somme += coef * moyenne;
    }
  }
  const moyenne = somme / totalCompetence(competence_id);
  document.querySelector(
    "#moy > td:nth-child(" + competence_id + ")"
  ).innerHTML = Math.round(moyenne * 1000) / 1000;
}

/**
 * Calcul la moyenne d'une compétence avec bonus
 * @param {*} competence_id id de la colonne de la compétence
 */
function moyenneBonus(competence_id) {
  const moyenne = parseFloat(
    document.querySelector("#moy > td:nth-child(" + competence_id + ")")
      .innerHTML
  );
  const bonus = parseFloat(
    document.querySelector("#bonus > td:last-child").innerHTML
  );
  const moyenneBonus = Math.round((moyenne + 0.5 * (bonus / 20)) * 1000) / 1000;
  const celluleMoyenne = document.querySelector(
    "#moyBonus > td:nth-child(" + competence_id + ")"
  );
  celluleMoyenne.innerHTML = moyenneBonus;

  if (moyenneBonus >= 10) {
    celluleMoyenne.classList.add("good");
    celluleMoyenne.classList.remove("bad");
  } else {
    celluleMoyenne.classList.remove("good");
    celluleMoyenne.classList.add("bad");
  }
}

/**
 * Compte le nombre de compétences
 * @returns le nombre de compétences
 */
function compterCompetences() {
  const competences = document.querySelectorAll("table > thead > tr > th.ue");
  return competences.length;
}

/**
 * Actualise les totaux et moyennes
 */
function update() {
  // Parcours des colonnes des compétences
  const competences = document.querySelectorAll(
    "table > thead > tr > th:nth-child(-n+" +
      (compterCompetences() + 1) +
      "):not(:first-child)"
  );

  for (let i = 0; i < competences.length; i++) {
    const competence = competences[i];
    totalCompetence(i + 2);
  }
  // Parcours de l'ensemble des lignes du tableau
  const lines = document.querySelectorAll(
    "table > tbody > tr:not(#moy, #moyBonus)"
  );

  let total = [];
  let moyenne = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const line_id = line.id;

    total.push(calculTotalCoef(line_id));
    if (line_id !== "total") moyenne.push(calculMoyenneMatiere(line_id));
  }

  moyenneTotale(total.slice(0, total.length - 1), moyenne);
  moyenneIntranet(moyenne);

  // Calcul de la moyenne par competence

  for (let i = 0; i < competences.length; i++) {
    const competence = competences[i];
    moyenneCompetence(i + 2);
    moyenneBonus(i + 2);
  }
}

/**
 *  Compte les colonnes de notes
 * @returns le nombre de colonnes de notes
 */
function compterColonnesNotes() {
  const colonnes = document.querySelectorAll("table > thead > tr > th");
  let nbColonnes = 0;
  for (let i = 0; i < colonnes.length; i++) {
    const colonne = colonnes[i];
    if (colonne.innerHTML === "Note") {
      nbColonnes++;
    }
  }
  return nbColonnes;
}

/**
 * Ajoute une colonne de note et de coef
 * @returns
 */
function ajouterColonneNoteCoef() {
  if (compterColonnesNotes() >= 7) {
    return;
  }
  // Ajouter les titre des colonnes avant la colonne de moyenne des matière
  const moyenneMatiere = document.querySelector(
    "table > thead > tr > th:last-child"
  );
  moyenneMatiere.insertAdjacentHTML("beforebegin", "<th>Note</th>");
  moyenneMatiere.insertAdjacentHTML("beforebegin", "<th>Coefficient</th>");

  // Ajouter les inputs avant la colonne de moyenne des matière
  const lignes = document.querySelectorAll(
    "table > tbody > tr:not(#moy, #moyBonus, #total)"
  );
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    const ligne_id = ligne.id;
    const moyenneMatiere = document.querySelector(
      "#" + ligne_id + " > td:last-child"
    );
    moyenneMatiere.insertAdjacentHTML(
      "beforebegin",
      "<td><input type='number' value='' min='0' max='100' step='1'></td>"
    );
    moyenneMatiere.insertAdjacentHTML(
      "beforebegin",
      "<td><input type='number' value='' min='0' max='20' step='0.01'></td>"
    );
  }

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
function supprimerColonneNoteCoef() {
  if (compterColonnesNotes() <= 1) {
    return;
  }
  // Supprimer les titre des colonnes avant la colonne de moyenne des matière
  const colonne_a_supprimer = document.querySelectorAll(
    "table > thead > tr > th:nth-last-child(-n+3):not(:last-child)"
  );
  for (let i = 0; i < colonne_a_supprimer.length; i++) {
    const colonne = colonne_a_supprimer[i];
    colonne.remove();
  }
  // Supprimer les inputs avant la colonne de moyenne des matière
  const lignes = document.querySelectorAll(
    "table > tbody > tr:not(#moy, #moyBonus, #total)"
  );
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i];
    const ligne_id = ligne.id;
    const colonne_a_supprimer = document.querySelectorAll(
      "#" + ligne_id + " > td:nth-last-child(-n+3):not(:last-child)"
    );
    for (let i = 0; i < colonne_a_supprimer.length; i++) {
      const colonne = colonne_a_supprimer[i];
      colonne.remove();
    }
  }
  // Supprimer des cellules vides dans la ligne de moyenne et total
  const moyenne = document.querySelectorAll(
    "#moy > td:nth-last-child(-n+3):not(:last-child)"
  );
  const total = document.querySelectorAll(
    "#total > td:nth-last-child(-n+3):not(:last-child)"
  );
  for (let i = 0; i < moyenne.length; i++) {
    moyenne[i].remove();
    total[i].remove();
  }
}

/**
 * Récupère les notes depuis l'API
 * @param {*} url url de l'API
 * @param {*} data paramètres de la requête
 * @returns les notes, coefs et ues
 */
async function fetchNotes(url, data = {}) {
  const body = Object.keys(data)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
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
    body: body,
  });
  return await response.json();
}

/**
 * Récupère les notes depuis l'API et les affiche
 * @returns
 */
async function get_notes() {
  const loader = document.querySelector(".loader-container");
  loader.classList.remove("hidden");

  // Recupérer le username et password
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // https://api-notes-dev.vercel.app/notes
  const notes_json = await fetchNotes("http://localhost:5000/notes", {
    username: username,
    password: password,
  });

  console.log(notes_json);

  if (!notes_json.ok) {
    console.log(notes_json.err);
    loader.classList.add("hidden");
    alert(notes_json.err);
    return;
  } else if (notes_json[0].length === 0) {
    console.log("Aucune note trouvée");
  } else {
    // Mémoriser les notes, coefs et ues dans le local storage
    localStorage.setItem("notes", JSON.stringify(notes_json));

    display_notes(notes_json[0], notes_json[1], notes_json[2]);

    loader.classList.add("hidden");

    let formContainer = document.getElementById("formContainer");
    formContainer.style.display = "none";
  }
}

function display_notes(notes_obj, ues, coefs) {
  // Supprimer les entetes de UE
  const colonne_ues = document.querySelectorAll("thead > tr > th.ue");

  if (colonne_ues.length > 0) {
    for (let i = 0; i < colonne_ues.length; i++) {
      colonne_ues[i].remove();
    }
  }
  // Supprimer toutes les lignes de matières
  const lignes_matieres = document.querySelectorAll(
    "tbody > tr:not(#moy, #moyBonus, #total)"
  );
  if (lignes_matieres.length > 0) {
    for (let i = 0; i < lignes_matieres.length; i++) {
      lignes_matieres[i].remove();
    }
  }
  // Compter le nombre max de notes par matière
  let max_eval = 0;
  for (let i = 0; i < notes_obj.length; i++) {
    if (notes_obj[i].evaluations.length > max_eval) {
      max_eval = notes_obj[i].evaluations.length;
    }
  }

  const nb_colonnes_notes = compterColonnesNotes();
  // Ajouter ou supprimer des colonnes de notes et de coef
  if (max_eval > nb_colonnes_notes) {
    for (let i = 0; i < max_eval - nb_colonnes_notes; i++) {
      ajouterColonneNoteCoef();
    }
  } else if (max_eval < nb_colonnes_notes) {
    for (let i = 0; i < nb_colonnes_notes - max_eval; i++) {
      supprimerColonneNoteCoef();
    }
  }

  // Ajouter les entetes de UE
  for (let i = 0; i < ues.length; i++) {
    let entete_ue = document.createElement("th");
    entete_ue.classList.add("ue");
    entete_ue.innerHTML = ues[i].name;
    const entete_total = document.querySelector("#totalCoef");
    entete_total.insertAdjacentElement("beforebegin", entete_ue);
  }

  // Ajouter les lignes de matières
  for (let i = 0; i < notes_obj.length; i++) {
    let ligne_matiere = document.createElement("tr");
    if (notes_obj[i].matiere.includes("Bonification")) {
      ligne_matiere.id = "bonus";
    } else {
      ligne_matiere.id = notes_obj[i].matiere
        .replace(" ", "_")
        .replace("'", "_")
        .replace(".", "_");
    }
    ligne_matiere.innerHTML = "<th>" + notes_obj[i].matiere + "</th>";
    // Colonnes des coefficients
    for (let j = 0; j < ues.length; j++) {
      let w = 0;
      while (
        w < coefs.length &&
        !coefs[w].matiere.includes(notes_obj[i].matiere)
      ) {
        w++;
      }
      let k = 0;
      while (k < coefs[w].coefs.length && coefs[w].coefs[k].ue !== ues[j].id) {
        k++;
      }

      if (k < coefs[w].coefs.length) {
        ligne_matiere.innerHTML += "<td>" + coefs[w].coefs[k].coef + "</td>";
      } else {
        ligne_matiere.innerHTML += "<td></td>";
      }
    }
    // Colonnes du total des coefficients
    ligne_matiere.innerHTML += "<td class='totalCoef'></td>";
    // Si aucune note n'est renseignée, ajouter une colonne note=0 et coef=1 puis des colonnes vides
    if (notes_obj[i].evaluations.length === 0) {
      ligne_matiere.innerHTML +=
        "<td><input type='number' value='0' min='0' max='20' step='0.01'></td>";
      ligne_matiere.innerHTML +=
        "<td><input type='number' value='1' min='0' max='100' step='1'></td>";

      for (let j = 0; j < max_eval - 1; j++) {
        ligne_matiere.innerHTML +=
          "<td><input type='number' value='' min='0' max='20' step='0.01'></td>";
        ligne_matiere.innerHTML +=
          "<td><input type='number' value='' min='0' max='100' step='1'></td>";
      }
    } else {
      // Colonnes des notes
      for (let j = 0; j < max_eval; j++) {
        if (notes_obj[i].evaluations[j]) {
          ligne_matiere.innerHTML +=
            "<td><input type='number' value='" +
            notes_obj[i].evaluations[j].note +
            "' min='0' max='20' step='0.01'></td>";
          ligne_matiere.innerHTML +=
            "<td><input type='number'' value='" +
            notes_obj[i].evaluations[j].coefficient +
            "' min='0' max='100' step='1'></td>";
        } else {
          ligne_matiere.innerHTML +=
            "<td><input type='number' value='' min='0' max='20' step='0.01'></td>";
          ligne_matiere.innerHTML +=
            "<td><input type='number'' value='' min='0' max='100' step='1'></td>";
        }
      }
    }
    // Colonnes de la moyenne de la matière
    ligne_matiere.innerHTML += "<td></td>";

    // Ajouter la ligne au tableau, avant la ligne des totaux
    const ligne_moyenne = document.querySelector("#total");
    ligne_moyenne.insertAdjacentElement("beforebegin", ligne_matiere);
  }

  update();
}

document
  .getElementById("showFormButton")
  .addEventListener("click", function () {
    let formContainer = document.getElementById("formContainer");
    formContainer.style.display = "flex";
  });

document
  .getElementById("CloseFormButton")
  .addEventListener("click", function () {
    let formContainer = document.getElementById("formContainer");
    formContainer.style.display = "none";
  });
