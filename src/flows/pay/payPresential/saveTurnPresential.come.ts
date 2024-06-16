/* eslint-disable no-prototype-builtins */
import menuFlow from "../../menu.flow.js";
import { updateFirebaseData } from "../../../fuctions/updateFirebaseData.js";
import { doc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";
import listPaymentMethods from "../listPaymentMethods.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";

export default addKeyword<Provider, Database>(utils.setEvent("SAVETURN_PRESENTIAL_COME")).addAction(
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic, endFlow }) => {
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const turnoNew = state.getMyState().turnoNew;
    const precio = state.getMyState().price;
    const statuscome = state.getMyState().statuscome
    console.log("ENTRA A PRESENTIAL COME ", ctx.body);
    if (ctx.body == "menu") {
      return gotoFlow(menuFlow);
    }
    if (ctx.body == "estoy seguro") {
      const docRef = doc(db, "consults", medicData.uid);
      const turnsUpdated = dataUpdated.turns.map((turn) => {
        if (turn.id === turnoNew.id) {
          return {
            ...turn,
            paymentMethod: state.getMyState().paymentChooseBeforeSave,
            imageConfirmation: null,
            create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            confirmed: true,
            status:
              statuscome == "ALLP_MEDIC_NO" ||
              statuscome == "PRESENTIAL_MEDIC_YES" ||
              statuscome == "OS_MEDIC_NO" 
                ? "TURNO_CUSTOMER_CONFIRMED"
                : "PRESENTIAL_CUSTOMER_YES",
          };
        }
        return turn;
      });
      return await updateDoc(docRef, {
        turns: turnsUpdated,
      }).then(() => {
        return endFlow(
          `Tu turno Fue guardado con exito!. ${
            turnoNew.hasOwnProperty("me")
              ? `*Haz confirmado el turno* \n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
              : `Ahora te toca esperar la confirmacion del turno de parte del medico, el precio del turno es ${turnoNew.price}\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
          }`
        );
      });
    }
    if (ctx.body == "pagar") {
      return gotoFlow(listPaymentMethods);
    }
    if (ctx.body == "menu" || ctx.body == "men") {
      return gotoFlow(menuFlow);
    }
  }
);
