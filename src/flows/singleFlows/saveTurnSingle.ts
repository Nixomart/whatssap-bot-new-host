import dayjs from "dayjs";
import giveDaysWhenMedicWorkNextWeekSingle from "./giveDaysWhenMedicWorkNextWeekSingle.js";
import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
import getInformationToSave from "./getInformationToSave.js";
import isAgreeToSave from "./seeKindOfPayments.js";
import menuFlow from "../menu.flow.js";
const weeks = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(utils.setEvent("SAVETURN_SINGLE"))
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, state, gotoFlow }) => {
      const medicData = state.getMyState().medic;
      if (ctx.body.toLowerCase() == "menu") {
        return gotoFlow(menuFlow);
      }
      const optionWeek = medicData.week;
      if (ctx.body.toLowerCase() == "dias") {
        if (optionWeek > 0) {
          return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
        }
        {
          return gotoFlow(giveDaysWhenMedicWorkSingle);
        }
      }
      const horarioeligidOfORMATEED =
        medicData.horariosformatted[parseInt(ctx.body)];
      await state.update({
        medic: {
          ...medicData,
          hourChoosenTofirebase:
            medicData.week > 0
              ? medicData.firstTime
                ? dayjs(horarioeligidOfORMATEED)
                    .add(medicData.week, "week")
                    .format("YYYY-MM-DDTHH:mm:ss")
                : dayjs(horarioeligidOfORMATEED).format("YYYY-MM-DDTHH:mm:ss")
              : horarioeligidOfORMATEED,
        },
      });
      if (horarioeligidOfORMATEED === undefined) {
        if (state.getMyState().medic.week === 1) {
            await flowDynamic("¡Por favor! ⏰ Elige un horario válido.")
            return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle)
        } else {
            await flowDynamic("¡Por favor! ⏰ Elige un horario válido.")
            return gotoFlow(giveDaysWhenMedicWorkSingle)
        }
      }
    }
  )
  .addAction(async (ctx, { flowDynamic, gotoFlow, state }) => {
    const medicData = state.getMyState().medic;
    const hour = medicData.hourChoosenTofirebase;

    if (state.getMyState().action === 1) {
        await flowDynamic(
          `¡Muy bien! 🌟 Elegiste un turno para el día *${dayjs(hour).format(
            "dddd D, MMMM HH:mm a"
          )}*`
        )
        return gotoFlow(isAgreeToSave)
    } else {
      const customersFound = medicData.customers.find(
        (customer) => customer.phone == ctx.from
      );

      if (customersFound === undefined) {
        await state.update({
          patientFound: {
            patientFound: false,
          },
        });
          await flowDynamic(
            `¡Muy bien! 🌟 Elegiste un turno para el día *${dayjs(hour).format(
              "dddd D, MMMM HH:mm a"
            )}*.\n\nAntes de guardar, hagamos algunas preguntas importantes. 🤔`
          )
          return gotoFlow(getInformationToSave)
      }
      await state.update({
        patientFound: {
          ...customersFound,
          patientFound: true,
        },
      });
        await flowDynamic(
          `¡Muy bien! 🌟 Eligiste un turno para el día *${dayjs(hour).format(
            "dddd D, MMMM HH:mm a"
          )}*.\n\nUsaremos la informacion que ya haz puesto anteriormente.`
        )
        return gotoFlow(isAgreeToSave)
    }
  });
