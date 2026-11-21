"use strict";

(() => {
  const cle = "revisFacilePreproduction:" + new URL(".", location.href).pathname;
  let serveur;
  try {
    serveur = sessionStorage.getItem(cle);
  } catch {
    // Sans configuration vérifiée dans cet onglet, retourner à l’écran de connexion au serveur.
  }
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(serveur || "")) {
    location.replace("./");
    return;
  }
  document.querySelector('meta[name="apps-script-url"]').content = serveur;
})();
