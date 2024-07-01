import Docker from "dockerode";
import { ApiResponse } from "~/dto/ApiResponse";
const docker = new Docker();
export const startContainer = async (bot,req, res) => {
  const { idContainer } = req.params;
  try {
    const container = docker.getContainer(idContainer);
    await container.start();
    const containerInfo = await container.inspect();
    const port = containerInfo.NetworkSettings.Ports['4000/tcp'][0].HostPort;
    const response :ApiResponse<Object> = {
      message: "container up successfully",
      status: "success",
      status_code: 200,
      data: {
        puerto: port,
      },
    };
    res.end(JSON.stringify(response));
  } catch (error) {
    console.log("ERROR, ", error);
    const response: ApiResponse<Object> = {
      message: "error to start container: container not found?",
      status: "error",
      status_code: 500,
      data: null
    };
    res.end(JSON.stringify(response));
  }
};
