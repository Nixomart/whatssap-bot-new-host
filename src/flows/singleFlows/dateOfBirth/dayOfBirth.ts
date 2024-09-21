import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import menuFlow from "../../menu.flow";
import giveDaysWhenMedicWorkNextWeekSingle from "../giveDaysWhenMedicWorkNextWeekSingle";
import giveDaysWhenMedicWorkSingle from "../giveDaysWhenMedicWorkSingle";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import monthOfBirth from "./monthOfBirth";
import getName from "../getInformation/getName";
/* export default addKeyword<Provider, Database>(utils.setEvent("GETDATEOFBIRTH")) */
export default addKeyword<Provider, Database>(  utils.setEvent("GETMONTHOFBIRTH")).addAnswer(
  "🎉 Vamos a formar tu fecha de nacimiento! 😊\n\n📅 ¿En qué *día naciste*? Ingresa solo números.\n\nEscribe *otros* 🔄 si deseas elegir otro horario.\n\nEscribe *menu* 🏠 para volver al menú.\n\nEscribe *datos* ✍ si quieres cambiar tu nombre, apellido y dni.\n\n*Si ingresaste un dato mal, lo vas a poder cambiar luego*",
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow }) => {
    if (ctx.body.toLowerCase() == "otros") {
      if (state.getMyState().medic.week === 1) {
        return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
      } else {
        return gotoFlow(giveDaysWhenMedicWorkSingle);
      }
    }
    if (ctx.body.toLowerCase() == "datos") {
      return gotoFlow(getName);
    }
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow);
    }
    if (ctx.body.length > 2) {
      return fallBack();
    }
    if (isNaN(+ctx.body) || +ctx.body > 31) {
      return fallBack();
    }
    /* const custtomer = state.getMyState().patientFound;
                await state.update({
                        patientFound: {
                        ...custtomer,
                        dateOfBirth: {
                                day: ctx.body,
                        },
                        },
                }); */
    await state.update({
      dateOfBirth: {
        day: +ctx.body,
      },
    });
    console.log("VA A IR A MONTH OF BIRTH");
    
    return gotoFlow(monthOfBirth);
  }
);
