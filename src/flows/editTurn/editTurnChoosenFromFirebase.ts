import giveQueryTypesSinglesEdit from './giveQueryTypesSinglesEDIT.js'
import askEditTurn from "./askEditTurn.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("EDIT_TURN_CHOOSEN_FROM_FIREBASE")).addAction(
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic, state }) => {
    if (ctx.body === "estoy de acuerdo") {
      /* const turn = state.getMyState().medic.turnChoosenToEDIT; */
      await state.update({action: 1})
      return gotoFlow(giveQueryTypesSinglesEdit)
      /* return flowDynamic(`El siguiente turno ha sido eliminado.\n\n*Fecha*: ${dayjs(turn.start).format("dddd D, MMMM HH:mm")} *${dayjs(
            turn.start
          ).fromNow()}*\n\nTus Datos:\nNombre: *${turn.name}*\nDNI: *${turn.dni}*\n\nEscribe *estoy de acuerdo* para cancelarlo`) */
    } else {
      await flowDynamic("Opcion incorrecta!")
      return gotoFlow(askEditTurn);
    }
  }
);
