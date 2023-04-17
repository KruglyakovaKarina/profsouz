import React, { useState, useEffect } from 'react';
import '@pathofdev/react-tag-input/build/index.css';
import { auth } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { reauthenticateWithCredential } from 'firebase/auth';
import { toast } from 'react-toastify';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  previousPassword: '',
};

const EditProfile = ({ user, setActive, setUser }) => {
  const [form, setForm] = useState(initialState);

  const { firstName, lastName, email, password, previousPassword } = form;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changeUserData = async (currentPassword, fistName, lastName) => {
    return await reauthenticateWithCredential(currentPassword)
      .then(() => {
        var user = auth().currentUser;
        user
          .updateProfile({ fistName, lastName })
          .then(() => {
            console.log('User data updated!');
          })
          .catch((error) => {
            toast.error(error);
          });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const changePassword = async (currentPassword, newPassword) => {
    return await reauthenticateWithCredential(currentPassword)
      .then(() => {
        var user = auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            console.log('Password updated!');
          })
          .catch((error) => {
            toast.error(error);
          });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const changeEmail = (currentPassword, newEmail) => {
    reauthenticateWithCredential(currentPassword)
      .then(async () => {
        var user = await auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            console.log('Email updated!');
          })
          .catch((error) => {
            toast.error(error);
          });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!previousPassword) {
      return toast.error('Введите ваш пароль!');
    }
    if (previousPassword && firstName && lastName) {
      const { user } = await changeUserData(
        previousPassword,
        firstName,
        lastName
      );
      if (user) {
        setUser(user);
        setActive('home');
      }
    } else if (password && previousPassword) {
      const { user } = await changePassword(previousPassword, password);
      if (user) {
        setUser(user);
        setActive('home');
      }
    } else if (previousPassword && email) {
      const { user } = await changeEmail(previousPassword, email);
      if (user) {
        setUser(user);
        setActive('home');
      }
    } else {
      return toast.error('Все поля должны быть заполнены');
    }

    navigate('/');
  };

  return (
    <div className='container-fluid mb-4'>
      <div className='container'>
        <div className='col-12'>
          <div className='text-center heading py-2'>
            Редактирование данных пользователя
          </div>
        </div>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-10 col-md-8 col-lg-6'>
            <form className='row blog-form' onSubmit={handleEditProfile}>
              <div className='col-12 py-3'>
                <input
                  type='text'
                  className='form-control input-text-box'
                  placeholder='Имя'
                  name='firstName'
                  value={firstName}
                  onChange={handleChange}
                />
              </div>

              <div className='col-12 py-3'>
                <input
                  type='text'
                  className='form-control input-text-box'
                  placeholder='Фамилия'
                  name='lastName'
                  value={lastName}
                  onChange={handleChange}
                />
              </div>

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
                  placeholder='Старый пароль'
                  name='previousPassword'
                  value={previousPassword}
                  onChange={handleChange}
                />
              </div>

              <div className='col-12 py-3'>
                <input
                  type='password'
                  className='form-control input-text-box'
                  placeholder='Новый пароль'
                  name='password'
                  value={password}
                  onChange={handleChange}
                />
              </div>

              <div className='col-12 py-3 text-center'>
                <button className='btn btn-add' type='submit'>
                  Редактировать
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
