import dayjs from "dayjs";
import dataToTransferCome from "./dataToTransfer.come.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(
  utils.setEvent("CONFIRM_TRANSFERSAVE_COME")
).addAction(async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
  const turnoToSave = state.getMyState().turnoNew;
  const medicData = state.getMyState().medic;

  await flowDynamic(
    `*CONFIRMACIÓN DE TURNO* 🟢\n\n` +
      `Tienes turno con: *${medicData.name}*\n` +
      `📅 Fecha: *${dayjs(turnoToSave.start).format(
        "dddd D, MMMM HH:mm a"
      )}*\n\n` +
      `*PAGO POR TRANSFERENCIA*\n\n` +
      `Precio del turno: *$${turnoToSave.price}*\n\n` +
      `Escribe *estoy seguro* para guardar tu turno y proceder a la transferencia.\n` +
      `Escribe *pagar* si quieres elegir otro método de pago.\n` +
      `Escribe *menu* si quieres volver al menu.`
  );
  return gotoFlow(dataToTransferCome);
});
