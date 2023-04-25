import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import { excerpt, cutTegs } from '../utility';

const BlogSection = ({
  id,
  title,
  description,
  category,
  imgUrl,
  userId,
  timestamp,
  user,
  handleDelete,
}) => {
  return (
    <div>
      <div className='row pb-4' key={id}>
        <div className='col-md-5'>
          <div className='hover-blogs-img'>
            <div className='blogs-img'>
              <img src={imgUrl} alt={title} />
            </div>
          </div>
        </div>
        <div className='col-md-7'>
          <div className='text-start'>
            <span className='title py-2'>{title}</span>
            <span className='meta-info'>
              {timestamp.toDate().toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className='short-description text-start'>
            {excerpt(cutTegs(description), 250)}
          </div>
          <Link to={`/detail/${id}`}>
            <button className='btn btn-read'>Подробнее</button>
          </Link>
          {user && user.uid === userId && (
            <div style={{ float: 'right' }}>
              <FontAwesome
                name='trash'
                style={{ margin: '15px', cursor: 'pointer' }}
                size='2x'
                onClick={() => handleDelete(id)}
              />
              <Link to={`/update/${id}`}>
                <FontAwesome
                  name='edit'
                  style={{ cursor: 'pointer' }}
                  size='2x'
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
