/**
 * Gestion des tooltips pour les concepts et définitions
 */

// Charger les définitions des concepts
let conceptDefinitions = {};

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Charger les définitions depuis le fichier JSON
    loadConceptDefinitions()
        .then(() => {
            // Initialiser les tooltips pour tous les éléments avec la classe "concept"
            initTooltips();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des définitions:', error);
            
            // Utiliser des définitions par défaut en cas d'échec
            setDefaultDefinitions();
            initTooltips();
        });
});

/**
 * Charge les définitions des concepts depuis le fichier JSON
 */
async function loadConceptDefinitions() {
    try {
        const response = await fetch('../data/concepts.json');
        if (!response.ok) {
            throw new Error('Impossible de charger le fichier de définitions');
        }
        conceptDefinitions = await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Définit des définitions par défaut en cas d'échec du chargement
 */
function setDefaultDefinitions() {
    conceptDefinitions = {
        "etat-nation": {
            "title": "État-nation",
            "definition": "Structure politique fondée sur un territoire délimité par des frontières administratives, où l'État est l'objet politique en charge de gérer ce territoire et la Nation est l'ensemble des êtres relevant de ce territoire.",
            "author": "Concept analysé par Alain Brégy"
        },
        "veridiction": {
            "title": "Système de véridiction",
            "definition": "Ensemble des règles et mécanismes qui, à une époque donnée, déterminent ce qui peut être dit comme vrai et comment le dire. Chaque époque produit sa propre manière de dire le vrai.",
            "author": "Concept inspiré de Michel Foucault"
        },
        "anamorphose": {
            "title": "Réalité anamorphique",
            "definition": "Communauté qui ne devient lisible et reconnaissable qu'à partir d'un point de vue unique. Pour quiconque ne se trouve pas au bon endroit, son discours apparaît comme une masse d'informations désordonnées, sans sens.",
            "author": "Concept développé par Alain Brégy"
        },
        "deterritorialisation": {
            "title": "Déterritorialisation",
            "definition": "Processus par lequel nos existences se détachent progressivement du territoire physique pour se développer dans des espaces virtuels et communautaires qui transcendent les frontières géographiques traditionnelles.",
            "author": "Concept inspiré de Deleuze et Guattari"
        }
    };
}

/**
 * Initialise les tooltips pour tous les éléments avec la classe "concept"
 */
function initTooltips() {
    const conceptElements = document.querySelectorAll('.concept');
    const tooltip = document.getElementById('tooltip');
    const tooltipContent = tooltip.querySelector('.tooltip-content');
    
    conceptElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const conceptKey = this.dataset.concept;
            if (conceptDefinitions[conceptKey]) {
                const definition = conceptDefinitions[conceptKey];
                
                tooltipContent.innerHTML = `
                    <h3>${definition.title}</h3>
                    <p>${definition.definition}</p>
                    ${definition.author ? `<p class="tooltip-author">${definition.author}</p>` : ''}
                `;
                
                // Positionner le tooltip
                positionTooltip(tooltip, e);
                
                // Afficher le tooltip
                tooltip.classList.add('visible');
            }
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });
        
        // Gérer le clic pour les appareils mobiles
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const conceptKey = this.dataset.concept;
            if (conceptDefinitions[conceptKey]) {
                const definition = conceptDefinitions[conceptKey];
                
                tooltipContent.innerHTML = `
                    <h3>${definition.title}</h3>
                    <p>${definition.definition}</p>
                    ${definition.author ? `<p class="tooltip-author">${definition.author}</p>` : ''}
                `;
                
                // Positionner le tooltip
                positionTooltip(tooltip, e);
                
                // Basculer la visibilité du tooltip
                tooltip.classList.toggle('visible');
            }
        });
    });
    
    // Fermer le tooltip en cliquant en dehors
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.concept') && !e.target.closest('.tooltip')) {
            tooltip.classList.remove('visible');
        }
    });
}

/**
 * Positionne le tooltip près de l'élément déclencheur
 */
function positionTooltip(tooltip, event) {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Calculer la position en fonction de l'espace disponible
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 10;
    
    // Ajuster si le tooltip sort de l'écran
    if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 20;
    }
    
    if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - tooltipRect.height - 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}
