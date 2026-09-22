document.addEventListener('DOMContentLoaded', function() {

    //  Modal 
    const editUserModal = document.getElementById('editUserModal');
    if (editUserModal) {
        editUserModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const userId = button.getAttribute('data-id');

            fetch(`/user/edit/${userId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch user data');
                    return response.json();
                })
                .then(user => {
                    document.getElementById('editId').value = user.id;
                    document.getElementById('editName').value = user.name;
                    document.getElementById('editEmail').value = user.email;
                    document.getElementById('editPassword').value = user.password;
                    document.getElementById('editAge').value = user.age;
                    
                    const editPhotoInput = document.getElementById('editPhoto');
                    if (editPhotoInput) editPhotoInput.value = '';

                    const imgPreview = document.getElementById('editPhotoPreview');
                    if (user.base64Photo) {
                        imgPreview.src = 'data:image/png;base64,' + user.base64Photo;
                        imgPreview.style.display = 'inline-block';
                    } else {
                        imgPreview.style.display = 'none';
                    }
                })
                .catch(error => console.error('Error fetching user:', error));
        });
    }

    // Photo Input check Real Image, Size & Type 
    const editPhotoInput = document.getElementById('editPhoto');
    const imgPreview = document.getElementById('editPhotoPreview');

    editPhotoInput?.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            //  1 MB Limit Check
            const maxSize = 1024 * 1024; 
            if (file.size > maxSize) {
                alert('Image size must not exceed 1 MB!');
                event.target.value = ''; 
                return;
            }

            //  MIME Type Check
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                alert('Only JPG, PNG, GIF, WEBP images are allowed!');
                event.target.value = ''; 
                return;
            }

            //  Real Image Validation 
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function() {
                    //if Image  Preview 
                    imgPreview.src = e.target.result;
                    imgPreview.style.display = 'inline-block';
                };

                img.onerror = function() {
                    //not Image show Alert delete Input 
                    alert('Selected file is not a valid image!');
                    editPhotoInput.value = ''; 
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Update Form Submit 
    const updateForm = document.getElementById('updateForm');
    updateForm?.addEventListener('submit', function(event) {
        const file = editPhotoInput?.files[0];
        const maxSize = 1024 * 1024;

        if (file && file.size > maxSize) {
            alert('Image size must not exceed 1 MB!');
            event.preventDefault();
            editPhotoInput.value = ''; 
        }
    });

});