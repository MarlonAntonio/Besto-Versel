document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('headerForm');
    const imageInput = document.getElementById('headerImageInput');
    const imagePreview = document.getElementById('headerImagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');

    if (imageInput) {
        imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        imagePreview.src = reader.result;
                        removeImageBtn.classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('Error al procesar la imagen:', error);
                    alert('Error al procesar la imagen. Por favor, intenta con otra imagen.');
                }
            }
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', () => {
            imagePreview.src = '/default-profile.jpg';
            imageInput.value = '';
            removeImageBtn.classList.add('hidden');
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                title: form.title.value,
                subtitle: form.subtitle.value,
                email: form.email.value,
                profileImage: imagePreview.src,
                socialLinks: {
                    instagram: form.instagram.value,
                    facebook: form.facebook.value,
                    tiktok: form.tiktok.value,
                    youtube: form.youtube.value
                }
            };

            try {
                localStorage.setItem('headerConfig', JSON.stringify(formData));
                window.dispatchEvent(new Event('headerConfigUpdated'));
                alert('Configuración guardada correctamente');
            } catch (error) {
                console.error('Error al guardar la configuración:', error);
                alert('Error al guardar la configuración. Por favor intenta de nuevo.');
            }
        });
    }
});
