import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDyieytBtqItqlRLPqTM7lza3-FuNFw4zE",
  authDomain: "primeiraonda-ecommerce.firebaseapp.com",
  projectId: "primeiraonda-ecommerce",
  storageBucket: "primeiraonda-ecommerce.appspot.com",
  messagingSenderId: "530368090023",
  appId: "1:530368090023:web:c344a6641d95ea63f53082",
  measurementId: "G-26DN9FBM7Y"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();