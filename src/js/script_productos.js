document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. Referencias a los elementos del DOM de los filtros y el contenedor de productos ---
    const productSearchInput = document.getElementById('product-search');
    const sortOrderSelect = document.getElementById('sort-order');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceAlert = document.getElementById('price-alert');
    const ratingFilters = document.querySelectorAll('input[name="rating-filter"]');
    const applyFiltersButton = document.getElementById('apply-filters');
    const mainContent = document.querySelector('.main-content');

    // <--- CAMBIO AQUÍ: Ahora seleccionamos el elemento SELECT en lugar de los checkboxes
    const categoryFilterSelect = document.getElementById('category-filter-select'); // Asegúrate de que el ID en tu HTML sea 'category-filter-select'

    let allProductsData = [];

    // --- Función para generar las estrellas de calificación (reutilizada) ---
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

    // --- 2. Función para renderizar todos los productos en el DOM (NO CAMBIA) ---
    function renderProducts(productsToRender) {
        mainContent.innerHTML = '';

        if (productsToRender.length === 0) {
            mainContent.innerHTML = '<p>No se encontraron productos que coincidan con los filtros seleccionados.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productLink = document.createElement('a');
            productLink.href = `productos.html?id=${product.id}`;
            productLink.classList.add('product-link');

            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.id = product.id;

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.imagen}" alt="${product.titulo}">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${product.titulo}</h3>
                    <p class="product-seller">Por ${product.vendedor}</p>
                    ${product.category ? `<p class="product-category">Categoría: ${Array.isArray(product.category) ? product.category.join(', ') : product.category}</p>` : ''}
                    <div class="product-price" data-price="${product.precio}">S/.${product.precio}</div>
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

    // <--- CAMBIO AQUÍ: La función populateCategoryFilter ahora es opcional o puede adaptar las opciones del SELECT
    // Si tus opciones de categoría están hardcodeadas en el HTML del SELECT, esta función no necesitaría modificar opciones.
    // Podría usarse, por ejemplo, para mostrar u ocultar el SELECT si no hay categorías disponibles, pero para este cambio,
    // si el SELECT ya está en el HTML, podemos simplificarla o dejarla sin efecto directo en el SELECT.
    // Si quisieras poblar dinámicamente el select con base en los productos, lo harías aquí.
    function populateCategoryFilter(products) {
        // En un enfoque con SELECT hardcodeado en HTML, esta función no hace cambios al SELECT.
        // Si quisieras que las opciones del SELECT se generaran dinámicamente,
        // tendrías que crear los <option> elementos y añadirlos al categoryFilterSelect aquí.
        // Por ahora, como el SELECT está en el HTML, simplemente podemos ignorar los checkboxes.
        // Si en el futuro las categorías vinieran del JSON, aquí podrías construir las <option>
        // basadas en 'products' y añadirlas a 'categoryFilterSelect'.
    }


    // --- 3. Función para aplicar filtros y ordenar (MODIFICADA para el SELECT de categoría) ---
    function applyFiltersAndSort() {
        let filteredProducts = [...allProductsData];

        // --- Filtrado por término de búsqueda ---
        const searchTerm = productSearchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => {
                return product.titulo.toLowerCase().includes(searchTerm) ||
                       product.vendedor.toLowerCase().includes(searchTerm);
            });
        }

        // --- Filtrado por rango de precios ---
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);
        priceAlert.classList.add('hidden');

        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            priceAlert.classList.remove('hidden');
            filteredProducts = [];
        } else {
            if (!isNaN(minPrice)) {
                filteredProducts = filteredProducts.filter(product => product.precio >= minPrice);
            }
            if (!isNaN(maxPrice)) {
                filteredProducts = filteredProducts.filter(product => product.precio <= maxPrice);
            }
        }

        // --- Filtrado por calificación (rating) (NO CAMBIA) ---
        const selectedRatingElement = document.querySelector('input[name="rating-filter"]:checked');
        const selectedRating = selectedRatingElement ? parseFloat(selectedRatingElement.value) : 0;

        if (selectedRating > 0) {
            filteredProducts = filteredProducts.filter(product => product.calificacion >= selectedRating);
        }

        // --- CAMBIO CLAVE AQUÍ: Filtrado por Categoría (usando SELECT) ---
        const selectedCategory = categoryFilterSelect.value; // Obtiene el valor de la opción seleccionada

        if (selectedCategory !== 'all') { // Si la categoría seleccionada NO es 'Todas'
            filteredProducts = filteredProducts.filter(product => {
                // Si el producto tiene una sola categoría (string)
                if (typeof product.category === 'string') {
                    return product.category.toLowerCase() === selectedCategory;
                }
                // Si el producto tiene múltiples categorías (array)
                else if (Array.isArray(product.category)) {
                    // Retorna verdadero si alguna de las categorías del producto coincide con la seleccionada
                    return product.category.some(cat => cat.toLowerCase() === selectedCategory);
                }
                return false; // Si no tiene categoría o es un tipo inesperado
            });
        }
        // Si selectedCategory es 'all', no se aplica ningún filtro de categoría, por lo que no necesitamos un 'else'.


        // --- Ordenamiento de productos filtrados (NO CAMBIA) ---
        const sortOrder = sortOrderSelect.value;
        if (sortOrder === 'price-asc') {
            filteredProducts.sort((a, b) => a.precio - b.precio);
        } else if (sortOrder === 'price-desc') {
            filteredProducts.sort((a, b) => b.precio - a.precio);
        } else if (sortOrder === 'rating-desc') {
            filteredProducts.sort((a, b) => b.calificacion - a.calificacion);
        }

        renderProducts(filteredProducts);
    }

    // --- 4. Cargar los datos de los productos desde el JSON al inicio (MODIFICADO) ---
    try {
        const response = await fetch('src/json/productos.json');
        if (!response.ok) {
            console.error(`Error al cargar productos.json: ${response.status} ${response.statusText}`);
            throw new Error('No se pudieron cargar los productos.');
        }
        allProductsData = await response.json();

        // <--- CAMBIO: populateCategoryFilter ya no necesita deshabilitar checkboxes.
        // Si tu SELECT tiene las opciones hardcodeadas, esta llamada es menos crítica.
        // Si el SELECT fuera dinámico, aquí se generarían las opciones.
        populateCategoryFilter(allProductsData);
        
        applyFiltersAndSort(); // Renderiza los productos y aplica filtros/ordenamiento inicial
    } catch (error) {
        console.error('Error al iniciar la tienda:', error);
        mainContent.innerHTML = '<p>Lo sentimos, no se pudieron cargar los productos en este momento. Por favor, intente más tarde.</p>';
        productSearchInput.disabled = true;
        sortOrderSelect.disabled = true;
        minPriceInput.disabled = true;
        maxPriceInput.disabled = true;
        ratingFilters.forEach(radio => radio.disabled = true);
        applyFiltersButton.disabled = true;
        // <--- CAMBIO AQUÍ: Deshabilita el SELECT de categoría en caso de error
        if (categoryFilterSelect) categoryFilterSelect.disabled = true;
    }

    // --- 5. Escuchadores de eventos para aplicar filtros/ordenación (MODIFICADO) ---
    applyFiltersButton.addEventListener('click', applyFiltersAndSort);
    productSearchInput.addEventListener('input', applyFiltersAndSort);
    sortOrderSelect.addEventListener('change', applyFiltersAndSort);
    minPriceInput.addEventListener('input', applyFiltersAndSort);
    maxPriceInput.addEventListener('input', applyFiltersAndSort);
    ratingFilters.forEach(radio => {
        radio.addEventListener('change', applyFiltersAndSort);
    });

    // <--- CAMBIO CLAVE AQUÍ: Ahora escuchamos el evento 'change' en el SELECT de categoría
    if (categoryFilterSelect) { // Asegurarse de que el elemento exista
        categoryFilterSelect.addEventListener('change', applyFiltersAndSort);
    }

    // ELIMINAR O MOVER ESTOS BLOQUES:
    // Los siguientes bloques 'DOMContentLoaded' no deberían estar aquí si son para otras páginas o funciones.
    // Si el segundo y tercer bloque 'DOMContentLoaded' son para 'productos.html' o una funcionalidad
    // de rating interactivo que no está en 'tienda.html', DEBEN estar en sus propios archivos JS
    // vinculados a esas páginas específicas.
    // Tener múltiples 'DOMContentLoaded' en el mismo archivo para la misma página es redundante y puede causar problemas.
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const productImg = document.getElementById('product-img');
    const productTitle = document.getElementById('product-title');
    const productSeller = document.getElementById('product-seller-name');
    const productPrice = document.getElementById('product-price');
    const productRatingValue = document.getElementById('product-rating-value');
    const productStarsContainer = document.getElementById('product-stars');
    const productDescription = document.getElementById('product-description');
    const buyButton = document.getElementById('buy-button');

    if (!productId) {
        productTitle.textContent = 'Producto no encontrado.';
        return;
    }

    try {
        const response = await fetch('src/json/productos.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();
        const product = products.find(p => p.id === productId);

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
});


document.addEventListener('DOMContentLoaded', () => {
  const productStarsContainer = document.getElementById('product-stars');
  const productRatingValue = document.getElementById('product-rating-value');

  function generateStarRating(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<i class="fas fa-star ${i <= rating ? 'filled' : ''}" data-value="${i}"></i>`;
    }
    return starsHtml;
  }

  let currentRating = 0;

  productStarsContainer.innerHTML = generateStarRating(currentRating);
  productRatingValue.textContent = currentRating.toFixed(1);

  productStarsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-star')) {
      currentRating = parseInt(event.target.getAttribute('data-value'));
      productStarsContainer.innerHTML = generateStarRating(currentRating);
      productRatingValue.textContent = currentRating.toFixed(1);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bookmark-icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            icon.classList.toggle('bookmarked');
        });
    });
});


