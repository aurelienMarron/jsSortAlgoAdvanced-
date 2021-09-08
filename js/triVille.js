let csvFile;
let listVille = [];
let nbPermutation = 0;
let nbComparaison = 0;


document.querySelector("#read-button").addEventListener('click', function () {
    csvFile = document.querySelector("#file-input").files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
        // récupération de la liste des villes
        listVille = getArrayCsv(e.target.result);

        // Calcul de la distance des villes par rapport à Grenoble
        listVille.forEach(ville => {
            ville.distanceFromGrenoble = distanceFromGrenoble(ville);
        });
        // Tri
        const algo = $("#algo-select").val();
        nbPermutation = 0;
        nbComparaison = 0;
        sort(algo);

        // Affichage 
        displayListVille()
    });
    reader.readAsText(csvFile)
})

/**
 * Récupére la liste des villes contenu dans le fichier csv
 * @param csv fichier csv brut
 * @returns la liste des villes mis en forme
 */
function getArrayCsv(csv) {
    let listLine = csv.split("\n")
    listVille = [];
    let isFirstLine = true;
    listLine.forEach(line => {
        if (isFirstLine || line === '') {
            isFirstLine = false;
        } else {
            let listColumn = line.split(";");
            listVille.push(
                new Ville(
                    listColumn[8],
                    listColumn[9],
                    listColumn[11],
                    listColumn[12],
                    listColumn[13],
                    0
                )
            );
        }
    });
    return listVille;
}

/**
 * Calcul de la distance entre Grenoble et une ville donnée
 * @param ville ville
 * @returns la distance qui sépare la ville de Grenoble
 */
function distanceFromGrenoble(ville) {
    const latitudeGrenoble = 45.188529;
    const longitudeGrenoble = 5.724524;
    const R = 6371e3; // metres
    const φ1 = latitudeGrenoble * Math.PI / 180; // φ, λ in radians
    const φ2 = ville.latitude * Math.PI / 180;
    const Δφ = (ville.latitude - latitudeGrenoble) * Math.PI / 180;
    const Δλ = (ville.longitude - longitudeGrenoble) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return ville.distanceFromGrenoble = R * c; // in metres


}

/**
 * Retourne vrai si la ville i est plus proche de Grenoble
 * par rapport à j
 * @param {*} i distance de la ville i
 * @param {*} j distance de la ville j
 * @return vrai si la ville i est plus proche
 */
function isLess(i, j) {
    if (i.distanceFromGrenoble < j.distanceFromGrenoble) {
        return true;
    }
}

/**
 * interverti la ville i avec la ville j dans la liste des villes
 * @param {*} i
 * @param {*} j
 */
