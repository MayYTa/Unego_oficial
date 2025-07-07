document.addEventListener('DOMContentLoaded', () => {
    // --- FUNCIÓN AUXILIAR: Obtener usuario desde localStorage ---
    function getLoggedInUser() {
        const userJSON = localStorage.getItem('loggedInUser');
        // Si hay un usuario, lo parseamos (convertimos de string a objeto), si no, devolvemos null.
        return userJSON ? JSON.parse(userJSON) : null;
    }

    // --- LÓGICA PARA LA PÁGINA DE VISUALIZACIÓN DE PERFIL (perfil.html) ---
    // Buscamos un elemento que solo exista en la página de perfil para ejecutar este bloque.
    const profilePageContent = document.querySelector('.profile-page-content-wrapper');
    if (profilePageContent) {
        const user = getLoggedInUser();

        if (user) {
            // Si encontramos un usuario, rellenamos la página con sus datos.
            // Usamos '||' para poner un texto por defecto si el dato no existe.
            const profilePic = document.getElementById('profile-main-pic');
            const profileName = document.getElementById('profile-header-name');
            const profileDescription = document.getElementById('profile-description');

            if (profilePic) profilePic.src = user.profilePic || 'assets/img/default-profile.png';
            if (profileName) profileName.textContent = user.fullName || 'Nombre de Usuario';
            if (profileDescription) profileDescription.textContent = user.description || 'Añade una descripción en "Editar Perfil".';

        } else {
            // Si no hay usuario, no se puede ver el perfil. Redirigimos a la página de login.
            alert('Debes iniciar sesión para ver tu perfil.');
            window.location.href = 'log-in.html';
        }
    }

    // --- LÓGICA PARA LA PÁGINA DE EDICIÓN DE PERFIL (editar-perfil.html) ---
    // Buscamos el formulario de edición para ejecutar este bloque.
    const editProfileForm = document.querySelector('.profile-edit-form');
    if (editProfileForm) {
        const user = getLoggedInUser();
        if (!user) {
            // Si no hay sesión iniciada, no se puede editar. Redirigimos.
            alert('Debes iniciar sesión para editar tu perfil.');
            window.location.href = 'log-in.html';
            return; // Detenemos la ejecución para no causar errores.
        }

        // --- Parte 1: Cargar datos existentes en el formulario ---
        // Obtenemos referencias a todos los campos del formulario.
        const currentProfilePic = document.getElementById('currentProfilePic');
        const profilePictureInput = document.getElementById('profilePicture');
        const nombreUsuarioInput = document.getElementById('nombreUsuario');
        const descripcionPerfilInput = document.getElementById('descripcionPerfil');
        const emailInput = document.getElementById('email');
        const telefonoInput = document.getElementById('telefono');
        const universidadInput = document.getElementById('universidad');
        const sedeInput = document.getElementById('sede');
        const socialLinksContainer = document.getElementById('socialLinksContainer');
        const addSocialLinkBtn = document.getElementById('addSocialLink');

        // Rellenamos los campos con los datos del usuario guardados en localStorage.
        currentProfilePic.src = user.profilePic || 'assets/img/default-profile.png';
        nombreUsuarioInput.value = user.fullName || '';
        descripcionPerfilInput.value = user.description || '';
        emailInput.value = user.email || '';
        telefonoInput.value = user.phone || '';
        universidadInput.value = user.university || '';
        sedeInput.value = user.campus || '';

        // --- Parte 2: Lógica de interacciones del formulario (movida desde el HTML) ---
        
        // Previsualización de la imagen de perfil al seleccionarla.
        profilePictureInput.addEventListener('change', function(event) {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // El resultado 'e.target.result' es una cadena base64 que representa la imagen.
                    // La guardaremos directamente en localStorage.
                    currentProfilePic.src = e.target.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        });

        // Función para crear un nuevo campo de red social.
        function createSocialLinkItem(platform = '', url = '') {
            const div = document.createElement('div');
            div.classList.add('social-link-item');
            div.innerHTML = `
                <input type="text" class="social-platform" placeholder="Nombre de la red (Ej: Instagram)" value="${platform}">
                <input type="url" class="social-url" placeholder="URL del perfil" value="${url}">
                <button type="button" class="remove-social-link"><i class="fas fa-times"></i></button>
            `;
            // Añadimos el evento para que el botón de eliminar funcione en el nuevo elemento.
            div.querySelector('.remove-social-link').addEventListener('click', () => div.remove());
            return div;
        }

        // Rellenar las redes sociales que ya existen en el perfil del usuario.
        socialLinksContainer.innerHTML = ''; // Limpiamos cualquier placeholder que haya en el HTML.
        if (user.socialLinks && user.socialLinks.length > 0) {
            user.socialLinks.forEach(link => {
                socialLinksContainer.appendChild(createSocialLinkItem(link.platform, link.url));
            });
        }

        // Añadir un nuevo campo de red social al hacer clic en el botón.
        addSocialLinkBtn.addEventListener('click', () => {
            socialLinksContainer.appendChild(createSocialLinkItem());
        });

        // --- Parte 3: Guardar los cambios del formulario ---
        editProfileForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenimos la recarga de la página.

            // Actualizamos el objeto 'user' con los nuevos valores del formulario.
            user.fullName = nombreUsuarioInput.value;
            user.description = descripcionPerfilInput.value;
            user.email = emailInput.value;
            user.phone = telefonoInput.value;
            user.university = universidadInput.value;
            user.campus = sedeInput.value;
            user.profilePic = currentProfilePic.src; // Guardamos la imagen (posiblemente en formato base64).
            
            // Recopilamos todas las redes sociales.
            user.socialLinks = Array.from(document.querySelectorAll('.social-link-item')).map(item => ({
                platform: item.querySelector('.social-platform').value,
                url: item.querySelector('.social-url').value
            })).filter(link => link.platform && link.url); // Filtramos las que estén vacías.

            // Guardamos el objeto de usuario actualizado en localStorage.
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            // Notificamos al usuario y lo redirigimos a su perfil para que vea los cambios.
            alert('¡Perfil actualizado exitosamente!');
            window.location.href = 'perfil.html';
        });
    }
});

// --- LÓGICA PARA CERRAR SESIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'log-in.html';
        });
    }

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const headerProfilePic = document.getElementById('header-profile-pic');
    if (headerProfilePic) {
        if (user && user.profilePic) {
            headerProfilePic.src = user.profilePic;
        } else {
            headerProfilePic.src = 'assets/img/default-profile.png';
        }
    }
});
