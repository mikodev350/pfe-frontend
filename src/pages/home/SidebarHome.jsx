import React from 'react';
import { Link } from 'react-router-dom';

const SidebarHome = () => {
  return (
    <div className="sidebar__area">
      <div className="sidebar__wrapper">
        <div className="sidebar__close">
          <button className="sidebar__close-btn" id="sidebar__close-btn">
            <span><i className="far fa-times"></i></span>
            <span>close</span>
          </button>
        </div>
        <div className="sidebar__content">
          <div className="logo mb-40">
            <Link to="/">
              <img src="./Home Two __ Online Learning and Education React Template_files/logo.png" alt="logo" />
            </Link>
          </div>
          <div className="mm-menu">
            <ul>
              <li className="has-droupdown">
                <Link to="/home-two#!">Home</Link>
                <ul className="sub-menu">
                  <li><Link to="/">Home 1</Link></li>
                  <li><Link to="/home-two">Home 2</Link></li>
                  <li><Link to="/home-three">Home 3</Link></li>
                </ul>
              </li>
              <li className="has-droupdown">
                <Link to="/home-two#!">Courses</Link>
                <ul className="sub-menu">
                  <li><Link to="/courses">Courses</Link></li>
                  <li><Link to="/course-list">Course List</Link></li>
                  <li><Link to="/course-sidebar">Course Sidebar</Link></li>
                  <li><Link to="/course-details">Course Details</Link></li>
                </ul>
              </li>
              <li className="has-droupdown">
                <Link to="/home-two#!">Blog</Link>
                <ul className="sub-menu">
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/blog-details">Blog Details</Link></li>
                </ul>
              </li>
              <li className="has-droupdown">
                <Link to="/home-two#!">Pages</Link>
                <ul className="sub-menu">
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/instructor">Instructor</Link></li>
                  <li><Link to="/instructor-details">Instructor Details</Link></li>
                  <li><Link to="/event-details">Event Details</Link></li>
                  <li><Link to="/cart">My Cart</Link></li>
                  <li><Link to="/wishlist">My Wishlist</Link></li>
                  <li><Link to="/checkout">Checkout</Link></li>
                  <li><Link to="/sign-in">Sign In</Link></li>
                  <li><Link to="/sign-up">Sign Up</Link></li>
                  <li><Link to="/error">Error</Link></li>
                </ul>
              </li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="sidebar__search p-relative mt-40">
            <form>
              <input type="text" placeholder="Search..." />
              <button type="submit">
                <svg className="search-toggle" viewBox="0 0 584.4 584.4">
                  <g>
                    <g>
                      <path className="st0" d="M565.7,474.9l-61.1-61.1c-3.8-3.8-8.8-5.9-13.9-5.9c-6.3,0-12.1,3-15.9,8.3c-16.3,22.4-36,42.1-58.4,58.4c-4.8,3.5-7.8,8.8-8.3,14.5c-0.4,5.6,1.7,11.3,5.8,15.4l61.1,61.1c12.1,12.1,28.2,18.8,45.4,18.8c17.1,0,33.3-6.7,45.4-18.8C590.7,540.6,590.7,499.9,565.7,474.9z"></path>
                      <path className="st1" d="M254.6,509.1c140.4,0,254.5-114.2,254.5-254.5C509.1,114.2,394.9,0,254.6,0C114.2,0,0,114.2,0,254.5C0,394.9,114.2,509.1,254.6,509.1z M254.6,76.4c98.2,0,178.1,79.9,178.1,178.1s-79.9,178.1-178.1,178.1S76.4,352.8,76.4,254.5S156.3,76.4,254.6,76.4z"></path>
                    </g>
                  </g>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHome;
