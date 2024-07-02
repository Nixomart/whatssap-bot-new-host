import axios from "axios";
import { ApiResponse } from "~/dto/ApiResponse";
/* SEND PARTICULAR DOCKER CONFIRMED TURN */
export const sendParticularTurnConfirmedCustomer = async (bot,req, res) => {
  const { document } = req.params;

  try {
    const { turnToSendCustomer } = req.body;
    const response = await axios.post(
      `http://${document}:4000/send-messageCustomer/confirmed`,
      { turnToSendCustomer }
    );
    console.log("RESPONSE DE ENVIAR a particular TURNO CONFIRMADO: ", response);
    /* 
        log de la funcion de ella
          console.log(
      "ID: ",
      id,
      "ENVIA A CUSTOMER PARTICULAR, RAPIDO: /send-messageCustomer"
    );
        */
    res.end(JSON.stringify(response.data));
  } catch (error) {
    console.log(
      `ERROR AL ENVIAR TURNO CONFIRMADO MEDIANTE DOCKER PARTICULAR: http://${document}:4000/send-messageCustomer/confirmed `,
      error
    );
    const response: ApiResponse<string> = {
      message: "error to send message particular turn confirmed error from DOCKER MAIN : "+error.message,
      status: "error",
      status_code: 500,
      data: null,
    };
    res.end(JSON.stringify(response));
  }
};
