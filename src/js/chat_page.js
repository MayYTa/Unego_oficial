document.addEventListener('DOMContentLoaded', async () => {
    // --- Referencias a los elementos del DOM de la INTERFAZ del chat (flotante/modal) ---
    const chatFloatBtn = document.getElementById('chatFloatBtn');
    const chatModal = document.getElementById('chatModal');
    const closeChatModalBtn = document.getElementById('closeChatModal');

    // --- Referencias a los elementos del DOM DENTRO de la modal del chat (tus referencias existentes) ---
    const sellerChatAvatar = document.getElementById('seller-chat-avatar'); // Esto probablemente necesita ser movido a la modal si no existe ya
    const sellerChatName = document.getElementById('seller-chat-name');     // Esto probablemente necesita ser movido a la modal si no existe ya
    const sellerStatusIndicator = document.getElementById('seller-status-indicator');
    const chatMessagesContainer = document.getElementById('chatMessages'); // ID corregido de 'chat-messages' a 'chatMessages' del HTML de la modal
    const chatMessageInput = document.getElementById('chatInput');         // ID corregido de 'chat-message-input' a 'chatInput' del HTML de la modal
    const sendMessageBtn = document.getElementById('sendMessageBtn');     // ID corregido de 'send-message-btn' a 'sendMessageBtn' del HTML de la modal

    const urlParams = new URLSearchParams(window.location.search);
    const sellerIdFromUrl = urlParams.get('sellerId'); 
    const productIdFromUrl = urlParams.get('id'); // Usamos 'id' para el ID del producto, como en tu load_productos.js

    let currentSeller = null; 

    // Función para añadir un mensaje al chat
    function addMessage(text, type, time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        messageDiv.innerHTML = `<p>${text}</p><span class="message-time">${time}</span>`;
        chatMessagesContainer.appendChild(messageDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // --- Lógica para cargar la información del vendedor ---
    // Esta lógica se ejecutará cuando se cargue la página
    // y determinará qué vendedor se mostrará en el chat al abrirlo.
    try {
        const response = await fetch('src/json/productos.json'); 
        if (!response.ok) {
            console.error(`Error al cargar productos.json: ${response.status} ${response.statusText}`);
            throw new Error('No se pudo cargar productos.json');
        }
        const products = await response.json();

        let foundProduct = null;

        if (sellerIdFromUrl) {
            foundProduct = products.find(p => p.vendedorId === sellerIdFromUrl);
            if (!foundProduct) {
                // Fallback si vendedorId no encuentra nada
                foundProduct = products.find(p => encodeURIComponent(p.vendedor.toLowerCase()) === sellerIdFromUrl.toLowerCase());
            }
        } else if (productIdFromUrl) {
            foundProduct = products.find(p => p.id === productIdFromUrl);
        }

        // Si no se encontró un vendedor específico o producto, usar el primer vendedor disponible como fallback
        if (!foundProduct && products.length > 0) {
            foundProduct = products[0]; 
            console.warn("No se pudo identificar un vendedor/producto específico desde la URL para el chat. Usando el primer vendedor del JSON como fallback.");
        }

        if (foundProduct) {
            currentSeller = {
                name: foundProduct.vendedor,
                avatar: foundProduct.vendedorAvatar || 'assets/img/LandingPage5.png',
                isActive: Math.random() > 0.5 // Simulación del estado
            };

            // Asegurarse de que estos elementos existan en tu HTML de la modal si quieres que se actualicen
            // (Los IDs 'seller-chat-avatar' y 'seller-chat-name' deben estar dentro de la modal)
            if (sellerChatName) sellerChatName.textContent = currentSeller.name;
            if (sellerChatAvatar) sellerChatAvatar.src = currentSeller.avatar;

            if (sellerStatusIndicator) {
                if (currentSeller.isActive) {
                    sellerStatusIndicator.classList.add('active');
                    sellerStatusIndicator.classList.remove('inactive');
                } else {
                    sellerStatusIndicator.classList.add('inactive');
                    sellerStatusIndicator.classList.remove('active');
                }
            }
            
            let welcomeMessage = `Hola, soy ${currentSeller.name}. ¿En qué puedo ayudarte?`;
            if (productIdFromUrl && foundProduct.titulo) {
                welcomeMessage = `Hola, soy ${currentSeller.name}. Estoy aquí para tus consultas sobre el producto "${foundProduct.titulo}".`;
            }
            // Agrega el mensaje de bienvenida inicial solo si no hay mensajes previos (al abrir la modal por primera vez)
            // O simplemente añádelo cada vez que el chat se cargue, dependiendo de tu UX.
            // Para este ejemplo, lo añadimos si el contenedor está vacío.
            if (chatMessagesContainer.children.length === 0) {
                 addMessage(welcomeMessage, 'received');
            }


        } else {
            // Manejo de caso donde no se encuentra vendedor/producto
            if (sellerChatName) sellerChatName.textContent = 'Vendedor no disponible';
            if (sellerChatAvatar) sellerChatAvatar.src = 'assets/img/foto-perfil1-png.png';
            if (sellerStatusIndicator) sellerStatusIndicator.classList.add('inactive'); 
            if (chatMessagesContainer.children.length === 0) {
                addMessage('Lo siento, no se pudo cargar la información del vendedor para el chat.', 'received');
            }
        }

    } catch (error) {
        console.error('Error al cargar la información del vendedor para el chat:', error);
        if (sellerChatName) sellerChatName.textContent = 'Error de carga';
        if (sellerChatAvatar) sellerChatAvatar.src = 'assets/img/foto-perfil1-png.png';
        if (sellerStatusIndicator) sellerStatusIndicator.classList.add('inactive'); 
        if (chatMessagesContainer.children.length === 0) {
            addMessage('Hubo un error al iniciar el chat. Por favor, inténtalo de nuevo más tarde.', 'received');
        }
    }

    // --- Lógica de la INTERFAZ: Abrir/Cerrar la Modal ---
    if (chatFloatBtn) {
        chatFloatBtn.addEventListener('click', () => {
            if (chatModal) {
                chatModal.style.display = 'flex'; // Usar 'flex' para centrar el contenido
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Asegurar scroll al abrir
            }
        });
    }

    if (closeChatModalBtn) {
        closeChatModalBtn.addEventListener('click', () => {
            if (chatModal) chatModal.style.display = 'none';
        });
    }

    // Cierra la modal si el usuario hace clic fuera del contenido
    if (chatModal) {
        window.addEventListener('click', (event) => {
            if (event.target === chatModal) {
                chatModal.style.display = 'none';
            }
        });
    }

    // --- Manejar el envío de mensajes (simulado) ---
    // Asegurarse de que el input y el botón existan
    if (sendMessageBtn && chatMessageInput) { 
        sendMessageBtn.addEventListener('click', () => {
            const messageText = chatMessageInput.value.trim();
            if (messageText) {
                addMessage(messageText, 'sent');
                chatMessageInput.value = '';

                // Simular respuesta del vendedor después de un tiempo
                setTimeout(() => {
                    let sellerResponse = 'Gracias por tu mensaje. Te responderemos pronto.';
                    if (currentSeller && !currentSeller.isActive) {
                        sellerResponse = 'Gracias por tu mensaje. El vendedor está inactivo en este momento, pero te responderá a la brevedad.';
                    }
                    addMessage(sellerResponse, 'received');
                }, 1500);
            }
        });

        chatMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessageBtn.click();
            }
        });
    }

    // NOTA: El chatMessagesContainer.scrollTop al final del DOMContentLoaded solo es necesario
    // si quieres asegurar que, incluso si el chat está oculto, se desplace al final
    // antes de que el usuario lo abra. Si lo manejas al abrir la modal, no es estrictamente necesario aquí.
});