import getInformationOS from "./getInformationOS.js";
import listPaymentMethods from "../listPaymentMethods.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(utils.setEvent("GET_OSNAME_TOSAVE_COME")).addAnswer(
  "El especialista acepta todas las obras sociales. Escribe el nombre de tu obra social. Por ejemplo. *ISJ, OSDE, ETC*\n\nEscribe *pagar* 🔄 si deseas elegir otro metodo de pago.",
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    if (ctx.body == "pagar") {
      return gotoFlow(listPaymentMethods)
    }
    if (ctx.body.length > 30) {
        await flowDynamic("Escribe el nombre correcto")
        return fallBack()
    }
    await state.update({
      turnoNew: { ...state.getMyState().turnoNew, os_name: ctx.body },
    });
    await state.update({
        turnoChoosen: { ...state.getMyState().turnoChoosen,  os_name: ctx.body},
      });
    return gotoFlow(getInformationOS)
  }
);