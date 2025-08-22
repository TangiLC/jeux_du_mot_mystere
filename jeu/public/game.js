// game.js - Module principal du jeu (refactorisé)

class WordGame {
  constructor() {
    this.initializeElements();
    this.initializeVariables();
    this.initializeGame();
    this.attachEventListeners();
  }

  initializeElements() {
    this.airDeJeu = document.getElementById("air_de_jeu");
    this.inputs = this.airDeJeu.getElementsByClassName("aTrouver");
    this.jeu = document.getElementById("jeu");
    this.confettiButton = document.getElementById("confettis");
    this.message = document.getElementById("message");
    this.affichage = document.getElementById("affichage");
    this.fin = document.getElementById("fin");
  }

  initializeVariables() {
    this.solution = "Demandez un nouveau jeu";
    this.etape = 0;
    this.bravo = 0;
    this.mots = [];
    this.niveau = this.getNiveau();
    
    // Configuration des mots par niveau
    this.motsParNiveau = {
      6: ["svelte", "hacker", "bifide", "bonsai", "cheval"],
      7: ["absolue", "butanol", "cabotin", "gabarie", "piccolo"]
    };
    this.mots = this.motsParNiveau[this.niveau];
  }

  initializeGame() {
    // Masquer/afficher la 7ème lettre selon le niveau
    document.getElementById("lettre6").hidden = (this.niveau < 7);
    
    // État initial
    this.desactiver(this.inputs, true);
    this.message.innerHTML = this.solution;
  }

  getNiveau() {
    const params = new URLSearchParams(document.location.search.substring(1));
    const niveau = params.get("niveau");
    return parseInt(niveau) || 6;
  }

  desactiver(nodes, ok) {
    const couleur = ok ? "#302535" : "#ffffff";
    const style = "background-color: " + couleur;

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].value = "";
      nodes[i].setAttribute("style", style);
      nodes[i].disabled = ok;
    }
  }

  gagner(nodes, solution) {
    this.desactiver(nodes, true);
    this.message.innerHTML = solution;
    this.message.setAttribute("style", "color: #7a4c81");
    this.affichage.src = "./public/gagne.png";

    // Utilisation du module sparkle
    const cleanup = confettis();
    setTimeout(cleanup, 4000);
  }

  perdre(nodes, solution) {
    this.desactiver(nodes, true);
    this.message.innerHTML = solution;
    this.affichage.src = "./public/jeu07.png";
    this.message.setAttribute("style", "color: #f9674d");
  }

  nouveauJeu() {
    const max = this.mots.length;
    const indice = Math.floor(Math.random() * max);
    this.solution = this.mots[indice];

    this.desactiver(this.inputs, false);
    this.affichage.src = "./public/jeu00.png";
    this.message.innerHTML = "";
    this.message.setAttribute("style", "color: #302535");
    this.bravo = 0;
    this.etape = 0;
  }

  guessLength() {
    let m = "";
    for (let i = 0; i < this.inputs.length; i++) {
      m += this.inputs[i].value;
    }
    return m.length;
  }

  handleLetterInput(inputElement) {
    inputElement.value = inputElement.value.toUpperCase();
    
    // Ne faire la vérification que si toutes les cases sont complétées
    if (this.guessLength() < this.niveau) return;
    
    // Vérifier TOUTES les lettres du mot complet
    this.bravo = 0; // Reset du compteur
    let motCorrect = true;
    
    for (let i = 0; i < this.niveau; i++) {
      const input = this.inputs[i];
      const saisie = input.value;
      const lettre = this.solution.charAt(i);
      
      // Nettoyer les classes CSS
      input.classList.remove("bonnePlace", "mauvaisePlace", "mauvaiseLettre");
      
      if (saisie.toLowerCase() === lettre.toLowerCase()) {
        this.bravo++;
        input.classList.add("bonnePlace");
      } else {
        motCorrect = false;
        if (this.solution.toLowerCase().includes(saisie.toLowerCase())) {
          input.classList.add("mauvaisePlace");
        } else {
          input.classList.add("mauvaiseLettre");
        }
      }
    }

    console.log("Guess complet:", this.getCurrentWord(), "Bravo:", this.bravo);
    
    // Vérifier victoire
    if (this.bravo === this.niveau) {
      this.gagner(this.inputs, this.solution);
      return;
    }
    
    // Incrémenter l'étape seulement si le mot est incorrect
    this.etape++;
    this.affichage.src = './public/jeu0' + this.etape + '.png';

    if (this.etape > 6) {
      this.perdre(this.inputs, this.solution);
    }
  }

  // Méthode utilitaire pour obtenir le mot actuel
  getCurrentWord() {
    let mot = "";
    for (let i = 0; i < this.inputs.length; i++) {
      mot += this.inputs[i].value;
    }
    return mot;
  }

  attachEventListeners() {
    // Bouton nouveau jeu
    this.jeu.addEventListener("click", () => {
      this.nouveauJeu();
    });

    // Bouton confettis
    this.confettiButton.addEventListener("click", () => {
      const cleanup = confettis();
      setTimeout(cleanup, 4000);
    });

    // Bouton voir solution
    this.fin.addEventListener("click", () => {
      this.perdre(this.inputs, this.solution);
    });

    // Gestionnaires pour les champs de saisie
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].addEventListener("change", (event) => {
        this.handleLetterInput(event.target);
      });
    }
  }
}

// Initialisation du jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
  new WordGame();
});

// Export pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WordGame;
}