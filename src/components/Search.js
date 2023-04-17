import React from 'react';
import { useNavigate } from 'react-router-dom';

const Search = ({ search, handleChange }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      navigate(`/search?searchQuery=${search}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <form className='form-inline' onSubmit={handleSubmit}>
        <div className='col-12 py-3 mt-4'>
          <input
            type='text'
            value={search}
            className='form-control search-input'
            placeholder='Поиск'
            onChange={handleChange}
          />
        </div>
        &nbsp;&nbsp;
        <button className='btn btn-secondary search-btn mt-4'>
          <i className='fa fa-search' />
        </button>
      </form>
    </div>
  );
};

export default Search;
