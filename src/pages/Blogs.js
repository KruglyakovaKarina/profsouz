import {
  collection,
  endAt,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import BlogSection from '../components/BlogSection';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import Footer from '../components/Footer';

const Blogs = ({ setActive }) => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [noOfPages, setNoOfPages] = useState(null);
  const [count, setCount] = useState(null);

  useEffect(() => {
    getBlogsData();
    getTotalBlogs();
    setActive('blogs');
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const getBlogsData = async () => {
    setLoading(true);
    const blogRef = collection(db, 'blogs');
    const first = query(blogRef, orderBy('timestamp', 'desc'), limit(6));
    const docSnapshot = await getDocs(first);
    setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setCount(docSnapshot.size);
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    setLoading(false);
  };

  const getTotalBlogs = async () => {
    const blogRef = collection(db, 'blogs');
    const docSnapshot = await getDocs(blogRef);
    const totalBlogs = docSnapshot.size;
    const totalPage = Math.ceil(totalBlogs / 6);
    setNoOfPages(totalPage);
  };

  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, 'blogs');
    const nextBlogsQuery = query(
      blogRef,
      orderBy('title'),
      startAfter(lastVisible),
      limit(6)
    );
    const nextBlogsSnaphot = await getDocs(nextBlogsQuery);
    setBlogs(
      nextBlogsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setCount(nextBlogsSnaphot.size);
    setLastVisible(nextBlogsSnaphot.docs[nextBlogsSnaphot.docs.length - 1]);
    setLoading(false);
  };
  const fetchPrev = async () => {
    setLoading(true);
    const blogRef = collection(db, 'blogs');
    const end =
      noOfPages !== currentPage ? endAt(lastVisible) : endBefore(lastVisible);
    const limitData =
      noOfPages !== currentPage
        ? limit(6)
        : count <= 6 && noOfPages % 2 === 0
        ? limit(6)
        : limitToLast(6);
    const prevBlogsQuery = query(blogRef, orderBy('title'), end, limitData);
    const prevBlogsSnaphot = await getDocs(prevBlogsQuery);
    setBlogs(
      prevBlogsSnaphot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setCount(prevBlogsSnaphot.size);
    setLastVisible(prevBlogsSnaphot.docs[prevBlogsSnaphot.docs.length - 1]);
    setLoading(false);
  };

  const handlePageChange = (value) => {
    if (value === 'Вперед') {
      setCurrentPage((page) => page + 1);
      fetchMore();
    } else if (value === 'Назад') {
      setCurrentPage((page) => page - 1);
      fetchPrev();
    }
  };
  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='blog-heading text-center py-2 mb-4'>Новости</div>
          {blogs?.map((blog) => (
            <div className='col-md-6' key={blog.id}>
              <BlogSection {...blog} />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          noOfPages={noOfPages}
          handlePageChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
