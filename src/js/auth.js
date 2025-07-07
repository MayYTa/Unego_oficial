// Este código se ejecutará solo si estamos en una página que tiene un formulario de login
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        // 1. Prevenimos que el formulario se envíe de la forma tradicional
        event.preventDefault();

        // 2. Obtenemos los valores de los campos
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('login-error');

        // 3. Validamos con nuestro usuario "admin"
        if (email === 'admin@upc.edu.pe' && password === 'admin') {
            // Si las credenciales son correctas, creamos el objeto de usuario
            const user = {
                fullName: 'Ivan Ruben Cunyas Ramos',
                email: 'admin@upc.edu.pe',
                profilePic: 'assets/img/foto-perfil1-png.png',
                description: '¡Hola! Soy un estudiante apasionado por la tecnología y el emprendimiento.',
                phone: '987654321',
                university: 'Universidad Peruana de Ciencias Aplicadas',
                campus: 'Campus Monterrico',
                socialLinks: [
                    { platform: 'Facebook', url: 'https://facebook.com/tupagina' }
                ]
            };

            // 4. Guardamos el objeto de usuario en localStorage.
            // JSON.stringify convierte el objeto en un string para poder guardarlo.
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            // 5. Redirigimos al usuario a la página de perfil
            window.location.href = 'tienda.html';

        } else {
            // Si las credenciales son incorrectas, mostramos un error
            loginError.style.display = 'block';
        }
    });
}

// --- LÓGICA DE RECUPERAR CONTRASEÑA ---
const recoverForm = document.getElementById('form-email');
if (recoverForm) {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const emailInput = document.getElementById('recuperar-email');
    const enviarCodigoBtn = document.getElementById('enviar-codigo-btn');

    emailInput.addEventListener('input', function() {
        enviarCodigoBtn.style.display = emailInput.value ? 'block' : 'none';
    });

    recoverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        step1.style.display = 'none';
        step2.style.display = 'block';
    });

    document.getElementById('form-codigo').addEventListener('submit', function(e) {
        e.preventDefault();
        const codigo = document.getElementById('codigo').value.trim();
        const codigoError = document.getElementById('codigo-error');
        if (codigo === '123456') {
            codigoError.style.display = 'none';
            step2.style.display = 'none';
            step3.style.display = 'block';
        } else {
            codigoError.style.display = 'block';
        }
    });

    document.getElementById('form-reset').addEventListener('submit', function(e) {
        e.preventDefault();
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirm-password').value;
        const errorDiv = document.getElementById('password-error');
        if (pass !== confirm || pass === '') {
            errorDiv.style.display = 'block';
        } else {
            errorDiv.style.display = 'none';
            step3.style.display = 'none';
            step4.style.display = 'block';
        }
    });
}

// --- LÓGICA DE REGISTRO (SIGN UP) ---
const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Obtener elementos del DOM
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const termsInput = document.getElementById('terms');
        const signupError = document.getElementById('signup-error');
        const confirmPasswordFeedback = document.getElementById('confirm-password-feedback');

        // 2. Resetear errores previos
        signupError.style.display = 'none';
        confirmPasswordInput.classList.remove('is-invalid');
        signupForm.classList.remove('was-validated');

        // 3. Validaciones
        let isValid = true;
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.classList.add('is-invalid');
            isValid = false;
        }

        // Usamos la validación de Bootstrap para el resto de campos
        if (!signupForm.checkValidity()) {
            isValid = false;
        }
        
        signupForm.classList.add('was-validated');

        if (isValid) {
            // 4. Si todo es válido, crear y guardar el usuario
            const newUser = {
                fullName: nameInput.value,
                email: emailInput.value,
                // Usamos una foto de perfil predeterminada para nuevos usuarios
                profilePic: 'assets/img/default-profile.png', 
                description: '¡Hola! Soy nuevo en Unego.',
                phone: '',
                university: '',
                campus: '',
                socialLinks: []
            };

            localStorage.setItem('loggedInUser', JSON.stringify(newUser));
            window.location.href = 'tienda.html'; // Redirigir a la tienda
        } else {
            signupError.style.display = 'block';
        }
    });
}
