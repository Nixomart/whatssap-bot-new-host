import dayjs from "dayjs";
import giveDaysWhenMedicWorkNextWeekSingle from "./giveDaysWhenMedicWorkNextWeekSingle.js";
import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
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
import getName from "./getInformation/getName.js";
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
      
    }
  )
  .addAction(async (ctx, { flowDynamic, gotoFlow, state }) => {
    const medicData = state.getMyState().medic;
    const hour = medicData.hourChoosenTofirebase;
    const horarioeligidOfORMATEED = medicData.horariosformatted[+ctx.body];
    console.log("HORA: ", horarioeligidOfORMATEED);
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
              : dayjs(horarioeligidOfORMATEED).format("YYYY-MM-DDTHH:mm:ss"),
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
    if (state.getMyState().action === 1) {
        await flowDynamic(
          `¡Muy bien! 🌟 Elegiste un turno para el día *${dayjs(horarioeligidOfORMATEED).format(
            "dddd D, MMMM hh:mm a"
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
            `¡Muy bien! 🌟 Elegiste un turno para el día *${dayjs(horarioeligidOfORMATEED).format(
              "dddd D, MMMM hh:mm a"
            )}*.\n\nAntes de guardar, hagamos algunas preguntas importantes. 🤔`
          )
          return gotoFlow(getName)
      }
      await state.update({
        patientFound: {
          ...customersFound,
          patientFound: true,
        },
      });
        await flowDynamic(
          `¡Muy bien! 🌟 Eligiste un turno para el día *${dayjs(horarioeligidOfORMATEED).format(
            "dddd D, MMMM hh:mm a"
          )}*.\n\n*Usaremos tu informacion que ya esta en el sistema.*`
        )
        return gotoFlow(isAgreeToSave)
    }
  });
