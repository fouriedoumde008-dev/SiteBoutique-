
let panier = JSON.parse(localStorage.getItem('monPanier')) || [];
let total = Number(localStorage.getItem('monTotal')) || 0;
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('compteur').textContent = panier.length;
  brancherBoutonsAjouter(); // On branche les boutons "Ajouter"
  brancherRecherche(); // On branche la recherche
  brancherFormulaire(); // On branche le formulaire
});
function brancherRecherche(){
    const inputRecherche = document.querySelector(`#search`);
    inputRecherche.addEventListener('keyup', function(){
      const terme=this.value.toLowerCase();
      const toutesLesCartes= document.querySelectorAll('.produit-card');
      toutesLesCartes.forEach(carte =>{ 
        const nom = carte.querySelector('.produit-tittle').textContent.toLowerCase();
        if (nom.includes(terme) ||terme ==="" ) { 
          carte.style.display = 'block';
        } else {
          carte.style.display = 'none';
        }
     });
    });
    

}
function sauvegarderPanier() {
  localStorage.setItem('monPanier', JSON.stringify(panier));
  localStorage.setItem('monTotal', total);
}
function brancherBoutonsAjouter() {
  document.querySelectorAll('button').forEach(btn => {
    if(btn.textContent.trim() === 'Ajouter') {
      btn.addEventListener('click', function() {
        const carte = this.parentElement; // La div du produit
        const nom = carte.querySelector('h3, p:nth-of-type(1)').textContent; // "Free", "Pro Dio"...
        const prixTexte = carte.querySelector('p:nth-of-type(2),.prix').textContent; // "30300FC"
        const prix = Number(prixTexte.replace('FC', '').replace(' ', ''));

        AjouterPanier({nom: nom, prix: prix});
      });
    }
  }); 
}
function AjouterPanier(produit) {
  panier.push(produit);
  total += produit.prix;
  document.getElementById('compteur').textContent = panier.length;
  sauvegarderPanier();
  alert(produit.nom + " ajouté au panier!");
}

function afficherCompteur() {
  const divPanier = document.getElementById('Panier');
  divPanier.style.display = divPanier.style.display === "none"? "block" : "none";
  mettreAJourAffichage();
}

function mettreAJourAffichage() {
  const divPanier = document.getElementById('Panier');
  let html = "<h3>🛒 Mon panier</h3>";

  if(panier.length === 0) {
    html += "<p>Panier vide 😢</p>";
  } else {
    panier.forEach((produit, index) => {
      html += `
        <div style="border-bottom:1px solid #ddd; padding:5px; margin:5px 0;">
          ${produit.nom} - ${produit.prix} FCFA
          <button onclick="retirerProduit(${index})" style="float:right; background:red; color:white; border:none;">X</button>
        </div>
      `;
    });
    html += `<hr><p><b style = "color : black">Total: ${total} FCFA</b></p>`;
    html += `<button onclick="commanderWhatsApp()" style="width:100%; padding:10px; background:green; color:white; border:none;">Commander sur WhatsApp 📱</button>`;
  }

  divPanier.innerHTML = html;
}

function retirerProduit(index) {
  total -= panier[index].prix;
  panier.splice(index, 1);
  document.getElementById('compteur').textContent = panier.length;
  sauvegarderPanier();
  mettreAJourAffichage();
}


function brancherFormulaire() {
  const form = document.querySelector('form') || document.querySelector('div:has(input[placeholder="Votre nom"])');
  const btnEnvoyer = document.querySelector('button:contains("Envoyer")');

  btnEnvoyer.addEventListener('click', function(e) {
    e.preventDefault();

    const nom = document.querySelector('input[placeholder="Votre nom"]').value;
    const tel = document.querySelector('input[placeholder*="6XX"]').value;
    const ville = document.querySelector('input[placeholder="Votre ville"]').value;
    const quartier = document.querySelector('input[placeholder="Votre quartier"]').value;
    const adresse = document.querySelector('input[placeholder*="Rue"]').value;

    if(panier.length === 0) {
      alert("Ajoute d’abord des produits au panier!");
      return;
    }
    if(!nom ||!tel) {
      alert("Nom et téléphone obligatoires!");
      return;
    }

    let message = `🛒 NOUVELLE COMMANDE%0A%0A`;
    message += `Client: ${nom}%0A`;
    message += `Tél: ${tel}%0A`;
    message += `Ville: ${ville} - ${quartier}%0A`;
    message += `Adresse: ${adresse}%0A%0A`;
    message += `PRODUITS:%0A`;

    panier.forEach((p, i) => {
      message += `${i+1}. ${p.nom} - ${p.prix} FCFA%0A`;
    });
    message += `%0ATOTAL: ${total} FCFA`;

    const numero = "2376XXXXXXXX"; // METS TON NUMÉRO WHATSAPP ICI SANS +
    window.open(`https://wa.me/${numero}?text=${message}`, '_blank');
    panier = []; total = 0; sauvegarderPanier();
    document.getElementById('compteur').textContent = 0;
    alert("Commande envoyée sur WhatsApp! ✅");
  });
}
function commanderWhatsApp() {
  if(panier.length === 0) return alert("Panier vide!");

  let message = "Bonjour! Je commande:%0A%0A";
  panier.forEach((p, i) => message += `${i+1}. ${p.nom} - ${p.prix} FCFA%0A`);
  message += `%0ATotal: ${total} FCFA`;

  const numero = "237692236142"; // TON NUMÉRO
  window.open(`https://wa.me/${numero}?text=${message}`, '_blank');
}
