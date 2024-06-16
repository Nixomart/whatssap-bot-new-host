import daysAvailablesSingle from "./daysAvailablesSingle.js";
import dayjs from "dayjs";
import giveDaysWhenMedicWorkNextWeekSingle from "./giveDaysWhenMedicWorkNextWeekSingle.js";
import giveQueryTypesSingle from "./giveQueryTypesSingle.js";
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
export default addKeyword<Provider, Database>(utils.setEvent("GIVEDAYS_WHENMEDICWORKS_SINGLE")).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    let medicData = state.getMyState().medic;
    await state.update({ medic: { ...medicData, turnsZeroThisWeek: false } });
    const reservcionesINdex = medicData.reservaciones.map(
      (turn, index) => index
    );
    const chosenDuration = medicData.chosenDuration;
    if (reservcionesINdex.includes(chosenDuration) ) {
      await state.update({price: medicData.reservaciones[chosenDuration].price, idReservacion: medicData.reservaciones[chosenDuration].id});
      if (medicData.reservaciones[chosenDuration].own) {
        const minutes = medicData.reservaciones[chosenDuration].minutes;
        await state.update({
          medic: {
            ...medicData,
            minutes: minutes,
            week: 0,
            businessHoursFiltered: medicData.businessHoursAlone.filter(
              (buss) =>
                buss.idReservacion ===
                  medicData.reservaciones[chosenDuration].id &&
                buss.index > dayjs().day()
            ),
          },
        });
        medicData = await state.getMyState().medic;
        const daysData = medicData.businessHoursFiltered.map((day, index) => ({
          body: `*${index}*. Día: *${dayjs()
            .set("d", day.index)
            .add(medicData.week, "week")
            .format("dddd D, MMMM")}*  Desde: ${day.horarioInicio} Hasta: ${
            day.horarioFin
          }`,
        }));
        const messageBody = `¡Genial! 📅 Elige el día para tu consulta:\n\n${daysData
          .map((item) => item.body)
          .join(
            "\n"
          )}\n\nPor favor, escribe el número correspondiente al día que prefieras.\n\nSi deseas un día para la próxima semana, escribe *proxima* 📅.\nSi prefieres elegir otro tipo de consulta, escribe *consulta* 💼.\n\nEscribe *menu* 🏠 para volver al menú.`;

        if (daysData.length === 0) {
          await state.update({
            medic: { ...medicData, turnsZeroThisWeek: true },
          });
            await flowDynamic(
              "¡Hola! 👋 Parece que el especialista no estará disponible esta semana. 😔\n\n*¿Qué te parece planificar para la próxima semana?* Escribe *proxima* para ver los días disponibles.\n\nEscribe *menu* 🏠 para volver al menú."
            )
            return gotoFlow(daysAvailablesSingle)
        } else {
          await flowDynamic(messageBody)
          return gotoFlow(daysAvailablesSingle);
        }
      } else {
        const minutes = medicData.reservaciones[chosenDuration].minutes;
        await state.update({
          medic: {
            ...medicData,
            minutes: minutes,
            week: 0,
            businessHoursFiltered: medicData.businessHours.filter(
              (buss) => buss.index > dayjs().day() && typeof buss === "object" 
            ),
          },
        });
        medicData = await state.getMyState().medic;
        const daysData = medicData.businessHoursFiltered.map((day, index) => ({
          body: `*${index}*. Día: *${dayjs()
            .set("d", day.index)
            .add(medicData.week, "week")
            .format("dddd D, MMMM")}* Desde: ${day.horarioInicio} Hasta: ${
            day.horarioFin
          }`,
        }));
        const messageBody = `¡Genial! 📅 Elige el día para tu consulta:\n\n${daysData
          .map((item) => item.body)
          .join(
            "\n"
          )}\n\nPor favor, escribe el número correspondiente al día que prefieras.\n\nSi deseas un día para la próxima semana, escribe *proxima* 📅.\nSi prefieres elegir otro tipo de consulta, escribe *consulta* 💼.\n\nEscribe *menu* 🏠 para volver al menú.`;

        if (daysData.length === 0) {
          await state.update({
            medic: { ...medicData, turnsZeroThisWeek: true },
          });
            await flowDynamic(
              "¡Hola! 👋 Parece que el especialista no estará disponible esta semana. 😔\n\n*¿Qué te parece planificar para la próxima semana?* Escribe *proxima* para ver los días disponibles.\n\nEscribe *menu* 🏠 para volver al menú."
            )
            return gotoFlow(daysAvailablesSingle)
        } else {
          await flowDynamic(messageBody)
           return gotoFlow(daysAvailablesSingle);
        }
      }
    } else {
      return gotoFlow(giveQueryTypesSingle);
    }
  }
);
