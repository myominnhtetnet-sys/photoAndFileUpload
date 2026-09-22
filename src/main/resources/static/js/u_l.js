document.addEventListener('DOMContentLoaded', function() {
    const profileModalElement = document.getElementById('profileModal');
    if (!profileModalElement) return;
    
    const profileModal = new bootstrap.Modal(profileModalElement);
    const rows = document.querySelectorAll('.clickable-row');

    rows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Check if click was on action column/button
            if (e.target.closest('form') || e.target.closest('button')) return;

            const userId = this.getAttribute('data-id');

            fetch(`/user/edit/${userId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to load user details');
                    return response.json();
                })
                .then(user => {
                    document.getElementById('modalUserId').textContent = user.id;
                    document.getElementById('modalUserName').textContent = user.name;
                    document.getElementById('modalUserEmail').textContent = user.email;
                    document.getElementById('modalUserAge').textContent = user.age;
                    document.getElementById('modalUserPassword').textContent = user.password;

                    const photoElement = document.getElementById('modalUserPhoto');
                    if (user.base64Photo) {
                        photoElement.src = 'data:image/png;base64,' + user.base64Photo;
                    } else {
                        photoElement.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=default';
                    }

                    profileModal.show();
                })
                .catch(error => console.error('Error:', error));
        });
    });
});