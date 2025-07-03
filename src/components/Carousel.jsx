import React from "react";
import Slider from "react-slick";

const Carousel = (props) => {
  var settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...(props.settings ? props.settings : settings)}>
      {props.children}
    </Slider>
  );
};

export default Carousel;
