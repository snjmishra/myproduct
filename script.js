const apiUrl = 'https://product-category-498u.onrender.com/api';

window.onload =  function() {
    getCategories();
  };

const getCategories = async () => {
    try {
      document.getElementById('loader').style.display = 'block';
  
      // Add timestamp to ensure no caching
      const response = await axios.get(`${apiUrl}/category?timestamp=${new Date().getTime()}`);
      const categories = response.data;
      document.getElementById('loader').style.display = 'none'; 
      const categoryTableBody = document.getElementById('categoryTableBody');
      categoryTableBody.innerHTML = '';
  
      if (categories.length === 0) {
        categoryTableBody.innerHTML = `<tr><td colspan="3" class="text-center">No categories found.</td></tr>`;
      } else {
        categories.forEach(category => {
          const row = `
            <tr>
              <td>${category.id}</td>
              <td>${category.categoryName}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="editCategory(${category.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Delete</button>
              </td>
            </tr>`;
          categoryTableBody.innerHTML += row;
        });
      }
  
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };
  
  
// Add a new category
document.getElementById('addCategoryBtn').addEventListener('click', async () => {
  const categoryName = document.getElementById('categoryName').value;
  try {
    await axios.post(`${apiUrl}/category`, { categoryName });
    getCategories();
    document.getElementById('categoryName').value = '';
    $('#addCategoryModal').modal('hide');
  } catch (error) {
    console.error('Error adding category:', error);
  }
});

// Delete category
const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await axios.delete(`${apiUrl}/category/${id}`);
      getCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};

// Edit Category: Pre-fill the data into the modal
const editCategory = (id) => {
  // Get category data
  axios.get(`${apiUrl}/category/${id}`)
    .then(response => {
      const category = response.data;
      
      // Pre-fill the data into the modal
      document.getElementById('editCategoryName').value = category.categoryName;
      
      // Show the modal
      $('#editCategoryModal').modal('show');

      // Save the changes
      document.getElementById('saveEditCategoryBtn').onclick = () => {
        const updatedCategoryName = document.getElementById('editCategoryName').value;

        // Send the updated data to the server
        axios.put(`${apiUrl}/category/${id}`, { categoryName: updatedCategoryName })
          .then(() => {
            // Reload categories after the update
            getCategories();
            $('#editCategoryModal').modal('hide');
          })
          .catch(error => {
            console.error('Error updating category:', error);
          });
      };
    })
    .catch(error => {
      console.error('Error fetching category for edit:', error);
    });
};
document.querySelector('[data-dismiss="modal"]').addEventListener('click', function () {
  $('#editCategoryModal').modal('hide'); // Hide the modal
});

    // // Ensure function runs when the page loads
    document.addEventListener('DOMContentLoaded',  () => {
         getCategories();  // This will automatically show the categories
        
      });
      
    
  
