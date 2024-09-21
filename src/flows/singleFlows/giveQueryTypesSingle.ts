import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
import menuFlow from "../menu.flow.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_PAY"))
  .addAction(
    null,
    async (ctx, { state, flowDynamic }) => {
      const data = state.getMyState().medic.reservaciones.map((m, index) => ({
        body: `*${index}*. Tipo: *${m.type}*, Duración: ${m.minutes} minutos, precio: *$${m.price}*.`,
      }));
      const messageBody = `¡Hola! 👋👨‍⚕️ Aquí están tus opciones de tipos de consulta:\n\n${data.map(item => item.body).join('\n')}\n\n*Por favor, elige el tipo de consulta escribiendo el número correspondiente.*\n\nEscribe *menu* 🏠 para volver al menú.`;

      return await flowDynamic(messageBody);
    }
  )
  .addAction({capture: true},async (ctx, { gotoFlow, state }) => {
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow)  
    }
    await state.update({
      medic: {
        ...state.getMyState().medic,
        chosenDuration: parseInt(ctx.body),
      },
    });
    return gotoFlow(giveDaysWhenMedicWorkSingle);
  });
