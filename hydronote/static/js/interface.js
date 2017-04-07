// Set up About pop-up handling on page load
window.onload = function() {
    var modal = document.getElementById('about-popup');
    var about = document.getElementById('about-link');
    var close = document.getElementsByClassName('close')[0];
    
    about.addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    close.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
};

