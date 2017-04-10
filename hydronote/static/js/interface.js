///////////////////////////////
// Modal pop-up interactions //
///////////////////////////////

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
}

// Add onload (hack: need to call modalSetup here and in Angular app due to AngularJS BS)
window.addEventListener('load', modalSetup);
