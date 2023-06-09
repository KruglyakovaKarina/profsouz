import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ active, setActive, user, handleLogout }) => {
  const userId = user?.uid;
  return (
    <nav className='navbar navbar-expand-lg navbar-light'>
      <div className='container-fluid bg-faded padding-media'>
        <div className='container padding-media'>
          <nav className='navbar navbar-toggleable-md navbar-light'>
            <button
              className='navbar-toggler mt-3'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarSupportedContent'
              data-bs-parent='#navbarSupportedContent'
              aria-controls='navbarSupportedContent'
              aria-expanded='true'
              aria-label='Toggle Navigation'
            >
              <span className='fa fa-bars'></span>
            </button>
            <div
              className='collapse navbar-collapse'
              id='navbarSupportedContent'
            >
              <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                <Link to='/'>
                  <li className='profile-logo mobile_logo_width'>
                    <img
                      src='https://profkomvtb.ru/wp-content/uploads/2022/06/vtbprof_logo_main_rgb-e1655940462305.png'
                      style={{ height: '40px', paddingRight: '30px' }}
                    />
                  </li>
                </Link>
                <Link to='/' style={{ textDecoration: 'none' }}>
                  <li
                    className={`nav-item nav-link ${
                      active === 'home' ? 'active' : ''
                    }`}
                    onClick={() => setActive('home')}
                  >
                    Главная
                  </li>
                </Link>
                <Link to='/blogs' style={{ textDecoration: 'none' }}>
                  <li
                    className={`nav-item nav-link ${
                      active === 'blogs' ? 'active' : ''
                    }`}
                    onClick={() => setActive('blogs')}
                  >
                    Новости
                  </li>
                </Link>
                {userId && user.isAdmin ? (
                  <>
                    <Link to='/create' style={{ textDecoration: 'none' }}>
                      <li
                        className={`nav-item nav-link ${
                          active === 'create' ? 'active' : ''
                        }`}
                        onClick={() => setActive('create')}
                      >
                        Создать пост
                      </li>
                    </Link>
                  </>
                ) : (
                  <></>
                )}

                <Link to='/about' style={{ textDecoration: 'none' }}>
                  <li
                    className={`nav-item nav-link ${
                      active === 'about' ? 'active' : ''
                    }`}
                    onClick={() => setActive('about')}
                  >
                    О нас
                  </li>
                </Link>

                <Link to='/info' style={{ textDecoration: 'none' }}>
                  <li
                    className={`nav-item nav-link ${
                      active === 'info' ? 'active' : ''
                    }`}
                    onClick={() => setActive('info')}
                  >
                    Важно знать
                  </li>
                </Link>
              </ul>

              <div className='row g-3'>
                <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                  {userId ? (
                    <>
                      <div className='profile-logo'>
                        <img
                          src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
                          alt='logo'
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            marginTop: '12px',
                          }}
                        />
                      </div>
                      <Link to={`/updateProfile/${userId}`}>
                        <p style={{ marginTop: '12px', marginLeft: '5px' }}>
                          {user?.displayName}
                        </p>
                      </Link>
                      <li className='nav-item nav-link' onClick={handleLogout}>
                        Выйти
                      </li>
                    </>
                  ) : (
                    <Link to='/auth' style={{ textDecoration: 'none' }}>
                      <li
                        className={`nav-item nav-link ${
                          active === 'login' ? 'active' : ''
                        }`}
                        onClick={() => setActive('login')}
                      >
                        Вход
                      </li>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Header;
