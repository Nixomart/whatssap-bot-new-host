/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { updateFirebaseData } from "../../../fuctions/updateFirebaseData.js";
import messageConfirmSave from "./messageConfirmSave.js";
import seeKindOfPayments from "../seeKindOfPayments.js";
import { verifyTurns } from "../../../fuctions/verifyTurns.js";
import giveQueryTypesSingle from "../giveQueryTypesSingle.js";
import dayjs from "dayjs";
import menuFlow from "../../menu.flow.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";
import getInformationOsSave from "./getInformationOsSave.js";
export default addKeyword<Provider, Database>(
  utils.setEvent("CONFIRMTURN_SAVE_OS")
).addAction(
  { capture: true },
  async (ctx, { state, endFlow, gotoFlow, flowDynamic }) => {
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const customer = state.getMyState().patientFound;
    const turnoNew = state.getMyState().turnoNew;
    switch (ctx.body.toLowerCase()) {
      case "menu":
        return gotoFlow(menuFlow);
      case "pagar":
        return gotoFlow(seeKindOfPayments);
      case "datos":
        return gotoFlow(getInformationOsSave);
      case "estoy seguro":
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
            const idReserva = state.getMyState().idReservacion;
            const date = await state.getMyState().dateOfBirth;
            await updateDoc(docRef, {
              turns: arrayUnion({
                ...turnoNew,
                status: "OS_CUSTOMER_YES",
                idReserva: idReserva,
                create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                specialist: medicData.name,
              }),
              customers: arrayUnion({
                ...customer,
                os_name: turnoNew.os_name,
                os_number: turnoNew.os_number,
                observation: [],
                cancell: 0,
                ban: false,
                phone: ctx.from,
                age: date.date,
              }),
            }).then(() => {
              console.log("SE GUARDO");
              return endFlow(
                `tu turno se guardo, ahora espera a que el Profesional confirme\n\nEscribe *miturno ${medicData.consultName}* 🏠 para volver al menú.`
              );
            });
          } else {
            const nuevoCustomer = dataUpdated.customers.map((cus) => {
              if (cus.id === customer.id) {
                return {
                  ...customer,
                  os_name: turnoNew.os_name,
                  os_number: turnoNew.os_number,
                };
              }
              return cus;
            });
            const idReserva = state.getMyState().idReservacion;
            return await updateDoc(docRef, {
              turns: arrayUnion({
                ...turnoNew,
                status: "OS_CUSTOMER_YES",
                idReserva: idReserva,
                create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                specialist: medicData.name,
              }),
              customers: nuevoCustomer,
            }).then(() => {
              return endFlow(
                `tu turno se guardo, ahora espera a que el Profesional confirme tu turno\n\nEscribe *miturno ${medicData.consultName}* 🏠 para volver al menú.`
              );
            });
          }
        } else {
          await flowDynamic(
            "El turno ya fue ocupado. Te pedimos que que eligas otro horario"
          );
          return gotoFlow(giveQueryTypesSingle);
        }
      default:
        return gotoFlow(messageConfirmSave);
    }
  }
);
