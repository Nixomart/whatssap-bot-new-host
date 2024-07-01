import messageConfirm from "./messageConfirm.js";
import listPaymentMethods from "../listPaymentMethods.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";

export default addKeyword<Provider, Database>(
  utils.setEvent("GET_INFORMATION_OS")
).addAnswer(
  "Escribe tu numero de crendencial\n\nEscribe *pagar* 🔄 si deseas elegir otro metodo de pago.",
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    if (ctx.body.toLowerCase() == "pagar") {
      return gotoFlow(listPaymentMethods);
    }
    if (ctx.body.length > 30) {
      await flowDynamic("Escribe tu numero de credencial correcto") 
      return fallBack();
    }
    await state.update({
      turnoChoosen: { ...state.getMyState().turnoChoosen, os_number: ctx.body },
    });
    return gotoFlow(messageConfirm);
  }
);
