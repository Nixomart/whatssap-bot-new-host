import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";
import axios from "axios";
export const sendMessageCustomer = async (bot, req, res) => {
  const { turnToSendCustomer, data } = req.body;

  try {
    const number = `${turnToSendCustomer.phone}`;
    console.log("NUMERO: ", number);
    
    const message = `🔵🔵*Este mensaje es un recordatorio de turnos proviente del Sistema PedirTurno.Online*🔵🔵 \n\n 🧨*Este es un mensaje automatico, no respondas a esta conversacion, cualquier consulta haz con el numero del consultorio 📞📞 ${turnToSendCustomer.phoneConsult} 📞📞*🧨 \n\n 📅*Recordatorio de Turno Programado:* \n\n 💢💢 Estimado/a, *${turnToSendCustomer.nameLastname}*.  💢💢 \n\n🟢Tienes turno con: *${turnToSendCustomer.specialist}* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${turnToSendCustomer.name}*\n 🏣Dirección: *${turnToSendCustomer.address}* `;

    await bot.sendMessage(number, message, {});
    console.log(
      "NUMBER: ",
      number, 
      "ENVIA A PACIENTE RAPIDO: /send-message-provider-customer"
    );
    const response: ApiResponse<null> = {
      message: "send message to customer fast",
      status: "success",
      status_code: 200,
      data: null,
    };
    res.end(JSON.stringify(response));
  } catch (error) {
    console.log("ERROR AL ENVIAR PACIENTE: ", error);
    const response: ApiResponse<null> = {
      message: error.message,
      status: "error",
      status_code: 500,
      data: null,
    }
    res.end(JSON.stringify(response));
  }
};
