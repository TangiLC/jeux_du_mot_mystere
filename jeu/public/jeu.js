
/* sélection des éléments de la page pour travailler avec */
var airDeJeu = document.getElementById("air_de_jeu")
//inputs contient tous les élements html de class 'aTrouver'
//inputs est un tableau qui contient plusieurs valeurs
//ici tous les inputs de class 'aTrouver'
var inputs = airDeJeu.getElementsByClassName("aTrouver")
var jeu = document.getElementById("jeu")
var confettiButton = document.getElementById("confettis")
var message = document.getElementById("message")
var affichage = document.getElementById("affichage")
var fin = document.getElementById("fin")

/* déclaration des variables */
// message à afficher dans la <p id="message">
var solution = "Demandez un nouveau jeu"
//compter le nombre d'erreur. Pour dire perdu au bout de 7 erreurs
var etape = 0
//pour compter le nombre de bonne lettre et dire gagner au bon moment
var bravo = 0
//var mots = "garage"
//liste des mots à trouver, un est tiré au hasard
var mots=[]

/* déclaration des fonctions */
const SPARKLE_COUNT = 50;
const rand = (min, max) => Math.random() * (max - min) + min;

function createSparkles(count = SPARKLE_COUNT) {
  document.querySelectorAll('.sparkle').forEach(el => el.remove());

  const width = window.innerWidth;
  const fragment = document.createDocumentFragment();
  const sparkles = [];

  for (let i = 1; i <= count; i++) {
    const el = document.createElement('div');
    el.id = `sparkle${i}`;
    el.className = 'sparkle';

    const size = rand(8, 20);
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;

    const hue = Math.floor(rand(0, 360));
    el.style.backgroundColor = `hsl(${hue} 80% 60%)`;

    el.style.left = `${rand(0, width - size)}px`;
    el.style.top = `${-rand(0, window.innerHeight)}px`;

    el.dataset.speed = rand(1.2, 4).toFixed(3);  
    el.dataset.drift = rand(-0.6, 0.6).toFixed(3);

    fragment.appendChild(el);
    sparkles.push(el);
  }

  document.body.appendChild(fragment);
  return sparkles;
}

function animateSparkles(sparkles) {
  let rafId;

  const step = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (const el of sparkles) {
      const speed = parseFloat(el.dataset.speed);
      const drift = parseFloat(el.dataset.drift);


      const y = (parseFloat(el.style.top) || 0) + speed;
      const x = (parseFloat(el.style.left) || 0) + Math.sin(y / 18) * drift;

      el.style.top = `${y}px`;
      el.style.left = `${x}px`;

      // Réapparition en haut quand on sort de l'écran
      if (y > height + 20) {
        el.style.top = `${-rand(40, 200)}px`;
        el.style.left = `${rand(0, width - el.offsetWidth)}px`;
        el.dataset.speed = rand(1.2, 4).toFixed(3); // vitesse rafraîchie
      }
    }

    rafId = requestAnimationFrame(step);
  };

  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

// Lance l'effet confettis et renvoie une fonction de nettoyage
function confettis() {
  const sparkles = createSparkles();
  const stop = animateSparkles(sparkles);

  // Fonction de cleanup : stop anim + retirer les éléments
  return function cleanup() {
    stop();
    document.querySelectorAll('.sparkle').forEach(el => el.remove());
  };
}


//fonction pour récupérer le niveau de difficulté
function getNiveau(){
    var params = new URLSearchParams(document.location.search.substring(1))
    var niveau = params.get("niveau")
    return niveau
}

//fonction pour activer ou desactiver les champs de saisie
//ok=false
function desactiver(nodes, ok){
    //couleur de dégrisage
    var couleur = "#ffffff"

    //ok est vrai si il faut griser
    // si ok=false pas de if
    if(ok)
    {
        //couleur de grisage
        couleur = "#302535"
    }

    //si pas de if, alors couleur="#ffffff"

    //modifie le background_color des input text
    var style = "background-color: " + couleur

    //boucle pour modifier tous les inputs d'un coup
    //il y en 7 en tout
    //c'est quoi nodes ? tableau qui contient tous les inputs text
    //le for va de 0 à la taille maxi de nodes (nodes.length)
    for (var i = 0; i < nodes.length; i++) {
        //efface toutes les lettres dans les inputs text
        nodes[i].value = ""
        //applique le bon background color
        nodes[i].setAttribute("style", style)
        //bloque la saisie
        //disabled = false
        nodes[i].disabled = ok
    }
}

