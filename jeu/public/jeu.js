/* sélection des éléments de la page pour travailler avec */

/* déclaration des variables */

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
   
}

/* logique de jeu */

//Liste de mots pour le niveau facile

//Liste de mots pour le niveau difficile

//initialiser le jeu

/* évènements */

//Click sur le bouton 'nouveau jeu'

//Click sur le bouton 'voir la solution'

//saisie dans un champs texte
for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change",function(){
    })
}





