document.addEventListener('DOMContentLoaded', async () => {
    // --- Variables de elementos del DOM ---
    const productSearchInput = document.getElementById('product-search');
    const sortOrderSelect = document.getElementById('sort-order');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceAlert = document.getElementById('price-alert');
    const ratingFilters = document.querySelectorAll('input[name="rating-filter"]');
    const categoryFilters = document.querySelectorAll('input[name="category-filter"]');
    const applyFiltersButton = document.getElementById('apply-filters');
    const mainContent = document.querySelector('.main-content');

    let allProducts = []; // Almacenará todos los productos del JSON

    // Función para generar las estrellas de calificación
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
            starsHtml += '<i class="fas fa-star"></i>';
        }
        return starsHtml;
    }

    // Función para renderizar los productos en el DOM
    function renderProducts(productsToDisplay) {
        mainContent.innerHTML = ''; // Limpiar el contenido actual
        productsToDisplay.forEach(product => {
            const productLink = document.createElement('a');
            productLink.href = `productos.html?id=${product.id}`;
            productLink.classList.add('product-link');

            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.id = product.id;
            productCard.dataset.category = product.category.toLowerCase(); // ¡IMPORTANTE! Añadir data-category
            productCard.dataset.price = product.precio; // Asegurar que el precio esté en dataset
            productCard.dataset.rating = product.calificacion; // Asegurar que la calificación esté en dataset

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.imagen}" alt="${product.titulo}">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.titulo}</h3>
                    <p class="product-seller">Por ${product.vendedor}</p>
                    <div class="product-price" data-price="${product.precio}">S/.${product.precio.toFixed(2)}</div>
                    <div class="product-rating" data-rating="${product.calificacion}">
                        <span class="rating-value">${product.calificacion.toFixed(1)}</span>
                        <div class="stars">
                            ${generateStarRating(product.calificacion)}
                        </div>
                    </div>
                </div>
                <div class="product-actions">
                    <i class="fas fa-ellipsis-h"></i>
                    <i class="far fa-bookmark"></i>
                </div>
            `;
            productLink.appendChild(productCard);
            mainContent.appendChild(productLink);
        });
    }

    // --- Función principal para aplicar filtros y ordenar ---
    function applyFiltersAndSort() {
        let filteredProducts = [...allProducts]; // Empezar con todos los productos

        const searchTerm = productSearchInput.value.toLowerCase().trim();
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);
        const selectedRating = parseFloat(document.querySelector('input[name="rating-filter"]:checked').value);
        const selectedCategories = Array.from(categoryFilters)
                                        .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
                                        .map(checkbox => checkbox.value);

        // Validar rango de precios
        priceAlert.classList.add('hidden');
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            priceAlert.classList.remove('hidden');
            filteredProducts = []; // No mostrar productos si el rango es inválido
        } else {
            // Aplicar filtros
            filteredProducts = filteredProducts.filter(product => {
                const title = product.titulo.toLowerCase();
                //const seller = product.vendedor.toLowerCase();
                const price = product.precio;
                const rating = product.calificacion;
                const category = product.category.toLowerCase();

                let matches = true;

                // Filtro por búsqueda de texto
                if (searchTerm && !(title.includes(searchTerm) || seller.includes(searchTerm))) {
                    matches = false;
                }

                // Filtro por rango de precios
                if (matches && !isNaN(minPrice) && price < minPrice) {
                    matches = false;
                }
                if (matches && !isNaN(maxPrice) && price > maxPrice) {
                    matches = false;
                }

                // Filtro por calificación (estrellas)
                if (matches && selectedRating > 0 && rating < selectedRating) {
                    matches = false;
                }

                // Filtro por categoría
                // Si "Todas" no está seleccionada y hay categorías específicas seleccionadas
                if (matches && !document.querySelector('input[name="category-filter"][value="all"]').checked && selectedCategories.length > 0) {
                    if (!selectedCategories.includes(category)) {
                        matches = false;
                    }
                }
                // Si "Todas" está seleccionada, cualquier categoría debería pasar
                // Si no hay categorías seleccionadas y "Todas" tampoco, por defecto no se filtra por categoría (se muestran todos)
                // Esta lógica ya está implícita si `selectedCategories.length === 0` y "Todas" está desmarcada, `matches` permanece true.

                return matches;
            });
        }
        
        // Aplicar ordenamiento
        const sortOrder = sortOrderSelect.value;
        if (sortOrder === 'price-asc') {
            filteredProducts.sort((a, b) => a.precio - b.precio);
        } else if (sortOrder === 'price-desc') {
            filteredProducts.sort((a, b) => b.precio - a.precio);
        } else if (sortOrder === 'rating-desc') {
            filteredProducts.sort((a, b) => b.calificacion - a.calificacion);
        }

        renderProducts(filteredProducts); // Renderizar los productos filtrados y ordenados
    }

    // --- Cargar productos desde JSON al inicio ---
    try {
        const response = await fetch('src/json/productos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json(); // Guardar todos los productos
        applyFiltersAndSort(); // Aplicar filtros iniciales y mostrar
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        mainContent.innerHTML = '<p>Error al cargar los productos. Por favor, intente de nuevo más tarde.</p>';
    }

    // --- Event Listeners para aplicar filtros y ordenar ---
    applyFiltersButton.addEventListener('click', applyFiltersAndSort);
    productSearchInput.addEventListener('input', applyFiltersAndSort);
    sortOrderSelect.addEventListener('change', applyFiltersAndSort);
    minPriceInput.addEventListener('input', applyFiltersAndSort);
    maxPriceInput.addEventListener('input', applyFiltersAndSort);
    ratingFilters.forEach(radio => {
        radio.addEventListener('change', applyFiltersAndSort);
    });
    // Event Listeners para los filtros de categoría
    categoryFilters.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            if (event.target.value === 'all' && event.target.checked) {
                // Si "Todas" se selecciona, deseleccionar las otras
                categoryFilters.forEach(otherCheckbox => {
                    if (otherCheckbox.value !== 'all') {
                        otherCheckbox.checked = false;
                    }
                });
            } else if (event.target.value !== 'all' && event.target.checked) {
                // Si se selecciona otra categoría, deseleccionar "Todas"
                document.querySelector('input[name="category-filter"][value="all"]').checked = false;
            } else if (Array.from(categoryFilters).filter(c => c.checked && c.value !== 'all').length === 0) {
                // Si ninguna categoría específica está seleccionada, marcar "Todas"
                document.querySelector('input[name="category-filter"][value="all"]').checked = true;
            }
            applyFiltersAndSort(); // Aplicar filtros después del cambio
        });
    });

    // --- Bloques de código para 'productos.html' (página de detalle) ---
    // He separado lógicamente estos bloques para que no interfieran con la página de tienda.
    // Lo ideal sería que estos bloques estuvieran en un archivo JS aparte (ej. 'product_detail.js')
    // si 'tienda.html' y 'productos.html' son páginas distintas.
    // Esto es solo una sugerencia para una mejor organización de tu código.
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (document.getElementById('product-img') && productId) { 
        // Solo ejecuta este código si estamos en una página que tiene elementos de detalle de producto
        const productImg = document.getElementById('product-img');
        const productTitle = document.getElementById('product-title');
        const productSeller = document.getElementById('product-seller-name');
        const productPrice = document.getElementById('product-price');
        const productRatingValue = document.getElementById('product-rating-value');
        const productStarsContainer = document.getElementById('product-stars');
        const productDescription = document.getElementById('product-description');
        const buyButton = document.getElementById('buy-button');

        try {
            const product = allProducts.find(p => p.id === productId); // Usar allProducts ya cargados

            if (product) {
                productImg.src = product.imagen;
                productImg.alt = product.titulo;
                productTitle.textContent = product.titulo;
                productSeller.textContent = product.vendedor;
                productPrice.textContent = `S/.${product.precio.toFixed(2)}`;
                productRatingValue.textContent = product.calificacion.toFixed(1);
                productStarsContainer.innerHTML = generateStarRating(product.calificacion);
                productDescription.innerHTML = '';

                product.descripcion.forEach(line => {
                    const li = document.createElement('li');
                    li.textContent = line;
                    productDescription.appendChild(li);
                });

                buyButton.addEventListener('click', () => {
                    alert(`¡Has comprado "${product.titulo}" por S/.${product.precio.toFixed(2)}!`);
                });
            } else {
                productTitle.textContent = 'Producto no encontrado.';
                productSeller.textContent = '';
                productPrice.textContent = '';
                productDescription.textContent = 'El producto que buscas no está disponible.';
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            productTitle.textContent = 'Error al cargar los detalles del producto.';
            productSeller.textContent = '';
            productPrice.textContent = '';
            productDescription.textContent = 'Hubo un problema al obtener la información del producto. Intente de nuevo más tarde.';
        }
    }

    // Bloque para calificación interactiva en productos.html
    const productStarsContainerInteractive = document.querySelector('.product-details-page .stars-interactive'); // Asume un contenedor diferente o clase para la calificación interactiva
    const productRatingValueInteractive = document.querySelector('.product-details-page .rating-value-interactive');

    if (productStarsContainerInteractive && productRatingValueInteractive) {
        let currentRating = 0; // Podrías inicializar esto con el rating del producto si ya lo tiene

        productStarsContainerInteractive.innerHTML = generateStarRating(currentRating);
        productRatingValueInteractive.textContent = currentRating.toFixed(1);

        productStarsContainerInteractive.addEventListener('click', (event) => {
            if (event.target.classList.contains('fa-star')) {
                currentRating = parseInt(event.target.getAttribute('data-value'));
                productStarsContainerInteractive.innerHTML = generateStarRating(currentRating);
                productRatingValueInteractive.textContent = currentRating.toFixed(1);
                // Aquí podrías agregar lógica para guardar la nueva calificación en el servidor
            }
        });
    }
});