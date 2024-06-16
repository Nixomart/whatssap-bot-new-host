import dayjs from "dayjs";
import confirmTurnSaveOs from "./confirmTurnSaveOs.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("MESSAGE_CONFIRM_SAVE")).addAction(
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    const qw = state.getMyState().turnoNew;
    const precio = state.getMyState().price;
    await state.update({ turnoNew: { ...qw, price: precio } });
    const turnoToSave = state.getMyState().turnoNew;
    const medicData = state.getMyState().medic
    console.log("ENTRA A CONFIRMAR MENSAJE");
      await flowDynamic(
        `*CONFIRMACIÓN DE TURNO* 🟢\n\n` +
        `Tienes turno con: *${medicData.name}*\n` +
        `📅 Fecha: *${dayjs(turnoToSave.start).format("dddd D, MMMM HH:mm a")}*\n\n` +
        `*PAGO POR OBRA SOCIAL*\n\n` +
        `Nombre de la Obra Social: ${turnoToSave.os_name}\n` +
        `Número de credencial: ${turnoToSave.os_number}\n\n` +
        `Escribe *estoy seguro* para guardar tu turno.\n` +
        `Escribe *pagar* si quieres elegir otro método de pago.\n` +
        `Escribe *datos* si quieres editar los datos de la obra social.\n` +
        `Escribe *menu* si quieres volver al menu.`      )  
      return gotoFlow(confirmTurnSaveOs)
  }
);