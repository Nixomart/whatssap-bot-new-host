import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "~/firebase/firebase.js";
import provider from "~/provider/provider";
import { utils } from "@builderbot/bot";
export const sendMessageCron = async () => {
  try {
    const q = collection(db, "consults");
    const querySnapshot = await getDocs(q);
    const allTurns = querySnapshot.docs.flatMap((doc) => {
      const data = doc.data();
      const profile = {
        ...data.profile,
        whatssap: data.whatssap,
        whatssap_enabled: data.whatssap_enabled,
        type: data.type,
        ownBotParticular: Object.prototype.hasOwnProperty.call(data, "ownBot") ? data.ownBot : null,
      };
      const turns = data.turns;

      const turnsWithProfile = turns.map((turn) => ({ ...turn, profile }));

      return turnsWithProfile;
    });
    const nextDayTurns = allTurns
      .filter((turn) => {
        const today = dayjs();
        const tomorrow = today.add(1, "day");
        const turnStart = dayjs(turn.start);
        const isSameOrNextWeek = turnStart.isSame(today, "week");
        const isNotToday = dayjs(turn.create_at).isSame(today, "d") === false;
        const isFutureTurn = turnStart.isSame(tomorrow, "day");
        const isClinica = turn.profile.type == 0;
        const isSend = turn.send === true;
        const ownBotParticular =
          turn.profile.ownBotParticular === null
            ? false
            : turn.profile.ownBotParticular;
        if ((isFutureTurn && isNotToday && isSend && isClinica) || (isFutureTurn && isNotToday && isSend && isClinica === false && ownBotParticular === false)  ) {
          console.log(
            "Turno de:",
            turn.customer.name,
            turn.customer.lastname,
            "phone",
            turn.customer.phone,
            "-",
            dayjs(turn.start).format("DD/MM/YYYY")
          );
        }
        return isFutureTurn && isNotToday && isSend && isClinica || (turn.fixed === true && (dayjs().get("d") + 1  == turn.daysOfWeek[0] || dayjs().get("d") === 6 && turn.daysOfWeek[0] == 1) )
      })
      .map((turn) => {
        return {
          number: turn.profile.type == 0 ? `549${turn.customer.phone}` : `${turn.customer.phone}`,
          message:  `🔵🔵*Este mensaje es un recordatorio de turnos proviente del Sistema PedirTurno.Online*🔵🔵 
              \n\n 🧨*Este es un mensaje automatico, no respondas a esta conversacion, cualquier consulta haz con el numero del consultorio 📞📞 ${
                turn.profile.socialNetwork.whatssap === null
                  ? turn.profile.socialNetwork.address
                  : turn.profile.socialNetwork.whatssap
              } 📞📞*🧨 
              \n\n 📅*Recordatorio de Turno Programado:* 
              \n\n 💢💢 Estimado/a, *${
                turn.customer.name + " " + turn.customer.lastname
              }*.  💢💢 
              \n\n🟢Tienes turno con: *${turn.specialist}* 
              \n 📅El dia: *${turn.fixed === false ? dayjs(turn.start).format(
                "dddd D MMMM, hh:mm a"
              ) : dayjs().day(turn.daysOfWeek[0]).set("minute", turn.startTime.split(":")[0]).set("hour",  turn.startTime.split(":")[1]).format(
                "dddd, hh:mm a"
              )}* 
              ${turn.profile.type == 0 ? `\n 📍Lugar: * ${turn.profile.consultName}*`: ""}
              \n 🏣Dirección: *${turn.profile.address}* `,
          
        };
      });
      for(const turn of nextDayTurns){
      console.log("ENVIO DE MENSAJE CRON BOT HOST, MENSAJE PARA: ", turn.number, " HORA: ", dayjs().format("dddd D MMMM, hh:mm a")  );
      await provider.sendMessage(turn.number, turn.message, {});
      await utils.delay(7000)
    }
  } catch (error) {
    console.log("error cron envio de mensaje: ", error);
  }
};
