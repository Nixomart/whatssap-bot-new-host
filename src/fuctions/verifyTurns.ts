import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebase/firebase";

export const verifyTurns = async (start, end, idDocument) =>{
    const docRef = doc(db, "consults", idDocument)
    const docSnap = await getDoc(docRef)
    const data = docSnap.data()
    const startTime = new Date(start);
    const endTime = new Date(end);
    for (const turno of data.turns) {
        const turnoStart = new Date(turno.start);
        const turnoEnd = new Date(turno.end);
    
        // Verificar si hay solapamiento
        if (
          (startTime >= turnoStart && startTime < turnoEnd) || // Verificar si el inicio del nuevo turno está dentro de uno existente
          (endTime > turnoStart && endTime <= turnoEnd) || // Verificar si el final del nuevo turno está dentro de uno existente
          (startTime <= turnoStart && endTime >= turnoEnd) // Verificar si el nuevo turno engloba completamente uno existente
        ) {
          // Si hay solapamiento, el horario no está disponible
          return false;
        }
      }
    
      // Si no se encontraron solapamientos, el horario está disponible
      return true;
}