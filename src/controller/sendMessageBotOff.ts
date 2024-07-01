import { ApiResponse } from "~/dto/ApiResponse.js";
import provider from "../provider/provider.js";

export const sendMessageBotOff = async (bot, req, res) => {
  const { phone } = req.params;
  try {
    const number = `549${phone}`;
    const message = `🚨🔴🚨 ALERTA URGENTE 🚨🔴🚨
    
          ¡El bot se ha APAGADO! 🛑 Esto impide que tus pacientes puedan comunicarse automáticamente con nuestro sistema. 🚫🤖
          
          👉 Por favor, accede inmediatamente al sistema para prender tu bot y de nuevo scanear el código QR. 📲 Necesitamos restablecer la conexión a la mayor brevedad posible.
          
          🔄 Mientras tanto, estaremos utilizando el sistema de respaldo para garantizar la continuidad del servicio.
          
          🙏 Agradecemos tu rápida respuesta. ¡Es urgente!`;
    await bot.sendMessage(number, message, {});
    const response:ApiResponse<string> = {
      message: "message sent! bot off",
      status: "success",
      status_code: 200,
      data: "enviado!",
    };
    res.end(JSON.stringify(response));
  } catch (error) {
    const response:ApiResponse<string> = {
      message: "error to send message bot off",
      status: "error",
      status_code: 500,
      data: null,
    };
      res.end(JSON.stringify(response));
  }
};
