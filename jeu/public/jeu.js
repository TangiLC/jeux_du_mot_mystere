/* sélection des éléments de la page pour travailler avec */
var airDeJeu = document.getElementById("air_de_jeu")
var inputs = airDeJeu.getElementsByClassName("aTrouver")
var jeu = document.getElementById("jeu")
var message = document.getElementById("message")
var affichage = document.getElementById("affichage")
var fin = document.getElementById("fin")

/* déclaration des variables */
var solution = "Demandez un nouveau jeu"
var etape = 0
var bravo = 0
//var mots = "garage"
var mots=["garage", "hacker", "bifide", "bonsai", "cheval"]

/* déclaration des fonctions */

//fonction pour récupérer le niveau de difficulté
function getNiveau(){
    var params = new URLSearchParams(document.location.search.substring(1))
    var niveau = params.get("niveau")
    return niveau
}

//fonction pour activer ou desactiver les champs de saisie
function desactiver(nodes, ok){
    var couleur = "#ffffff"

    if(ok)
    {
        couleur = "#302535"
    }

    var style = "background-color: " + couleur

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].value = ""
        nodes[i].setAttribute("style", style)
        nodes[i].disabled = ok
    }
}

//fonction pour mettre à jour la page web lors d'une victoire
function gagner(nodes, solution){
    desactiver(nodes, true)
    message.innerHTML = solution
    message.setAttribute("style", "color: #7a4c81")
    affichage.src = "./public/gagne.png"
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
document.getElementById("lettre6").hidden = true

//Liste de mots pour le niveau difficile
if (niveau == 7)
{
    mots = ["absolue","butanol","cabotin","gabarie","piccolo"]
    document.getElementById("lettre6").hidden = false
}

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

    desactiver(inputs, false)
    affichage.src = "./public/jeu00.png"
    message.innerHTML = ""
    message.setAttribute("style", "color: #302535")
    bravo = 0
    etape = 0
})

//Click sur le bouton 'voir la solution'
fin.addEventListener("click", function(){
    perdre(inputs, solution)
})

//saisie dans un champs texte
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change",function(){
        var position = this.getAttribute("id").charAt(6)
        var saisie = this.value
        var lettre = solution.charAt(position)

        
        if(saisie.toLowerCase() == lettre.toLowerCase())
        {
            bravo++

            if (bravo == niveau)
            {
                gagner(inputs, solution)
            }

        }else{
            etape++
            affichage.src = './public/jeu0'+etape+'.png'

            if(etape > 6){
                perdre(inputs, solution)
            }
        }
    })
}





