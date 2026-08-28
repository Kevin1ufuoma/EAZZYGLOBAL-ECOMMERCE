/* ==========================================================================
   EAZZYGLOBAL PLATFORM CORE INTERACTION ENGINE
   ========================================================================== */

// 1. RECOVERY ARRAYS PERSISTENCE STORAGE INITIALIZATION
let SHOPPING_BASKET_REGISTRY = JSON.parse(localStorage.getItem('eazzy_cart_store')) || [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("System Status: Native browser engines synchronized successfully.");
    
    // Launch all individual interaction sub-modules
    initializeMobileDrawerNavigation();
    initializeGlobalThemeEngine();
    initializeProductGallerySwitcher();
    initializeShoppingCartCalculations();
});

/* ==========================================================================
   A. MOBILE DRAWER NAVIGATION MENU CONTROLLER
   ========================================================================== */
function initializeMobileDrawerNavigation() {
    const hamburgerButton = document.getElementById('bar');
    const closeMenuButton = document.getElementById('close');
    const navigationMenu = document.getElementById('navbar');

    if (hamburgerButton && navigationMenu) {
        hamburgerButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            navigationMenu.classList.add('active');
        });
    }

    if (closeMenuButton && navigationMenu) {
        closeMenuButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            navigationMenu.classList.remove('active');
        });
    }

    document.addEventListener('click', (event) => {
        if (navigationMenu && navigationMenu.classList.contains('active')) {
            if (!navigationMenu.contains(event.target) && !hamburgerButton.contains(event.target)) {
                navigationMenu.classList.remove('active');
            }
        }
    });
}

/* ==========================================================================
   B. DYNAMIC ACYRLIC LIGHT & DARK MODE ENGINE
   ========================================================================== */
function initializeGlobalThemeEngine() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const bodyElement = document.body;

    if (localStorage.getItem('eazzy_theme_preference') === 'dark-mode-active') {
        bodyElement.classList.add('dark-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-theme');
            if (bodyElement.classList.contains('dark-theme')) {
                if (themeIcon) themeIcon.className = 'fas fa-sun';
                localStorage.setItem('eazzy_theme_preference', 'dark-mode-active');
            } else {
                if (themeIcon) themeIcon.className = 'fas fa-moon';
                localStorage.setItem('eazzy_theme_preference', 'light-mode-active');
            }
        });
    }
}

/* ==========================================================================
   C. PRODUCT CONFIGURATION GALLERY IMAGE SWITCHER
   ========================================================================== */
function initializeProductGallerySwitcher() {
    const thumbnailImagesList = document.querySelectorAll('.small-img');
    const masterDisplayImageFrame = document.getElementById('MainImg');

    if (thumbnailImagesList.length > 0 && masterDisplayImageFrame) {
        thumbnailImagesList.forEach((thumbnail) => {
            thumbnail.addEventListener('click', function () {
                const targetedImageSource = this.getAttribute('src');
                masterDisplayImageFrame.setAttribute('src', targetedImageSource);
                console.log(`Gallery Event: Swapped main frame to ${targetedImageSource}`);
            });
        });
    }
}

/* ==========================================================================
   D. DYNAMIC SHOPPING CART MANAGEMENT & SUMMARIES REAL-TIME CALCULATION
   ========================================================================== */
