import React, { useState, useEffect } from 'react';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import { db, storage } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

const initialState = {
  title: '',
  tags: [],
  trending: 'no',
  category: '',
  description: '',
  comments: [],
  likes: [],
};

const categoryOption = [
  'Новости',
  'Мероприятия',
  'Опросы',
  'Полезная информация',
  'Спорт',
  'Туризм',
  'Театры и концерты',
  'Профилактика и оздоровление',
  'Охрана труда и здоровья',
];

const AddEditBlog = ({ user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const { title, tags, category, trending, description } = form;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Загрузилось ' + progress + '% ');
          setProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('Загрузка остановлена');
              break;
            case 'running':
              console.log('Идет загрузка');
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info('Файл загружен');
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    };

    file && uploadFile();
  }, [file]);

  useEffect(() => {
    id && getBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, 'blogs', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
    setActive(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (tags) => {
    setForm((prevState) => {
      return { ...prevState, tags };
    });
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags && title && description && trending) {
      if (!id) {
        try {
          await addDoc(collection(db, 'blogs'), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success('Пост создан');
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await updateDoc(doc(db, 'blogs', id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success('Пост изменен');
        } catch (err) {
          console.log(err);
        }
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
            {id ? 'Редактирование поста' : 'Создание поста'}
          </div>
        </div>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-10 col-md-8 col-lg-6'>
            <form className='row blog-form' onSubmit={handleSubmit}>
              <div className='col-12 py-3'>
                <input
                  type='text'
                  className='form-control input-text-box'
                  placeholder='Заголовок'
                  name='title'
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className='col-12 py-3'>
                <ReactTagInput
                  tags={tags}
                  placeholder='Теги'
                  onChange={handleTags}
                />
              </div>
              <div className='col-12 py-3'>
                <p className='trending'>Это актуальный пост ?</p>
                <div className='form-check-inline mx-2'>
                  <input
                    type='radio'
                    className='form-check-input'
                    value='yes'
                    name='radioOption'
                    checked={trending === 'yes'}
                    onChange={handleTrending}
                  />
                  <label htmlFor='radioOption' className='form-check-label'>
                    Да&nbsp;&nbsp;&nbsp;
                  </label>
                  <input
                    type='radio'
                    className='form-check-input'
                    value='no'
                    name='radioOption'
                    checked={trending === 'no'}
                    onChange={handleTrending}
                  />
                  <label htmlFor='radioOption' className='form-check-label'>
                    Нет
                  </label>
                </div>
              </div>
              <div className='col-12 py-3'>
                <select
                  value={category}
                  onChange={onCategoryChange}
                  className='catg-dropdown'
                >
                  <option>Выберите категорию</option>
                  {categoryOption.map((option, index) => (
                    <option value={option || ''} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-12 py-3'>
                <textarea
                  className='form-control description-box'
                  placeholder='Описание'
                  value={description}
                  name='description'
                  onChange={handleChange}
                />
              </div>
              <div className='mb-3'>
                <input
                  type='file'
                  className='form-control'
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className='col-12 py-3 text-center'>
                <button
                  className='btn btn-add'
                  type='submit'
                  disabled={progress !== null && progress < 100}
                >
                  {id ? 'Редактировать' : 'Опубликовать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditBlog;
