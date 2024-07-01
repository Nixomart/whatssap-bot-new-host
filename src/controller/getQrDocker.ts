import axios from "axios";
import { ApiResponse } from "~/dto/ApiResponse";
export const getQrDocker = async (bot, req, res) => {
  const { port, uid } = req.params;
  try {
    const response = await axios.get(`http://${uid}:4000/getqr`);
    res.end(JSON.stringify(response.data));
  } catch (error) {
    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty("errors")) {
      console.error("Error al obtener el QR:", error.errors[0]);
    } else {
      console.error("Error al obtener el QR:", error);
    }
    const response: ApiResponse<string> = {
      message: "error to get QR",
      status: "error",
      status_code: 500,
      data: null,
    };
    res.end(JSON.stringify(response));
  }
};
