import dayjs from "dayjs";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import fs from "fs";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { File } from "buffer";
import firebaseApp, { db } from "~/firebase/firebase";
export const saveInFirebaseTurn = async (medicData, localPath:string, id) => {
  fs.readFile(localPath, async (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return;
    }
    const storage = getStorage(firebaseApp);
    const docRef = doc(db, "consults", medicData.uid);
    const file = new File([data], "image.jpeg", { type: "image/jpeg" });
    const fileRef = ref(
      storage,
      `${medicData.uid}/turnos/paymentConfirmation/${id}`
    );

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    const turnsToUpdate = medicData.turns.map((turn) => {
      if (turn.id === id) {
        return {
          ...turn,  
          imageConfirmation: downloadURL,
          status: "TRANSFER_CUSTOMER_YES",
          payment: dayjs().format("YYYY-MM-DDTHH:mm:ss")
        };
      } else {
        return turn;
      }
    });
    await updateDoc(docRef, {
      turns: turnsToUpdate,
    }).then(() => {
      const archivoAEliminar = localPath;
      fs.access(archivoAEliminar, fs.constants.F_OK, (err) => {
        if (err) {
          console.error("El archivo no existe");
          return;
        }

        // El archivo existe, así que intentamos eliminarlo
        fs.unlink(archivoAEliminar, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo:", err);
            return;
          }
          console.log("El archivo ha sido eliminado exitosamente");
        });
      });
    });
  });
};
