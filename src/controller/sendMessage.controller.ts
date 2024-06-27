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
          const id = `${specialist.phone}@c.us`;
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
  
          const templateMessage =  `💢💢 Hola, *${specialist.specialist}.* 👨‍⚕️ 💢💢 \n\n *Tienes los siguientes turnos:*\n${turnsText} \n\n *Para ver tu calendario de turnos, ingresa a este sitio* \n\n ${specialist.link}`
          
           await bot.sendMessage(id, templateMessage , {});
          console.log("ID: ", id, "ENVIA A ESPECIALISTA ESPECIALISTA, RAPIDO: /send-message-provider");
        }
  
        res.end({ data: "enviado!" });
      } catch (error) {
        console.log("ERROR AL EVNIAR MENSAJE: ", error);
        res.end({ data: "No se pudo enviar mensaje" });
      }
}