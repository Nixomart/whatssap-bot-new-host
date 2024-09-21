import dayjs from "dayjs";
import isAgreeToSave from "./seeKindOfPayments.js";
import menuFlow from "../menu.flow.js";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import giveDaysWhenMedicWorkNextWeekSingle from "./giveDaysWhenMedicWorkNextWeekSingle.js";
import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
import { db } from "~/firebase/firebase.js";
import getName from "./getInformation/getName.js";
export default addKeyword<Provider, Database>(utils.setEvent("SAVETURN_TOFIREBASE")).addAction(
  { capture: true },
  async (ctx, { flowDynamic, gotoFlow, state, endFlow }) => {
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow);
    }
    if (state.getMyState().action === 1) {
      if (
        ctx.body.toLowerCase() == "estoy seguro" ||
        ctx.body.toLowerCase() == "si" ||
        ctx.body.toLowerCase() == "de acuerdo" ||
        ctx.body.toLowerCase() == "estoy acuerdo" ||
        ctx.body.toLowerCase() == "estoy de acuerdo"
      ) {
        const medicData = state.getMyState().medic;
        const docRef = doc(db, "consults", medicData.uid);
        const customerUpdated = medicData.customers.map((customer) => {
          if (customer.phone == ctx.from) {
            return {
              ...customer,
              cancell: +customer.cancell + 1,
            };
          }
          return customer;
        });
        const idReserva = state.getMyState().idReservacion
        console.log("RESERVA ", idReserva);
        const updatedTurns = medicData.turns.map((turn) => {
          if (turn.id == medicData.turnChoosenToEDIT.id) {
            return {
              ...turn,
              start: dayjs(medicData.hourChoosenTofirebase).format(
                "YYYY-MM-DDTHH:mm:ss"
              ),
              idReserva: idReserva
            };
          }
          return turn;
        });
        await updateDoc(docRef, {
          turns: updatedTurns,
          customers: customerUpdated,
        }).then(()=>{
          const hour = state.getMyState().medic.hourChoosenTofirebase;
          return endFlow(
            `¡Excelente! 🎉 Tu turno ha sido guardado Para el dia ${dayjs(
              hour
            ).format(
              "dddd D, MMMM HH:mm a"
            )}. ¡Gracias por elegirnos! 👨‍⚕️📅\n\nRecuerda que te enviaremos un recordatorio de tu turno un día antes por este medio. ⏰ Además, si por alguna razón no puedes asistir, puedes cancelar o cambiar tu turno. Solo escríbenos con anticipación. 📆❗ ¡Esperamos verte pronto y que tengas una excelente atención médica!\n\nEscribe *miturno ${medicData.consultName}* 🏠 para volver al menú.`
          );
        });
      } else {
        return gotoFlow(isAgreeToSave);
      }
    } else {
      if (ctx.body.toLowerCase() == "otro" || ctx.body.toLowerCase() == "otros" || ctx.body.toLowerCase() == "otr") {
        if (state.getMyState().medic.week === 1) {
          return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
        } else {
          return gotoFlow(giveDaysWhenMedicWorkSingle);
        }
      } else if (
        ctx.body.toLowerCase() == "datos" ||
        ctx.body.toLowerCase() == "dato" ||
        ctx.body.toLowerCase() == "dat"
      ) {
        return gotoFlow(getName);
      } else {
        return gotoFlow(isAgreeToSave);
      }
    }
  }
);
