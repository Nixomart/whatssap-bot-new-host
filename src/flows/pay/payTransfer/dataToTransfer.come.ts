import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

import menuFlow from "../../menu.flow.js";
import { updateFirebaseData } from "../../../fuctions/updateFirebaseData.js";
import { doc, updateDoc } from "firebase/firestore";
import listPaymentMethods from "../listPaymentMethods.js";
import dayjs from "dayjs";
import { db } from "~/firebase/firebase.js";
export default addKeyword<Provider, Database>(utils.setEvent("DATA_TOTRANSFER_COME")).addAction(
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const statuscome = state.getMyState().statuscome;
    const turnoNew = state.getMyState().turnoNew;
    
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow);
    }
    if (ctx.body.toLowerCase() == "estoy seguro") {
      const docRef = doc(db, "consults", medicData.uid);
      const turnsUpdated = dataUpdated.turns.map((turn) => {
        if (turn.id === turnoNew.id) {
          return {
            ...turn,
            paymentMethod: state.getMyState().paymentChooseBeforeSave,
            imageConfirmation: null,
            status:"TRANSFER_CUSTOMER_NO",
            create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss")
          };
        }
        return turn;
      });
      const dataTransfer = state
        .getMyState()
        .medic.paymentMethods.find((pay) => pay.id === "3");
      await updateDoc(docRef, {
        turns: turnsUpdated,
      }).then(async() => {
        return await flowDynamic([
          {
            body: `Bien. Aquí tienes los datos para realizar la transferencia al especialista:\n\n💳 CBU: ${dataTransfer.cbu}\n🏷️ ALIAS: ${dataTransfer.alias}\n👤 NOMBRE: ${dataTransfer.name}\n\n💰 VALOR DE LA CONSULTA: *${turnoNew.price}*\n\nPor favor, envía una foto de la transferencia siguiendo el ejemplo proporcionado.`,
            media:
              "https://firebasestorage.googleapis.com/v0/b/calendar-dashboard-df06c.appspot.com/o/default%2FHeading.png?alt=media&token=4714f1cb-274a-4cc9-b6ad-5af9caa2f364",
          },
          {
            body: "*SOLO TIENES UN INTENTO PARA ENVIAR LA IMAGEN*",
          },
        ]);
      });
    }
    if (ctx.body.toLowerCase() == "pagar") {
      return gotoFlow(listPaymentMethods);
    }
    if (ctx.body.toLowerCase() == "menu" || ctx.body.toLowerCase() == "men") {
      return gotoFlow(menuFlow);
    }
  }
);
