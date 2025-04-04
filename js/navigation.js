/**
 * Navigation et système de slides pour le parcours pédagogique sur la pensée d'Alain Brégy
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu et mise en évidence de la page active
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.nav-menu li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (linkPage === currentPage) {
            item.classList.add('active');
            updateProgressBar(menuItems, item);
        }
    });
    
    // Gestion de la navigation précédent/suivant
    setupPaginationButtons();
    
    // Ajout des écouteurs d'événements pour les liens de navigation
    addNavigationListeners();
});

/**
 * Met à jour la barre de progression en fonction de la position actuelle dans le parcours
 */
function updateProgressBar(menuItems, activeItem) {
    const progressIndicator = document.querySelector('.progress-indicator');
    if (!progressIndicator) return;
    
    // Ignore l'accueil dans le calcul de la progression
    const menuItemsArray = Array.from(menuItems).filter(item => {
        const link = item.querySelector('a').getAttribute('href');
        return !link.endsWith('index.html');
    });
    
    // Calcul du pourcentage de progression
    const totalItems = menuItemsArray.length;
    const currentIndex = menuItemsArray.indexOf(activeItem);
    
    if (currentIndex === -1) {
        // Si on est sur la page d'accueil, progression à 0
        progressIndicator.style.width = '0%';
    } else {
        // Sinon, calculer le pourcentage
        const percentage = ((currentIndex + 1) / totalItems) * 100;
        progressIndicator.style.width = `${percentage}%`;
    }
}

/**
 * Configure les boutons de pagination précédent/suivant
 */
function setupPaginationButtons() {
    const paginationContainer = document.querySelector('.page-navigation');
    if (!paginationContainer) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = Array.from(document.querySelectorAll('.nav-menu li a')).filter(link => 
        !link.getAttribute('href').endsWith('index.html'));
    
    const currentPageIndex = menuItems.findIndex(link => 
        link.getAttribute('href').split('/').pop() === currentPage);
    
    if (currentPageIndex === -1) return;
    
    // Bouton précédent
    const prevButton = document.querySelector('.prev-page');
    if (prevButton) {
        if (currentPageIndex > 0) {
            prevButton.href = menuItems[currentPageIndex - 1].getAttribute('href');
        } else {
            prevButton.href = 'index.html';
        }
    }
    
    // Bouton suivant
    const nextButton = document.querySelector('.next-page');
    if (nextButton) {
        if (currentPageIndex < menuItems.length - 1) {
            nextButton.href = menuItems[currentPageIndex + 1].getAttribute('href');
        } else {
            nextButton.style.visibility = 'hidden';
        }
    }
}

/**
 * Ajoute des écouteurs d'événements pour les liens de navigation
 */
function addNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ajout d'une transition fluide lors du changement de page
            e.preventDefault();
            const href = this.getAttribute('href');
            
            document.body.style.opacity = '0';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
    
    // Animation à l'arrivée sur la page
    window.addEventListener('pageshow', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);
    });
    
    // Transition de sortie
    document.body.style.transition = 'opacity 300ms ease';
}