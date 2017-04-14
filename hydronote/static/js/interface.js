///////////////////////////////
// Modal pop-up interactions //
///////////////////////////////

var modalIsUp = false;
var menuIsUp = false;

function closeModals() {
    if (!modalIsUp) return;

    var modals = document.getElementsByClassName('modal');

    for (var i=0; i < modals.length; i++) {
        var modal = modals[i];
        modal.style.display = 'none';
    }
    modalIsUp = false;
}

function popUpModal(elementId) {
    var modal = document.getElementById(elementId);
    modal.style.display = 'block';
    modalIsUp = true;
}


// elementId: ID of deletion modal dialog
// deleteCallback: function to call when user confirms permanent delete
function deleteDialog(elementId, deleteCallback) {
    var modal = document.getElementById(elementId);
    modal.style.display = 'block';
    modalIsUp = true;
    
    document.getElementById('delete-modal-cancel').addEventListener('click', function() {
        closeModals();
    }, false);
    
    var deleteConfirm = document.getElementById('delete-modal-confirm');
    var deleteHandler = function() {
        // remove event listener to prevent double-delete cases
        deleteConfirm.removeEventListener('click', deleteHandler, false);
        deleteCallback();
        closeModals();
    }
    deleteConfirm.addEventListener('click', deleteHandler, false);
}


// Set up modal pop-up handling on page load
function modalSetup() {
    var aboutLink = document.getElementById('about-link');
    
    aboutLink.addEventListener('click', function() {
        popUpModal('about-popup');
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
}


///////////////////////////////
// Menu interactions         //
///////////////////////////////
function menuSetup() {        
    if (matchMedia) {
        var mq = window.matchMedia('(max-width: 650px)');
        mq.addListener(screenSizeChange);
        screenSizeChange(mq);
    }
}

function screenSizeChange(mq) {
    var notelistButton = document.getElementById('notelist-button');
    if (mq.matches) {
        notelistButton.addEventListener('click', openMenu, false);
        window.addEventListener('click', closeMenu, false);
    } else {
        openMenu();
        notelistButton.removeEventListener('click', openMenu, false);
        window.removeEventListener('click', closeMenu, false);
    }
}

function openMenu(event) {
    // Only open menu and stop event propogation if menu is currently closed
    if (!menuIsUp) {
        document.getElementById('notelist-container').style.display = 'block';
        if (event) event.stopPropagation();
        menuIsUp = true;
    }
}

function closeMenu(event) {
    if (menuIsUp) {
        document.getElementById('notelist-container').style.display = 'none';
        menuIsUp = false;
    }
}

function eventListenerSetup() {
    modalSetup();
    menuSetup();
}

// Add onload (hack: need to call setup here and in Angular app due to AngularJS loading BS)
window.addEventListener('load', eventListenerSetup);
