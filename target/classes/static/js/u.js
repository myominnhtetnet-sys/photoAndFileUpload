document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('photo');
    const previewImg = document.getElementById('photoPreview');
    const registerForm = document.querySelector('form');

    // 1. File ရွေးချယ်ချိန်တွင် စစ်ဆေးခြင်း
    photoInput?.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const maxSize = 1024 * 1024; // 1 MB
            if (file.size > maxSize) {
                alert('Image size is not over 1 MB!');
                event.target.value = ''; // File ပြန်ဖြုတ်မည်
                previewImg.style.display = 'none';
                return;
            }

            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('chose only image!');
                event.target.value = ''; 
                previewImg.style.display = 'none';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewImg.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        } else {
            previewImg.style.display = 'none';
        }
    });

    // 🌟 2. Form Submit နှိပ်ချိန်တွင် 1 MB ထက်ကြီးပါက Submit မလုပ်အောင် တားဆီးခြင်း
    registerForm?.addEventListener('submit', function(event) {
        const file = photoInput?.files[0];
        if (file && file.size > (1024 * 1024)) {
            alert('Image size is not over  1 MB!');
            event.preventDefault(); // Server သို့ Form တင်ခြင်းကို တားဆီးမည်
            photoInput.value = '';
            previewImg.style.display = 'none';
        }
    });
});