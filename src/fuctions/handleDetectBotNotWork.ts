import { doc, getDoc, updateDoc } from "firebase/firestore";
import { findContainerName } from "./findContainerName.js";
import axios from "axios";
import { db } from "~/firebase/firebase.js";

export const handleDetectBotNotWork  = async () => {
  const url = "https://whatssapbot.online"
  try {
    const id = await findContainerName();
    const docRef = doc(db, "consults", "qeqwe");
    console.log("EXISTE DOCUMENTO: ", (await getDoc(docRef)).exists);
    const data = (await getDoc(docRef)).data()
    updateDoc(docRef, {
      ownBot: false,
    }).then(()=>{
      axios.post(`${url}/sendBotNotWork`, { phone: data.phone });  
    });
  } catch (error) {
    console.log("OCURRIO UN ERROR AL ENVIAR BOT NOT WORK: ", error);
  }
  
};
