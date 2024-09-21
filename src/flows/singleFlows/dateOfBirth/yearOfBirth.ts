import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import menuFlow from "../../menu.flow";
import giveDaysWhenMedicWorkNextWeekSingle from "../giveDaysWhenMedicWorkNextWeekSingle";
import giveDaysWhenMedicWorkSingle from "../giveDaysWhenMedicWorkSingle";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import dayjs from "dayjs";
import isAgreeToSave from "../seeKindOfPayments.js";
/* export default addKeyword<Provider, Database>(utils.setEvent("GETDATEOFBIRTH")) */
export default addKeyword<Provider, Database>(
  utils.setEvent("GETYEAROFBIRTH")
).addAnswer(
  "📅 ¿Cuál es tu *año de nacimiento*? Por ejemplo: *2001* Ingresa solo números.\n\nEscribe *otros* 🔄 si deseas elegir otro horario.\n\nEscribe *menu* 🏠 para volver al menú.\n\n*Si ingresaste un dato mal, lo vas a poder cambiar luego*",
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
    if (ctx.body.toLowerCase() == "otros") {
      if (state.getMyState().medic.week === 1) {
        return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
      } else {
        return gotoFlow(giveDaysWhenMedicWorkSingle);
      }
    }
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow);
    }

    if (ctx.body.length > 4) {
      return fallBack();
    }
    if (isNaN(+ctx.body)) {
      return fallBack();
    }
    /* const custtomer = state.getMyState().patientFound;
                await state.update({
                        patientFound: {
                        ...custtomer,
                        dateOfBirth: {
                                month: ctx.body,
                        },
                        },
                }); */
    const spread = await state.getMyState().dateOfBirth;

    await state.update({
      dateOfBirth: {
        ...spread,
        year: ctx.body,
        date: dayjs()
        .set("year", +ctx.body)
        .month(spread.month)
        .set("D", spread.day)
        .format("YYYY-MM-DDTHH:mm:ss")
      },
    });

    const date = dayjs()
      .set("year", +ctx.body)
      .month(spread.month)
      .set("D", spread.day)
      .format("DD/MM/YYYY");
    await flowDynamic(
      `¡Tu día de nacimiento es: *${date}!* 🎉 *Es correcto?*\n\nEscribe *fecha*📆 para cambiar le facha de nacimiento`
    );
    return gotoFlow(isAgreeToSave);
  }
);
