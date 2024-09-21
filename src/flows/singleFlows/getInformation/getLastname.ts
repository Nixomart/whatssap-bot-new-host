import giveDaysWhenMedicWorkNextWeekSingle from "../giveDaysWhenMedicWorkNextWeekSingle.js";
import giveDaysWhenMedicWorkSingle from "../giveDaysWhenMedicWorkSingle.js";
import isAgreeToSave from "../seeKindOfPayments.js";
import menuFlow from "../../menu.flow.js";
import { v4 as uuidv4 } from 'uuid';
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import dayOfBirth from "../dateOfBirth/dayOfBirth.js";
import getDni from "./getDni.js";
export default addKeyword<Provider, Database>(utils.setEvent("GETINFORMATION_TOSAVE"))
/* export default addKeyword<Provider, Database>("hola") */
.addAnswer(
    "¿Cuál es tu apellido?\n\nEscribe *otros* 🔄 si deseas elegir otro horario.\n\nEscribe *menu* 🏠 para volver al menú.\n\n*Si ingresaste un dato mal, lo vas a poder cambiar luego*",
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow }) => {
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

      if (ctx.body.length <= 3|| !isNaN(+ctx.body)) {
        return fallBack();
      }
      const custtomer = state.getMyState().patientFound;
      await state.update({
        patientFound: {
          ...custtomer,
          lastname: ctx.body,
        },
      });
      return gotoFlow(getDni)
    }
  )