import React, { useState, useEffect } from "react";
import {
  faCartPlus,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductItemTable from "./productListTable";
import ProductListModal from "./ProuctListModal";

function SellProduct() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showProductListModal, setShowProductListModal] = useState(false);

  const serverHost = import.meta.env.VITE_REACT_APP_SERVER;

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${serverHost}/ClientProducts`);
        setProducts(response.data);
        setFilteredProducts(response.data);
        console.log("current data filter", response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
      setCurrentPage(1);
      setSearchPerformed(false);
    } else {
      console.log("Searching for:", searchTerm);
      console.log("Products available:", products);

      const filtered = products.filter((product) => {
        console.log("Checking product:", product.name);
        if (product.name == null) {
          console.log("Product name is null,...", product);
        }
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
      setSearchPerformed(true);
    }
  }, [searchTerm, products]);

  // Group products by name
  const groupedProducts = Object.entries(
    filteredProducts.reduce((acc, product) => {
      if (!acc[product.name]) {
        acc[product.name] = [];
      }
      acc[product.name].push(product);
      return acc;
    }, {})
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = groupedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(groupedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToCart = (product, quantity) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += parseInt(quantity);
      updatedCart[existingItemIndex].totalPrice =
        updatedCart[existingItemIndex].selling_price *
        updatedCart[existingItemIndex].quantity;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: parseInt(quantity),
          totalPrice: product.selling_price * parseInt(quantity),
        },
      ]);
    }
  };

  const handleCheckoutClick = () => {
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex lg:flex-row flex-col gap-4 lg:p-0">
        {/* Sidebar */}
        <div className="flex lg:w-1/4 bg-gray-100">
          <div className="flex flex-col fixed z-20 bg-gray-100 py-4 w-full lg:w-1/5 mr-5 shadow-md">
            <div className="flex flex-row items-center justify-between px-4">
              <div className="flex flex-row items-center justify-center">
                <div className="text-xl font-bold text-primaryColor">Carts</div>

                <button
                  onClick={handleCheckoutClick}
                  className="relative inline-flex items-center p-3 text-sm font-medium text-center hover:scale-105 transition-transform"
                >
                  <FontAwesomeIcon
                    icon={faCartPlus}
                    className="text-2xl text-primaryColor"
                  />
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-red-500 rounded-full -top-1 -end-1 border-2 border-primaryColor">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col">
              {/* Search */}
              <div className="flex border border-primaryColor py-2 px-3 mx-3 gap-3 rounded-full mt-4 focus-within:ring-2 focus-within:ring-primaryColor focus-within:ring-opacity-50">
                <button
                  type="button"
                  className="relative inline-flex items-center text-sm font-medium text-center"
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-lg text-primaryColor"
                  />
                </button>
                <div className="flex items-center justify-center text-lg w-full">
                  <input
                    type="text"
                    className="outline-none bg-transparent w-full text-gray-700"
                    placeholder="Search Product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => setShowProductListModal(true)}
                className="px-2 lg:px-4 py-1 md:py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-colors mx-3 mt-4"
              >
                Product List
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 p-4 mt-32 lg:mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
            </div>
          ) : (
            <>
              {/* Product Not Found Message */}
              {searchPerformed && groupedProducts.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any products matching "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Product List */}
              {currentProducts.map(([productName, products]) => (
                <div
                  key={productName}
                  className="bg-white rounded-lg shadow-md p-4 mb-6"
                >
                  <div className="text-2xl p-2 font-bold border-b-2 mx-4 capitalize text-primaryColor border-primaryColor">
                    {productName}
                  </div>
                  <ProductItemTable
                    products={products}
                    addToCart={addToCart}
                    cart={cart}
                    setCart={setCart}
                  />
                </div>
              ))}

              {/* Pagination */}
              {groupedProducts.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-l-md border border-gray-300 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-primaryColor hover:bg-gray-50"
                      }`}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-4 py-2 border-t border-b border-gray-300 ${
                            currentPage === pageNumber
                              ? "bg-primaryColor text-white"
                              : "bg-white text-primaryColor hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-500">
                        ...
                      </span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => paginate(totalPages)}
                        className={`px-4 py-2 border-t border-b border-gray-300 ${
                          currentPage === totalPages
                            ? "bg-primaryColor text-white"
                            : "bg-white text-primaryColor hover:bg-gray-50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-r-md border border-gray-300 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-primaryColor hover:bg-gray-50"
                      }`}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Product List Modal */}
      <ProductListModal
        show={showProductListModal}
        onClose={() => setShowProductListModal(false)}
        products={groupedProducts}
      />
    </div>
  );
}

export default SellProduct;
