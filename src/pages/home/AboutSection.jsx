import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/mousewheel';
import 'swiper/css/autoplay';

import  IconProfile from "./images/teacher.png"
import { Navigation, Pagination, Mousewheel, Autoplay, A11y } from 'swiper/modules';

// Import des icônes de react-icons
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt } from 'react-icons/fa';

// Composant pour afficher une carte de profil
const ProfileCard = ({ name, position, imgSrc }) => {
  return (
    <div
      className="profile-card"
      style={{
        backgroundColor: '#ecf2f6',  
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s',
        margin: 'auto',
        width: '100%',
        maxWidth: '250px',
        color: '#333',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      }}
    >
      <div
        className="testimonial__thumb"
        style={{
          marginBottom: '15px',
          position: 'relative',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          margin: '0 auto',
          overflow: 'hidden',
          border: '3px solid #e0e0e0',
        }}
      >
        <img
          src={imgSrc}
          alt="profile"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
        {name}
      </h4>
      <span style={{ fontSize: '14px', color: '#666' }}>{position}</span>
      <div
        className="social-icons"
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: 'transform 0.3s',
            color: '#1877F2',
            fontSize: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaFacebookF />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: 'transform 0.3s',
            color: '#E4405F',
            fontSize: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaInstagram />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: 'transform 0.3s',
            color: '#1DA1F2',
            fontSize: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaTwitter />
        </a>
        <a
          href="tel:+1234567890"
          style={{
            transition: 'transform 0.3s',
            color: '#25D366',
            fontSize: '20px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaPhoneAlt />
        </a>
      </div>
    </div>
  );
};

// Composant principal pour la section des témoignages
const TestimonialSection = () => {
  return (
    <section
      className="testimonial__area"
      style={{
        backgroundColor: '#10266f18',
        // background: '#fff',
        // padding: '50px 0',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'-20px',
        // marginBottom:'50px'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', width: '100%' }}>
        <Swiper
          modules={[Navigation, Pagination, Mousewheel, Autoplay, A11y]}
          spaceBetween={30}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            640: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          navigation
          pagination={{ clickable: true }}
          mousewheel={{ forceToAxis: true }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="testimonial__slider pt-20"
          style={{ paddingBottom: '30px' }} // Pour espacer les icônes de pagination
        >
          <SwiperSlide>
            <ProfileCard
              name="Bouda Malek Nourhane"
              position="Software Engineer"
              imgSrc={IconProfile}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProfileCard
              name="Beneissa Sarah"
              position="IT Engineer"
              imgSrc={IconProfile}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProfileCard
              name="Khaznadar Meriem"
              position="IT Engineer"
              imgSrc={IconProfile}
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;
