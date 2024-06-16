import giveDaysWhenMedicWorkNextWeekSingle from "./giveDaysWhenMedicWorkNextWeekSingle.js";
import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
import isAgreeToSave from "./seeKindOfPayments.js";
import menuFlow from "../menu.flow.js";
import { v4 as uuidv4 } from 'uuid';
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("GETINFORMATION_TOSAVE"))
  .addAnswer(
    "¿Cuál es tu nombre?\n\nEscribe *otros* 🔄 si deseas elegir otro horario.\n\nEscribe *menu* 🏠 para volver al menú.",
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow }) => {
      if (ctx.body === "otros") {
        if (state.getMyState().medic.week === 1) {
          return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
        } else {
          return gotoFlow(giveDaysWhenMedicWorkSingle);
        }
      }
      if (ctx.body === "menu") {
        return gotoFlow(menuFlow);
      }

      if (ctx.body.length <= 3) {
        return fallBack();
      }
      const custtomer = state.getMyState().patientFound;
      await state.update({
        patientFound: {
          ...custtomer,
          id: uuidv4(), 
          name: ctx.body,
        },
      });
    }
  )
  .addAnswer(
    "¿Cuál es tu apellido?\n\nEscribe *otros* 🔄 si deseas elegir otro horario.\n\nEscribe *menu* 🏠 para volver al menú.",
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow }) => {
      if (ctx.body === "otros") {
        if (state.getMyState().medic.week === 1) {
          return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
        } else {
          return gotoFlow(giveDaysWhenMedicWorkSingle);
        }
      }
      if (ctx.body === "menu") {
        return gotoFlow(menuFlow);
      }

      if (ctx.body.length <= 3) {
        return fallBack();
      }
      const custtomer = state.getMyState().patientFound;
      await state.update({
        patientFound: {
          ...custtomer,
          lastname: ctx.body,
        },
      });
    }
  )
  .addAnswer(
    "¿Cuál es tu DNI? 🆔 Esta información es importante si quieres cancelar o editar tu turno.\n\nEscribe *otros* 🔄 si deseas elegir otro horario.\n\nEscribe *menu* 🏠 para volver al menú.",
    { capture: true },
    async (ctx, { state, gotoFlow, fallBack }) => {
      if (ctx.body === "menu") {
        return gotoFlow(menuFlow);
      }
      if (ctx.body === "otros") {
        if (state.getMyState().medic.week === 1) {
          return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
        } else {
          return gotoFlow(giveDaysWhenMedicWorkSingle);
        }
      }
      if (ctx.body.length <= 5) {
        return fallBack();
      }
      const custtomer = state.getMyState().patientFound;
      await state.update({
        patientFound: {
          ...custtomer,
          dni: ctx.body,
        },
      });
      return gotoFlow(isAgreeToSave);
    }
  );
