const firebaseConfig = {
  apiKey: "AIzaSyC5hxq4G0Tu4_IuT1KCQWtywxVvjVib7YM",
  authDomain: "codelux-academy.firebaseapp.com",
  projectId: "codelux-academy",
  storageBucket: "codelux-academy.firebasestorage.app",
  messagingSenderId: "1067879315679",
  appId: "1:1067879315679:web:b275be6fc2831a34b1d16a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
