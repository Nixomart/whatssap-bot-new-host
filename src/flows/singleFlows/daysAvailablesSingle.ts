/* eslint-disable no-inner-declarations */
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import saveTurnSingle from "./saveTurnSingle.js";
import giveDaysWhenMedicWorkSingle from "./giveDaysWhenMedicWorkSingle.js";
import giveDaysWhenMedicWorkNextWeekSingle from "./giveDaysWhenMedicWorkNextWeekSingle.js";
import giveQueryTypesSingle from "./giveQueryTypesSingle.js";
import menuFlow from "../menu.flow.js";
dayjs.extend(isSameOrAfter);
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
export default addKeyword<Provider, Database>(
  utils.setEvent("DAYS_AVAILABLESSINGLE")
).addAction(
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow }) => {
    let medicData = state.getMyState().medic;
    await state.update({
      medic: { ...medicData, chosenDay: parseInt(ctx.body) },
    });
    medicData = state.getMyState().medic;
    if (ctx.body.toLowerCase() == "consulta")
      return gotoFlow(giveQueryTypesSingle);
    if (
      ctx.body.toLowerCase() == "si quiero" ||
      ctx.body.toLowerCase() == "quiero" ||
      ctx.body.toLowerCase() == "siquiero" ||
      ctx.body.toLowerCase() == "si"
    ) {
      return gotoFlow(menuFlow);
    }
    if (ctx.body.toLowerCase() == "menu") {
      return gotoFlow(menuFlow);
    }

    if (medicData.turnsZeroThisWeek) {
      if (ctx.body.toLowerCase() == "proxima" || ctx.body.toLowerCase() === "Proxima" || ctx.body.toLowerCase() === "Próxima") {
        await state.update({
          medic: {
            ...medicData,
            comeFromErrorNext: true,
            week: medicData.week + 1,
          },
        });
        return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
      } else {
        return gotoFlow(giveDaysWhenMedicWorkSingle);
      }
    } else {
      if (ctx.body.toLowerCase() == "proxima" || ctx.body.toLowerCase() === "Proxima" || ctx.body.toLowerCase() === "Próxima") {
        await state.update({
          medic: {
            ...medicData,
            comeFromErrorNext: true,
            week: medicData.week + 1,
          },
        });
        return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
      }
      if (ctx.body.toLowerCase() == "actual") {
        return gotoFlow(giveDaysWhenMedicWorkSingle);
      } else if (ctx.body.toLowerCase() == "consulta") {
        return gotoFlow(giveQueryTypesSingle);
      }
      const optionChoosen = medicData.chosenDay;
      if (medicData.businessHoursFiltered[optionChoosen] != undefined) {
        const minutesChoosen = medicData.minutes;

        const daySelectedOfMedicWork =
          medicData.businessHoursFiltered[optionChoosen];
          const selectedDayOfWeek = daySelectedOfMedicWork.daysOfWeek[0]; // Día de la semana seleccionado por el cliente
          const diaEligidoDayjs = dayjs()
          .set("d", selectedDayOfWeek)
          .add(medicData.week, "week");
        console.log("DAY SELECT OF MEDIC WORK: ", diaEligidoDayjs);
        const turnsOfDaysSelectedAndAfterTodayBeforeSunday = state
          .getMyState()
          .medic.turns.filter((turn) => {
            return (
              (turn.fixed === false &&
                dayjs(turn.start).day() === selectedDayOfWeek &&
                dayjs(turn.start).isSame(diaEligidoDayjs, "day")) ||
              (turn.fixed === true && turn.daysOfWeek[0] === selectedDayOfWeek)
            );
          })
          .map((turn) => {
            if (turn.fixed == true) {
              return {
                ...turn,
                start: dayjs()
                  .day(turn.daysOfWeek[0])
                  .set("hour", parseInt(turn.startTime.split(":")[0]))
                  .set("minute", parseInt(turn.startTime.split(":")[1]))
                  .add(medicData.week, "week")
                  .set("second", 0)
                  .format("YYYY-MM-DDTHH:mm:ss"),
                end: dayjs()
                  .day(turn.daysOfWeek[0])
                  .set("hour", parseInt(turn.endTime.split(":")[0]))
                  .set("minute", parseInt(turn.endTime.split(":")[1]))
                  .add(medicData.week, "week")
                  .set("second", 0)
                  .format("YYYY-MM-DDTHH:mm:ss"),
              };
            }
            return { ...turn, start: turn.start, end: turn.end };
          });

        if (turnsOfDaysSelectedAndAfterTodayBeforeSunday.length == 0) {
          const splitStartHourStartTime =
            daySelectedOfMedicWork.startTime.split(":")[0];
          const splitStartMinutesStartTime =
            daySelectedOfMedicWork.startTime.split(":")[1];
          const splitStartHourEndTime =
            daySelectedOfMedicWork.endTime.split(":")[0];
          const splitStartMinutesEndTime =
            daySelectedOfMedicWork.endTime.split(":")[1];
          /* START TIME Y END TIME */
          let dayTodayStartTime = dayjs()
            .set("d", daySelectedOfMedicWork.daysOfWeek[0])
            .set("hour", +splitStartHourStartTime)
            .set("minute", +splitStartMinutesStartTime)
            .set("second", 0);
          const dayTodayEndTime = dayjs()
            .set("d", daySelectedOfMedicWork.daysOfWeek[0])
            .set("hour", +splitStartHourEndTime)
            .set("minute", +splitStartMinutesEndTime)
            .set("second", 0);

          const giveHours = [daySelectedOfMedicWork.startTime];
          const giveHoursFormatted = [
            dayTodayStartTime.format("YYYY-MM-DDTHH:mm:ss"),
          ];
          if (minutesChoosen > 60) {
            while (dayTodayStartTime < dayTodayEndTime) {
              dayTodayStartTime = dayTodayStartTime.add(
                minutesChoosen,
                "minute"
              );
              if (
                Math.abs(dayTodayStartTime.diff(dayTodayEndTime, "minute")) >=
                minutesChoosen
              ) {
                giveHours.push(dayTodayStartTime.format("HH:mm"));
                giveHoursFormatted.push(
                  dayTodayStartTime.format("YYYY-MM-DDTHH:mm:ss")
                );
              }
            }
          } else {
            while (dayTodayStartTime < dayTodayEndTime) {
              dayTodayStartTime = dayTodayStartTime.add(60, "minute");
              if (
                Math.abs(dayTodayStartTime.diff(dayTodayEndTime, "minute")) >=
                60
              ) {
                giveHours.push(dayTodayStartTime.format("HH:mm"));
                giveHoursFormatted.push(
                  dayTodayStartTime.format("YYYY-MM-DDTHH:mm:ss")
                );
              }
            }
          }
          const hourstovide = giveHours
            .map((hour, index) => ({
              body: `*${index}*. Horarios disponibles en el día *${dayjs().set("h", hour.split(":")[0]).set("m", hour.split(":")[1]).format("hh:mm a")}* ⏰`,
            }))
            .concat([
              {
                body: "\n*Elige el horario disponible con el numero correspondiente* 🔢\nEscribe *dias* si deseas elegir otro día.",
              },
            ])
            /*  */
            .map((item) => item.body)
            .join("\n");

          await state.update({
            medic: {
              ...medicData,
              horariosIndex: giveHours.map((turn, index) => index),
              horariosAvailable: hourstovide,
              horariosformatted: giveHoursFormatted,
              firstTime: true,
            },
          });
          await flowDynamic(
            `Eligiste el dia: *${dayjs().set("d", daySelectedOfMedicWork.daysOfWeek[0]).add(medicData.week, "week").format("dddd D, MMMM")}* Desde: *${
              daySelectedOfMedicWork.startTime
            }* Hasta: *${daySelectedOfMedicWork.endTime}*\n\n` + hourstovide
          );
          return gotoFlow(saveTurnSingle);
        } else {
          /* const startTimeWork = {
            start: dayjs()
              .day(selectedDayOfWeek)
              .set(
                "hour",
                parseInt(daySelectedOfMedicWork.startTime.split(":")[0])
              )
              .set(
                "minute",
                parseInt(daySelectedOfMedicWork.startTime.split(":")[1])
              )
              .add(medicData.week, "week")
              .set("second", 0)
              .format("YYYY-MM-DDTHH:mm:ss"),
            end: dayjs(turnsOfDaysSelectedAndAfterTodayBeforeSunday[0].start)
              .set(
                "hour",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[0])
              )
              .set(
                "minute",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[1])
              )
              .add(medicData.week -1 , "week")
              .set("second", 0)
              .format("YYYY-MM-DDTHH:mm:ss"),
          };

          const endTimeWork = {
            start: dayjs()
              .day(selectedDayOfWeek)
              .set(
                "hour",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[0])
              )
              .set(
                "minute",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[1])
              )
              .add(medicData.week, "week")
              .set("second", 0)
              .format("YYYY-MM-DDTHH:mm:ss"),
              end: dayjs()
              .day(selectedDayOfWeek)
              .set(
                "hour",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[0])
              )
              .set(
                "minute",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[1])
              )
              .add(medicData.week -1, "week")
              .set("second", 0)
              .format("YYYY-MM-DDTHH:mm:ss"),
          };
          turnsOfDaysSelectedAndAfterTodayBeforeSunday.unshift(startTimeWork);
          turnsOfDaysSelectedAndAfterTodayBeforeSunday.push(endTimeWork); */
          console.log(
            "TURNS SELECCIONADOS: START: ",
            turnsOfDaysSelectedAndAfterTodayBeforeSunday.map((turn) =>
              dayjs(turn.start).format("D dddd HH:mm")
            ),
            "TURNOS SELECCIONADO END: ",
            turnsOfDaysSelectedAndAfterTodayBeforeSunday.map((turn) =>
              dayjs(turn.end).format("D dddd HH:mm")
            )
          );
          let availableTurnsString = [];
          function generateTimeSlots() {
            const slots = [];
            let currentTime = dayjs()
              .day(selectedDayOfWeek)
              .set(
                "hour",
                parseInt(daySelectedOfMedicWork.startTime.split(":")[0])
              )
              .set(
                "minute",
                parseInt(daySelectedOfMedicWork.startTime.split(":")[1])
              )
              .add(medicData.week, "week")
              .set("second", 0);

            const endTime = dayjs()
              .day(selectedDayOfWeek)
              .set(
                "hour",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[0])
              )
              .set(
                "minute",
                parseInt(daySelectedOfMedicWork.endTime.split(":")[1])
              )
              .add(medicData.week, "week")
              .set("second", 0)
              .format("YYYY-MM-DDTHH:mm:ss");

            while (
              currentTime.add(minutesChoosen, "minutes").isBefore(endTime) ||
              currentTime.isSame(endTime)
            ) {
              slots.push(currentTime);
              currentTime = currentTime.add(minutesChoosen, "minutes");
            }

            return slots;
          }

          const totalSlots = generateTimeSlots();
          const availableSlots = totalSlots.filter((slot) => {
            const slotStart = slot;
            const slotEnd = slotStart.clone().add(minutesChoosen, "minutes");
            console.log(
              "SLOT INICIO ",
              slotStart.format("YYYY-MM-DDTHH:mm:ss"),
              "SLOT FINAL ",
              slotEnd.format("YYYY-MM-DDTHH:mm:ss")
            );
            // Verificar si el slot se solapa con algún turno existente
            const isSlotAvailable =
              !turnsOfDaysSelectedAndAfterTodayBeforeSunday.some((turn) => {
                const turnStart = dayjs(turn.start);
                const turnEnd = dayjs(turn.end);
                const overlaps =
                  slotStart.isBefore(turnEnd, "minute") &&
                  slotEnd.isAfter(turnStart, "minute");
                console.log(
                  "TURNO SOME START: ",
                  turnStart.format("YYYY-MM-DDTHH:mm:ss"),
                  " TURNO SOME END: ",
                  turnEnd.format("YYYY-MM-DDTHH:mm:ss"),
                  " FALSO?? ",
                  overlaps
                );
                return overlaps;
              });
            return isSlotAvailable;
          });
          availableTurnsString = availableSlots.map((slot, index) => ({
            body: `*${index}*. ¡Turno Disponible! 🕰️ *${dayjs(slot).format(
              "dddd D, HH:mm a"
            )}*`,
          }));
          const turnsAvailables = availableTurnsString
            .concat([
              {
                body: `¡Genial! 🌈 Estos son los turnos disponibles para el *${dayjs()
                  .set("day", daySelectedOfMedicWork.daysOfWeek[0])
                  .set(
                    "hour",
                    parseInt(daySelectedOfMedicWork.endTime.split(":")[0])
                  )
                  .set(
                    "minute",
                    parseInt(daySelectedOfMedicWork.endTime.split(":")[1])
                  )
                  .add(medicData.week, "week")
                  .format(
                    "dddd D"
                  )}*\n\nEscribe *dias* si deseas elegir otro día.`,
              },
            ])
            .map((item) => item.body)
            .join("\n");
          /* const turnsAvailablesToGive =
            turnsOfDaysSelectedAndAfterTodayBeforeSunday
              .sort((a, b) => a.start - b.start)
              .filter((turn, index, array) => {
                const nextTurn = array[index + 1];
                return (
                  nextTurn != undefined &&
                  Math.abs(dayjs(turn.end).diff(dayjs(nextTurn.start))) /
                    60000 >=
                    minutesChoosen
                );
              })
              .map((turn) => dayjs(turn.end).format("YYYY-MM-DDTHH:mm:ss")); */
          if (availableSlots.length === 0) {
            await flowDynamic(
              "¡Oops! 😕 No hay turnos disponibles para este día. Por favor, elige otro."
            );
            if (medicData.week > 0) {
              return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
            }
            return gotoFlow(giveDaysWhenMedicWorkSingle);
          } else {
            await state.update({
              medic: {
                ...medicData,
                horariosIndex: availableSlots.map((turn, index) => index),
                horariosAvailable: turnsAvailables,
                horariosformatted: availableSlots.map((slot) =>
                  dayjs(slot).format("YYYY-MM-DDTHH:mm:ss")
                ),
                firstTime: false,
              },
            });
            await flowDynamic(turnsAvailables);
            return gotoFlow(saveTurnSingle);
          }
        }
      } else {
        if (medicData.week > 0) {
          await state.update({
            medic: {
              ...medicData,
              comeFromErrorNext: false,
            },
          });
          await flowDynamic([
            {
              body: "*POR FAVOR* 🙏 Elige un día correcto usando los números 🔢...",
            },
          ]);
          return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
        } else {
          await flowDynamic([
            {
              body: "*POR FAVOR* 🙏 Elige un día correcto usando los números 🔢...\nEscribe *consulta* si quieres elegir otro tipo de consulta.",
            },
          ]);
          return gotoFlow(giveDaysWhenMedicWorkSingle);
        }
      }
    }
  }
);
