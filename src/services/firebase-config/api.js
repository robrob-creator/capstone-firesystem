import firebase from 'firebase';
import 'firebase/analytics';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAmL8pELPzpOJSmxQVFjk4G7mgpNbAEl-Q',
  authDomain: 'fire-alarm-system-ab525.firebaseapp.com',
  databaseURL: 'https://fire-alarm-system-ab525-default-rtdb.firebaseio.com',
  projectId: 'fire-alarm-system-ab525',
  storageBucket: 'fire-alarm-system-ab525.appspot.com',
  messagingSenderId: '561108511477',
  appId: '1:561108511477:web:f7fac750dd0cb3bd2473bc',
  measurementId: 'G-1Y0ZTJ69WK',
};
const fire = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default fire;
