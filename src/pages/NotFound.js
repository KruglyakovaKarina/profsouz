import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = (active, setActive) => {
  return (
    <div>
      <img src='/images/404.jpg' alt='Page not found' height='800px' />
      <Link to='/' style={{ textDecoration: 'none' }}>
        <li
          className={`nav-item nav-link ${active === 'home' ? 'active' : ''}`}
          onClick={() => setActive('home')}
        >
          Вернуться на главную
        </li>
      </Link>
    </div>
  );
};

export default NotFound;
