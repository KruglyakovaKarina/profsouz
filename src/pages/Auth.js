import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Auth = ({ setActive, setUser }) => {
  const [state, setState] = useState(initialState);
  const [signUp, setSignUp] = useState(false);

  const { email, password, firstName, lastName, confirmPassword } = state;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!signUp) {
      if (email && password) {
        try {
          const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          if (user) {
            setUser(user);
            setActive('home');
          }
        } catch {
          return toast.error(
            'Введённые данные неверные, проверьте их и введите снова'
          );
        }
      } else {
        return toast.error('Все поля должны быть заполнены');
      }
    } else {
      if (password !== confirmPassword) {
        return toast.error('Пароли не совпадают');
      }
      if (password.length < 6) {
        return toast.error('Пароль должен состоять минимум из 6 символов');
      }
      if (firstName && lastName && email && password) {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        //await
        updateProfile(user, { displayName: `${firstName} ${lastName}` });
        setActive('home');
      } else {
        return toast.error('Все поля должны быть заполнены');
      }
    }
    navigate('/');
  };

  return (
    <div className='container-fluid mb-4'>
      <div className='container'>
        <div className='col-12 text-center'>
          <div className='text-center heading py-3 mt-5'>
            {!signUp ? 'Вход' : 'Регистрация'}
          </div>
        </div>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-10 col-md-8 col-lg-6'>
            <form className='row' onSubmit={handleAuth}>
              {signUp && (
                <>
                  <div className='col-6 py-3'>
                    <input
                      type='text'
                      className='form-control input-text-box'
                      placeholder='Имя'
                      name='firstName'
                      value={firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='col-6 py-3'>
                    <input
                      type='text'
                      className='form-control input-text-box'
                      placeholder='Фамилия'
                      name='lastName'
                      value={lastName}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              <div className='col-12 py-3'>
                <input
                  type='email'
                  className='form-control input-text-box'
                  placeholder='Email'
                  name='email'
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className='col-12 py-3'>
                <input
                  type='password'
                  className='form-control input-text-box'
                  placeholder='Пароль'
                  name='password'
                  value={password}
                  onChange={handleChange}
                />
              </div>
              {signUp && (
                <div className='col-12 py-3'>
                  <input
                    type='password'
                    className='form-control input-text-box'
                    placeholder='Подтвердите пароль'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className='col-12 py-4 text-center'>
                <button
                  className={`btn ${!signUp ? 'btn-sign-in' : 'btn-sign-up'}`}
                  type='submit'
                >
                  {!signUp ? 'Войти' : 'Зарегистрироваться'}
                </button>
              </div>
            </form>
            <div>
              {!signUp ? (
                <>
                  <div className='text-center justify-content-center mt-1 pt-1'>
                    <p className='small'>
                      Нет аккаунта?&nbsp;
                      <span
                        className='link-danger'
                        style={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                          color: '#1f469d',
                        }}
                        onClick={() => setSignUp(true)}
                      >
                        Зарегистрироваться
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className='text-center justify-content-center mt-1 pt-1'>
                    <p className='small'>
                      Уже есть аккаунт?&nbsp;
                      <span
                        style={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                          color: '#1f469d',
                        }}
                        onClick={() => setSignUp(false)}
                      >
                        Войти
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
