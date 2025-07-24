// composables/useFirebase.ts
import { useNuxtApp } from "#app";
export default () => {
  const { $auth, $firestore } = useNuxtApp();
  const auth = $auth;
  const firestore = $firestore;
  if (!auth || !firestore) {
    console.warn("Firebase not properly injected");
  }
  return { auth, firestore };
};
