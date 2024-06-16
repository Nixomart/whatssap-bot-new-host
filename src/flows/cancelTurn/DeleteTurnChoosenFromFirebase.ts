import askDeleteTurn from "./askDeleteTurn.js";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";

export default addKeyword<Provider, Database>(utils.setEvent("DELETE_TURN_FROM_FIREBASE")).addAction(
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic, state }) => {
    const medicData = state.getMyState().medic;
    if (ctx.body === "estoy de acuerdo") {
      const docRef = doc(db, "consults", medicData.uid);
      const updatedTurns = medicData.turns.filter(
        (turn) => turn.id != medicData.turnChoosenToDelete.id
      );
      const customerUpdated = medicData.customers.map((customer) => {
        if (customer.phone == ctx.from) {
          return {
            ...customer,
            cancell: +customer.cancell + 1,
          };
        }
        return customer;
      });
      console.log("customer updated: ", customerUpdated);
      await updateDoc(docRef, {
        turns: updatedTurns,
        customers: customerUpdated,
      });

      const turn = state.getMyState().medic.turnChoosenToDelete;
      return await flowDynamic(
        `📅 *Turno Cancelado* 📅\n\n*Fecha*: ${dayjs(
          turn.start
        ).format("dddd D, MMMM HH:mm")} (*${dayjs(
          turn.start
        ).fromNow()}*)\n\n*Tus Datos:*\n👤 Nombre: *${turn.customer.name}*\n🔢 DNI: *${
          turn.customer.dni
        }*`
      );
    } else {
      await flowDynamic("Opcion incorrecta!") 
      return gotoFlow(askDeleteTurn);
    }
  }
);
