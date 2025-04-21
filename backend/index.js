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
  CreateUser,
} = require("./functions/Users/users");
const {
  Account,
  EditAccount,
  showAccount,
  FetchUserName,
} = require("./functions/Users/account");
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
  ItemsCount,
  ItemsList,
} = require("./functions/Inventory/items");
const {
  Supplier,
  singleSupplier,
  EditSupplier,
  AddSupplier,
  deleteSupplier,
  SupplierCount,
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
const {
  Products,
  singleProduct,
  ClientProducts,
} = require("./functions/Inventory/Stock/products");
const { Stock, ClientStock } = require("./functions/Inventory/Stock/stock");
const {
  submitSale,
  fetchSellsProducts,
} = require("./functions/Inventory/Sells/sells");
const {
  Customers,
  singleCustomer,
  EditCustomer,
  AddCustomer,
  deleteCustomer,
  customerSignUp,
  customerLogin,
  getCustomerProfile,
  updateCustomerProfile,
  CustomersCount,
} = require("./functions/Inventory/customers");
const {
  SellsList,
  CustomerOrders,
  deleteOrder,
} = require("./functions/Inventory/Sells/sellsList");
const {
  otherExpenses,
  addOtherExpense,
  EditOtherExpense,
  showOtherExpense,
  deleteOtherExpense,
} = require("./functions/Financial/otherExpense");
const {
  otherIncome,
  addOtherIncome,
  EditOtherIncome,
  showOtherIncomes,
  deleteOtherIncome,
} = require("./functions/Financial/otherIncome");
const {
  soldProducts,
  purchasedProducts,
  FinancialAnalaysis,
} = require("./functions/Financial/report");
const {
  CustomerOrdes,
  CustomerSingleOrder,
  UpdateSalesStatus,
} = require("./functions/Inventory/Sells/customerOrders");
const {
  Notifications,
  deleteNotification,
  updateNotificationStatus,
} = require("./functions/Notifications/allNotifications");
const {
  ExpiredProducts,
  deleteProductExpiredProduct,
  checkExpiredProducts,
  ExpiredProductCount,
  expiredProductCount,
} = require("./functions/Notifications/expiredProduts");
const {
  EmptyProductsCount,
  EmptyProducts,
} = require("./functions/Notifications/emptyProducts");
const {
  understockProductsCount,
  understockProducts,
} = require("./functions/Notifications/understockProducts");
const {
  reachedDuePayments,
  checkPaymentDueDates,
} = require("./functions/Notifications/reachedDuePayemnts");
const {
  upcamingPayments,
  checkUpcamingPayments,
} = require("./functions/Notifications/upcamingPayments");

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

app.post("/users", verifyToken, CreateUser);

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
app.get("/messages", Messages);

app.post("/messages", InsertMessage);

app.get("/messages/:id", verifyToken, AMessage);

app.delete("/messages/:id", verifyToken, deleteMessage);

//******Notifications******** */
app.get("/notifications", Notifications);

app.delete("/deleteNotification/:id", deleteNotification);
app.put("/updateNotification/:id", updateNotificationStatus);

///payemnt due lists
app.get("/reachedDuePayments", reachedDuePayments);

//upcomiong payments.

app.get("/upcamingPayments", upcamingPayments);

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

app.get("/stock", verifyToken, Stock);

app.get("/ClientStock", ClientStock);

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
//this will ftch items with out pagination
app.get("/ItemsList", ItemsList);

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
app.get("/supplier", Supplier);

//this fetch suppliers without limit. of pagination
app.get("/supplierCount", SupplierCount);

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
//****Supplier ******/
//read suplier
app.get("/customers", Customers);

//this fetch custoemr without pagination
app.get("/customersCount", CustomersCount);

app.post("/customerLogin", customerLogin);

app.post("/CustomerSignUp", customerSignUp);
/// a custoemr orders
app.get("/CustomerOrders/:id", verifyToken, CustomerOrders);

app.get("/fetchAcustomer/:customerId", getCustomerProfile);

app.put("/updateCustomer/:customerId", verifyToken, updateCustomerProfile);

/// show an customer
app.get("/customers/:id", verifyToken, singleCustomer);

// edit supplier
app.put("/customers/:id", verifyToken, EditCustomer);

// add customer
app.post("/customers", verifyToken, AddCustomer);

//delete customer
app.delete("/customers/:id", verifyToken, deleteCustomer);
//**** End of customer ******/
//******************************

//******************************
//****Purchase List ******/
//read purchase List
app.get("/purchaseList", PurchaseList);

app.get("/purchaseList/:id", verifyToken, SinglePurchaseData);
/// show an purchase List
app.get("/supplier/:id", verifyToken, singleSupplier);

app.get("/aPurchasePayments/:id", verifyToken, aPurchasePayments);

// edit purchase List
app.put("/supplier/:id", verifyToken, EditSupplier);

//read prduct list under a purchase
app.get("/PurchasedProductList/:id", verifyToken, PurchasedProductList);

//fetch product list
app.get("/products", Products);

//proucts to show on client side without backend pagination
app.get("/ClientProducts", ClientProducts);

app.get("/products/:id", singleProduct);

app.delete("/products/:id", verifyToken, deleteProduct);

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
app.put("/EditPurchase/:id", verifyToken, EditPurchase);

//delete purchase List
app.delete("/supplier/:id", verifyToken, deleteSupplier);

//**** End of purchase List ******/
//******************************

//**************Sells  */
app.post("/addSells", verifyToken, submitSale);

//fetch product lists under a sale
app.get("/salesList/:id", fetchSellsProducts);

//read sales list
app.get("/salesList", SellsList);

//fetch expired products
app.get("/expiredProducts", ExpiredProducts);

app.get("/expiredProductCount", expiredProductCount);

///empty products
app.get("/EmptyProducts", EmptyProducts);
///empty products count
app.get("/EmptyProductsCount", EmptyProductsCount);

//
app.get("/understockProducts", understockProducts);

app.get("/understockProductsCount", understockProductsCount);

//delete expired product
app.delete("/expiredProducts/:id", deleteProductExpiredProduct);

//update sales status
app.put("/update_sells_status/:id", verifyToken, UpdateSalesStatus);
//readcustoerm ordrs client side
app.get("/orders", CustomerOrdes);

app.get("/orders/:id", verifyToken, CustomerSingleOrder);

app.delete("/deleteOrder/:id", verifyToken, deleteOrder);

app.get("/soldProducts", soldProducts);

app.get("/purchasedProducts", verifyToken, purchasedProducts);
///Financial********************
app.get("/otherExpenses", verifyToken, otherExpenses);

app.get("/otherExpenses", verifyToken, otherIncome);

app.post("/addotherExpenses", verifyToken, addOtherExpense);

app.put("/otherExpenses/:id", verifyToken, EditOtherExpense);

app.get("/otherExpenses/:id", verifyToken, showOtherExpense);

app.delete("/otherExpenses/:id", verifyToken, deleteOtherExpense);

/// other incomes

app.get("/otherIncomes", verifyToken, otherIncome);

app.post("/addOtherIncome", verifyToken, addOtherIncome);

app.put("/otherIncomes/:id", verifyToken, EditOtherIncome);

app.get("/otherIncomes/:id", verifyToken, showOtherIncomes);

app.delete("/otherIncomes/:id", verifyToken, deleteOtherIncome);

//sales anlysis
app.get("/FinancialAnalaysis", FinancialAnalaysis);
setInterval(() => {
  checkExpiredProducts();
  checkPaymentDueDates();
  checkUpcamingPayments();
}, 24 * 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
