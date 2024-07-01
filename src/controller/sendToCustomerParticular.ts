import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";
export const sendToCustomerParticular = async (bot,req, res) => {
  const { turnToSendCustomer } = req.body;
  try {
    const number = `${turnToSendCustomer.phone}`;
    let message;
    if (turnToSendCustomer.fixed === true) {
      message = `🔵🔵*TURNO CONFIRMADO*🔵🔵 🧨 \n\n💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes un turno *RECURRENTE* con: *${
          turnToSendCustomer.newTurn.specialist
        }* \n 📅Los dias: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n *Mensaje del Especialista: *${
          turnToSendCustomer.message
        }*\n\n*METODO DE PAGO*\n ${turnToSendCustomer.newTurn.paymentMethod
          .map(
            (pay, index) =>
              `${
                pay === "os"
                  ? "Obra Social"
                  : pay === "transfer"
                  ? "Transferencia"
                  : pay === "presential" && "Presencial"
              }`
          )
          .join("\n")}\n\n*ESTO QUIERE DECIR QUE TODOS LOS ${
          turnToSendCustomer.date
        } TIENES UN TURNO, ESCRIBE "mispagos ${
          turnToSendCustomer.name
        }" PARA VER QUE TURNOS TIENES A PAGAR*`
    } else {
      message =  `🔵🔵*TURNO CONFIRMADO*🔵🔵 🧨 \n\n💢💢 Estimado/a, *${
          turnToSendCustomer.nameLastname
        }*.  💢💢 \n\n🟢Tienes turno con: *${
          turnToSendCustomer.newTurn.specialist
        }* \n 📅El dia: *${turnToSendCustomer.date}* \n 📍Lugar: *${
          turnToSendCustomer.address
        }*\n *Mensaje del Especialista:* *${
          turnToSendCustomer.message
    }*\n\n*METODO DE PAGO*\n ${turnToSendCustomer.newTurn.paymentMethod
          .map(
            (pay, index) =>
              `${
                pay === "os"
                  ? "Obra Social"
                  : pay === "transfer"
                  ? "Transferencia"
                  : pay === "presential" && "Presencial"
              }`
          )
          .join("\n")}\n\n *ESCRIBE "mispagos ${
          turnToSendCustomer.name
        }" PARA VER QUE TURNOS TIENES A PAGAR*`
    }
    const response: ApiResponse<string> = {
      message: "send turn to customer particular",
      status: "success",
      status_code: 200,
      data: null,
    };
    await bot.sendMessage(number, message, {});
    res.end(JSON.stringify(response));
  } catch (error) {
    const response: ApiResponse<string> = {
      message: error.message,
      status: "error",
      status_code: 500,
      data: null,
    };
    console.log("ERROR AL ENVIAR TURNO CONFIRMADO MEDIANTE ESTE DOCKER: ", error);
    res.end(JSON.stringify(response));
  }
};
