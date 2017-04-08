// Modal pop-up interactions

var modalIsUp = false;

function closeModals() {
    if (!modalIsUp) return;

    var modals = document.getElementsByClassName('modal');

    for (var i=0; i < modals.length; i++) {
        var modal = modals[i];
        modal.style.display = 'none';
    }
    modalIsUp = false;
}

function popUpModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = 'block';
    modalIsUp = true;
}

// Set up modal pop-up handling on page load
window.addEventListener('load', function() {
    var aboutLink = document.getElementById('about-link');
    
    aboutLink.addEventListener('click', function() {
        popUpModal('about-popup')
    }, false);
    
    var closeButtons = document.getElementsByClassName('close');
    for (var i=0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', closeModals, false);
    }
    
    window.addEventListener('click', function(event) {
        // If a modal is being clicked out of , exit
        // (the if statement prevents immediate closing as soon as link is clicked)
        if (modalIsUp && event.target.className.split(' ').indexOf('modal') > -1) {
            closeModals();
        }
    });
}, false);

