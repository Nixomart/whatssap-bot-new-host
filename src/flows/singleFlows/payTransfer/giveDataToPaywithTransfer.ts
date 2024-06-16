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
export default addKeyword<Provider, Database>(utils.setEvent("GIVEDATA_TOPAYWITHTRANSFER")).addAction(
  { capture: true },
  async (ctx, { state, endFlow, gotoFlow, flowDynamic }) => {
    const medicData = state.getMyState().medic;
    const dataUpdated = await updateFirebaseData(medicData.uid);
    const customer = state.getMyState().patientFound;
    const turnoNew = state.getMyState().turnoNew;
    const precio = state.getMyState().price;

    if (ctx.body == "estoy seguro") {
      const idReserva = state.getMyState().idReservacion;

      const dataTransfer = medicData.paymentMethods.find(
        (reserv) => reserv.id === "1"
      );

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
          await updateDoc(docRef, {
            turns: arrayUnion({
              ...turnoNew,
              status: "TRANSFER_CUSTOMER_NO",
              idReserva: idReserva,
               create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"), specialist: medicData.name
            }),
            customers: arrayUnion({
              ...customer,
              observation: [],
              cancell: 0,
              ban: false,
              phone: ctx.from,
              os_name: null,
              os_number: null,
            }),
          }).then(() => {
            return endFlow(
              `tu turno se guardo, ahora espera a que el especialista confirme el turno\n\nSi quieres volver al menu en cualquier momento escribe. *miturno ${medicData.consultName}*`
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
            turns: arrayUnion({ ...turnoNew, status: "TRANSFER_CUSTOMER_NO", idReserva:idReserva, create_at: dayjs().format("YYYY-MM-DDTHH:mm:ss"), specialist: medicData.name }),
            customers: nuevoCustomer,
          }).then(async() => {
            await flowDynamic([
              {
                body: `Bien. Aquí tienes los datos para realizar la transferencia al especialista:\n\n💳 CBU: ${dataTransfer.cbu}\n🏷️ ALIAS: ${dataTransfer.alias}\n👤 NOMBRE: ${dataTransfer.name}\n\n💰 VALOR DE LA CONSULTA: *${precio}*\n\nPor favor, envía una foto de la transferencia siguiendo el ejemplo proporcionado.`,
                media:
                  "https://firebasestorage.googleapis.com/v0/b/calendar-dashboard-df06c.appspot.com/o/default%2FHeading.png?alt=media&token=4714f1cb-274a-4cc9-b6ad-5af9caa2f364",
              },
              {
                body: "*SOLO TIENES UN INTENTO PARA ENVIAR LA IMAGEN*",
              },
            ]);
          });
        }
      } else {
          await flowDynamic(
            "❌El turno ya fue ocupado. Te pedimos que porfavor que eligas otro horario"
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
