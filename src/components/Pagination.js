import React from 'react';

const Pagination = ({ currentPage, handlePageChange, noOfPages }) => {
  return (
    <div>
      <div className='row mx-0'>
        <div className='col-12 text-center pb-4 pt-4 '>
          <button
            className='btn_mange_pagging'
            disabled={currentPage === 1}
            onClick={() => handlePageChange('Назад')}
          >
            <i className='fa fa-long-arrow-left'></i>&nbsp;&nbsp;Назад
          </button>
          <span className='btn_pagging'>{currentPage}</span>
          <button
            className='btn_mange_pagging'
            disabled={currentPage === noOfPages}
            onClick={() => handlePageChange('Вперед')}
          >
            Вперед <i className='fa fa-long-arrow-right'></i>&nbsp;&nbsp;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
