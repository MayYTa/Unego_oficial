document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyFiltersButton = document.getElementById('apply-filters');
    const ratingFilterRadios = document.querySelectorAll('input[name="rating-filter"]');
    const sortOrderSelect = document.getElementById('sort-order'); 
    const productContainer = document.querySelector('.main-content'); 
    let productCards = Array.from(document.querySelectorAll('.product-card')); 
    const priceAlert = document.getElementById('price-alert');

    const filterAndSortProducts = () => { 
        const searchTerm = searchInput.value.toLowerCase().trim();
        let minPrice = parseFloat(minPriceInput.value);
        let maxPrice = parseFloat(maxPriceInput.value);
        let selectedRating = parseFloat(document.querySelector('input[name="rating-filter"]:checked').value);
        const sortOrder = sortOrderSelect.value; 

        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            priceAlert.textContent = "El precio mínimo no puede ser mayor que el máximo.";
            priceAlert.classList.remove('hidden');
            
            productCards.forEach(card => {
                card.classList.add('hidden');
            });
            
            return; 
        } else {
            priceAlert.classList.add('hidden'); 
        }

        let visibleProducts = []; 

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const seller = card.querySelector('.product-seller').textContent.toLowerCase();
            const price = parseFloat(card.querySelector('.product-price').dataset.price);
            const rating = parseFloat(card.querySelector('.product-rating').dataset.rating);

            let isVisible = true;

            if (searchTerm) {
                if (!title.includes(searchTerm) && !seller.includes(searchTerm)) {
                    isVisible = false;
                }
            }

            if (!isNaN(minPrice) && price < minPrice) {
                isVisible = false;
            }

            if (!isNaN(maxPrice) && price > maxPrice) {
                isVisible = false;
            }

            if (selectedRating > 0) {
                if (rating < selectedRating) {
                    isVisible = false;
                }
            }

            if (isVisible) {
                card.classList.remove('hidden');
                visibleProducts.push(card); 
            } else {
                card.classList.add('hidden');
            }
        });

        if (sortOrder !== 'default') {
            visibleProducts.sort((a, b) => {
                const aPrice = parseFloat(a.querySelector('.product-price').dataset.price);
                const bPrice = parseFloat(b.querySelector('.product-price').dataset.price);
                const aRating = parseFloat(a.querySelector('.product-rating').dataset.rating);
                const bRating = parseFloat(b.querySelector('.product-rating').dataset.rating);

                if (sortOrder === 'price-asc') {
                    return aPrice - bPrice;
                } else if (sortOrder === 'price-desc') {
                    return bPrice - aPrice; 
                } else if (sortOrder === 'rating-desc') {
                    return bRating - aRating; 
                }
                return 0;
            });
        }

        productContainer.innerHTML = ''; 
        visibleProducts.forEach(card => {
            productContainer.appendChild(card);
        });
    };

    searchInput.addEventListener('keyup', filterAndSortProducts);
    applyFiltersButton.addEventListener('click', filterAndSortProducts);
    minPriceInput.addEventListener('change', filterAndSortProducts);
    maxPriceInput.addEventListener('change', filterAndSortProducts);
    ratingFilterRadios.forEach(radio => {
        radio.addEventListener('change', filterAndSortProducts);
    });
    sortOrderSelect.addEventListener('change', filterAndSortProducts); 
    filterAndSortProducts();
});