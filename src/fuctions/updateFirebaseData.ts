import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebase/firebase";

export const updateFirebaseData = async (id) => {
  const docRef = doc(db, "consults", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
  }
};
