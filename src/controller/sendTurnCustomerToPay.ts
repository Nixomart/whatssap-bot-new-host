import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";

export const sendTurnCustomerToPay = async (bot,req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const number = `${turnToSendCustomer.phone}`;
    let message 
    if (turnToSendCustomer.fixed === true) {
      message =  `🔵🔵*Tienes un turno RECURRENTE*🔵🔵 
         \n📅*El especialista te ha asignado un turno RECURRENTE:* \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes turno *RECURRENTE* con: *${
          turnToSendCustomer.specialist
        }* \n 📅Los dias: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\nEscribe *mispagos ${turnToSendCustomer.name}* para eligir un metodo. Deberás pagar siempre antes del proximo turno para que lo confirmes.`
    }else{
      message = `🔵🔵*Tienes un turno proveniente del sistema PedirTurno.Online*🔵🔵 
         \n📅*El especialista te ha asignado un turno:* \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes turno con: *${
          turnToSendCustomer.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\n*METODOS DE PAGO🔢* \n ${turnToSendCustomer.newTurn.paymentMethod.map(
          (pay, index) => `*${index}*. ${pay == "os"? "Obra social": pay == "presential" ? "Presencial": "Transferencia"}\n`
        )}\nEscriba *mispagos ${turnToSendCustomer.name}* para eligir un metodo`
    }
    
    await bot.sendMessage(number, message, {});
    const reponse: ApiResponse<string> = {
      message: "send message turn to pay",
      status: "success",
      status_code: 200,
      data: "enviado!",
    };

    res.end(JSON.stringify(reponse));
  } catch (error) {
    const response: ApiResponse<string> = {
      message: "error to send message turn to pay",
      status: "error",
      status_code: 500,
      data: null,
    };
    console.log("ERROR AL ENVIAR TURNO PARA PAGAR MEDIANTE ESTE DOCKER: ", error);
        res.end(JSON.stringify(response));
  }
};
