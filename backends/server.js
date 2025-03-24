const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { Category, AddCategory, deleteCategory, singleCategory, EditCategory } = require('./functions/category');
const { Items, AddItem, singleItem, EditItem, deleteITem } = require('./functions/items');
const { Products, singleProduct, EditProduct, AddProduct, deleteProduct } = require('./functions/products');
const { Supplier, AddSupplier, singleSupplier, EditSupplier, deleteSupplier } = require('./functions/supplier');
const { Stock } = require('./functions/stock');
const { Stockout, AddStockout, singleStockout, EditStockout, deleteStockout } = require('./functions/stockout');
const { Customers, singleCustomer, EditCustomer, AddCustomer, deleteCustomer } = require('./functions/customers');

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });//  store file


//******************************
//****Category ******/
//read category
app.get('/category', Category);

/// show a category
app.get('/category/:id', singleCategory);

// edit category
app.put('/category/:id', EditCategory);

// add category
app.post('/addCategory', AddCategory)

//delete category
app.delete('/category/:id', deleteCategory)
//**** End of Category ******/
//******************************



//******************************
//****Items ******/
//read item
app.get('/items', Items);

/// show an item
app.get('/items/:id', singleItem);

// edit item
app.put('/items/:id', EditItem);

// add Item
app.post('/addItem', AddItem)

//delete category
app.delete('/items/:id', deleteITem)
//**** End of Item ******/
//******************************


//******************************
//****Products ******/
//read product
app.get('/products', Products);

/// show an item
app.get('/products/:id', singleProduct);

// edit product
app.put('/products/:id', EditProduct);

// add product
app.post('/products', AddProduct)

//delete product
app.delete('/products/:id', deleteProduct)
//**** End of Product ******/
//******************************



//******************************
//****Supplier ******/
//read suplier
app.get('/supplier', Supplier);

/// show an supplier
app.get('/supplier/:id', singleSupplier);

// edit supplier
app.put('/supplier/:id', EditSupplier);

// add Supplier
app.post('/addSupplier', AddSupplier)

//delete supplier
app.delete('/supplier/:id', deleteSupplier)
//**** End of supplier ******/
//******************************




//******************************
//****Stocks ******/
//read stockks
app.get('/stock', Stock);

//**** End of stockout ******/
//******************************




//******************************
//****Stockouts ******/
//read stokout
app.get('/stockouts', Stockout);

/// show an stockouts
app.get('/stockouts/:id', singleStockout);

// edit stockouts
app.put('/stockouts/:id', EditStockout);

// add stockout
app.post('/addStockout', AddStockout)

//delete stockouts
app.delete('/stockouts/:id', deleteStockout)
//**** End of stockout ******/
//******************************



//******************************
//****Customers ******/
//read stokout
app.get('/customers', Customers);

/// show an customer
app.get('/customers/:id', singleCustomer);

// edit customers
app.put('/customers/:id', EditCustomer);

// add customers
app.post('/addCustomer', AddCustomer)

//delete customers
app.delete('/customers/:id', deleteCustomer)
//**** End of customers ******/
//******************************

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
