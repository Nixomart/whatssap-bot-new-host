/* eslint-disable no-self-assign */
/* eslint-disable no-prototype-builtins */
import dayjs from "dayjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
/*  */
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import { findContainerName } from "../../fuctions/findContainerName.js";
import welcomeFlow from "../welcome.flow.js";
import listPaymentMethods from "./listPaymentMethods.js";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { MemoryDB as Database, addKeyword, utils } from "@builderbot/bot";
import { db } from "~/firebase/firebase.js";
dayjs.extend(isSameOrAfter);

export default addKeyword<Provider, Database>(
  ["mispagos", "Mipago", "Mispagos"],
  { sensitive: true }
).addAction(async (ctx, { flowDynamic, endFlow, state, gotoFlow }) => {
  const medicosplit = ctx.body.split(" ");
  if (
    (medicosplit.length > 1 && (medicosplit[0] === "mispagos") ||
    medicosplit[0] === "Mispagos")
  ) {
    const consultsRef = collection(db, "consults");
    const qeqwe = query(
      consultsRef,
      where("consultName", "==", medicosplit[1])
    );

    const querySnapshot = await getDocs(qeqwe);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
      });
    } else {
      console.log("Documento no encontrado.");
      return endFlow(
        `Profesional no encontrado. Por favor busca escribe *mispagos "justo con el nombre del Profesional"*`
      );
    }
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        await state.update({ medic: doc.data() });
      });
      const medicData = state.getMyState().medic;
      const customerFound = medicData.customers.find(
        (customer) => customer.phone == ctx.from
      );
    }

    const medicData = state.getMyState().medic;
    if (
      medicData.paymentMethods.length !== 0 &&
      medicData.reservaciones.length !== 0 &&
      medicData.businessHours.length !== 0
    ) {
      if (medicData.onlySendMessagesBot) {
        console.log("SOLO ENVIA DE MENSAJES");

        return endFlow();
      } else {
        await flowDynamic("...🕒");
        if (medicData.ownBot === true) {
          return endFlow(
            `*¡Ups!* 🤷‍♂️\n\n👨‍⚕️ El médico tiene su propio bot de asistencia. 🤖 Si necesitas registrar un turno, simplemente envía un mensaje diciendo "turno" al siguiente número: 📲 ${medicData.profile.socialNetwork.whatssap}.\n\nO, si prefieres, puedes iniciar la conversación directamente haciendo clic en este enlace:\nhttps://wa.me/549${medicData.profile.socialNetwork.whatssap}?text=miturno\n\n¡No te quedes sin tu cita! Hazlo ahora mismo. 🕒`
          );
        }

        const customerFound = medicData.customers.find(
          (customer) => customer.phone == ctx.from
        );
        let turnos = [];
        let turno = medicData.turns
          .filter(
            (tu) =>
              tu.customer.phone === ctx.from &&
              tu.fixed === false &&
              dayjs(tu.start).isSameOrAfter(dayjs(), "h") &&
              (tu.status == "TRANSFER_CUSTOMER_NO" ||
                tu.status == "TRANSFER_MEDIC_NO" ||
                tu.status == "ALLP_MEDIC_NO" ||
                tu.status == "OS_MEDIC_NO" ||
                tu.status == "PRESENTIAL_MEDIC_YES")
          )
          .sort((a, b) => dayjs(a.start).valueOf() - dayjs(b.start).valueOf());
        turno = turno[0];
        const turnsFixeds = medicData.turns.filter(
          (turn) => turn.customer.phone == ctx.from && turn.fixed === true
        );
        const turnsWithoutThis = medicData.turns.filter(
          (turn) => turn.customer.phone != ctx.from
        );
        const turnsTHISWITHOUT = medicData.turns.filter(
          (turn) => turn.customer.phone == ctx.from && turn.fixed === false
        );
        const turnsUpdated = turnsWithoutThis.concat(turnsTHISWITHOUT);
        let turnoMasCercano = null;
        let turnoCercanoFixed = null;
        if (turnsFixeds.length > 0) {
          /* REESTABLECER PAGOS */
          let reestablecido;
          reestablecido = false;
          const turnsFixeds2 = turnsFixeds.map((turn) => {
            if (turn.hasOwnProperty("payment") && turn.payment != null) {
              const diaDelTurno = dayjs()
                .day(turn.daysOfWeek[0])
                .hour(parseInt(turn.startTime.split(":")[0]))
                .minute(parseInt(turn.startTime.split(":")[1]));
              const hoy = dayjs(); // Fecha actual
              const diadelpago = dayjs(turn.payment);
              const inicioSemanaHoy =
                hoy.get("d") == 0
                  ? hoy.startOf("week").add(1, "week").day(0)
                  : hoy.startOf("week").day(0);
              const inicioSemanaPago =
                diadelpago.get("d") == 0
                  ? diadelpago.startOf("week").add(1, "week").day(0)
                  : diadelpago.startOf("week").day(0);
              if (
                hoy.get("d") > turn.daysOfWeek[0] &&
                inicioSemanaHoy.isSame(inicioSemanaPago, "week") &&
                diadelpago.isBefore(diaDelTurno, "m") &&
                diadelpago.isSameOrBefore(diaDelTurno, "d")
              ) {
                reestablecido = true;
                console.log("PAGO REESTABLECIDO IF 1 ");
                return {
                  ...turn,
                  week: 0,
                  status: "TRANSFER_MEDIC_NO",
                  imageConfirmation: null,
                  payment: null,
                };
              }
              if (
                hoy.day() < turn.daysOfWeek[0] &&
                inicioSemanaHoy.isAfter(inicioSemanaPago, "week") &&
                diadelpago.isBefore(diaDelTurno, "minute") &&
                diadelpago.isSameOrBefore(diaDelTurno, "d")
              ) {
                console.log("PAGO REESTABLECIDO IF 2 ");
                reestablecido = true;
                return {
                  ...turn,
                  week: 1,
                  status: "TRANSFER_MEDIC_NO",
                  imageConfirmation: null,
                  payment: null,
                };
              }
              if (
                hoy.day() === turn.daysOfWeek[0] &&
                inicioSemanaHoy.isAfter(inicioSemanaPago, "week") &&
                diadelpago.isBefore(diaDelTurno, "minute") &&
                diadelpago.isSameOrBefore(diaDelTurno, "d")
              ) {
                reestablecido = true;

                return {
                  ...turn,
                  week: 1,
                  status: "TRANSFER_MEDIC_NO",
                  imageConfirmation: null,
                  payment: null,
                };
              }
              return {
                ...turn,
              };
            }
            return {
              ...turn,
            };
          });

          if (reestablecido == true) {
            console.log(
              "entra a actualizar doc ",
              turnsUpdated.concat(turnsFixeds2)
            );
            const docRef = doc(db, "consults", medicData.uid);
            await updateDoc(docRef, {
              turns: turnsUpdated.concat(turnsFixeds2),
            });
          }
          /* FILTRAR TURNOS SIN PAGOS */
          const turnsFixedWithoutPaymentToPay = turnsFixeds2.filter(
            (turn) =>
              turn.customer.phone == ctx.from &&
              turn.fixed === true &&
              turn.status !== "TRANSFER_CUSTOMER_YES" &&
              turn.status !== "OS_CUSTOMER_YES" &&
              turn.status !== "PRESENTIAL_CUSTOMER_YES" &&
              turn.status !== "TURNO_MEDIC_CONFIRMED"
          );

          const turnosFixedMaps = turnsFixedWithoutPaymentToPay.map((turn) => {
            if (
              turn.daysOfWeek[0] > dayjs().get("d") ||
              (turn.daysOfWeek[0] === dayjs().get("d") &&
                turn.startTime.split(":")[0] > dayjs().get("hour"))
            ) {
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
          const turnosWeek0 = turnosFixedMaps.filter((turn) => turn.week === 0);
          const turnosWeek1 = turnosFixedMaps.filter((turn) => turn.week === 1);
          if (turnosWeek0.length > 0 || turnosWeek1.length > 0) {
            // Encontrar el turno más cercano en week 0
            const turnoMasCercanoWeek0 = turnosWeek0.reduce(
              (minTurno, turno) => {
                return turno.daysOfWeek[0] < minTurno.daysOfWeek[0]
                  ? turno
                  : minTurno;
              },
              turnosWeek0[0]
            );

            // Encontrar el turno más cercano en week 1
            const turnoMasCercanoWeek1 = turnosWeek1.reduce(
              (minTurno, turno) => {
                return turno.daysOfWeek[0] < minTurno.daysOfWeek[0]
                  ? turno
                  : minTurno;
              },
              turnosWeek1[0]
            );

            // Determinar el turno más cercano en general
            turnoMasCercano =
              turnosWeek0.length > 0
                ? turnoMasCercanoWeek0
                : turnoMasCercanoWeek1;
            turnoCercanoFixed = dayjs()
              .day(turnoMasCercano.daysOfWeek[0])
              .hour(parseInt(turnoMasCercano.startTime.split(":")[0]))
              .minute(parseInt(turnoMasCercano.startTime.split(":")[1]))
              .add(turnoMasCercano.week, "week");
          } /* else {
            
          } */
        }
        if (turno == undefined && turnoMasCercano == null) {
          turnos = medicData.turns
            .filter(
              (turn) =>
                turn.customer.phone === ctx.from &&
                (turn.fixed === false
                  ? dayjs(turn.start).isSameOrAfter(dayjs()) &&
                    turn.customer.phone == ctx.from
                  : turn.customer.phone === ctx.from)
            )
            .map((turn) => {
              if (turn.fixed) {
                if (
                  turn.daysOfWeek[0] > dayjs().get("d") ||
                  (turn.daysOfWeek[0] === dayjs().get("d") &&
                    turn.startTime.split(":")[0] > dayjs().get("hour"))
                ) {
                  return {
                    ...turn,
                    week: 0,
                  };
                }
                return {
                  ...turn,
                  week: 1,
                };
              }
              return {
                ...turn,
                week: 1,
              };
            });
        } else {
          if (turno === undefined) {
            turno = turnoMasCercano;
          } else {
            if (turnoMasCercano == null) {
              turno = turno;
            } else {
              if (
                turnoCercanoFixed.isBefore(dayjs(turno.start), "m") &&
                turnoCercanoFixed.isSameOrAfter(dayjs())
              ) {
                turno = turnoMasCercano;
              } else {
                turno = turno;
              }
            }
          }
        }
        if (customerFound == undefined) {
          return endFlow(
            `🔍 No tienes un turno programado con el médico. Escribe *miturno  ${medicData.consultName}* para volver al menu principal y explorar otras opciones.`
          );
        } else {
          if (customerFound.ban) {
            return endFlow(
              "👨‍⚕️ El médico ha bloqueado tu número.\n\nEsto se debe a múltiples cancelaciones o postergaciones de citas. Si crees que esto es un error o deseas discutir tu situación, te recomendamos contactar directamente con el consultorio."
            );
          } else {
            if (turnos.length > 0) {
              console.log("ENTRA ACAAAAAAAA 284");

              const mensajeDeTurnos = turnos
                .map((turno) => {
                  if (turno.fixed) {
                    const fechaFormateada = dayjs()
                      .set("day", turno.daysOfWeek[0])
                      .set("hour", parseInt(turno.startTime.split(":")[0]))
                      .set("minute", parseInt(turno.startTime.split(":")[1]))
                      .format("dddd [a las] hh:mm A"); // Ejemplo: "lunes a las 03:00 PM"

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
                  }

                  switch (turno.status) {
                    case "TRANSFER_CUSTOMER_NO":
                      return `📅 ¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format(
                        "dddd D, MMMM HH:mm a"
                      )} *A PAGAR VIA TRANSFERENCIA*`;
                    case "TRANSFER_CUSTOMER_YES":
                      return `📅 ¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format(
                        "dddd D, MMMM HH:mm a"
                      )} *ESPERA ALA CONFIRMACION DE TRANSFERENCIA ENVIADA*`;
                    case "OS_CUSTOMER_YES":
                      return `¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format(
                        "dddd D, MMMM HH:mm a"
                      )} *ESPERAR CONFIRMACION DEL TURNO*`;
                    case "PRESENTIAL_CUSTOMER_YES":
                      return `¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format(
                        "dddd D, MMMM HH:mm a"
                      )} *ESPERAR CONFIRMACION DEL TURNO*`;
                    case "TURNO_MEDIC_CONFIRMED":
                      return `📅 ¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format("dddd D, MMMM HH:mm a")} *CONFIRMADO*`;
                    case "ALLP_MEDIC_NO":
                      return `📅 ¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format("dddd D, MMMM HH:mm a")} *ELGIR METODO DE PAGO*`;
                    case "TRANSFER_MEDIC_NO":
                      return `📅 ¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format(
                        "dddd D, MMMM HH:mm a"
                      )} *A PAGAR VIA TRANSFERENCIA*`;
                    case "OS_MEDIC_NO":
                      return `📅 ¡Turno registrado para el día! ${dayjs(
                        turno.start
                      ).format(
                        "dddd D, MMMM HH:mm a"
                      )} Pero no eligiste un metodo de pago Escriba ${
                        "mispagos " + medicData.consultName
                      } para confirmar tu turno`;
                    case "TURNO_CUSTOMER_CONFIRMED":
                      return `📅 ¡Ya tienes un turno registrado para el día! ${dayjs(
                        turno.start
                      ).format("dddd D, MMMM HH:mm a")} *CONFIRMADO*`;
                    case "TURNO_CONFIRMED":
                      return `📅 ¡Ya tienes un turno registrado para el día! ${dayjs(
                        turno.start
                      ).format("dddd D, MMMM HH:mm a")}  *CONFIRMADO*`;
                    case "PRESENTIAL_MEDIC_YES":
                      return `📅 ¡Ya tienes un turno registrado para el día! ${dayjs(
                        turno.start
                      ).format("dddd D, MMMM HH:mm a")} *ELGIR METODO DE PAGO*`;
                    default:
                      break;
                  }
                })
                .join("\n\n");

              return endFlow(
                `📅 Tienes turnos registrados!. Aquí están los detalles:\n\n${mensajeDeTurnos} 
                  \nSi deseas ver el menu principal, escribe *miturno ${medicData.consultName}*`
              );
            }
            if (turno === undefined) {
              return endFlow(
                `🔍 No tienes un turno programado con el médico. Escribe *miturno ${medicData.consultName}* para regresar al menu principal y explorar otras opciones.`
              );
            }
            await state.update({
              turnoNew: turno.fixed
                ? {
                    ...turno,
                    start: dayjs()
                      .day(turno.daysOfWeek[0])
                      .hour(parseInt(turno.startTime.split(":")[0]))
                      .minute(parseInt(turno.startTime.split(":")[1]))
                      .add(turno.week, "week")
                      .format("YYYY-MM-DDTHH:mm:ss"),
                  }
                : turno,
            });
            const turnoNew = state.getMyState().turnoNew;
            console.log("TURNONEW: ", turnoNew);
            const dataTransfer = medicData.paymentMethods.find(
              (pay) => pay.id === "1"
            );
            switch (turnoNew.status) {
              case "TRANSFER_CUSTOMER_NO":
                await state.update({ statuscome: "TRANSFER_MEDIC_NO" });
                await flowDynamic(
                  `Ya tienes un turno registrado para el dia \n\n *${dayjs(
                    turnoNew.start
                  ).format(
                    "dddd D, MMMM HH:mm a"
                  )}* Pero no enviaste la foto de confirmacion de transferencia. Enviala ahora mismo como lo indicado en la foto!`
                );
                await flowDynamic([
                  {
                    body: `*Aquí tienes los datos para realizar la transferencia al Profesional:*\n\n💳 CBU: ${dataTransfer.cbu}\n🏷️ ALIAS: ${dataTransfer.alias}\n👤 NOMBRE: ${dataTransfer.name}\n\n💰 VALOR DE LA CONSULTA: *$ ${turnoNew.price}*\n\nPor favor, envía una foto de la transferencia siguiendo el ejemplo proporcionado. *Si tienes mas turnos, confirma este para confirmar los demas*`,
                    media:
                      "https://firebasestorage.googleapis.com/v0/b/calendar-dashboard-df06c.appspot.com/o/default%2FHeading.png?alt=media&token=4714f1cb-274a-4cc9-b6ad-5af9caa2f364",
                  },
                ]);
                return endFlow(
                  "*SOLO TIENES UN INTENTO PARA ENVIAR LA IMAGEN*"
                );
              case "TRANSFER_MEDIC_NO":
                await state.update({ statuscome: "TRANSFER_MEDIC_NO" });
                await flowDynamic(
                  `Ya tienes un turno registrado para el dia \n\n *${dayjs(
                    turnoNew.start
                  ).format(
                    "dddd D, MMMM HH:mm a"
                  )}* Pero no enviaste la foto de confirmacion de transferencia. Enviala ahora mismo como lo indicado en la foto!`
                );
                await flowDynamic([
                  {
                    body: `*Aquí tienes los datos para realizar la transferencia al Profesional:*\n\n💳 CBU: ${dataTransfer.cbu}\n🏷️ ALIAS: ${dataTransfer.alias}\n👤 NOMBRE: ${dataTransfer.name}\n\n💰 VALOR DE LA CONSULTA: *$ ${turnoNew.price}*\n\nPor favor, envía una foto de la transferencia siguiendo el ejemplo proporcionado. *Si tienes mas turnos, confirma este para confirmar los demas*`,
                    media:
                      "https://firebasestorage.googleapis.com/v0/b/calendar-dashboard-df06c.appspot.com/o/default%2FHeading.png?alt=media&token=4714f1cb-274a-4cc9-b6ad-5af9caa2f364",
                  },
                ]);
                return endFlow(
                  "*SOLO TIENES UN INTENTO PARA ENVIAR LA IMAGEN*"
                );
              case "TURNO_CONFIRMED":
                return endFlow(
                  `📅 ¡Ya tienes un turno registrado para el día! ${
                    turnoNew.fixed == false
                      ? dayjs(turno.start).format("dddd D, MMMM HH:mm a")
                      : dayjs()
                          .set("day", turno.daysOfWeek[0])
                          .set("hour", parseInt(turno.startTime.split(":")[0]))
                          .set(
                            "minute",
                            parseInt(turno.startTime.split(":")[1])
                          )
                          .format("dddd [a las] hh:mm A")
                  } *CONFIRMADO*`
                );
              case "TRANSFER_CUSTOMER_YES":
                return endFlow(
                  `📅 ¡Ya tienes un turno registrado para el día!\n ${
                    turnoNew.fixed == false
                      ? dayjs(turno.start).format("dddd D, MMMM HH:mm a")
                      : dayjs()
                          .set("day", turno.daysOfWeek[0])
                          .set("hour", parseInt(turno.startTime.split(":")[0]))
                          .set(
                            "minute",
                            parseInt(turno.startTime.split(":")[1])
                          )
                          .format("dddd [a las] hh:mm A")
                  }\n\n *ESPERA ALA CONFIRMACION DE TRANSFERENCIA ENVIADA*`
                );
              case "OS_CUSTOMER_YES":
                return endFlow(
                  `¡Ya tienes un turno registrado para el día!\n ${
                    turnoNew.fixed == false
                      ? dayjs(turno.start).format("dddd D, MMMM HH:mm a")
                      : dayjs()
                          .set("day", turno.daysOfWeek[0])
                          .set("hour", parseInt(turno.startTime.split(":")[0]))
                          .set(
                            "minute",
                            parseInt(turno.startTime.split(":")[1])
                          )
                          .format("dddd [a las] hh:mm A")
                  }\n\n*ESPERAR CONFIRMACION DEL TURNO*`
                );
              case "PRESENTIAL_CUSTOMER_YES":
                return endFlow(
                  `¡Ya tienes un turno registrado para el día!\n ${
                    turnoNew.fixed == false
                      ? dayjs(turno.start).format("dddd D, MMMM HH:mm a")
                      : dayjs()
                          .set("day", turno.daysOfWeek[0])
                          .set("hour", parseInt(turno.startTime.split(":")[0]))
                          .set(
                            "minute",
                            parseInt(turno.startTime.split(":")[1])
                          )
                          .format("dddd [a las] hh:mm A")
                  }\n\n*ESPERAR CONFIRMACION DEL TURNO*`
                );
              case "ALLP_MEDIC_NO":
                await state.update({
                  paymentMethod: turnoNew.paymentMethod,
                  turnoChoosen: turno,
                  statuscome: "ALLP_MEDIC_NO",
                });
                return gotoFlow(listPaymentMethods);
              case "PRESENTIAL_MEDIC_YES":
                await state.update({
                  paymentMethod: turnoNew.paymentMethod,
                  turnoChoosen: turno,
                  statuscome: "PRESENTIAL_MEDIC_YES",
                });
                return gotoFlow(listPaymentMethods);
              case "OS_MEDIC_NO":
                await state.update({
                  paymentMethod: turnoNew.paymentMethod,
                  turnoChoosen: turno,
                  statuscome: "OS_MEDIC_NO",
                });
                return gotoFlow(listPaymentMethods);
              default:
                break;
            }
          }
        }
      }
    } else {
      console.log("no tiene los datos necesarios");
      return endFlow();
    }
  } else {
    return endFlow(
      "*¡Atención!* ⚠️\nCarácter incorrecto. Por favor, utiliza solo letras al buscar un médico. Si quieres buscar los pagos de un medico escribe *mispagos* junto con el nombre del medico  📝🚫"
    );
  }
});
