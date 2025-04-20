import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  faStar,
  faStore,
  faMarker,
  faShop,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Order from "./detail";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}
function SeedlingCrousel({ cart, setCart }) {
  const [isOrderOpen, setOrderOpen] = useState(false);
  const [productItems, setProductItems] = useState("");
  const openOrder = (items) => {
    setProductItems(items);
    setOrderOpen(true);
  };
  const closOrder = () => setOrderOpen(false);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const data = [
    {
      title: `Green Plant `,
      image: `assets/seedling/seedling pant.jpg`,
      desc: `Green plant seedling to grow in your home`,
      price: `44 birr`,
    },
    {
      title: `Beauty Plants`,
      image: `assets/seedling/flowers.jpg`,
      desc: `Beauty plants seedling`,
      price: `24 birr`,
    },
    {
      title: `Fruits`,
      image: `assets/seedling/fruits.jpg`,
      desc: `Fruit seedling to produce in your home`,
      price: `50 birr`,
    },
    {
      title: `Seedling`,
      image: `assets/seedling/seedling 2.jpg`,
      desc: `Fruit seedling to produce in your home`,
      price: `200 birr`,
    },
    {
      title: `Healthy`,
      image: `assets/seedling/exiperimental fruits .jpg`,
      desc: `Healthy plant seedling `,
      price: `240 birr`,
    },
    {
      title: `Seedling`,
      image: `assets/seedling/seedling.jpg`,
      desc: `Fruit seedling to produce in your home`,
      price: `444 birr`,
    },
  ];
  return (
    <>
      <div className="p-8 m-6 ">
        <Slider {...settings}>
          {data.map((d) => (
            <div className=" h-80 md:h-60 bg-white rounded-xl shadow-sm  overflow-hidden">
              <img
                className="h-48 md:h-32 w-full rounded-t-xl hover:scale-110 "
                src={d.image}
                alt="seedling"
              />
              <div className="mt-2 mx-4 text-green-700 font-bold hover:bg-green-700 hover:text-white">
                {d.title}
              </div>
              {/**
                                *<div className="flex space-x-1 mt-2 mx-2 text-orange-400">
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                    <FontAwesomeIcon icon={faStar} />
                                </div>
                                */}
              <p className="mt-2 mx-4 text-green-700 ">Price: {d.price} </p>
              <div className="flex justify-between mx-4 mt-2">
                <button
                  onClick={() => openOrder(d)}
                  className="rounded-md border border-green-600 text-green-700 from-green-700 to-green-900  text-lg  px-3 hover:bg-gradient-to-l hover:text-white"
                >
                  buy
                </button>
                <button>
                  <FontAwesomeIcon
                    icon={faCartPlus}
                    onClick={() => setCart(cart + 1)}
                    className="text-xl text-green-800 hover:scale-125"
                  />{" "}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <Order
        isOrderOpen={isOrderOpen}
        closeOrder={closOrder}
        items={productItems}
        cart={cart}
        setCart={setCart}
      />
    </>
  );
}

export default SeedlingCrousel;
