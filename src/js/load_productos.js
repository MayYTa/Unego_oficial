document.addEventListener('DOMContentLoaded', async () => {
    // --- Referencias a los elementos del DOM ---
    const productImg = document.getElementById('product-img');
    const productMainTitle = document.getElementById('product-main-title'); // Título principal (h1) de la columna izquierda
    const productNameInfo = document.getElementById('product-name-info'); // Span con el nombre en la columna derecha
    const productSellerNameInfo = document.getElementById('product-seller-name-info'); // Vendedor en la sección de info
    const productSellerNameTop = document.getElementById('product-seller-name-top'); // Vendedor arriba de la imagen
    const productCategoriesDisplay = document.getElementById('product-categories');
    const productPrice = document.getElementById('product-price');
    const productRatingValue = document.getElementById('product-rating-value');
    const productStarsContainer = document.getElementById('product-stars');
    const productDescriptionList = document.getElementById('product-description-list'); // CAMBIO: Ahora es un UL
    const buyButton = document.getElementById('buy-button');

    // Nuevo: Referencia al contenedor del chat flotante
    const floatingChatContainer = document.querySelector('.floating-chat-container');
    // Nuevo: Referencia al módulo de chat principal (el que ya tenías)
    const sellerChatModule = document.querySelector('.seller-chat-module');


    // Función para generar las estrellas de calificación (solo visualización)
    function generateStarRating(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star filled"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>'; // Usar far fa-star para estrellas vacías si la librería lo permite
        }
        return starsHtml;
    }

    // Función para mostrar mensaje de "Producto no encontrado"
    function displayProductNotFound() {
        if (productMainTitle) productMainTitle.textContent = 'Producto no encontrado.';
        if (productNameInfo) productNameInfo.textContent = 'No disponible';
        if (productSellerNameInfo) productSellerNameInfo.textContent = 'N/A';
        if (productSellerNameTop) productSellerNameTop.textContent = 'N/A';
        if (productCategoriesDisplay) productCategoriesDisplay.textContent = 'N/A';
        if (productPrice) productPrice.textContent = 'N/A';
        if (productRatingValue) productRatingValue.textContent = 'N/A';
        if (productStarsContainer) productStarsContainer.innerHTML = '';
        if (productDescriptionList) productDescriptionList.innerHTML = '<li>El producto que buscas no está disponible o el ID es incorrecto.</li>';
        if (buyButton) buyButton.disabled = true;
        if (productImg) productImg.src = '';
        if (productImg) productImg.alt = 'Producto no encontrado';
    }

    // Lógica para cargar los detalles de un producto específico (basado en el ID de la URL)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        displayProductNotFound();
        return;
    }

    try {
        // Asegúrate que esta ruta sea correcta desde src/js/detalle_producto.js
        // Si tu JS está en src/js/ y el JSON en src/json/, la ruta '../json/productos.json' es la más común.
        const response = await fetch('src/json/productos.json'); 
        
        if (!response.ok) {
            // Log de error de red
            console.error(`Error al cargar productos.json: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        const product = products.find(p => p.id === productId);

        if (product) {
            // Rellenar la información del producto
            if (productImg) {
                productImg.src = product.imagen;
                productImg.alt = product.titulo;
            }
            if (productMainTitle) productMainTitle.textContent = product.titulo;
            if (productNameInfo) productNameInfo.textContent = product.titulo; // Aquí se llena el span en la columna derecha
            
            if (productSellerNameInfo) productSellerNameInfo.textContent = product.vendedor;
            if (productSellerNameTop) productSellerNameTop.textContent = product.vendedor;

            if (productCategoriesDisplay && product.category) {
                productCategoriesDisplay.textContent = Array.isArray(product.category) ? product.category.join(', ') : product.category;
            } else if (productCategoriesDisplay) {
                productCategoriesDisplay.textContent = 'N/A';
            }

            if (productPrice) {
                if (Array.isArray(product.precio)) {
                     productPrice.innerHTML = product.precio.map(p => `<span>S/.${p}</span>`).join('<br>');
                } else {
                     productPrice.textContent = `S/.${typeof product.precio === 'number' ? product.precio.toFixed(2) : product.precio}`;
                }
            }
            
            if (productRatingValue && productStarsContainer) {
                productRatingValue.textContent = product.calificacion ? product.calificacion.toFixed(1) : 'N/A';
                productStarsContainer.innerHTML = product.calificacion ? generateStarRating(product.calificacion) : '';
            }

            // Maneja la descripción, ahora rellenando el UL
            if (productDescriptionList) {
                productDescriptionList.innerHTML = ''; // Limpia el contenido anterior
                if (Array.isArray(product.descripcion)) {
                    product.descripcion.forEach(line => {
                        const li = document.createElement('li');
                        li.textContent = line;
                        productDescriptionList.appendChild(li);
                    });
                } else if (product.descripcion) { // Si es un string simple
                    const li = document.createElement('li');
                    li.textContent = product.descripcion;
                    productDescriptionList.appendChild(li);
                } else {
                    productDescriptionList.innerHTML = '<li>No hay descripción disponible.</li>';
                }
            }

            if (buyButton) {
                buyButton.addEventListener('click', () => {
                    alert(`¡Has comprado "${product.titulo}"!`);
                });
            }

        } else {
            displayProductNotFound();
        }
    } catch (error) {
        console.error('Error al cargar los detalles del producto:', error);
        displayProductNotFound();
    }

    // Lógica para que el chat flotante se desplace al chat principal
    if (floatingChatContainer && sellerChatModule) {
        floatingChatContainer.addEventListener('click', () => {
            sellerChatModule.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }


});

document.addEventListener('DOMContentLoaded', () => {
    // Solo necesitamos referenciar el botón principal de chat y el flotante (si también lo quieres redirigir)
    const chatWithSellerButton = document.getElementById('chat-with-seller-button');
    const floatingChatContainer = document.querySelector('.floating-chat-container'); // Este era tu flotante original (div)

    // Función simple para redirigir
    const redirectToChat = () => {
        // Redirige directamente a chat.html. No pasa parámetros por ahora.
        // Si más tarde quieres pasar el ID del producto, necesitarás cargar los datos del producto nuevamente.
        window.location.href = 'chat.html'; 
    };

    // Añadir el listener al botón principal
    if (chatWithSellerButton) {
        chatWithSellerButton.addEventListener('click', redirectToChat);
    }

    // Añadir el listener al chat flotante (si es un div y quieres que JS lo redirija)
    if (floatingChatContainer) {
        floatingChatContainer.addEventListener('click', redirectToChat);
    }

    // TODO: (Opcional) Si necesitas cargar la información del producto para OTROS ELEMENTOS
    // en la página de detalles, mantén el código de carga del producto AQUÍ,
    // pero asegúrate de que no interfiera con esta lógica de botón simple.
    // Ej:
    /*
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        // Aquí iría toda tu lógica para cargar los detalles del producto (imagen, título, precio, etc.)
        // No la pongas dentro del evento click del botón de chat.
    }
    */
});

// --- CHAT MODAL: Mostrar solo al hacer click ---
const chatFloatBtn = document.getElementById('chatFloatBtn'); // Botón flotante de chat
const chatModal = document.getElementById('chatModal'); // Modal de chat
const closeChatModalBtn = document.getElementById('closeChatModal'); // Botón para cerrar la modal

if (chatFloatBtn && chatModal) {
    chatFloatBtn.addEventListener('click', () => {
        chatModal.style.display = 'flex'; // Muestra la modal solo al hacer click
    });
}
if (closeChatModalBtn && chatModal) {
    closeChatModalBtn.addEventListener('click', () => {
        chatModal.style.display = 'none'; // Oculta la modal al cerrar
    });
}
// Opcional: cerrar la modal al hacer click fuera del contenido
if (chatModal) {
    chatModal.addEventListener('click', (e) => {
        if (e.target === chatModal) {
            chatModal.style.display = 'none';
        }
    });
}

// Nota: Todo tu código anterior para cargar la información del producto (imagen, título, etc.)
// debe existir por separado en detalle_producto.js pero FUERA DE ESTA FUNCIÓN SIMPLE DE REDIRECCIÓN,
// si aún lo necesitas para otras partes de la página de detalles del producto.