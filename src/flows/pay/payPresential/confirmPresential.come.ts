import dayjs from "dayjs";
import saveTurnPresentialCome from "./saveTurnPresential.come.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("CONFIRM_PRESENTIAL_COME")).addAction(
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const turnoToSave = state.getMyState().turnoNew;
    const precio = state.getMyState().price;
    const medicData = state.getMyState().medic;

await      flowDynamic(
        `*CONFIRMACIÓN DE TURNO* 🟢\n\n` +
          `Tienes turno con: *${medicData.name}*\n` +
          `📅 Fecha: *${dayjs(turnoToSave.start).format(
            "dddd D, MMMM HH:mm a"
          )}*\n\n` +
          `*PAGO PRESENCIALMENTE*\n` +
          `Precio del turno: *$${turnoToSave.price}*\n\n` +
          `Escribe *estoy seguro* para guardar tu turno.\n` +
          `Escribe *pagar* si quieres elegir otro método de pago.\n` +
          `Escribe *menu* si quieres volver al menu.`
      )
  return      gotoFlow(saveTurnPresentialCome)
  }
);
