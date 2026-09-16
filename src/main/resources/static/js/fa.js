
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
                
                // Photo input ကို clear ပြန်လုပ်ထားမည်
                const editPhotoInput = document.getElementById('editPhoto');
                if (editPhotoInput) editPhotoInput.value = '';

                // 📸 Database ထဲရှိ လက်ရှိ Photo ကို Preview ပြသခြင်း
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

// 📸 Choose File ဖြင့် ပုံအသစ် ရွေးလိုက်ပါက Preview ကို ချက်ချင်း ပြောင်းပြပေးခြင်း
document.getElementById('editPhoto')?.addEventListener('change', function(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const imgPreview = document.getElementById('editPhotoPreview');

    if (file) {
        // Image validation စစ်ဆေးခြင်း
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            alert('ဓာတ်ပုံ (JPG, PNG, GIF, WEBP) ဖိုင်များကိုသာ တင်ခွင့်ရှိပါသည်။');
            fileInput.value = ''; 
            return;
        }

        // ဖိုင်အသစ် ရွေးထားလျှင် Preview ပြသပေးခြင်း
        const reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
});

// Update Form Submit Handling
document.getElementById("updateForm")?.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const formData = new FormData(this);

    fetch('/user/update', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        if (response.ok) {
            window.location.reload(); 
        } else {
            const errorMsg = await response.text();
            alert(errorMsg || "Update failed! Please try again.");
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
    });
});