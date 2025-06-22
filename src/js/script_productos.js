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

    // <--- CAMBIO IMPORTANTE: Ahora seleccionamos TODOS los checkboxes de categoría
    const categoryFilterCheckboxes = document.querySelectorAll('input[name="category-filter"]');

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

    // --- 2. Función para renderizar todos los productos en el DOM ---
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

    // <--- CAMBIO IMPORTANTE: La función populateCategoryFilter ya no es estrictamente necesaria
    // si tus checkboxes están hardcodeados en el HTML. Sin embargo, podemos usarla para
    // deshabilitar checkboxes de categorías que no tienen productos.
    function populateCategoryFilter(products) {
        const availableCategories = new Set();
        products.forEach(product => {
            if (product.category) {
                if (Array.isArray(product.category)) {
                    product.category.forEach(cat => availableCategories.add(cat.trim().toLowerCase()));
                } else {
                    availableCategories.add(product.category.trim().toLowerCase());
                }
            }
        });

        categoryFilterCheckboxes.forEach(checkbox => {
            const categoryValue = checkbox.value;
            // No deshabilites la opción "Todas"
            if (categoryValue === 'all') {
                checkbox.disabled = false; 
                return;
            }
            // Deshabilita el checkbox si no hay productos para esa categoría
            checkbox.disabled = !availableCategories.has(categoryValue);
            // Opcional: desmarcar si está deshabilitado
            if (checkbox.disabled && checkbox.checked) {
                checkbox.checked = false;
            }
        });
    }

    // --- 3. Función para aplicar filtros y ordenar (modificada para checkboxes) ---
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

        // --- Filtrado por calificación (rating) ---
        const selectedRatingElement = document.querySelector('input[name="rating-filter"]:checked');
        const selectedRating = selectedRatingElement ? parseFloat(selectedRatingElement.value) : 0;

        if (selectedRating > 0) {
            filteredProducts = filteredProducts.filter(product => product.calificacion >= selectedRating);
        }

        // --- CAMBIO IMPORTANTE: Filtrado por múltiples Categorías (checkboxes) ---
        const selectedCategories = [];
        categoryFilterCheckboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') { // Si está marcado y no es "Todas"
                selectedCategories.push(checkbox.value);
            }
        });

        // Lógica para el checkbox "Todas": Si está marcado, no aplica ningún filtro de categoría.
        // Si no está marcado o no existe, y no hay categorías seleccionadas, se filtra por nada.
        const allCheckbox = document.querySelector('input[name="category-filter"][value="all"]');
        const allIsChecked = allCheckbox && allCheckbox.checked;

        if (!allIsChecked && selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                // Si el producto tiene una sola categoría (string)
                if (typeof product.category === 'string') {
                    return selectedCategories.includes(product.category.toLowerCase());
                } 
                // Si el producto tiene múltiples categorías (array)
                else if (Array.isArray(product.category)) {
                    // Retorna verdadero si alguna de las categorías del producto está en las seleccionadas
                    return product.category.some(cat => selectedCategories.includes(cat.toLowerCase()));
                }
                return false; // Si no tiene categoría o es un tipo inesperado
            });
        } else if (!allIsChecked && selectedCategories.length === 0) {
            // Si "Todas" no está marcado y no se selecciona ninguna otra categoría,
            // no se muestra ningún producto por categoría.
            filteredProducts = [];
        }


        // --- Ordenamiento de productos filtrados ---
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

    // --- 4. Cargar los datos de los productos desde el JSON al inicio ---
    try {
        const response = await fetch('src/json/productos.json');
        if (!response.ok) {
            console.error(`Error al cargar productos.json: ${response.status} ${response.statusText}`);
            throw new Error('No se pudieron cargar los productos.');
        }
        allProductsData = await response.json();

        // <--- CAMBIO IMPORTANTE: Poblamos/ajustamos el filtro de categorías
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
        categoryFilterCheckboxes.forEach(checkbox => checkbox.disabled = true); // <--- CAMBIO IMPORTANTE: Deshabilitar checkboxes
    }

    // --- 5. Escuchadores de eventos para aplicar filtros/ordenación ---
    applyFiltersButton.addEventListener('click', applyFiltersAndSort);
    productSearchInput.addEventListener('input', applyFiltersAndSort);
    sortOrderSelect.addEventListener('change', applyFiltersAndSort);
    minPriceInput.addEventListener('input', applyFiltersAndSort);
    maxPriceInput.addEventListener('input', applyFiltersAndSort);
    ratingFilters.forEach(radio => {
        radio.addEventListener('change', applyFiltersAndSort);
    });

    // <--- CAMBIO IMPORTANTE: Escucha cambios en CADA checkbox de categoría
    categoryFilterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            // Lógica para el checkbox "Todas":
            // Si "Todas" se marca, desmarca las demás.
            if (event.target.value === 'all' && event.target.checked) {
                categoryFilterCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox.value !== 'all') {
                        otherCheckbox.checked = false;
                    }
                });
            } else if (event.target.value !== 'all' && event.target.checked) {
                // Si se marca cualquier otra categoría, desmarca "Todas".
                const allCheckbox = document.querySelector('input[name="category-filter"][value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            } else if (event.target.value !== 'all' && !event.target.checked) {
                // Si una categoría se desmarca y no queda ninguna otra marcada, marca "Todas".
                const anyOtherChecked = Array.from(categoryFilterCheckboxes).some(cb => cb.checked && cb.value !== 'all');
                const allCheckbox = document.querySelector('input[name="category-filter"][value="all"]');
                if (!anyOtherChecked && allCheckbox) {
                    allCheckbox.checked = true;
                }
            }
            applyFiltersAndSort(); // Aplicar filtros después del cambio
        });
    });

    // El resto de tus bloques `DOMContentLoaded` para `productos.html` y rating interactivo
    // deben ir en sus propios archivos JavaScript o ser eliminados si solo son para tienda.html
    // y no pertenecen a esta página.
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



