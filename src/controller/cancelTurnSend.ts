import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";

export const cancelTurnSend = async (bot,req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const number = `${turnToSendCustomer.phone}`;
    let message
    if (turnToSendCustomer.fixed === true && turnToSendCustomer.newTurn.imageConfirmation !== null) {
      message = `🔴🔴*El especialista no recibio el pago correctamente de tu turno *RECURRENTE**🔴🔴 \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n Tu turno turno con: *${
          turnToSendCustomer.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\nEscribe *mispagos ${turnToSendCustomer.consultName}* para pagarlo nuevamente\n\n*Mensaje del especialista:* *${turnToSendCustomer.message}*`
    }else{
      message = `🔴🔴*Tu turno fue cancelado*🔴🔴 \n\n 💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n Tu turno turno con: *${
          turnToSendCustomer.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n\n*Mensaje del especialista:* ${turnToSendCustomer.message}`
      }
    await bot.sendMessage(number, message , {});
    const reponse : ApiResponse<string> = {
      message: "send turn cancel message to customer",
      status: "success",
      status_code: 200,
      data: null,
    };
    res.end(JSON.stringify(reponse));
  } catch (error) {
    const response: ApiResponse<string> = {
      message: "error to send message turn cancel",
      status: "error",
      status_code: 500,
      data: null,
    };
    console.log("ERROR AL CANCELAR TURNO MEDIANTE ESTE DOCKER: ", error);
    res.end(JSON.stringify(response));
  }
};
