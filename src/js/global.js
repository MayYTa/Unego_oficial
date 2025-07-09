document.addEventListener('DOMContentLoaded', function() {
    // 1. Intentar obtener el usuario del localStorage
    const userJSON = localStorage.getItem('loggedInUser');

    if (userJSON) {
        // 2. Si el usuario existe, convertir el JSON a un objeto
        const user = JSON.parse(userJSON);

        // 3. Encontrar todas las imágenes de perfil en el header
        // Usamos una clase común 'header-profile-pic' que añadiremos a las imágenes
        const profileImages = document.querySelectorAll('.header-profile-pic');
        
        profileImages.forEach(img => {
            if (user.profilePic) {
                img.src = user.profilePic;
                img.alt = `Perfil de ${user.fullName}`; // Buena práctica para accesibilidad
            }
        });

        // 4. También nos aseguramos de que el enlace del perfil apunte a la página correcta
        const profileLinks = document.querySelectorAll('.header-profile-link');
        profileLinks.forEach(link => {
            link.href = 'perfil.html';
        });

    } else {
        console.log('No hay usuario logueado. Se mostrará el ícono por defecto.');
    }
});
