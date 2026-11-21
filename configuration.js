"use strict";

const cleServeur = "revisFacilePreproduction:" + new URL(".", location.href).pathname;
const formatServeur = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const champServeur = document.getElementById("serveur");
const boutonContinuer = document.getElementById("continuer");
const etat = document.getElementById("etatConfiguration");

try {
  champServeur.value = localStorage.getItem(cleServeur) || "";
} catch {
  // La configuration reste possible si le stockage de session est autorisé.
}

async function ouvrirPreproduction() {
  if (boutonContinuer.disabled) return;
  const serveur = champServeur.value.trim();
  if (!formatServeur.test(serveur)) {
    etat.textContent = "Colle l’adresse complète du déploiement TEST, terminée par /exec.";
    return;
  }

  boutonContinuer.disabled = true;
  etat.textContent = "Vérification du serveur TEST…";
  const controleur = new AbortController();
  const minuterie = setTimeout(() => controleur.abort(), 15000);
  try {
    const reponse = await fetch(serveur + "?preproduction=verifier", {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: controleur.signal
    });
    if (!reponse.ok) throw new Error("Serveur indisponible");
    const donnees = await reponse.json();
    if (donnees.environnement !== "revis-facile-test-v1") {
      etat.textContent = "Cette adresse ne correspond pas au serveur de préproduction activé. Vérifie le projet TEST et son déploiement.";
      return;
    }

    sessionStorage.setItem(cleServeur, serveur);
    try {
      localStorage.setItem(cleServeur, serveur);
    } catch {
      // L’application peut s’ouvrir dans cet onglet.
    }
    location.assign("./application.html");
  } catch {
    etat.textContent = "Impossible d’ouvrir le serveur TEST. Vérifie la connexion, l’adresse et les réglages d’accès du déploiement, puis réessaie.";
  } finally {
    clearTimeout(minuterie);
    boutonContinuer.disabled = false;
  }
}
document.getElementById("configuration").addEventListener("submit", evenement => {
  evenement.preventDefault();
  ouvrirPreproduction();
});
if (champServeur.value && !new URL(location.href).searchParams.has("configuration")) {
  ouvrirPreproduction();
}
