const apiUrl = 'https://product-category-498u.onrender.com/api';

// Fetch and display products with pagination
let currentPage = 1;
let pageSize = 10;


window.onload = function() {
    console.log("🚀 Page Reloaded, triggering getCategories...");
    getProducts();
    // getCategoriesForProduct();
  };
 
  
  const getProducts = async () => {
    try {
      console.log(`Fetching products for page ${currentPage}...`);
      
      const response = await axios.get(`${apiUrl}/product`, {
        params: { page: currentPage, pageSize }
      });
  
      const products = response.data;
      const productTableBody = document.getElementById('productTableBody');
      productTableBody.innerHTML = '';
  
      if (products.length === 0) {
        productTableBody.innerHTML = `<tr><td colspan="4" class="text-center">No products found.</td></tr>`;
      } else {
        products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>${product.categoryName}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
          `;
          productTableBody.appendChild(row);
        });
      }
  
      // Update Pagination UI
      renderPagination();
      updatePaginationButtons(products.length);
  
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    }
  };
  
  // Function to update pagination UI
  const renderPagination = () => {
    let totalPages = 3;
    const paginationContainer = document.getElementById('pageNumbers');
    paginationContainer.innerHTML = ''; // Clear previous pagination buttons
  
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-light'}`;
      pageButton.innerText = i;
      pageButton.addEventListener('click', () => {
        currentPage = i;
        getProducts();
      });
  
      paginationContainer.appendChild(pageButton);
    }
  
    console.log(`📌 Current Page: ${currentPage} | Total Pages: ${totalPages}`);
  };
  
  // Function to enable/disable pagination buttons based on data availability
  const updatePaginationButtons = (nextPageDataLength) => {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = nextPageDataLength === 0;
  };
  
  // Pagination Button Click Events
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      getProducts();
    }
  });
  
  document.getElementById('nextPage').addEventListener('click', async () => {
    // Fetch the next page's data to check if it exists
    const response = await axios.get(`${apiUrl}/product`, {
      params: { page: currentPage + 1, pageSize }
    });
  
    if (response.data.length > 0) {
      currentPage++;
      getProducts();
    }
  
    // If no more data, disable the "Next" button
    updatePaginationButtons(response.data.length);
  });
  
  // Ensure pagination works on page load
  document.addEventListener('DOMContentLoaded', () => {
    getProducts();
  });
  // Close the modal when "Close" button is clicked
document.querySelector('[data-dismiss="modal"]').addEventListener('click', function () {
    $('#editProductModal').modal('hide'); // Hide the modal
  });
  

const getCategoriesForProduct = async () => {
    try {
      const response = await axios.get(`${apiUrl}/category`);
      const categories = response.data;
      const categorySelect = document.getElementById('categoryId');
      categorySelect.innerHTML = '<option value="">Select Category</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.categoryName;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching categories for product:', error);
    }
  };
  
  // Add a new product
  // document.getElementById('addProductBtn').addEventListener('click', async () => {
  //   const productId = document.getElementById('productId').value;
  //   const productName = document.getElementById('productName').value;
  //   const categoryId = document.getElementById('categoryId').value;
  //   try {
  //     await axios.post(`${apiUrl}/product`, { productId, productName, categoryId });
  //     getProducts();
  //     document.getElementById('productId').value = '';
  //     document.getElementById('productName').value = '';
  //     document.getElementById('categoryId').value = '';
  //     $('#addProductModal').modal('hide');
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //   }
  // });

  document.getElementById('addProductBtn').addEventListener('click', async () => {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const categoryId = document.getElementById('categoryId').value;
    
    try {
        await axios.post(`${apiUrl}/product`, { productId, productName, categoryId });

        // Clear input fields
        document.getElementById('productId').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('categoryId').value = '';

        // Hide the modal using Bootstrap's JavaScript API
        const addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        if (addProductModal) {
            addProductModal.hide();
        }

        // Refresh the page
        window.location.reload();
    } catch (error) {
        console.error('❌ Error adding product:', error);
    }
});

  
  // Delete product
  const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${apiUrl}/product/${id}`);
        getProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  

// Edit Product: Pre-fill the data into the modal
const editProduct = (id) => {
    // Get product data
    axios.get(`${apiUrl}/product/${id}`)
      .then(response => {
        const product = response.data;
  
        // Pre-fill the data into the modal
        document.getElementById('editProductName').value = product.productName;
        document.getElementById('editCategoryForProduct').value = product.categoryId;
        document.getElementById('editProductId').value = product.productId;
  
        // Fetch categories  for the product dropdown
        getCategoriesForEditProduct();
  
        // Show the modal
        $('#editProductModal').modal('show'); // This triggers the modal to open using Bootstrap's jQuery
  
        // Save the changes when user clicks the Save Changes button
        document.getElementById('saveEditProductBtn').onclick = () => {
          const updatedProductName = document.getElementById('editProductName').value;
          const updatedCategoryId = document.getElementById('editCategoryForProduct').value;
          const updatedProductId = document.getElementById('editProductId').value;
  
          // Send the updated data to the server
          axios.put(`${apiUrl}/product/${id}`, { productName: updatedProductName, categoryId: updatedCategoryId, productId:updatedProductId })
            .then(() => {
              // Reload products after the update
              getProducts();
              $('#editProductModal').modal('hide'); // Close the modal after update
            })
            .catch(error => {
              console.error('Error updating product:', error);
            });
        };
      })
      .catch(error => {
        console.error('Error fetching product for edit:', error);
      });
  };
  
  // Fetch categories for the product dropdown in the edit modal
  const getCategoriesForEditProduct = () => {
    axios.get(`${apiUrl}/category`)
      .then(response => {
        const categories = response.data;
        const categorySelect = document.getElementById('editCategoryForProduct');
        categorySelect.innerHTML = ''; // Clear existing options
  
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.categoryName;
          categorySelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error fetching categories for product:', error);
      });
  };
  
  
  getCategoriesForProduct();
