import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommentBox = ({ userId, userComment, setUserComment, handleComment }) => {
  const navigate = useNavigate();
  return (
    <>
      {!userId ? (
        <>
          <br></br>
          <h5>
            Пожалуйста войдите в аккаунт или зарегистрируйтесь, чтобы оставить
            комментарий
          </h5>
          <br></br>
          <button
            className='btn btn-success'
            style={{
              background: '#1f469d',
              border: '#1f469d',
            }}
            onClick={() => navigate('/auth')}
          >
            Войти
          </button>
        </>
      ) : (
        <>
          <form className='row blog-form'>
            <div className='col-12 py-3'>
              <textarea
                rows='4'
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className='form-control description'
              />
            </div>
          </form>
          <button
            className='btn btn-primary'
            type='submit'
            onClick={handleComment}
            style={{
              background: '#1f469d',
              border: '#1f469d',
            }}
          >
            Опубликовать комментарий
          </button>
        </>
      )}
    </>
  );
};

export default CommentBox;
