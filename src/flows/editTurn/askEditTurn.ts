import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import editTurnChoosen from "./editTurnChoosen.js";
import { addKeyword, utils } from "@builderbot/bot";
dayjs.extend(relativeTime);
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("ASK_EDIT_TURN"))
  .addAnswer("...⏱")
  .addAction(async (ctx, { state, flowDynamic, gotoFlow }) => {
    const turns = state.getMyState().medic.turnFoundToEdit;
    await flowDynamic(
      `Turnos encontrados para *EDITAR* con el especialista \n\nAquí están los detalles de tus turnos:\nEspecialista: *${
        state.getMyState().medic.name
      }*\n${turns
        .map(
          (turn, index) =>
            `\n${index}: *Fecha*: ${dayjs(turn.start).format(
              "dddd D, MMMM HH:mm"
            )} *${dayjs(turn.start).fromNow()}*\n\nTus Datos:\nNombre: *${
              turn.customer.name
            }*\nDNI: *${
              turn.customer.dni
            }* \n\nEscribe *${index}* ❌ para editar este turno.`
        )
        .join("\n")}`
    );
    return gotoFlow(editTurnChoosen);
  });
