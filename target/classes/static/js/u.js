document.addEventListener('DOMContentLoaded', function() {
    // ID with Element called
    const photoInput = document.getElementById('photo');
    const previewImg = document.getElementById('photoPreview');
    const registerForm = document.querySelector('form');

    // Photo Input 
    photoInput?.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            // File Size Check (1 MB)
            const maxSize = 1024 * 1024;
            if (file.size > maxSize) {
                alert('Image size must not exceed 1 MB!');
                event.target.value = ''; 
                previewImg.style.display = 'none';
                return;
            }

            // MIME Type Check
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file!');
                event.target.value = ''; 
                previewImg.style.display = 'none';
                return;
            }

            // Real Image Check & Preview Render
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function() {
                    // if Image show Preview 
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'inline-block';
                };

                img.onerror = function() {
                    // not Image  show Error delete Preview 
                    alert('Selected file is not a valid image!');
                    photoInput.value = '';
                    previewImg.style.display = 'none';
                };
            };
            reader.readAsDataURL(file);
        } else {
            previewImg.style.display = 'none';
        }
    });

    // Form Submit not over 1 MB 
    registerForm?.addEventListener('submit', function(event) {
        const file = photoInput?.files[0];
        if (file && file.size > (1024 * 1024)) {
            alert('Image size must not exceed 1 MB!');
            event.preventDefault();
            photoInput.value = '';
            previewImg.style.display = 'none';
        }
    });
});