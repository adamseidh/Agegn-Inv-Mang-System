import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { faCartPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Detail from "./detail";

function NextArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} bg-primaryColor rounded-full w-8 h-8 flex items-center justify-center right-[-15px] z-10 opacity-80 hover:opacity-100`}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} bg-primaryColor rounded-full w-8 h-8 flex items-center justify-center left-[-15px] z-10 opacity-80 hover:opacity-100`}
      onClick={onClick}
    />
  );
}

function ProductItemCarousel({ products, addToCart, cart, setCart }) {
  // Added cart and setCart props
  const [isDetailOpen, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});

  const openDetail = (product) => {
    setSelectedProduct(product);
    setOpenDetail(true);
  };

  const closeDetail = () => setOpenDetail(false);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: Math.max(1, parseInt(value) || 1),
    });
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="p-4">
      <Slider {...settings}>
        {products.map((product) => (
          <div
            key={product.id}
            className="h-96 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow mx-2"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                src={product.image ? product.image : product.itemImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/assets/default-product.jpg";
                }}
              />
            </div>

            <div className="p-4 mt-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Price:</span>
                <span className="font-bold">{product.selling_price} birr</span>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => openDetail(product)}
                  className="rounded-md px-3 py-1 text-sm border border-primaryColor text-primaryColor hover:bg-gray-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                  Details
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={product.available_product}
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="w-16 px-2 py-1 border border-primaryColor rounded text-center"
                  />

                  <button
                    onClick={() =>
                      addToCart(product, quantities[product.id] || 1)
                    }
                    className="p-2 rounded-full h-10 w-10 bg-primaryColor text-white hover:bg-opacity-80 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCartPlus} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {selectedProduct && (
        <Detail
          isDetailOpen={isDetailOpen}
          closeDetail={closeDetail}
          product={selectedProduct}
          cart={cart}
          setCart={setCart}
        />
      )}
    </div>
  );
}

export default ProductItemCarousel;
