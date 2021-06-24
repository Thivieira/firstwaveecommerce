import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDyieytBtqItqlRLPqTM7lza3-FuNFw4zE",
  authDomain: "primeiraonda-ecommerce.firebaseapp.com",
  projectId: "primeiraonda-ecommerce",
  storageBucket: "primeiraonda-ecommerce.appspot.com",
  messagingSenderId: "530368090023",
  appId: "1:530368090023:web:c344a6641d95ea63f53082",
  measurementId: "G-26DN9FBM7Y"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth()
const database = firebase.database()

export { firebase, auth, database }
