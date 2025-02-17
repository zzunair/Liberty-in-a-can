document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('wholesale-popup');
    const openButtons = document.querySelectorAll('.js-open-wholesale-popup');
    const closeButton = document.querySelector('.js-close-wholesale-popup');
    const otherModal = document.querySelector('.profile-modal');
    const form = popup.querySelector('form');

    function openPopup() {
        otherModal.style.display = 'none';
        popup.classList.add('active');
        document.body.classList.add('popup-open');
    }

    function closePopup() {
        popup.classList.remove('active');
        document.body.classList.remove('popup-open');
    }

    // Open popup
    openButtons.forEach(button => {
        button.addEventListener('click', openPopup);
    });

    // Close popup
    closeButton.addEventListener('click', closePopup);

    // Close on outside click
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
  });