//fonction pour mettre à jour la page web lors d'une victoire
function gagner(nodes, solution){
    desactiver(nodes, true)
    message.innerHTML = solution
    message.setAttribute("style", "color: #7a4c81")
    affichage.src = "./public/gagne.png"

    const cleanup = confettis();
    setTimeout(cleanup, 4000);

}

//fonction pour mettre à jour la page web lorsque le mot n'est pas trouvé
function perdre(nodes, solution){
    desactiver(nodes, true)
    message.innerHTML = solution
    affichage.src = "./public/jeu07.png"
    message.setAttribute("style", "color: #f9674d")    
}

/* logique de jeu */
var niveau = getNiveau()
//Liste de mots pour le niveau facile
//document.getElementById("lettre6").hidden = true
document.getElementById("lettre6").hidden = (niveau<7)
mots_par_niveau={6:["svelte", "hacker", "bifide", "bonsai", "cheval"],
    7:["absolue","butanol","cabotin","gabarie","piccolo"]
}
mots=mots_par_niveau[niveau]
//Liste de mots pour le niveau difficile
// ici on tire un mot de 7 pour le niveau difficile
//if (niveau == 7)
//{
//    mots = ["absolue","butanol","cabotin","gabarie","piccolo"]
    //document.getElementById("lettre6").hidden = false
//}

//initialiser le jeu
//alert(jeu.innerHTML)
desactiver(inputs, true)
message.innerHTML = solution

/* évènements */

//Click sur le bouton 'nouveau jeu'
jeu.addEventListener("click", function(){
    //solution = mots
    var max = mots.length
    var indice = Math.floor(Math.random() * max)
    solution = mots[indice]

    //appel à la fonction desactiver. On lui passe en paramètres inputs et false
    //false valeur bool
    //du coup ok = 'false'
    //nodes = inputs
    desactiver(inputs, false)
    //
    affichage.src = "./public/jeu00.png"
    message.innerHTML = ""
    message.setAttribute("style", "color: #302535")
    bravo = 0
    etape = 0
})

confettiButton.addEventListener("click", function(){
    const cleanup = confettis();
    setTimeout(cleanup, 4000);
})

//Click sur le bouton 'voir la solution'
fin.addEventListener("click", function(){
    perdre(inputs, solution)
})

//saisie dans un champs texte
const guessLength=()=>{
    m=""
    for (var i = 0; i < inputs.length; i++) {
        m+=inputs[i].value
    }
    return m.length
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change",function(){
        this.value=this.value.toUpperCase()
        var position = this.getAttribute("id").charAt(6)
        var saisie = this.value
        var lettre = solution.charAt(position)

        this.classList.remove("bonnePlace", "mauvaisePlace", "mauvaiseLettre");
        
        
        if(saisie.toLowerCase() == lettre.toLowerCase())
        {
            bravo++
            this.classList.add("bonnePlace");

            //c'est ici qu'on gère le niveau 7
            if (bravo == niveau)
            {
                gagner(inputs, solution)
            }

        }else{
            if(solution.toLowerCase().includes(saisie.toLowerCase())) {
                // Lettre existe mais pas à la bonne place
                this.classList.add("mauvaisePlace");
            } else {
                // Lettre n'existe pas dans le mot
                this.classList.add("mauvaiseLettre");
            }
            //etape = etape+1
            console.log("Guess",guessLength())
            if (guessLength()<niveau) return
            else {
            etape++
            //modifie le src de img
            //car la var affichage contient la balise img
            affichage.src = './public/jeu0'+etape+'.png'
            //à la première erreur, src = './public/jeu01.png'

            if(etape > 6){
                perdre(inputs, solution)
            }}
        }
    })
}
