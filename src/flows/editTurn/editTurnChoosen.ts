import dayjs from "dayjs";
import editTurnChoosenFromFirebase from "./editTurnChoosenFromFirebase.js";
import askEditTurn from "./askEditTurn.js";
import { addKeyword, utils } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
//PARA EL FINAL!
export default addKeyword<Provider, Database>(utils.setEvent("EDIT_TURN_CHOOSEN")).addAction(
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic, state }) => {
    const turnsIndex = state.getMyState().medic.turnIndexToEdit;
    const turns = state.getMyState().medic.turnFoundToEdit;
    if (turns[parseInt(ctx.body)] !== undefined) {
      const turn = turns[ctx.body];
      const medicData = state.getMyState().medic;
      await state.update({
        medic: { ...medicData, turnChoosenToEDIT: turn },
      });
        await flowDynamic(
          `📆 Solo para asegurarnos, ¿deseas *EDITAR* el siguiente turno?
          \n*Fecha*: ${dayjs(turn.start).format("dddd D, MMMM HH:mm")} *${dayjs(turn.start).fromNow()}*
          \n\n👤 Tus Datos:
          \nNombre: *${turn.customer.name}*
          \nDNI: *${turn.customer.dni}*
          \n\n✍️ Escribe *estoy de acuerdo* para Editarlo`
        )
        return gotoFlow(editTurnChoosenFromFirebase)
    } else {
      return gotoFlow(askEditTurn);
    }
  }
);
