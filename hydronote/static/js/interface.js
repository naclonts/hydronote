///////////////////////////////
// Modal pop-up interactions //
///////////////////////////////

var modalIsUp = false;
var menuCurrentlyOpen = '';

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
    var optionsButton = document.getElementById('options-button');

    // Small-screen views
    if (mq.matches) {
        notelistButton.addEventListener('click', function(event) {
            openPopupMenu('notelist-container', event)
        }, false);
        optionsButton.addEventListener('click', function(event) {
            openPopupMenu('options-container', event)
        }, false);
        window.addEventListener('click', closeMenus, false);
        // start out with menus closed
        closeMenus();
    // Return to wide-screen views
    } else {
        notelistButton.removeEventListener('click', openPopupMenu, false);
        optionsButton.removeEventListener('click', openPopupMenu, false);
        window.removeEventListener('click', closeMenus, false);
        displayAllMenus();
        menuCurrentlyOpen = '';
    }
}

// Display pop-up menu for element "id"
// event: optional event to stop propogating and avoid immediate close
function openPopupMenu(id, event) {
    // if it's already open and button is clicked, let it close
    if (id == menuCurrentlyOpen) return;
    
    // close currently active menus, then display the selected one
    closeMenus();
    
    var el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'block';
    if (event) event.stopPropagation();
    menuCurrentlyOpen = id;
}

// For return to full-width screen
function displayAllMenus() {
    var menus = document.getElementsByClassName('menu-popup');

    for (var i=0; i < menus.length; i++) {
        var menu = menus[i];
        menu.style.display = 'block';
    }
}

// Close all the pop-up menus
function closeMenus(event) {
    var menus = document.getElementsByClassName('menu-popup');

    for (var i=0; i < menus.length; i++) {
        var menu = menus[i];
        menu.style.display = 'none';
    }
    menuCurrentlyOpen = '';
    if (event) event.stopPropagation();
}

// Set up modal and responsive menu interfaces
function eventListenerSetup() {
    modalSetup();
    menuSetup();
}

// Add onload (hack: need to call setup here and in Angular app due to AngularJS loading BS)
window.addEventListener('load', eventListenerSetup);
