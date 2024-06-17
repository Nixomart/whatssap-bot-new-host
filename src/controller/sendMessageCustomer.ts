import provider from "../provider/provider.js";
import axios from "axios";
export const sendMessageCustomer = async (req, res) => {
  const { turnToSendCustomer, data } = req.body;
  
    try {
      const id = `${turnToSendCustomer.phone}@c.us`;
      const templateMessage = `🔵🔵*Este mensaje es un recordatorio de turnos proviente del Sistema PedirTurno.Online*🔵🔵 \n\n 🧨*Este es un mensaje automatico, no respondas a esta conversacion, cualquier consulta haz con el numero del consultorio 📞📞 ${turnToSendCustomer.phoneConsult} 📞📞*🧨 \n\n 📅*Recordatorio de Turno Programado:* \n\n 💢💢 Estimado/a, *${turnToSendCustomer.nameLastname}*.  💢💢 \n\n🟢Tienes turno con: *${turnToSendCustomer.specialist}* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${turnToSendCustomer.name}*\n 🏣Dirección: *${turnToSendCustomer.address}* `
      await provider.sendMessage(id, templateMessage, {});

      console.log(
        "ID: ",
        id,
        "ENVIA A ESPECIALISTA ESPECIALISTA, RAPIDO: /send-message-provider-customer"
      );
      res.send({ data: "enviado!" });
    } catch (error) {
      console.log("ERROR AL EVNIAR MENSAJE: ", error);
      res.send({ data: "No se pudo enviar mensaje" });
    }
};
