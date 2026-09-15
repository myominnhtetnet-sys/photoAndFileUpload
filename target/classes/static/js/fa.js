
// 1. Modal ပွင့်လာလျှင် Server ထံမှ Data Fetch လုပ်ပြီး Form ထဲဖြည့်ပေးခြင်း
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
                
                // Photo input ကို clear လုပ်ထားမည် (ပုံအသစ်မတင်ရင် ဖိုင်ဟောင်းပဲကျန်ခဲ့မည်)
                const editPhotoInput = document.getElementById('editPhoto');
                if (editPhotoInput) editPhotoInput.value = '';
            })
            .catch(error => console.error('Error fetching user:', error));
    });
}

// 2. Image Validation Function (ဓာတ်ပုံဖိုင် ဟုတ်/မဟုတ် စစ်ဆေးခြင်း)
function validateImageFile(fileInput) {
    const file = fileInput.files[0];
    if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            alert('ဓာတ်ပုံ (JPG, PNG, GIF, WEBP) ဖိုင်များကိုသာ တင်ခွင့်ရှိပါသည်။');
            fileInput.value = ''; // မှားယွင်းသော ဖိုင်ကို ပြန်ဖျက်ပေးမည်
            return false;
        }
    }
    return true;
}

// Edit Modal Form ထဲက Photo Input ကို စစ်ဆေးသည့် Event Listener
document.getElementById('editPhoto')?.addEventListener('change', function() {
    validateImageFile(this);
});

// Register Form ရှိပါက စစ်ဆေးသည့် Event Listener
document.getElementById('photo')?.addEventListener('change', function() {
    validateImageFile(this);
});

// 3. Edit Form Submit လုပ်သည့် အပိုင်း (Ajax Fetch သုံး၍ Update လုပ်ခြင်း)
document.getElementById("updateForm")?.addEventListener('submit', function(event) {
    event.preventDefault(); // Default Page Reload ဖြစ်ခြင်းကို တားဆီးသည်

    const formData = new FormData(this);

    fetch('/user/update', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Update အဆင်ပြေရင် Profile / User List Page သို့ Reload / Redirect လုပ်မည်
            window.location.reload(); 
        } else {
            alert("Update failed! Please try again.");
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
    });
});