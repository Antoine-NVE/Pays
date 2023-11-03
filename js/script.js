// --------------
// Code Postal
// --------------

// const codePostal = document.getElementById("codePostal");
// const boutonRechercher = document.getElementById("boutonRechercher");
// const liste = document.getElementById("liste");

// boutonRechercher.addEventListener("click", () => {
//   let xhr = new XMLHttpRequest();
//   let fluxHTML = "";
//   let objet;

//   xhr.open("GET", "http://api.zippopotam.us/fr/" + codePostal.value, true);
//   xhr.send();

//   xhr.addEventListener("readystatechange", () => {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       objet = JSON.parse(xhr.responseText);

//       for (i = 0; i < objet.places.length; i++) {
//         fluxHTML += "<option>" + objet["places"][i]["place name"] + "</option>";
//       }

//       liste.innerHTML = fluxHTML;
//     }
//   });
// });

// -----------
// Les Pays
// -----------

// Variables de l'input text, de la liste déroulante, des options de la liste, du bouton envoyer et du container d'affichage
const inputPays = document.getElementById("inputPays");
const liste = document.getElementById("liste");
const options = document.getElementsByClassName("options");
const boutonEnvoyer = document.getElementById("boutonEnvoyer");
const container = document.getElementById("container");

// Détecte le changement de value de l'input text
inputPays.addEventListener("input", () => {
  // Prends les valeurs de pays.json et les mets en tableau pour les rendre utilisable
  fetch("./pays.json")
    .then((response) => response.json())
    .then((response) => {
      // Reset les options de la liste
      liste.innerHTML = "";

      for (i = 0; i < response.length; i++) {
        // Vérifie si la chaîne de caractère rentrée correspond à l'alpha2 ou au nom d'un des pays
        if (
          response[i].alpha2.includes(inputPays.value.toUpperCase()) ||
          response[i].nom_fr_fr
            .toUpperCase()
            .includes(inputPays.value.toUpperCase())
        ) {
          // Mets en place les différentes options de la liste
          liste.innerHTML += `<option id="${i + 1}" class="options">${
            response[i].nom_fr_fr
          }<options>`;
        }
      }

      // Affiche la liste si l'user écrit
      if (inputPays.value.length > 0) {
        liste.style.display = "block";
      } else {
        liste.style.display = "none";
      }

      // Détecte quelle option est cliquée et récupère ses valeurs
      for (i = 0; i < options.length; i++) {
        const option = document.getElementById(options[i].id);
        option.addEventListener("click", () => {
          inputPays.value = option.value;
          liste.style.display = "none";
          var pays = response[option.id - 1];
          nomFr = pays.nom_fr_fr;
          nomEn = pays.nom_en_gb;
          alpha2 = pays.alpha2;
        });
      }
    });
});

// Détecte le clic du bouton "Envoyer"
boutonEnvoyer.addEventListener("click", (e) => {
  e.preventDefault();

  // Crée une div pour les informations et une div pour la carte
  container.innerHTML = `
    <div id="informations"></div>
    <div id="carte"></div>
    `;

  // Variables pour afficher les informations et la carte
  informations = document.getElementById("informations");
  carte = document.getElementById("carte");

  // Prends les valeurs de l'API correspondantes au pays recherché
  fetch(
    `http://api.geonames.org/searchJSON?username=antoine_nve&name_equals="${nomEn}"&country="${alpha2}"`
  )
    .then((response) => response.json())
    .then((response) => {
      pays = response.geonames[0];

      // Affiche les informations
      informations.innerHTML = `
      <img src="./flags/${alpha2.toLowerCase()}.png">
      <p>Code Pays : ${alpha2}</p>
      <p>Nom du Pays : ${nomFr}</p>
      <p>Population du Pays : ${pays.population}
      `;

      // Crée la carte et le marqueur
      let map = L.map("carte").setView([pays.lat, pays.lng], 3);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.marker([pays.lat, pays.lng]).addTo(map);
    });
});
