import { addKeyword, utils } from "@builderbot/bot";
import dayjs from "dayjs";
/*  */
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database } from "@builderbot/bot";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import giveQueryTypesSingle from "./singleFlows/giveQueryTypesSingle";
import editTurnWelcome from "./editTurn/editTurnWelcome";
import cancelTurnWelcome from "./cancelTurn/cancelTurnWelcome";
import menuFlow from "./menu.flow";
import giveDaysWhenMedicWorkNextWeekSingle from "./singleFlows/giveDaysWhenMedicWorkNextWeekSingle";
import giveDaysWhenMedicWorkSingle from "./singleFlows/giveDaysWhenMedicWorkSingle";
/* import giveDaysWhenMedicWorkSingle from "../flows/singleFlows/giveDaysWhenMedicWorkSingle.js";
import giveDaysWhenMedicWorkNextWeekSingle from "../flows/singleFlows/giveDaysWhenMedicWorkNextWeekSingle.js";
import giveQueryTypesSingle from "../flows/singleFlows/giveQueryTypesSingle.js";
import editTurnWelcome from "../flows/editTurn/editTurnWelcome.js";
import cancelTurnWelcome from "../flows/cancelTurn/cancelTurnWelcome.js";
import menuFlow from "./menu.flow.js";
import payFlowCome from "./pay/payFlow.come.js"; */
dayjs.extend(isSameOrAfter);

