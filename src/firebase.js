import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaJF7kyY-lVBm6abiAcrDvORIhs4kA2fw",
  authDomain: "module-2-project-b8e95.firebaseapp.com",
  projectId: "module-2-project-b8e95",
  storageBucket: "module-2-project-b8e95.appspot.com",
  messagingSenderId: "448711661475",
  appId: "1:448711661475:web:e00eb0d8cbc3727236ac16",
  measurementId: "G-41WVPQKPB4"
};

const app = initializeApp(firebaseConfig);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  return await signInWithPopup(auth, provider);
};

export const loginWithGithub = async () => {
  const githubProvider = new GithubAuthProvider();
  const auth = getAuth(app);
  return await signInWithPopup(auth, githubProvider);
};

export const linkGithubWithGoogle = async () => {
  let provider = new GithubAuthProvider();
  const auth = getAuth();
  let current = auth.currentUser;
  return await linkWithPopup(current, provider);
};

export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const auth = getAuth(app);
  return await signInWithPopup(auth, provider);
};

export const linkFacebookWithGoogle = async () => {
  let provider = new FacebookAuthProvider();
  const auth = getAuth();
  let current = auth.currentUser;
  return await linkWithPopup(current, provider);
};

export async function uploadToFirebase(
  file,
  fallBackUrl = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
) {
  try {
    const storage = getStorage(app);
    const fileNameRef = ref(
      storage,
      `avatar/image_${Date.now() * Math.random()}.${
        file.name.split(".")[file.name.split(".").length - 1]
      }`
    );
    let result = await uploadBytes(fileNameRef, file);
    let url = await getDownloadURL(result.ref);
    return url;
  } catch (err) {
    console.log(err);
    return fallBackUrl;
  }
}
