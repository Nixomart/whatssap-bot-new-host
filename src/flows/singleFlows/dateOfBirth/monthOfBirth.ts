import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import menuFlow from "../../menu.flow";
import giveDaysWhenMedicWorkNextWeekSingle from "../giveDaysWhenMedicWorkNextWeekSingle";
import giveDaysWhenMedicWorkSingle from "../giveDaysWhenMedicWorkSingle";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import yearOfBirth from "./yearOfBirth";
export default addKeyword<Provider, Database>(
  utils.setEvent("GETMONTHOFBIRTH")
).addAnswer(
  "📅 ¿En qué *mes naciste*? Ingresa *un número del 1 al 12* para representar los meses del año.\n\nEscribe *otros* 🔄 si deseas elegir otra opción.\n\nEscribe *menu* 🏠 para volver al menú.\n\n*Si ingresaste un dato mal, lo vas a poder cambiar luego* ",
  { capture: true },
  async (ctx, { state, fallBack, gotoFlow }) => {
    try {
      console.log("ENTRA A MONTH OF BIRTH");
      
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
  
      if (ctx.body.length > 2) {
        return fallBack();
      }
      if (isNaN(+ctx.body) || +ctx.body > 12) {
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
      console.log("ACTUALIZA ESTADO");
      const spread = await state.getMyState().dateOfBirth;
      await state.update({
        dateOfBirth: {
          ...spread,
          month: +ctx.body - 1,
        },
      });
      console.log("VA A IR A YEAR OF BIRTH");
      
      return gotoFlow(yearOfBirth);
    } catch (error) {
      console.log("ERROR", error);
      
    }
    
  }
);
