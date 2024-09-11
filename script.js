document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const categoryInput = document.getElementById('categoryInput');
    const priceInput = document.getElementById('priceInput');
    const countInput = document.getElementById('countInput');
    const addProductBtn = document.getElementById('addProductBtn');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.querySelector('.modal .close');
    const saveEditBtn = document.getElementById('saveEditBtn');
    
    let currentRow;
    
    // Load data from local storage
    loadProducts();

    addProductBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const category = categoryInput.value.trim();
        const price = parseFloat(priceInput.value).toFixed(2);
        const count = parseInt(countInput.value, 10);
        
        if (name && category && !isNaN(price) && !isNaN(count)) {
            addProduct(name, category, price, count);
            nameInput.value = '';
            categoryInput.value = '';
            priceInput.value = '';
            countInput.value = '';
            saveProducts(); // Save to localStorage
        }
    });
    
    function addProduct(name, category, price, count) {
        const row = productTable.insertRow();
        
        // Generate index based on the number of rows
        const index = productTable.rows.length;
        
        row.innerHTML = `
            <td>${index}</td>
            <td>${name}</td>
            <td>${category}</td>
            <td>$${price}</td>
            <td>${count}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        
        const editBtn = row.querySelector('.edit');
        const deleteBtn = row.querySelector('.delete');
        
        editBtn.addEventListener('click', () => {
            currentRow = row;
            document.getElementById('editNameInput').value = row.cells[1].textContent;
            document.getElementById('editCategoryInput').value = row.cells[2].textContent;
            document.getElementById('editPriceInput').value = parseFloat(row.cells[3].textContent.replace('$', '')).toFixed(2);
            document.getElementById('editCountInput').value = row.cells[4].textContent;
            editModal.style.display = 'block';
        });
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this product?')) {
                row.remove();
                updateIndexes();
                saveProducts(); // Save to localStorage
            }
        });
    }
    
    function updateIndexes() {
        const rows = productTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[0].textContent = i + 1;
        }
    }
    
    function saveProducts() {
        const rows = productTable.getElementsByTagName('tr');
        const products = [];
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            products.push({
                name: cells[1].textContent,
                category: cells[2].textContent,
                price: parseFloat(cells[3].textContent.replace('$', '')).toFixed(2),
                count: parseInt(cells[4].textContent, 10)
            });
        }
        localStorage.setItem('products', JSON.stringify(products));
    }

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach(product => addProduct(product.name, product.category, product.price, product.count));
    }
    
    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });
    
    saveEditBtn.addEventListener('click', () => {
        const newName = document.getElementById('editNameInput').value.trim();
        const newCategory = document.getElementById('editCategoryInput').value.trim();
        const newPrice = parseFloat(document.getElementById('editPriceInput').value).toFixed(2);
        const newCount = parseInt(document.getElementById('editCountInput').value, 10);
        
        if (newName && newCategory && !isNaN(newPrice) && !isNaN(newCount)) {
            currentRow.cells[1].textContent = newName;
            currentRow.cells[2].textContent = newCategory;
            currentRow.cells[3].textContent = `$${newPrice}`;
            currentRow.cells[4].textContent = newCount;
            editModal.style.display = 'none';
            saveProducts(); // Save to localStorage
        }
    });

    // Close the modal if the user clicks anywhere outside of the modal
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });
});
