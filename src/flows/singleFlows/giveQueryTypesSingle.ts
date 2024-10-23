import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
import menuFlow from "../menu.flow.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
/* only if customer watns to see new */
let justToSee = false;
export default addKeyword<Provider, Database>(utils.setEvent("CHOOSE_PAY"))
  .addAction(null, async (ctx, { state, flowDynamic }) => {
    justToSee = await state.getMyState().justToSee;
    const data = state.getMyState().medic.reservaciones.map((m, index) => ({
      body: `${!justToSee ? `*${index}*.`: "" }Tipo: *${m.type}*, Duración: ${m.minutes} minutos, precio: *$${m.price}*.`,
    }));
    const messageBody = !justToSee
      ? `¡Hola! 👋👨‍⚕️ Aquí están tus opciones de tipos de consulta:\n\n${data
          .map((item) => item.body)
          .join(
            "\n"
          )}\n\n*Por favor, elige el tipo de consulta escribiendo el número correspondiente.*\n\nEscribe *menu* 🏠 para volver al menú.`
      : `¡Hola! 👋👨‍⚕️ Aquí están tus opciones de tipos de consulta:\n\n${data
          .map((item) => item.body)
          .join("\n")}\n\nEscribe *menu* 🏠 para volver al menú.`;

    return await flowDynamic(messageBody);
  })
  .addAction({ capture: true }, async (ctx, { gotoFlow, state, flowDynamic }) => {
    if (!justToSee) {
      if (ctx.body.toLowerCase() == "menu") {
        return gotoFlow(menuFlow);
      }
      await state.update({
        medic: {
          ...state.getMyState().medic,
          chosenDuration: parseInt(ctx.body),
        },
      });
      return gotoFlow(giveDaysWhenMedicWorkSingle);
    } else {
      if (ctx.body.toLowerCase() == "menu") {
        return gotoFlow(menuFlow);
      }else{
        return gotoFlow(menuFlow);
      }
    }
  });
