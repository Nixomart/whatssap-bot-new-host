import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import deleteTurnChoosen from "./deleteTurnChoosen.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
dayjs.extend(relativeTime);

export default addKeyword<Provider, Database>(utils.setEvent("ASK_DELETE_TURN")).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    const turn = state.getMyState().medic.turnFound;
     await flowDynamic(
        `Turnos encontrados para *ELIMINAR* ${dayjs(turn[0].start).format(
          "dddd D, MMMM HH:mm"
        )} \n\nAquí están los detalles de tus turnos:\nDirección: *qwoenqowe*\nEspecialista: *${
          turn.specialist
        }*\n${turn
          .map(
            (turn, index) =>
              `\n${index}: *Fecha*: ${dayjs(turn.start).format(
                "dddd D, MMMM HH:mm"
              )} *${dayjs(turn.start).fromNow()}*\n\nTus Datos:\nNombre: *${
                turn.customer.name + " "+turn.customer.lastname
              }*\nDNI: *${
                turn.customer.dni
              }* \n\nEscribe *${index}* ❌ para cancelar este turno.`
          )
          .join("\n")}`
      )
      return gotoFlow(deleteTurnChoosen)
  }
);
