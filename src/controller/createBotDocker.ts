import axios from "axios";
import Docker from "dockerode";
import { ApiResponse } from "~/dto/ApiResponse";
const docker = new Docker();
const instance = axios.create();

export const createBotDocker = async (bot, req, res) => {
  const { doc } = req.params;
  try {
    // Crea un contenedor Docker basado en un Dockerfile
    const container = await docker.createContainer({
      Image: "whatssapbot-particular",
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      name: doc,
      Cmd: ["/bin/sh", "-c", "npm start"],
      ExposedPorts: { "4000/tcp": {} },
      HostConfig: {
        NetworkMode: "whatssapbots-red", // Asegúrate de que la red 'whatssapbots' existe.
        PortBindings: { "4000/tcp": [{ HostPort: "0" }] }, // Mapea el puerto 4000 del contenedor a un puerto aleatorio en el host
      },
    });

    // Inicia el contenedor
    await container.start();

    // Espera un momento para obtener el puerto mapeado
    await new Promise((resolve) => setTimeout(resolve, 4000));
    // Obtén información sobre los puertos mapeados del contenedor
    const containerInfo = await container.inspect();
    const port = containerInfo.NetworkSettings.Ports["4000/tcp"][0].HostPort;

    await instance
      .get(`http://${doc}:4000/putFile/${doc}`)
      .then(() => {
        const response: ApiResponse<Object> = {
          message: "bot created successfully",
          status: "success",
          status_code: 200,
          data: {
            puerto: port,
            id_container: container.id,
          },
        };
        res.end(JSON.stringify(response));
      })
      .catch((error) => {
        const response: ApiResponse<Object> = {
          message: "Error put file en crear contenedor",
          status: "error",
          status_code: 500,
          data: null,
        };
        console.log(
          `Error al put FIle en contenedor URL LLAMADA: ${`http://${doc}:4000/putFile/${doc}`}:`,
          error
        );
        
        res.end(JSON.stringify(response));
      });
  } catch (error) {
    console.log("Error al crear el contenedor:", error);
    const response: ApiResponse<Object> = {
      message: "Error al crear el contenedor catch",
      status: "error",
      status_code: 500,
      data: null,
    };
    res.end(JSON.stringify(response));
  }
};
