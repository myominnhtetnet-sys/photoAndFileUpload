document.addEventListener('DOMContentLoaded', function() {

    // 1. Modal ပွင့်လာပါက Data ဖြည့်သွင်းခြင်း
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

    // 2. Photo Input ရွေးချယ်ချိန်တွင် Size & Type စစ်ဆေးခြင်း
    const editPhotoInput = document.getElementById('editPhoto');
    const imgPreview = document.getElementById('editPhotoPreview');

    editPhotoInput?.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            // 🌟 1 MB (1,048,576 Bytes) Limit Check
            const maxSize = 1024 * 1024; 
            if (file.size > maxSize) {
                alert('Image size is not over 1 MB !');
                event.target.value = ''; // Selected file ကို ဖြုတ်မည်
                return;
            }

            // File Type Check
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                alert('Image (JPG, PNG, GIF, WEBP) can accept');
                event.target.value = ''; 
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 🌟 3. Update Form Submit နှိပ်ချိန်တွင် 1 MB ထက်ကြီးပါက တားဆီးခြင််း
    const updateForm = document.getElementById('updateForm');
    updateForm?.addEventListener('submit', function(event) {
        const file = editPhotoInput?.files[0];
        const maxSize = 1024 * 1024; // 1 MB

        if (file && file.size > maxSize) {
            alert('Image sizes is not over  1 MB!');
            event.preventDefault(); // Server သို့ Submit မသွားအောင် တားဆီးမည်
            editPhotoInput.value = ''; 
        }
    });

});