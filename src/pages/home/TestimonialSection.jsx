import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel';
import 'swiper/css/autoplay';
import { Navigation, Pagination, Mousewheel, Autoplay, A11y } from 'swiper/modules';

const TestimonialSection = () => {
  const paginationBottom = '10px'; // Adjust this value to move the bullets further down

  return (
    <section
      className="testimonial__area testimonial__overlay pt-175 pb-170"
      style={{ background: 'url("/assets/img/teacher-bg.jpg") center center / cover no-repeat' }}
    >
      <div className="container">
        <div className="col-xxl-12">
          <Swiper
            modules={[Navigation, Pagination, Mousewheel, Autoplay, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true, el: '.custom-swiper-pagination' }}
            mousewheel={{ forceToAxis: true }}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="testimonial__slider"
          >
            <SwiperSlide>
              <div className="testimonial__item text-center">
                <div className="testimonial__thumb">
                  <img src="./assets/img/why/teacher.png" alt="testimonial" />
                </div>
                <div className="testimonial__content">
                  <div className="testimonial__info">
                    <h4>Madame Allouane</h4>
                    <span>Encadreur de la fac</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="testimonial__item text-center">
                <div className="testimonial__thumb">
                  <img src="./assets/img/why/teacher.png" alt="testimonial" />
                </div>
                <div className="testimonial__content">
                  <div className="testimonial__info">
                    <h4>Madame Salmi</h4>
                    <span>Encadreur de Cerist</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            {/* Add more SwiperSlide components as needed */}
          </Swiper>
          <div className="custom-swiper-pagination swiper-pagination" style={{ bottom: paginationBottom }}></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
