import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDRkgKJJZYmvDn_QqsROxczIQ54KdKRfd8',
  authDomain: 'profsouzvtb.firebaseapp.com',
  projectId: 'profsouzvtb',
  storageBucket: 'profsouzvtb.appspot.com',
  messagingSenderId: '819303435537',
  appId: '1:819303435537:web:08242ac38050f131db90b0',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
