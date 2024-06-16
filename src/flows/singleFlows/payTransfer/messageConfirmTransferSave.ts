import dayjs from "dayjs";
import giveDataToPaywithTransfer from "./giveDataToPaywithTransfer.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("MESSAGE_CONFIRM_TRANSFER_SAVE")).addAction(
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const qw = state.getMyState().turnoNew;
    const precio = state.getMyState().price;
    await state.update({turnoNew: {...qw, price: precio}})
    const turnoToSave = state.getMyState().turnoNew;
    const medicData = state.getMyState().medic

      await flowDynamic(
        `*CONFIRMACIÓN DE TURNO* 🟢\n\n` +
        `Tienes turno con: *${medicData.name}*\n` +
        `📅 Fecha: *${dayjs(turnoToSave.start).format("dddd D, MMMM HH:mm a")}*\n\n` +
        `*PAGO POR TRANSFERENCIA*\n\n` +
        `Precio del turno: *$${precio}*\n\n` +
        `Escribe *estoy seguro* para guardar tu turno y proceder a la transferencia.\n` +
        `Escribe *pagar* si quieres elegir otro método de pago.\n` +
        `Escribe *menu* si quieres volver al menu.`      ) 
      return gotoFlow(giveDataToPaywithTransfer)
  }
);

