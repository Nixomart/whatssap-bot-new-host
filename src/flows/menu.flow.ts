import { addKeyword, utils } from "@builderbot/bot";
import welcomeFlow from "./welcome.flow.js";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "~/firebase/firebase.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("MENU_FLOW")).addAction(
  async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
      const medicDataa = state.getMyState().medic
    if (state.getMyState() != undefined) {
      const docRef = doc(db, "consults", medicDataa.uid)
      const data = (await getDoc(docRef)).data()
      await state.update({medic: data})
      const medicData = state.getMyState().medic;
        await flowDynamic(
          `*¡Hola! soy el asistente de ${medicData.name}* 🌟\n${medicData.about} 😊 \n\nSi quieres *registrar un turno* o *ver tu turno*. Escribe *si quiero*.\n\nSi quieres cancelar un turno. Escribe *cancelar*.\n\nPara cambiar la fecha de un turno. Escribe *editar*\n\nPara ver los horarios del especialista. Escribe *horarios*\n\nPara saber los tipos de turnos del especialista. Escribe *turnos*\n\nEstoy aquí para facilitarte el proceso! 📅👨‍⚕️ ¡Adelante! 🌈`
        )
        return gotoFlow(welcomeFlow)
    } else {
      return endFlow(
        "*¡Atención!* ⚠️\nCarácter incorrecto. Por favor, utiliza solo letras al buscar un médico. 📝🚫\nEstamos en el proceso de encontrar un médico. Inténtalo de nuevo. 👨‍⚕️🔍"
      );
    }
  }
);
