import dayjs from "dayjs";
import provider from "../provider/provider.js";

export const sendMessageCronParticular = async (data) => {
  try {
    const nextDayTurns = data.turns
      .filter((turn) => {
        const today = dayjs();
        const turnStart = dayjs(turn.start);
        const isSameOrNextWeek = turnStart.isSame(today, "week");
        const isNotToday = !dayjs(turn.create_at).isSame(today, "d");
        const isFutureTurn = turnStart.isAfter(today, "d");
        return isSameOrNextWeek && isFutureTurn && isNotToday;
      })
      .map((turn) => {
        return {
          id: `549${turn.customer.phone}@c.us`,
          templateMessage: {
            text: `🔵🔵*Este mensaje es un recordatorio de turnos proviente del Sistema PedirTurno.Online*🔵🔵 
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
                  \n 📅El dia: *${dayjs(turn.start).format(
                    "dddd D MMMM, hh:mm a"
                  )}* 
                  \n 📍Lugar: *${turn.profile.consultName}*
                  \n 🏣Dirección: *${turn.profile.address}* `,
            footer: "Sistema: PedirTurno.online",
          },
        };
      });
    const abc = await provider.getInstance();
    nextDayTurns.forEach(async (turn, index) => {
      setTimeout(async () => {
        await provider.sendMessage(turn.id, turn.templateMessage, {});

      }, index * 2 * 60 * 1000);
    });
  } catch (error) {
    console.log("error cron envio de mensaje enviado: ", error);
  }
};