function initializeShoppingCartCalculations() {
    const emptyMessageNode = document.getElementById('cart-empty-message');
    const cartTableNode = document.getElementById('cart-table');
    const tableBodyNode = document.getElementById('cart-table-body');
    
    const subtotalSummaryNode = document.getElementById('cart-total-sub');
    const grandTotalSummaryNode = document.getElementById('cart-total-grand');

    // --- 1. THE DYNAMIC RENDERING LOOP (BUILDS ROW CELLS FROM CACHE) ---
    function renderBasketTimelineView() {
        if (!tableBodyNode) return; // Exit safely if the user is not actively browsing cart.html

        if (SHOPPING_BASKET_REGISTRY.length === 0) {
            if (emptyMessageNode) emptyMessageNode.style.display = 'block';
            if (cartTableNode) cartTableNode.style.display = 'none';
            if (subtotalSummaryNode) subtotalSummaryNode.textContent = '₦0';
            if (grandTotalSummaryNode) grandTotalSummaryNode.textContent = '₦0';
            return;
        }

        if (emptyMessageNode) emptyMessageNode.style.display = 'none';
        if (cartTableNode) cartTableNode.style.display = 'table';

        tableBodyNode.innerHTML = '';

        SHOPPING_BASKET_REGISTRY.forEach((product) => {
            const calculatedLineSubtotal = product.price * product.quantity;
            const tableRowNode = document.createElement('tr');
            tableRowNode.setAttribute('data-cart-id', product.id);
            
            tableRowNode.innerHTML = `
                <td><a href="#" class="remove-item" aria-label="Remove item"><i class="fas fa-times-circle"></i></a></td>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td class="cart-price">₦${product.price.toLocaleString()}</td>
                <td><input type="number" class="cart-quantity" value="${product.quantity}" min="1"></td>
                <td class="cart-subtotal">₦${calculatedLineSubtotal.toLocaleString()}</td>
            `;
            tableBodyNode.appendChild(tableRowNode);
        });

        executeLiveBasketBillingCalculations();
    }

    // --- 2. LIVE BILLING MATRIX CALCULATION OVERSEER ---
    function executeLiveBasketBillingCalculations() {
        let currentCalculatedSubtotal = 0;
        const activeRows = document.querySelectorAll('#cart-table-body tr');

        activeRows.forEach((row) => {
            const dataTargetId = row.getAttribute('data-cart-id');
            const structuralBasketRecord = SHOPPING_BASKET_REGISTRY.find(item => item.id === dataTargetId);

            if (structuralBasketRecord) {
                const quantityInputField = row.querySelector('.cart-quantity');
                const numericQuantityCount = parseInt(quantityInputField.value, 10) || 1;
                
                structuralBasketRecord.quantity = numericQuantityCount;
                const calculatedItemLineCost = structuralBasketRecord.price * numericQuantityCount;
                currentCalculatedSubtotal += calculatedItemLineCost;

                const subtotalDisplayCell = row.querySelector('.cart-subtotal');
                if (subtotalDisplayCell) {
                    subtotalDisplayCell.textContent = `₦${calculatedItemLineCost.toLocaleString()}`;
                }
            }
        });

        localStorage.setItem('eazzy_cart_store', JSON.stringify(SHOPPING_BASKET_REGISTRY));

        if (subtotalSummaryNode) subtotalSummaryNode.textContent = `₦${currentCalculatedSubtotal.toLocaleString()}`;
        if (grandTotalSummaryNode) grandTotalSummaryNode.textContent = `₦${currentCalculatedSubtotal.toLocaleString()}`;
    }

    // --- 3. DYNAMIC ADD TO CART CLICK INTERCEPT LISTENERS ---
    const cartTriggers = document.querySelectorAll('.add-to-cart-btn, #btn-add-to-cart-prodetails');
    cartTriggers.forEach((btn) => {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const itemIdentity = this.getAttribute('data-id');
            const itemName = this.getAttribute('data-name');
            const itemPrice = parseInt(this.getAttribute('data-price'), 10) || 6000;
            const itemImageFile = this.getAttribute('data-image');
            
            let finalOrderAmount = 1;
            const prodetailsQtyNode = document.getElementById('txt-prodetails-qty');
            
            if (prodetailsQtyNode && this.getAttribute('id') === 'btn-add-to-cart-prodetails') {
                finalOrderAmount = parseInt(prodetailsQtyNode.value, 10) || 1;
            }

            // FIXED: Corrected reference loop variable target clash from 'product.id' to 'prod.id'
            let existingItemInBasket = SHOPPING_BASKET_REGISTRY.find(prod => prod.id === itemIdentity);

            if (existingItemInBasket) {
                existingItemInBasket.quantity += finalOrderAmount;
            } else {
                SHOPPING_BASKET_REGISTRY.push({
                    id: itemIdentity,
                    name: itemName,
                    price: itemPrice,
                    image: itemImageFile,
                    quantity: finalOrderAmount
                });
            }

            localStorage.setItem('eazzy_cart_store', JSON.stringify(SHOPPING_BASKET_REGISTRY));
            alert(`${itemName} added to your basket successfully!`);
        });
    });

    if (cartTableNode) {
        
        // Change listener capturing user quantity counter box adjustments
        cartTableNode.addEventListener('change', (event) => {
            if (event.target.classList.contains('cart-quantity')) {
                // Enforce safety limits to block zeros or negative numbers
                if (parseInt(event.target.value, 10) < 1) {
                    event.target.value = 1;
                }
                executeLiveBasketBillingCalculations();
            }
        }); // <-- Closed the change listener block correctly here

        // Click listener capturing trash icon actions to drop item rows
        cartTableNode.addEventListener('click', (event) => {
            const removeTriggerAnchor = event.target.closest('.remove-item');
            if (removeTriggerAnchor) {
                event.preventDefault();
                const targetedRow = removeTriggerAnchor.closest('tr');
                const targetedCartIdKey = targetedRow.getAttribute('data-cart-id');

                // Filter and erase record completely from memory data array registry
                SHOPPING_BASKET_REGISTRY = SHOPPING_BASKET_REGISTRY.filter(item => item.id !== targetedCartIdKey);
                localStorage.setItem('eazzy_cart_store', JSON.stringify(SHOPPING_BASKET_REGISTRY));

                // Smooth fade transition out before layout rebuild
                targetedRow.style.transition = 'opacity 0.25s ease';
                targetedRow.style.opacity = '0';
                
                setTimeout(() => {
                    targetedRow.remove();
                    renderBasketTimelineView(); // Re-evaluate total template states
                }, 250);
            }
        });
        
    }

    // --- 5. AUTOMATED SYSTEMS CALENDAR SYNC LOCK ---
    const copyrightYearNode = document.getElementById('copyright-year');
    if (copyrightYearNode) {
        copyrightYearNode.textContent = new Date().getFullYear();
    }

    // Kickstart default view state construction instantly on load execution
    renderBasketTimelineView();
}
