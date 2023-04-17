import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDUX5_A9GkorWdbpWa5QmfqqAsfNNUvqkk',
  authDomain: 'react-trade-union.firebaseapp.com',
  projectId: 'react-trade-union',
  storageBucket: 'react-trade-union.appspot.com',
  messagingSenderId: '373861221730',
  appId: '1:373861221730:web:c6a49758dab57cb7bb583b',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
