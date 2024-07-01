import GetInformationOS from "./getInformationOS.js";
import messageConfirm from "./messageConfirm.js";
import listPaymentMethods from "../listPaymentMethods.js";
import { doc, updateDoc } from "firebase/firestore";
import { updateFirebaseData } from "../../../fuctions/updateFirebaseData.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import dayjs from "dayjs";
import menuFlow from "~/flows/menu.flow.js";
import { db } from "~/firebase/firebase.js";

export default addKeyword<Provider, Database>(utils.setEvent("ISAGREE_TOSAVE_OSPAYMENT")).addAction(
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic, endFlow }) => {
    const medicData = state.getMyState().medic;
    const datanueva = await updateFirebaseData(medicData.uid);
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow);
    }
    if (ctx.body.toLowerCase() == "pagar") {
      return gotoFlow(listPaymentMethods);
    }
    if (ctx.body.toLowerCase() == "datos" || ctx.body.toLowerCase() == "dato") {
      return gotoFlow(GetInformationOS);
    }
    if (ctx.body.toLowerCase() == "estoy seguro") {
      /* GUARDARRRR */
      const docRef = doc(db, "consults", medicData.uid);
      const turnoupdated = state.getMyState().turnoChoosen;
      const statuscome = state.getMyState().statuscome;
      const turnsUpdated = datanueva.turns.map((turn) => {
        if (turn.id === turnoupdated.id) {
          return {
            ...turn,
            paymentMethod: state.getMyState().paymentChooseBeforeSave,
            os_name: turnoupdated.os_name,
            os_number: turnoupdated.os_number,
            confirmed: true,
            create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
            status:
              statuscome == "ALLP_MEDIC_NO" ||
              statuscome == "PRESENTIAL_MEDIC_YES" ||
              statuscome == "OS_MEDIC_NO"
                ? "TURNO_CUSTOMER_CONFIRMED"
                : "OS_CUSTOMER_YES",
          };
        }
        return turn;
      });
      const customers = datanueva.customers.map((customer) => {
        if (customer.phone === ctx.from) {
          return {
            ...customer,
            os_name: turnoupdated.os_name,
            os_number: turnoupdated.os_number,
          };
        }
        return customer;
      });
      return await updateDoc(docRef, {
        turns: turnsUpdated,
        customers: customers,
      }).then(() => {
        return endFlow(
          ` ${
            statuscome == "ALLP_MEDIC_NO" ||
            statuscome == "PRESENTIAL_MEDIC_YES" ||
            statuscome == "OS_MEDIC_NO"
              ? `Tu turno se guardo, Haz confirmado el turno\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
              : `tu turno se guardo, ahora espera a que el especialista confirme tu turno\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
          }`
        );
      });
    }
  }
);
