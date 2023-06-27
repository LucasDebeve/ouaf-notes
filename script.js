const coefs = document.querySelectorAll("tbody > tr:not(#moy, #moyBonus, #total) > td:nth-child(n+9):nth-child(2n):not(:last-child)");
const notes = document.querySelectorAll("tbody > tr:not(#moy, #moyBonus, #total) > td:nth-child(n+9):nth-child(2n-1):not(:last-child)");


coefs.forEach(coef => {
    coef.innerHTML = "<input type='number' value='"+coef.innerHTML.replace(',','.')+"' min='0' max='100' step='1'>";
});
notes.forEach(note => {
    note.innerHTML = "<input type='number' value='"+note.innerHTML.replace(',','.')+"' min='0' max='20' step='0.01'>";
});




// Calcul des Totaux des coefficients
function calculTotalCoef(line_id) {
    let total = 0;
    const coef = document.querySelectorAll("#" + line_id + " > td:nth-child(-n+7)");
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

function calculMoyenneMatiere(line_id) {
    const Notes = document.querySelectorAll("#" + line_id + " td:nth-child(n+9):nth-child(2n-1):not(:last-child) > input");
    const coefs = document.querySelectorAll("#" + line_id + " td:nth-child(n+9):nth-child(2n):not(:last-child) > input");
    // Somme des notes * coef
    let sommeNotesCoef = 0;
    let sommeCoef = 0;
    for (var i = 0; i < Notes.length; i++) {
        if (Notes[i].value !== "" && coefs[i].value !== "") {
            sommeNotesCoef += parseFloat(Notes[i].value.replace(',','.')) * parseFloat(coefs[i].value.replace(',','.'));
            sommeCoef += parseFloat(coefs[i].value.replace(',','.'));
        } else {
            sommeCoef += 0;
        }
        
    }
    // Moyenne
    document.querySelector("#" + line_id + " td:last-child").innerHTML = Math.round((sommeNotesCoef / sommeCoef)*1000)/1000;
    
    return Math.round((sommeNotesCoef / sommeCoef)*1000)/1000;

}

function moyenneTotale(totalCoefs, moyennesMatieres) {
    let somme = 0;
    for (var i = 0; i < totalCoefs.length; i++) {
        somme += totalCoefs[i] * moyennesMatieres[i];
    }
    const moyenne = Math.round((somme / totalCoefs.reduce((a, b) => a + b, 0))*1000)/1000;
    const celluleMoyenne= document.querySelector("#moyenneGenerale");
    celluleMoyenne.innerHTML = "<abbr title='Moyenne du bulletin (Pondéré)'> "+Math.round(moyenne*1000)/1000+"</abbr>";
    
    if (moyenne >= 10) {
        celluleMoyenne.classList.add("good");
        celluleMoyenne.classList.remove("bad");
    } else {
        celluleMoyenne.classList.remove("good");
        celluleMoyenne.classList.add("bad");
    }

    return moyenne;
}

function moyenneIntranet(moyennesMatieres) {
    let somme = 0;
    for (var i = 0; i < moyennesMatieres.length; i++) {
        somme += moyennesMatieres[i];
    }
    const moyenne = somme / moyennesMatieres.length;
    document.querySelector("#moy > td:last-child").innerHTML = "<abbr title='Moyenne de l&#x2019;intranet'> "+Math.round(moyenne*1000)/1000+"</abbr>";
}

function totalCompetence(competence_id) {
    const lignes = document.querySelectorAll("table > tbody > tr:not(#moy, #moyBonus, #total)");
    let total = 0;
    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i];
        const ligne_id = ligne.id;
        const cellule = document.querySelector("#" + ligne_id + " > td:nth-child(" + competence_id + ")");
        if (cellule.innerHTML !== "") {
            total += parseFloat(cellule.innerHTML);
        }
    }
    document.querySelector("#total > td:nth-child(" + competence_id + ")").innerHTML = total;
    return total;
}

function moyenneCompetence(competence_id) {
    const lignes = document.querySelectorAll("table > tbody > tr:not(#moy, #moyBonus, #total)");
    let somme = 0;
    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i];
        const ligne_id = ligne.id;
        const cellule = document.querySelector("#" + ligne_id + " > td:nth-child(" + competence_id + ")");
        if (cellule.innerHTML !== "") {
            const coef = parseFloat(cellule.innerHTML);
            const moyenne = parseFloat(document.querySelector("#" + ligne_id + " > td:last-child").innerHTML);
            somme += coef * moyenne;
        }
    }
    const moyenne = somme / totalCompetence(competence_id);
    document.querySelector("#moy > td:nth-child(" + competence_id + ")").innerHTML = Math.round(moyenne*1000)/1000;

}


