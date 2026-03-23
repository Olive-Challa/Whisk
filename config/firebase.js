import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmYkXNmq6Qany8VAaoJFw0TPZh234xvdo",
  authDomain: "whisk-app-c08f3.firebaseapp.com",
  projectId: "whisk-app-c08f3",
  storageBucket: "whisk-app-c08f3.firebasestorage.app",
  messagingSenderId: "158463614173",
  appId: "1:158463614173:web:708134417a28bd3ea8cf34"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);