document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('wholesale-popup');
    const openButtons = document.querySelectorAll('.js-open-wholesale-popup');
    const closeButton = document.querySelector('.js-close-wholesale-popup');
    const form = popup.querySelector('form');

    function openPopup() {
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

    // Handle form submission
    // form.addEventListener('submit', function(e) {
    //     e.preventDefault();
        
    //     // Create FormData object
    //     const formData = new FormData(form);
        
    //     // Submit form using fetch
    //     fetch(form.action, {
    //         method: 'POST',
    //         body: formData
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.status === 'success') {
    //             alert('Thank you for your submission!');
    //             closePopup();
    //             form.reset();
    //         } else {
    //             alert('There was an error submitting the form. Please try again.');
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //         alert('There was an error submitting the form. Please try again.');
    //     });
    // });
  });