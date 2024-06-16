import dayjs from "dayjs";
import isAgreeToSaveOSpayment from "./isAgreeToSaveOSpayment.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("MESSAGE_CONFIRM")).addAction(async (ctx, { state, fallBack, gotoFlow, flowDynamic }) =>{
  const turnoToSave = state.getMyState().turnoChoosen;
  const medicData = state.getMyState().medic
await    flowDynamic(
      `*CONFIRMACIÓN DE TURNO* 🟢\n\n` +
      `Tienes turno con: *${medicData.name}*\n` +
      `📅 Fecha: *${dayjs(turnoToSave.start).format("dddd D, MMMM HH:mm a")}*\n` +
      `📍 Lugar: *${turnoToSave.name}*\n` +
      `🏣 Dirección: *${turnoToSave.address}*\n\n` +
      `PAGO POR OBRA SOCIAL:\n` +
      `Nombre de Obra Social: *${turnoToSave.os_name}*\n` +
      `Número de credencial: *${turnoToSave.os_number}*\n\n` +
      `Escribe *estoy seguro* para guardar tu turno.\n` +
      `Escribe *pagar* si quieres elegir otro método de pago.\n` +
      `Escribe *datos* si quieres editar los datos de la obra social.\n` +
      `Escribe *menu* si quieres volver al menu.`
    )
    return gotoFlow(isAgreeToSaveOSpayment)
})