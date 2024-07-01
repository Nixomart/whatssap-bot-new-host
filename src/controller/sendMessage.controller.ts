import { ApiResponse } from "~/dto/ApiResponse";
import provider from "../provider/provider";

export const sendMessage = async  (bot,req, res) =>{
    try {
        const { turnToSend } = req.body;
        const specialist = turnToSend[0];
        const data = turnToSend[1];
  
        let turnsText = "";
        specialist.turns.forEach((turn) => {
          turnsText += `Fecha: ${turn.date}, Cliente: ${turn.customer}\n`;
        });
        if (specialist) {
          const number = `${specialist.phone}`;
          const templateButtons = [
            {
              index: 1,
              urlButton: {
                displayText: ":star: Ver tu calendario de turnos!",
                url: specialist.link,
              },
            },
          ];
  
          let turnsText = "";
          specialist.turns.forEach((turn) => {
            turnsText += `✅ *Cliente:* ${turn.customer}, 🕗 *Fecha:* ${turn.date} \n`;
          });
  
          const message =  `💢💢 Hola, *${specialist.specialist}.* 👨‍⚕️ 💢💢 \n\n *Tienes los siguientes turnos:*\n${turnsText} \n\n *Para ver tu calendario de turnos, ingresa a este sitio* \n\n ${specialist.link}`
          
           await bot.sendMessage(number, message , {});
          console.log("number: ", number, "ENVIA A ESPECIALISTA ESPECIALISTA, RAPIDO: /send-message-provider");
        }
  
        const response: ApiResponse<null> ={
          message: "send message to specialist fast",
          status: "success",
          status_code: 200,
          data: null,
        }
        res.end(JSON.stringify(response));
      } catch (error) {
        console.log("ERROR AL ENVIAR ESPECIALISTA PAPIDO: ", error);
        const response: ApiResponse<null> ={
          message: error.message,
          status: "error",
          status_code: 500,
          data: null,
        }
        res.end(JSON.stringify(response));
      }
}