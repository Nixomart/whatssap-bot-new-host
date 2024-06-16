import askDeleteTurn from "./askDeleteTurn.js";
import dayjs from "dayjs";
import DeleteTurnChoosenFromFirebase from "./DeleteTurnChoosenFromFirebase.js";
import { addKeyword, utils } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
export default addKeyword<Provider, Database>(
  utils.setEvent("DELETE_TURN_CHOOSEN")
).addAction(
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic, state }) => {
    const turnsIndex = state.getMyState().medic.turnsIndexToDelete;
    const turns = state.getMyState().medic.turnFound;
    if (turnsIndex.includes(parseInt(ctx.body))) {
      const turn = turns[ctx.body];
      const medicData = state.getMyState().medic;
      await state.update({
        medic: { ...medicData, turnChoosenToDelete: turn },
      });
      await flowDynamic(
        `🚨 *Confirmación de Cancelación de Turno* 🚨\n\nPara asegurarnos, ¿deseas eliminar el siguiente turno?\n\n*Fecha*: ${dayjs(
          turn.start
        ).format("dddd D, MMMM HH:mm")} (*${dayjs(
          turn.start
        ).fromNow()}*)\n\n*Tus Datos:*\n👤 Nombre: *${
          turn.customer.name + " " + turn.customer.lastname
        }*\n🔢 DNI: *${
          turn.customer.dni
        }*\n\nPor favor, escribe *estoy de acuerdo* para confirmar la cancelación.`
      );
      return gotoFlow(DeleteTurnChoosenFromFirebase);
    } else {
      return gotoFlow(askDeleteTurn);
    }
  }
);
