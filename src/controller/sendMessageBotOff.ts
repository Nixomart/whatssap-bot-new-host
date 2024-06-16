import provider from "../provider/provider.js"

export const sendMessageBotOff = async(req, res) =>{
    const {phone} = req.params
    try {
        const id = `549${phone}@c.us`;
        const templateMessage = {
          text: `🚨🔴🚨 ALERTA URGENTE 🚨🔴🚨
    
          ¡El bot se ha APAGADO! 🛑 Esto impide que tus pacientes puedan comunicarse automáticamente con nuestro sistema. 🚫🤖
          
          👉 Por favor, accede inmediatamente al sistema para prender tu bot y de nuevo scanear el código QR. 📲 Necesitamos restablecer la conexión a la mayor brevedad posible.
          
          🔄 Mientras tanto, estaremos utilizando el sistema de respaldo para garantizar la continuidad del servicio.
          
          🙏 Agradecemos tu rápida respuesta. ¡Es urgente!`,
          footer: "Sistema: PedirTurno.online",
        };
        const abc = await provider.getInstance();
        await abc.sendMessage(id, templateMessage);
        res.send({ data: "enviado!" });
      } catch (error) {
       
        res.send({ data: "No se pudo enviar mensaje" });
      }
}