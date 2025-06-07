// script_productos.js

// ----------- FILTROS Y ORDENAMIENTO -----------
document.addEventListener('DOMContentLoaded', () => {
    const productSearchInput = document.getElementById('product-search');
    const sortOrderSelect = document.getElementById('sort-order');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceAlert = document.getElementById('price-alert');
    const ratingFilters = document.querySelectorAll('input[name="rating-filter"]');
    const applyFiltersButton = document.getElementById('apply-filters');
    const productLinks = document.querySelectorAll('.product-link');

    function applyFiltersAndSort() {
        let displayedProducts = [];

        productLinks.forEach(link => {
            const productCard = link.querySelector('.product-card');
            const title = productCard.querySelector('.product-title').textContent.toLowerCase();
            const seller = productCard.querySelector('.product-seller').textContent.toLowerCase();
            const price = parseFloat(productCard.querySelector('.product-price').dataset.price);
            const rating = parseFloat(productCard.querySelector('.product-rating').dataset.rating);
            let isVisible = true;

            const searchTerm = productSearchInput.value.toLowerCase().trim();
            if (searchTerm && !(title.includes(searchTerm) || seller.includes(searchTerm))) {
                isVisible = false;
            }

            const minPrice = parseFloat(minPriceInput.value);
            const maxPrice = parseFloat(maxPriceInput.value);
            priceAlert.classList.add('hidden');

            if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
                priceAlert.classList.remove('hidden');
                isVisible = false;
            } else {
                if (!isNaN(minPrice) && price < minPrice) {
                    isVisible = false;
                }
                if (!isNaN(maxPrice) && price > maxPrice) {
                    isVisible = false;
                }
            }

            const selectedRating = parseFloat(document.querySelector('input[name="rating-filter"]:checked').value);
            if (selectedRating > 0 && rating < selectedRating) {
                isVisible = false;
            }

            link.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                displayedProducts.push({ element: link, price: price, rating: rating });
            }
        });

        const sortOrder = sortOrderSelect.value;
        if (sortOrder === 'price-asc') {
            displayedProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            displayedProducts.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'rating-desc') {
            displayedProducts.sort((a, b) => b.rating - a.rating);
        }

        const mainContent = document.querySelector('.main-content');
        displayedProducts.forEach(product => {
            mainContent.appendChild(product.element);
        });
    }

    applyFiltersButton.addEventListener('click', applyFiltersAndSort);
    productSearchInput.addEventListener('input', applyFiltersAndSort);
    sortOrderSelect.addEventListener('change', applyFiltersAndSort);
    minPriceInput.addEventListener('input', applyFiltersAndSort);
    maxPriceInput.addEventListener('input', applyFiltersAndSort);
    ratingFilters.forEach(radio => {
        radio.addEventListener('change', applyFiltersAndSort);
    });

    applyFiltersAndSort();
});


// ----------- DETALLES DE PRODUCTO -----------
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
        const response = await fetch('assets/json/productos.json');
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

  // Siempre inicializamos rating a 0 al cargar la página
  let currentRating = 0;

  // Pintamos las estrellas según rating inicial (cero)
  productStarsContainer.innerHTML = generateStarRating(currentRating);
  productRatingValue.textContent = currentRating.toFixed(1);

  // Evento para pintar estrellas al clickear
  productStarsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('fa-star')) {
      currentRating = parseInt(event.target.getAttribute('data-value'));
      productStarsContainer.innerHTML = generateStarRating(currentRating);
      productRatingValue.textContent = currentRating.toFixed(1);
    }
  });
});



