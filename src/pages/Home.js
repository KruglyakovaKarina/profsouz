import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import BlogSection from '../components/BlogSection';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import FeatureBlogs from '../components/FeatureBlogs';
import Trending from '../components/Trending';
import Search from '../components/Search';
import { isEmpty, isNull } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import Category from '../components/Category';
import Footer from '../components/Footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  const searchQuery = queryString.get('searchQuery');
  const location = useLocation();
  const navigate = useNavigate();

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, 'blogs');
    const trendQuery = query(blogRef, where('trending', '==', 'yes'));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data() });
    });
    setTrendBlogs(trendBlogs);
  };

  useEffect(() => {
    getTrendingBlogs();
    setSearch('');
    const unsub = onSnapshot(
      collection(db, 'blogs'),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get('tags'));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setTotalBlogs(list);
        // setBlogs(list);
        setLoading(false);
        setActive('home');
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
      getTrendingBlogs();
    };
  }, [setActive, active]);

  useEffect(() => {
    getBlogs();
    setHide(false);
  }, [active]);

  const getBlogs = async () => {
    const blogRef = collection(db, 'blogs');
    const firstFour = query(blogRef, orderBy('timestamp', 'desc'), limit(4));
    const docSnapshot = await getDocs(firstFour);
    setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const blogsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs((blogs) => [...blogs, ...blogsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info('Больше нет постов');
      setHide(true);
    }
  };

  const fetchMore = async () => {
    const blogRef = collection(db, 'blogs');
    const nextFour = query(
      blogRef,
      orderBy('timestamp', 'desc'),
      limit(4),
      startAfter(lastVisible)
    );
    const docSnapshot = await getDocs(nextFour);
    updateState(docSnapshot);
  };

  const searchBlogs = async () => {
    const blogRef = collection(db, 'blogs');
    const searchTagQuery = query(
      blogRef,
      where('tags', 'array-contains', searchQuery)
    );
    const tagSnapshot = await getDocs(searchTagQuery);

    const blogs = await getDocs(blogRef);
    let titleSnapshot = [];

    blogs.forEach((blog) => {
      if (
        blog.data().title.toLowerCase().indexOf(searchQuery.toLowerCase()) !==
        -1
      ) {
        console.log('push', blog.data());
        titleSnapshot.push(blog);
      }
    });

    let searchTitleBlogs = [];
    let searchTagBlogs = [];
    titleSnapshot?.forEach((doc) => {
      searchTitleBlogs.push({ id: doc.id, ...doc.data() });
    });
    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({ id: doc.id, ...doc.data() });
    });
    const combinedSearchBlogs = searchTitleBlogs.concat(searchTagBlogs);
    setBlogs(combinedSearchBlogs);
    setHide(true);
    setActive('');
  };

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchBlogs();
    }
  }, [searchQuery]);

  if (loading) {
    return <Spinner />;
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост ?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        setTimeout(() => document.location.reload(), 500);
        toast.success('Пост удален');
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      getBlogs();
      setHide(false);
    }
    setSearch(value);
  };

  // category count
  const counts = totalBlogs.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }
    prevValue[name]++;
    // delete prevValue["undefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k],
    };
  });

  return (
    <div className='home'>
      <div className='container-fluid pb-4 pt-4 padding'>
        <div className='container padding'>
          <div className='row mx-0'>
            <Trending blogs={trendBlogs} />
            <div className='col-md-8'>
              <div className='blog-heading text-start py-2 mt-4 mb-4'>
                Новости
              </div>
              {blogs.length === 0 && location.pathname !== '/' && (
                <>
                  <h4>Ничего не найдено по запросу: {searchQuery}</h4>
                </>
              )}
              {blogs?.map((blog) => (
                <BlogSection
                  key={blog.id}
                  user={user}
                  handleDelete={handleDelete}
                  {...blog}
                />
              ))}

              {!hide && (
                <button
                  style={{
                    background: '#1f469d',
                    border: '#1f469d',
                  }}
                  className='btn btn-primary'
                  onClick={fetchMore}
                >
                  Загрузить еще
                </button>
              )}
            </div>
            <div className='col-md-4 column2'>
              <Search search={search} handleChange={handleChange} />

              <FeatureBlogs title={'Недавние посты'} blogs={blogs} />
              <Category catgBlogsCount={categoryCount} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