function swap(tableau, i, j) {
    [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    nbPermutation++;
}

function sort(type) {
    switch (type) {
        case 'insert':
            listVille = insertsort(listVille);
            break;
        case 'select':
            listVille = selectionsort(listVille);
            break;
        case 'bubble':
            listVille = bubblesort(listVille);
            break;
        case 'shell':
            listVille = shellsort(listVille);
            break;
        case 'merge':
            listVille = mergesort(listVille);
            break;
        case 'heap':
            listVille = heapsort(listVille);
            break;
        case 'quick':
            listVille = quicksort(listVille, 0, listVille.length - 1);
            break;
    }
}

function insertsort(tableau) {
    let temp
    let i
    let j
    tableau = [...tableau]
    for (i = 0; i < tableau.length; i++) {
        temp = tableau[i];
        j = i;
        while (j > 0 && isLess(temp, tableau[j - 1])) {
            swap(tableau, j, j - 1)
            j = j - 1;
        }
        tableau[j] = temp;
    }
    return tableau
}

function selectionsort(tableau) {
    tableau = [...tableau]
    for (let i = 0; i < tableau.length - 1; i++) {
        for (let j = i + 1; j < tableau.length; j++) {
            let min = i;
            if (isLess(tableau[j], tableau[min])) {
                min = j;
                swap(tableau, i, min)
            }
        }
    }
    return tableau
}

function bubblesort(tableau) {
    tableau = [...tableau]
    let i = 0;
    let j;
    let permutation = true;
    while (permutation) {
        permutation = false;
        i++;
        for (j = 0; j < tableau.length - i; j++) {
            if (isLess(tableau[j + 1], tableau[j])) {
                permutation = true;
                swap(tableau, j, j + 1)
            }
        }
    }
    return tableau
}

function shellsort(tableau) {
    tableau = [...tableau]
    let longueur = tableau.length;
    let n = 0;
    while (n < longueur) {
        n = (3 * n + 1)
    }
    while (n !== 0) {
        n = Math.floor(n / 3)
        for (let i = n; i < longueur; i++) {
            let valeur = tableau[i];
            let j = i;
            while (j > n - 1 && isLess(valeur, tableau[j - n])) {
                tableau[j] = tableau[j - n]
                j = j - n
                nbPermutation++;
            }
            tableau[j] = valeur
        }
    }
    return tableau
}

function mergesort(tableau) {
    tableau = [...tableau]
    if (tableau.length <= 1) {
        return tableau
    } else {
        let milieu = Math.floor(tableau.length / 2)
        let right = tableau.slice(milieu)
        let left = tableau.slice(0, milieu)
        tableau = fusion(mergesort(left), mergesort(right))
        return tableau
    }

    function fusion(left, right) {
        if (left.length === 0) {
            return right
        } else if (right.length === 0) {
            return left
        } else if (isLess(left[0], right[0])) {
            return [left[0]].concat(fusion(left.slice(1, left.length), right))
        } else {
            nbPermutation++
            return [right[0]].concat(fusion(left, right.slice(1, right.length)))
        }
    }
}


function heapsort(tableau) {
    tableau = [...tableau]
    organiser(tableau);
    for (let i = tableau.length - 1; i !== 0; i--) {
        swap(tableau, 0, i);
        redescendre(tableau, i, 0);
    }
    return tableau;
}

function organiser(tableau) {
    for (let i = 0; i < tableau.length - 1; i++) {
        remonter(tableau, i)
    }
}

function remonter(tableau, index) {
    if (isLess(tableau[Math.floor(index / 2)], tableau[index])) {
        swap(tableau, index, Math.floor(index / 2));
        remonter(tableau, Math.floor(index / 2));
    }
}

function redescendre(tableau, element, index) {
    let max
    let formule = 2 * index + 1
    if (formule < element) {
        if (isLess(tableau[2 * index], tableau[formule])) {
            max = formule;
        } else {
            max = 2 * index
        }
        if (isLess(tableau[index], tableau[max])) {
            swap(tableau, max, index)
            redescendre(tableau, element, max)
        }
    }
}


function quicksort(tableau, premier, dernier) {
    // tableau = [...tableau]
    if (premier < dernier) {
        let pi = partitionner(tableau, premier, dernier)
        quicksort(tableau, premier, pi - 1)
        quicksort(tableau, pi + 1, dernier)
    }
    return tableau
}

function partitionner(tableau, premier, dernier) {
    let pivot = dernier;
    let j = premier;
    for (let i = premier; i <= dernier; i++) {
        if (isLess(tableau[i], tableau[pivot])) {
            swap(tableau, i, j)
            j = j + 1;
        }
    }
    swap(tableau, dernier, j)
    return j;
}

/** MODEL */

class Ville {
    constructor(nom_commune, codes_postaux, latitude, longitude, dist, distanceFromGrenoble) {
        this.nom_commune = nom_commune;
        this.codes_postaux = codes_postaux;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dist = dist;
        this.distanceFromGrenoble = distanceFromGrenoble;
    }
}

/** AFFICHAGE */
function displayPermutation(nbPermutation) {
    document.getElementById('permutation').innerHTML = nbPermutation + ' permutations';
}

function displayListVille() {
    document.getElementById("navp").innerHTML = "";
    displayPermutation(nbPermutation);
    let mainList = document.getElementById("navp");
    for (var i = 0; i < listVille.length; i++) {
        let item = listVille[i];
        let elem = document.createElement("li");
        elem.innerHTML = item.nom_commune + " - \t" + Math.round(item.distanceFromGrenoble * 100) / 100 + ' m';
        mainList.appendChild(elem);
    }
}