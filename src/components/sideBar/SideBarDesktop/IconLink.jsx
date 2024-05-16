// IconLink.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function IconLink({ icon, text, isActive, onMouseEnter, onMouseLeave }) {
  return (
    <div className={`icon-container ${isActive ? 'active' : ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link to={`/${text.toLowerCase()}`} className="nav-icon">
        {icon}
        <span className="icon-text">{text}</span>
      </Link>
    </div>
  );
}

export default IconLink;
