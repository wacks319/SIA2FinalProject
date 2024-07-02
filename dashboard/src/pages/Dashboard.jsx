import React from 'react';
import './Dashboard.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Dashboard() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true
  };

  return (
    <div className="dashboard">
      <div className='image-section'>
        <Slider {...settings}>
          <div>
            <img src="carousel1.png" alt="Image 1" />
          </div>
          <div>
            <img src="carousel2.png" alt="Image 2" />
          </div>
          <div>
            <img src="carousel3.png" alt="Image 3" />
          </div>
        </Slider>
      </div>
      <div className='main-section'>
        <h2>
          Welcome to the National Book Store
        </h2>
        <p>
        LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
