import daysAvailablesSingle from "./daysAvailablesSingle.js";
import dayjs from "dayjs";
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
export default addKeyword<Provider, Database>(utils.setEvent("GIVEDAYS_WHENMEDICWORK_NEXTWEEK")).addAction(
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    let medicData = state.getMyState().medic;
    const reservcionesINdex = medicData.reservaciones.map(
      (turn, index) => index
    );
    const chosenDuration = medicData.chosenDuration;
    if (reservcionesINdex.includes(chosenDuration)) {
      const typeTurnChoosen = medicData.reservaciones[chosenDuration];
      const minutes = typeTurnChoosen.minutes;

      if (medicData.comeFromErrorNext) {
        await state.update({
          medic: {
            ...medicData,
            minutes: minutes,
            /* week: 1, */
            businessHoursFiltered: typeTurnChoosen.own
              ? medicData.businessHoursAlone.filter(
                  (buss) => buss.idReservacion === typeTurnChoosen.id
                )
              : medicData.businessHours.filter((buss)=> typeof buss === "object" ),
          },
        });
      }else{
        await state.update({
          medic: {
            ...medicData,
            minutes: minutes,
            businessHoursFiltered: typeTurnChoosen.own
              ? medicData.businessHoursAlone.filter(
                (buss) => buss.idReservacion === typeTurnChoosen.id
              )
            : medicData.businessHours.filter((buss)=> typeof buss === "object" ),
          },
        });
      }
      medicData = state.getMyState().medic
      let daysNextWeekData;
      if (typeTurnChoosen.own) {
        daysNextWeekData = state
          .getMyState()
          .medic.businessHoursFiltered.filter(
            (buss) => buss.idReservacion === typeTurnChoosen.id 
          )
          .map((day, index) => ({
            body: `*${index}*. Día: *${dayjs().set("d", day.daysOfWeek[0]).add(medicData.week, "week").format("dddd D, MMMM")}* Desde: *${
              day.startTime
            } Hasta: ${day.endTime}*`,
          }));
      } else {
        daysNextWeekData = state
          .getMyState()
          .medic.businessHoursFiltered.filter((buss)=> typeof buss === "object" ).map((day, index) => ({
            body: `*${index}*. Día:  *${dayjs().set("d", day.daysOfWeek[0]).add(medicData.week, "week").format("dddd D, MMMM")}* Desde: *${
              day.startTime
            }* Hasta: *${day.endTime}*`,
          }));
      }
      const messageBody = ` ¡Genial! 📅 Estos son los días que trabajará la próxima semana:\n\n${daysNextWeekData
        .map((item) => item.body)
        .join(
          "\n"
        )}\n\n*Elige un día escribiendo el número correspondiente.*\n\nSi quieres eligir un dia de la proxima semana Escribe *proxima* \nSi prefieres elegir un día de la semana actual, Escribe *actual* ⏰.\nEscribe *menu* 🏠 para volver al menú.`;
      await state.update({
        medic: { ...state.getMyState().medic, turnsZeroThisWeek: false },
      });
      await flowDynamic(messageBody)
      return gotoFlow(daysAvailablesSingle);
    } else {
      return await flowDynamic(
        "¡Ups! 🤷‍♂️ Carácter incorrecto. Por favor, escribe *consulta* para elegir de nuevo un tipo de consulta 📝🔄.\n\nEscribe *menu* 🏠 para volver al menú."
      );
    }
  }
);
