import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { updateFirebaseData } from "../../../fuctions/updateFirebaseData.js";
import messageConfirmSave from "./messageConfirmSave.js";
import getInformationOsSave from "./getInformationOsSave.js";
import seeKindOfPayments from "../seeKindOfPayments.js";
import { verifyTurns } from "../../../fuctions/verifyTurns.js";
import giveQueryTypesSingle from "../giveQueryTypesSingle.js";
import dayjs from "dayjs";
import menuFlow from "../../menu.flow.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";
export default addKeyword<Provider, Database>(utils.setEvent("CONFIRMTURN_SAVE_OS")).addAction(
  { capture: true },
  async (ctx, { state, endFlow, gotoFlow, flowDynamic }) => {
    console.log("ENTRA A GUARDAR TURNO");
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const customer = state.getMyState().patientFound;
    const turnoNew = state.getMyState().turnoNew
    if (ctx.body == "pagar") {
      return gotoFlow(seeKindOfPayments);
    }
    if (ctx.body == "estoy seguro") {
      console.log("ENTRA ACA GUARDAR TURNO NUEVO OS");
      const isAvailable = verifyTurns(
        medicData.hourChoosenTofirebase,
        dayjs(medicData.hourChoosenTofirebase)
          .add(medicData.minutes, "minute")
          .format("YYYY-MM-DDTHH:mm:ss"),
        medicData.uid
      );
      if (isAvailable) {
        const docRef = doc(db, "consults", medicData.uid);
        if (customer.patientFound === false) {
          const idReserva = state.getMyState().idReservacion
          await updateDoc(docRef, {
            turns: arrayUnion({...turnoNew, status: "OS_CUSTOMER_YES", idReserva:idReserva, create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"), specialist: medicData.name}),
            customers: arrayUnion({...customer, os_name: turnoNew.os_name, os_number: turnoNew.os_number, observation:[], cancell: 0, ban:false, phone: ctx.from}),
          }).then(() => {
            console.log("SE GUARDO");
            return endFlow(`tu turno se guardo, ahora espera a que el especialista confirme\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`);
          });
        } else {
          const nuevoCustomer = dataUpdated.customers.map((cus) => {
            if (cus.id === customer.id) {
              return {...customer, os_name: turnoNew.os_name, os_number: turnoNew.os_number};
            }
            return cus;
          });
          const idReserva = state.getMyState().idReservacion
          return await updateDoc(docRef, {
            turns: arrayUnion({...turnoNew, status: "OS_CUSTOMER_YES", idReserva: idReserva , create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"), specialist: medicData.name}),
            customers: nuevoCustomer,
          }).then(() => {
            return endFlow(`tu turno se guardo, ahora espera a que el especialista confirme tu turno\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`);
          });
        }
      } else {
          await flowDynamic(
            "El turno ya fue ocupado. Te pedimos que porfavor que eligas otro horario"
          )
          return gotoFlow(giveQueryTypesSingle)
      }
    }
    if (ctx.body == "datos" || ctx.body == "dato") {
      return gotoFlow(getInformationOsSave);
    }
    if (ctx.body == "menu" || ctx.body == "men") {
      return gotoFlow(menuFlow);
    }
  }
);
