document.addEventListener('DOMContentLoaded', async () => {
    const sellerChatAvatar = document.getElementById('seller-chat-avatar');
    const sellerChatName = document.getElementById('seller-chat-name');
    const sellerStatusIndicator = document.getElementById('seller-status-indicator'); // NUEVA REFERENCIA
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatMessageInput = document.getElementById('chat-message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const sellerIdFromUrl = urlParams.get('sellerId'); // Obtener de la URL
    const productIdFromUrl = urlParams.get('productId'); // Obtener de la URL

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
    try {
        const response = await fetch('src/json/productos.json'); 
        if (!response.ok) {
            console.error(`Error al cargar productos.json: ${response.status} ${response.statusText}`);
            throw new Error('No se pudo cargar productos.json');
        }
        const products = await response.json();

        let foundProduct = null;

        if (sellerIdFromUrl) {
            // Intenta encontrar un producto asociado al sellerId de la URL
            // (Asume que cada producto tiene un vendedorId único que podemos usar para identificar al vendedor)
            foundProduct = products.find(p => p.vendedorId === sellerIdFromUrl);
            if (!foundProduct) {
                // Si no encuentra por vendedorId, intenta por el nombre del vendedor (menos robusto)
                foundProduct = products.find(p => encodeURIComponent(p.vendedor) === sellerIdFromUrl); 
            }
        } else if (productIdFromUrl) {
            // Intenta encontrar el producto por productId de la URL
            foundProduct = products.find(p => p.id === productIdFromUrl);
        }

        // Si no se encontró un vendedor específico (o no se pasaron IDs en la URL)
        // Usar el primer vendedor disponible como fallback para evitar "no especificado"
        if (!foundProduct && products.length > 0) {
            foundProduct = products[0]; // Usar el primer producto/vendedor del JSON
            console.warn("No se pudo identificar un vendedor específico desde la URL. Usando el primer vendedor del JSON como fallback.");
        }

        if (foundProduct) {
            currentSeller = {
                name: foundProduct.vendedor,
                avatar: foundProduct.vendedorAvatar || 'assets/img/foto-perfil1-png.png',
                // Simulación del estado: podrías tener esto en tu JSON de vendedores.
                // Aquí, lo hacemos aleatorio o basado en alguna lógica simple.
                isActive: Math.random() > 0.5 // 50% de probabilidad de estar activo
            };

            sellerChatName.textContent = currentSeller.name;
            sellerChatAvatar.src = currentSeller.avatar;

            // Actualizar el icono de estado
            if (currentSeller.isActive) {
                sellerStatusIndicator.classList.add('active');
                sellerStatusIndicator.classList.remove('inactive');
            } else {
                sellerStatusIndicator.classList.add('inactive');
                sellerStatusIndicator.classList.remove('active');
            }
            
            // Mensaje de bienvenida adaptado
            let welcomeMessage = `Hola, soy ${currentSeller.name}. ¿En qué puedo ayudarte?`;
            if (productIdFromUrl) {
                welcomeMessage = `Hola, soy ${currentSeller.name}. Estoy aquí para tus consultas sobre el producto "${foundProduct.titulo}".`;
            }
            addMessage(welcomeMessage, 'received');

        } else {
            // Si incluso el fallback falla (JSON vacío o no se puede cargar)
            sellerChatName.textContent = 'Vendedor no disponible';
            sellerChatAvatar.src = 'assets/img/foto-perfil1-png.png';
            sellerStatusIndicator.classList.add('inactive'); // Por defecto inactivo
            addMessage('Lo siento, no se pudo cargar la información del vendedor para el chat.', 'received');
        }

    } catch (error) {
        console.error('Error al cargar la información del vendedor:', error);
        sellerChatName.textContent = 'Error de carga';
        sellerChatAvatar.src = 'assets/img/foto-perfil1-png.png';
        sellerStatusIndicator.classList.add('inactive'); 
        addMessage('Hubo un error al iniciar el chat. Por favor, inténtalo de nuevo más tarde.', 'received');
    }

    // --- Manejar el envío de mensajes (simulado) ---
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

    // Desplazar al último mensaje al cargar (para el mensaje inicial)
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
});