function moyenneBonus(competence_id) {
    const moyenne = parseFloat(document.querySelector("#moy > td:nth-child(" + competence_id + ")").innerHTML);
    const bonus = parseFloat(document.querySelector("#bonus > td:last-child").innerHTML);
    const moyenneBonus = Math.round((moyenne + 0.5*(bonus/20))*1000)/1000;
    const celluleMoyenne= document.querySelector("#moyBonus > td:nth-child("+competence_id+")");
    celluleMoyenne.innerHTML = moyenneBonus;
    
    if (moyenneBonus >= 10) {
        celluleMoyenne.classList.add("good");
        celluleMoyenne.classList.remove("bad");
    } else {
        celluleMoyenne.classList.remove("good");
        celluleMoyenne.classList.add("bad");
    }

}

function update() {
    // Parcours des colonnes des compétences
    const competences = document.querySelectorAll("table > thead > tr > th:nth-child(-n+7):not(:first-child)");
    for (let i = 0; i < competences.length; i++) {
        const competence = competences[i];
        totalCompetence(i+2);

    }
    // Parcours de l'ensemble des lignes du tableau
    const  lines = document.querySelectorAll("table > tbody > tr:not(#moy, #moyBonus)");
    
    let total = [];
    let moyenne = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const line_id = line.id;
        
        total.push(calculTotalCoef(line_id));
        if (line_id !== "total") 
            moyenne.push(calculMoyenneMatiere(line_id));
    }

    moyenneTotale(total.slice(0, total.length - 1), moyenne);
    moyenneIntranet(moyenne);

    // Calcul de la moyenne par competence

    for (let i = 0; i < competences.length; i++) {
        const competence = competences[i];
        moyenneCompetence(i+2);
        moyenneBonus(i+2);
    }
}

function ajouterColonneNoteCoef () {
    // Ajouter les titre des colonnes avant la colonne de moyenne des matière
    const moyenneMatiere = document.querySelector("table > thead > tr > th:last-child");
    moyenneMatiere.insertAdjacentHTML("beforebegin", "<th>Note</th>");
    moyenneMatiere.insertAdjacentHTML("beforebegin", "<th>Coefficient</th>");
    

    // Ajouter les inputs avant la colonne de moyenne des matière
    const lignes = document.querySelectorAll("table > tbody > tr:not(#moy, #moyBonus, #total)");
    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i];
        const ligne_id = ligne.id;
        const moyenneMatiere = document.querySelector("#" + ligne_id + " > td:last-child");
        moyenneMatiere.insertAdjacentHTML("beforebegin", "<td><input type='number' value='' min='0' max='100' step='1'></td>");
        moyenneMatiere.insertAdjacentHTML("beforebegin", "<td><input type='number' value='' min='0' max='20' step='0.01'></td>");
    }

    // Ajouter des cellules vides dans la ligne de moyenne et total
    const moyenne = document.querySelector("#moy > td:last-child");
    moyenne.insertAdjacentHTML("beforebegin", "<td></td>");
    moyenne.insertAdjacentHTML("beforebegin", "<td></td>");
    const total = document.querySelector("#total > td:last-child");
    total.insertAdjacentHTML("beforebegin", "<td></td>");
    total.insertAdjacentHTML("beforebegin", "<td></td>");
}

// supprimer les colonnes de note et de coef
function supprimerColonneNoteCoef () {
    // Supprimer les titre des colonnes avant la colonne de moyenne des matière
    const colonne_a_supprimer = document.querySelectorAll("table > thead > tr > th:nth-last-child(-n+3):not(:last-child)");
    for (let i = 0; i < colonne_a_supprimer.length; i++) {
        const colonne = colonne_a_supprimer[i];
        colonne.remove();
    }
    // Supprimer les inputs avant la colonne de moyenne des matière
    const lignes = document.querySelectorAll("table > tbody > tr:not(#moy, #moyBonus, #total)");
    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i];
        const ligne_id = ligne.id;
        const colonne_a_supprimer = document.querySelectorAll("#" + ligne_id + " > td:nth-last-child(-n+3):not(:last-child)");
        for (let i = 0; i < colonne_a_supprimer.length; i++) {
            const colonne = colonne_a_supprimer[i];
            colonne.remove();
        }
    }
    // Supprimer des cellules vides dans la ligne de moyenne et total
    const moyenne = document.querySelectorAll("#moy > td:nth-last-child(-n+3):not(:last-child)");
    const total = document.querySelectorAll("#total > td:nth-last-child(-n+3):not(:last-child)");
    for (let i = 0; i < moyenne.length; i++) {
        moyenne[i].remove();
        total[i].remove();
    }
}