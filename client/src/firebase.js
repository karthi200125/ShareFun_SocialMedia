import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFN_1uUdNqOYZj_TqbcJX-9F7gaEWPZlk",
  authDomain: "socialmedia-60f73.firebaseapp.com",
  projectId: "socialmedia-60f73",
  storageBucket: "socialmedia-60f73.appspot.com",
  messagingSenderId: "271154174839",
  appId: "1:271154174839:web:ab5bfe85caf7d5dd5f9f72"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export {storage}
export default app;