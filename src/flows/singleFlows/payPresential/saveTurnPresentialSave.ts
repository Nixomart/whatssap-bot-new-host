import seeKindOfPayments from "../seeKindOfPayments.js";
import menuFlow from "../../menu.flow.js";
import giveQueryTypesSingle from "../giveQueryTypesSingle.js";
import { updateFirebaseData } from "../../../fuctions/updateFirebaseData.js";
import { verifyTurns } from "../../../fuctions/verifyTurns.js";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";
export default addKeyword<Provider, Database>(utils.setEvent("SAVETURN_PRESENTIAL_SAVE")).addAction({capture: true},
  async (ctx, { state, fallBack, gotoFlow, flowDynamic, endFlow }) => {
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const customer = state.getMyState().patientFound;
    const turnoNew = state.getMyState().turnoNew;
    const precio = state.getMyState().price;
    if (ctx.body == "estoy seguro") {
      const isAvailable = verifyTurns(
        medicData.hourChoosenTofirebase,
        dayjs(medicData.hourChoosenTofirebase)
          .add(medicData.minutes, "minute")
          .format("YYYY-MM-DDTHH:mm:ss"),
        medicData.uid
      );

      if (isAvailable) {
        const idReserva = state.getMyState().idReservacion;

        const docRef = doc(db, "consults", medicData.uid);
        if (customer.patientFound === false) {
          await updateDoc(docRef, {
            turns: arrayUnion({...turnoNew, status: "PRESENTIAL_CUSTOMER_YES", idReserva: idReserva, create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"), specialist: medicData.name}),
            customers: arrayUnion({...customer, observation:[], cancell: 0, ban:false, phone: ctx.from, os_name: null, os_number: null}),
          }).then(() => {
            return endFlow(`tu turno se guardo, ahora espera a que el especialista confirme el turno\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`);
          });
        } else {
          const nuevoCustomer = dataUpdated.customers.map((cus) => {
            if (cus.id === customer.id) {
              return customer;
            }
            return cus;
          });
          return await updateDoc(docRef, {
            turns: arrayUnion({...turnoNew, status: "PRESENTIAL_CUSTOMER_YES", idReserva:idReserva, create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"), specialist: medicData.name }),
            customers: nuevoCustomer,
          }).then(() => {
            return endFlow(
              `Tu turno Fue guardado con exito!. Ahora te toca esperar la confirmacion del turno de parte del especialista, el precio del turno es ${precio}\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
            );
          });
        }
      } else {
          await flowDynamic(
            `El turno ya fue ocupado. Te pedimos que porfavor que eligas otro horario\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
          )
          return gotoFlow(giveQueryTypesSingle)
      }
    }
    if (ctx.body == "pagar") {
      return gotoFlow(seeKindOfPayments);
    }
    if (ctx.body == "menu" || ctx.body == "men") {
      return gotoFlow(menuFlow);
    }
  }
);