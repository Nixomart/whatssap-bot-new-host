import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";

export const sendBotNotWork = async (bot,req, res) => {
  const { phone } = req.body;
  try {
    const number = `549${phone}`;
    const message = 
       `🚨🔴🚨 ALERTA URGENTE 🚨🔴🚨

      ¡El bot se ha desconectado! 🛑 Esto impide que tus pacientes puedan comunicarse automáticamente con nuestro sistema. 🚫🤖
      
      👉 Por favor, accede inmediatamente al sistema para escanear de nuevo el código QR. 📲 Necesitamos restablecer la conexión a la mayor brevedad posible.
      
      🔄 Mientras tanto, estaremos utilizando el sistema de respaldo para garantizar la continuidad del servicio.
      
      🙏 Agradecemos tu rápida respuesta. ¡Es urgente!`
    await bot.sendMessage(number, message , {});
    const response: ApiResponse<string> = {
      message: "send message bot dont work",
      status: "success",
      status_code: 200,
      data: null,
    };
    res.end(JSON.stringify(response));
  } catch (error) {
    console.log(
      "ERROR AL EVNIAR MENSAJE DE BOT DESCONECTADO PARTICULAR: ",
    );
    const response: ApiResponse<string> = {
      message: "error to send message bot dont work",
      status: "error",
      status_code: 500,
      data: null,
    };
    res.end(JSON.stringify(response));
  }
};
