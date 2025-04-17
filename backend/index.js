const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const {
  FetchUsers,
  FetchUser,
  GetUserRole,
  Users,
  EditUser,
  DeleteUser,
  SigleUser,
} = require("./functions/users");
const {
  Account,
  EditAccount,
  showAccount,
  FetchUserName,
} = require("./functions/account");
const {
  Articles,
  CreateArticle,
  deleteArticle,
  AnArticle,
  EditArticle,
} = require("./functions/articles");
const { verifyToken } = require("./middleware/jwt");
const {
  Messages,
  InsertMessage,
  AMessage,
  deleteMessage,
} = require("./functions/messages");
const {
  Category,
  singleCategory,
  EditCategory,
  AddCategory,
  deleteCategory,
} = require("./functions/Inventory/category");
const {
  ProductType,
  singleProductType,
  EditProductType,
  AddProductType,
  deleteProductType,
} = require("./functions/Inventory/type");
const {
  Items,
  AnItem,
  EditItem,
  CreateItem,
  deleteItem,
} = require("./functions/Inventory/items");
const {
  Supplier,
  singleSupplier,
  EditSupplier,
  AddSupplier,
  deleteSupplier,
} = require("./functions/Inventory/suppliers");
const {
  PurchaseList,
  SinglePurchaseData,
  EditPurchase,
} = require("./functions/Inventory/PurchaseList/purchaseList");
const {
  AddPurchase,
} = require("./functions/Inventory/PurchaseList/addPurchase");
const {
  PurchasedProductList,
  deleteProduct,
  updateProduct,
  addProduct,
} = require("./functions/Inventory/PurchaseList/purchasedProductList");
const {
  aPurchasePayments,
  deletePayment,
  updatePayment,
  addPayment,
} = require("./functions/Inventory/PurchaseList/payments");
const {
  productCostList,
  deleteProductCost,
  updateProductCost,
} = require("./functions/Inventory/PurchaseList/costs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

/*****************Users****************/
/// fetch users
app.get("/FetchUsers", verifyToken, FetchUsers);

//authenticate user'

app.post("/getUser", FetchUser);

//reading the user role
app.post("/getUserRole", verifyToken, GetUserRole);

// delete user

//*****Admin Side User */

// read users

app.get("/users", verifyToken, Users);

// read a user data
app.get("/users/:id", verifyToken, SigleUser);

// editt user
app.put("/users/:id", verifyToken, EditUser);

// delete user
app.delete("/users/:id", verifyToken, DeleteUser);

//*******User account info */
/// read an account info
app.get("/account", verifyToken, Account);

//edit account
app.put("/account/:id", verifyToken, EditAccount);

// show account;
app.get("/account/:id", verifyToken, showAccount);

// get name
app.get("/getUsername/:id", verifyToken, FetchUserName);

//********Articles*******************/
app.get("/articles", verifyToken, Articles);

// Define routes AFTER defining upload
app.post("/articles", verifyToken, upload.single("image"), CreateArticle);

app.get("/articles/:id", verifyToken, AnArticle);

app.put("/articles/:id", verifyToken, upload.single("image"), EditArticle);

app.delete("/articles/:id", verifyToken, deleteArticle);

//********Messages*******************/
app.get("/messages", verifyToken, Messages);

app.post("/messages", InsertMessage);

app.get("/messages/:id", verifyToken, AMessage);

app.delete("/messages/:id", verifyToken, deleteMessage);

//****************Inventory*******************************/

//******************************
//****Category ******/
//read category
app.get("/category", Category);

/// show a category
app.get("/category/:id", singleCategory);

// edit category
app.put("/category/:id", verifyToken, EditCategory);

// add category
app.post("/addCategory", verifyToken, AddCategory);

//delete category
app.delete("/category/:id", verifyToken, deleteCategory);
//**** End of Category ******/
//******************************

//******************************
//****productType ******/
//read productType
app.get("/productType", ProductType);

/// show a productType
app.get("/productType/:id", singleProductType);

// edit productType
app.put("/productType/:id", verifyToken, EditProductType);

// add productType
app.post("/productType", verifyToken, AddProductType);

//delete productType
app.delete("/productType/:id", verifyToken, deleteProductType);
//**** End of ProductType ******/
//******************************

//******************************
//****items ******/
//read items
app.get("/items", Items);

/// show an item
app.get("/items/:id", AnItem);

// add items
app.post("/items", verifyToken, upload.single("image"), CreateItem);

// edit items
app.put("/items/:id", verifyToken, upload.single("image"), EditItem);

//delete items
app.delete("/items/:id", verifyToken, deleteItem);
//**** End of items ******/
//******************************

//******************************
//****Supplier ******/
//read suplier
app.get("/supplier", verifyToken, Supplier);

/// show an supplier
app.get("/supplier/:id", verifyToken, singleSupplier);

// edit supplier
app.put("/supplier/:id", verifyToken, EditSupplier);

// add Supplier
app.post("/supplier", verifyToken, AddSupplier);

//delete supplier
app.delete("/supplier/:id", verifyToken, deleteSupplier);
//**** End of supplier ******/
//******************************

//******************************
//****Purchase List ******/
//read purchase List
app.get("/purchaseList", verifyToken, PurchaseList);

app.get("/purchaseList/:id", verifyToken, SinglePurchaseData);
/// show an purchase List
app.get("/supplier/:id", verifyToken, singleSupplier);

app.get("/aPurchasePayments/:id", verifyToken, aPurchasePayments);

// edit purchase List
app.put("/supplier/:id", verifyToken, EditSupplier);

//read prduct list under a purchase
app.get("/PurchasedProductList/:id", verifyToken, PurchasedProductList);

app.put(
  "/updateProduct/:id",
  verifyToken,
  upload.single("image"),
  updateProduct
);

app.post("/addProduct", verifyToken, upload.single("image"), addProduct);

app.post("/addPayment", verifyToken, upload.single("image"), addPayment);

app.put(
  "/updatePayment/:id",
  verifyToken,
  upload.single("image"),
  updatePayment
);

app.delete("/deleteProduct/:id", verifyToken, deleteProduct);

//delete purchase payment data
app.delete("/deletePayment/:id", verifyToken, deletePayment);

//costs under a product.
app.get("/productCostList/:id", verifyToken, productCostList);

app.delete("/deleteProductCost/:id", verifyToken, deleteProductCost);

app.put("/updateProductCost/:id", updateProductCost);

// add purchase List
app.post(
  "/addPurchase",
  verifyToken,
  upload.fields([{ name: "productsImages" }, { name: "paymentImages" }]),
  AddPurchase
);

//edit purchae dta
app.put("/EditPurchase/:id", EditPurchase);

//delete purchase List
app.delete("/supplier/:id", verifyToken, deleteSupplier);
//**** End of purchase List ******/
//******************************

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
