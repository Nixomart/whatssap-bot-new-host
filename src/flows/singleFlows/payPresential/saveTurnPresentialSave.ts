/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
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
import messageConfirmPresentialSave from "./messageConfirmPresentialSave.js";
export default addKeyword<Provider, Database>(
  utils.setEvent("SAVETURN_PRESENTIAL_SAVE")
).addAction(
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic, endFlow }) => {
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const customer = state.getMyState().patientFound;
    const turnoNew = state.getMyState().turnoNew;
    const precio = state.getMyState().price;
    switch (ctx.body.toLowerCase()) {
      case "menu":
        return gotoFlow(menuFlow);
      case "pagar":
        return gotoFlow(seeKindOfPayments);
      case "estoy seguro":
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
            const date = await state.getMyState().dateOfBirth;
            await updateDoc(docRef, {
              turns: arrayUnion({
                ...turnoNew,
                status: "PRESENTIAL_CUSTOMER_YES",
                idReserva: idReserva,
                create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                specialist: medicData.name,
              }),
              customers: arrayUnion({
                ...customer,
                observation: [],
                cancell: 0,
                ban: false,
                phone: ctx.from,
                os_name: null,
                os_number: null,
                age: date.date,
              }),
            }).then(() => {
              return endFlow(
                `tu turno se guardo, ahora espera a que el Profesional confirme el turno\n\nEscribe *miturno ${medicData.consultName}* 🏠 para volver al menú.`
              );
            });
          } else {
            const nuevoCustomer = dataUpdated.customers.map((cus) => {
              if (cus.id === customer.id) {
                return customer;
              }
              return cus;
            });
            return await updateDoc(docRef, {
              turns: arrayUnion({
                ...turnoNew,
                status: "PRESENTIAL_CUSTOMER_YES",
                idReserva: idReserva,
                create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                specialist: medicData.name,
              }),
              customers: nuevoCustomer,
            }).then(() => {
              return endFlow(
                `Tu turno Fue guardado con exito!. Ahora te toca esperar la confirmacion del turno de parte del Profesional, el precio del turno es ${precio}\n\nEscribe *miturno ${medicData.consultName}* 🏠 para volver al menú.`
              );
            });
          }
        } else {
          await flowDynamic(
            `El turno ya fue ocupado. Te pedimos que porfavor que eligas otro horario\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
          );
          return gotoFlow(giveQueryTypesSingle);
        }
      default:
        return gotoFlow(messageConfirmPresentialSave);
    }
  }
);