export default addKeyword<Provider, Database>(
  utils.setEvent("WELCOME_FLOW")
).addAction(
  { capture: true },
  async (ctx, { state, flowDynamic, gotoFlow, endFlow }) => {
    const medicData = state.getMyState().medic;
    /* if (ctx.body.toLowerCase() == "pagar") {
      return gotoFlow(payFlowCome)
    } */
    if (ctx.body.toLocaleLowerCase() == "si quiero") {
      
      const medicData = state.getMyState().medic;
      const turnosWithouFixed = medicData.turns
        .filter(
          (tu) =>
            tu.customer.phone === ctx.from &&
            tu.fixed === false &&
            dayjs(tu.start).isSameOrAfter(dayjs(), "h")
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.start).valueOf() - new Date(b.start).valueOf()
        );
      const turnsFixeds = medicData.turns.filter(
        (turn) => turn.customer.phone == ctx.from && turn.fixed === true
      );
      const turnosFixedMaps = turnsFixeds.map((turn) => {
        if (turn.daysOfWeek[0] > dayjs().get("d")) {
          return {
            ...turn,
            week: 0,
          };
        }
        return {
          ...turn,
          week: 1,
        };
      });
      if (turnosWithouFixed.length === 0 && turnosFixedMaps.length === 0) {
      console.log("ENTRA POR ACA ?? VA A DAR LOS TIPOS DE TURNOS");

         return gotoFlow(giveQueryTypesSingle);
      }
      let mensajeDeTurnos;
      if (turnosFixedMaps.length > 0) {
        const paymentsChanged = turnosFixedMaps.map((turno)=>{
          if (Object.prototype.hasOwnProperty.call(turno, "payment")) {
            console.log("entra aca");
            let reestablecido;
            reestablecido = false;
            const diaDelTurno = dayjs()
              .day(turno.daysOfWeek[0])
              .hour(parseInt(turno.startTime.split(":")[0]))
              .minute(parseInt(turno.startTime.split(":")[1]));
            const hoy = dayjs(); // Fecha actual
            const diadelpago = dayjs(turno.payment);
            const inicioSemanaHoy =
              hoy.get("d") == 0
                ? hoy.startOf("week").add(1, "week").day(0)
                : hoy.startOf("week").day(0);
            const inicioSemanaPago =
              diadelpago.get("d") == 0
                ? diadelpago.startOf("week").add(1, "week").day(0)
                : diadelpago.startOf("week").day(0);
                console.log("INICO SEMANA HOY: ", inicioSemanaHoy.format("DD/MM/YYYY"));
                console.log("INICO SEMANA HOY: ", inicioSemanaPago.format("DD/MM/YYYY"));
                
            if (
              hoy.get("d") > turno.daysOfWeek[0] &&
              inicioSemanaHoy.isSame(inicioSemanaPago, "week") &&
              diadelpago.isBefore(diaDelTurno, "m") &&
              diadelpago.isSameOrBefore(diaDelTurno, "d")
            ) {
              reestablecido = true;
              console.log("PAGO REESTABLECIDO IF 1 ");
              return {
                ...turno,
                week: 0,
                status: "TRANSFER_MEDIC_NO",
                imageConfirmation: null,
                payment: null,
              };
            }
            if (
              hoy.day() < turno.daysOfWeek[0] &&
              inicioSemanaHoy.isAfter(inicioSemanaPago, "week") &&
              diadelpago.isBefore(diaDelTurno, "minute") &&
              diadelpago.isSameOrBefore(diaDelTurno, "d")
            ) {
              console.log("PAGO REESTABLECIDO IF 2 ");
              reestablecido = true;
              return {
                ...turno,
                week: 1,
                status: "TRANSFER_MEDIC_NO",
                imageConfirmation: null,
                payment: null,
              };
            }
            if ( hoy.day() === turno.daysOfWeek[0] &&
            inicioSemanaHoy.isAfter(inicioSemanaPago, "week") &&
            diadelpago.isBefore(diaDelTurno, "minute") &&
            diadelpago.isSameOrBefore(diaDelTurno, "d")) {
              return {
                ...turno,
                week: 1,
                status: "TRANSFER_MEDIC_NO",
                imageConfirmation: null,
                payment: null,
              };
            }
          }
          return {...turno}
        })
        mensajeDeTurnos = paymentsChanged
          .map((turno) => {
            const fechaFormateada = dayjs()
              .set("day", turno.daysOfWeek[0])
              .set("hour", parseInt(turno.startTime.split(":")[0]))
              .set("minute", parseInt(turno.startTime.split(":")[1]))
              .add(turno.week, "week")
              .format("dddd, D [a las] hh:mm A"); // Ejemplo: "lunes a las 03:00 PM"
            switch (turno.status) {
              case "TRANSFER_MEDIC_NO":
                return `Tienes un turno recurrente para ${
                  turno.week == 0 ? "este" : "el proximo"
                }  *${fechaFormateada}* Paga este turno para confirmarlo. Escribe *${
                  "mispagos" + " " + medicData.consultName
                }* para pagar tus turnos`;
              case "TRANSFER_CUSTOMER_YES":
                return `Tienes un turno recurrente para ${
                  turno.week == 0 ? "este" : "el proximo"
                } *${fechaFormateada}* Haz pagado este turno. *Espera a que el Profesional confirme la transferencia.*`;
              case "TURNO_CONFIRMED":
                return `Tienes un turno recurrente para ${
                  turno.week == 0 ? "este" : "el proximo"
                } *${fechaFormateada}*. *CONFIRMADO*.`;
              case "TURNO_MEDIC_CONFIRMED":
                return `Tienes un turno recurrente para ${
                  turno.week == 0 ? "este" : "el proximo"
                } *${fechaFormateada}*. *CONFIRMADO*.`;
              default:
                break;
            }
          })
          .join("\n\n");
      }
      const turnosWithoutFixed = turnosWithouFixed
        .map((turn) => {
          switch (turn.status) {
            case "TRANSFER_CUSTOMER_NO":
              return `📅 ¡Turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")} *A PAGAR VIA TRANSFERENCIA*`;
            case "TRANSFER_CUSTOMER_YES":
              return `📅 ¡Turno registrado para el día! ${dayjs(
                turn.start
              ).format(
                "dddd D, MMMM HH:mm a"
              )} *ESPERA ALA CONFIRMACION DE TRANSFERENCIA ENVIADA*`;
            case "OS_CUSTOMER_YES":
              return `¡Turno registrado para el día! ${dayjs(turn.start).format(
                "dddd D, MMMM HH:mm a"
              )} *ESPERAR CONFIRMACION DEL TURNO*`;
            case "PRESENTIAL_CUSTOMER_YES":
              return `¡Turno registrado para el día! ${dayjs(turn.start).format(
                "dddd D, MMMM HH:mm a"
              )} *ESPERAR CONFIRMACION DEL TURNO*`;
            case "TURNO_MEDIC_CONFIRMED":
              return `📅 ¡Turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")} *CONFIRMADO*`;
            case "ALLP_MEDIC_NO":
              return `📅 ¡Turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")} *ELGIR METODO DE PAGO*`;
            case "TRANSFER_MEDIC_NO":
              return `📅 ¡Turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")} *A PAGAR VIA TRANSFERENCIA*`;
            case "OS_MEDIC_NO":
              return `📅 ¡Turno registrado para el día! ${dayjs(
                turn.start
              ).format(
                "dddd D, MMMM HH:mm a"
              )} Pero no eligiste un metodo de pago Escriba ${
                "mispagos " + medicData.consultName
              } para confirmar tu turno`;
            case "TURNO_CUSTOMER_CONFIRMED":
              return `📅 ¡Ya tienes un turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")} *CONFIRMADO*`;
            case "TURNO_CONFIRMED":
              return `📅 ¡Ya tienes un turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")}  *CONFIRMADO*`;
            case "PRESENTIAL_MEDIC_YES":
              return `📅 ¡Ya tienes un turno registrado para el día! ${dayjs(
                turn.start
              ).format("dddd D, MMMM HH:mm a")} *ELGIR METODO DE PAGO*`;
            default:
              break;
          }
        })
        .join("\n\n");
      // eslint-disable-next-line builderbot/func-prefix-endflow-flowdynamic
      return endFlow(
        `📅 Tienes turnos registrados!. Aquí están los detalles:\n\n${turnosWithoutFixed} ${
          turnosFixedMaps.length > 0 ? "\n\n" + mensajeDeTurnos : ""
        } \n\nEscribe *${
          "mispagos" + " " + medicData.consultName
        }* para pagar tus turnos.
        \nSi deseas ver el menu principal, escribe *miturno ${medicData.consultName}*`
      );
      /* switch (turno.status) {
        case "TRANSFER_CUSTOMER_NO":
          state.update({ turnoNew: turno });
          return flowDynamic([
            {
              body: `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
                turno.start
              ).format(
                "dddd D, MMMM HH:mm a"
              )}\nPero aún no has enviado la foto de confirmación de la transferencia. Por favor, envíala ahora mismo siguiendo las instrucciones anteriores.\n\n*Recuerda que solo se acepta una foto como confirmación.*`,
            },
            {
              body: `Bien. Aquí tienes los datos para realizar la transferencia al Profesional:\n\n💳 CBU: ${dataTransfer.cbu}\n🏷️ ALIAS: ${dataTransfer.alias}\n👤 NOMBRE: ${dataTransfer.name}\n\n💰 VALOR DE LA CONSULTA: *${turno.price}*\n\nPor favor, envía una foto de la transferencia siguiendo el ejemplo proporcionado. Si tienes mas turnos, confirma este para confirmar los demas`,
              media:
                "https://firebasestorage.googleapis.com/v0/b/calendar-dashboard-df06c.appspot.com/o/default%2FHeading.png?alt=media&token=4714f1cb-274a-4cc9-b6ad-5af9caa2f364",
            },
            {
              body: "*SOLO TIENES UN INTENTO PARA ENVIAR LA IMAGEN*",
            },
          ]);
        case "TRANSFER_CUSTOMER_YES":
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format(
              "dddd D, MMMM HH:mm a"
            )}\n\n *Espera a que el medico confirme tu transferencia*`
          );
        case "OS_CUSTOMER_YES":
          return endFlow(
            `¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format(
              "dddd D, MMMM HH:mm a"
            )}\n\n*Espera a que el medico lo confirme*`
          );
        case "PRESENTIAL_CUSTOMER_YES":
          return endFlow(
            `¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format(
              "dddd D, MMMM HH:mm a"
            )}\n\n*Espera a que el medico lo confirme*`
          );

        case "TURNO_MEDIC_CONFIRMED":
          state.update({
            medic: { ...medicData, resent: true, turnId: turno.id },
          });
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format("dddd D, MMMM HH:mm a")}`
          );
        case "ALLP_MEDIC_NO":
          state.update({
            medic: { ...medicData, resent: true, turnId: turno.id },
          });
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format(
              "dddd D, MMMM HH:mm a"
            )} pero no eligiste un metodo de pago escribe *pagar*`
          );
        case "TRANSFER_MEDIC_NO":
          console.log("ENTRA ACAAA TRANSFER_MEDIC_NO");
          state.update({ turnoNew: turno });
          return flowDynamic([
            {
              body: `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
                turno.start
              ).format(
                "dddd D, MMMM HH:mm a"
              )}\nPero aún no has enviado la foto de confirmación de la transferencia. Por favor, envíala ahora mismo siguiendo las instrucciones anteriores.\n\n*Recuerda que solo se acepta una foto como confirmación.*`,
            },
            {
              body: `Bien. Aquí tienes los datos para realizar la transferencia al Profesional:\n\n💳 CBU: ${dataTransfer.cbu}\n🏷️ ALIAS: ${dataTransfer.alias}\n👤 NOMBRE: ${dataTransfer.name}\n\n💰 VALOR DE LA CONSULTA: *${turno.price}*\n\nPor favor, envía una foto de la transferencia siguiendo el ejemplo proporcionado.`,
              media:
                "https://firebasestorage.googleapis.com/v0/b/calendar-dashboard-df06c.appspot.com/o/default%2FHeading.png?alt=media&token=4714f1cb-274a-4cc9-b6ad-5af9caa2f364",
            },
            {
              body: "*SOLO TIENES UN INTENTO PARA ENVIAR LA IMAGEN*",
            },
          ]);
        case "OS_MEDIC_NO":
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format(
              "dddd D, MMMM HH:mm a"
            )}\n\nPero no eligiste un metodo de pago *pagar* para confirmar tu turno`
          );
        case "TURNO_CUSTOMER_CONFIRMED":
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format("dddd D, MMMM HH:mm a")}`
          );
        case "TURNO_CONFIRMED":
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format("dddd D, MMMM HH:mm a")}`
          );
        case "PRESENTIAL_MEDIC_YES":
          return endFlow(
            `📅 ¡Ya tienes un turno registrado para el día!\n${dayjs(
              turno.start
            ).format(
              "dddd D, MMMM HH:mm a"
            )}\n\nPero no eligiste un metodo de pago *pagar* para confirmar tu turno`
          );
        default:
          break;
      } */
    }
     if (ctx.body.toLocaleLowerCase() === "consulta") {
      return gotoFlow(giveQueryTypesSingle);
    }
    if (ctx.body.toLocaleLowerCase() === "editar") {
      return gotoFlow(editTurnWelcome);
    }
    if (ctx.body.toLocaleLowerCase() === "cancelar") {
      return gotoFlow(cancelTurnWelcome);
    }
    if (ctx.body.toLocaleLowerCase() === "menu") {
      if (state.getMyState() === undefined) {
        return await flowDynamic("Caracter incorrecto");
      }
      return gotoFlow(menuFlow);
    }
    if (state.getMyState().medic.turnsZeroThisWeek) {
      if (ctx.body.toLocaleLowerCase() === "proxima" || ctx.body.toLowerCase() === "Proxima" || ctx.body.toLowerCase() === "Próxima") {
        return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
      } else {
        return gotoFlow(giveDaysWhenMedicWorkSingle);
      }
    } else {
      if (ctx.body.toLocaleLowerCase() === "proxima" || ctx.body.toLowerCase() === "Proxima" || ctx.body.toLowerCase() === "Próxima") {
        return gotoFlow(giveDaysWhenMedicWorkNextWeekSingle);
      }
      if (ctx.body.toLocaleLowerCase() === "actual") {
        return gotoFlow(giveDaysWhenMedicWorkSingle);
      } else if (ctx.body.toLocaleLowerCase() === "consulta") {
        return gotoFlow(giveQueryTypesSingle);
      }
    }
    await flowDynamic("Opcion incorrecta..❌")
    return gotoFlow(menuFlow);
  }
);
