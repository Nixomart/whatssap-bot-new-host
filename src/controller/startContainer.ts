import Docker from "dockerode";
const docker = new Docker();
export const startContainer = async (req, res) => {
  const { idContainer } = req.params;
  try {
    const container = docker.getContainer(idContainer);
    await container.start();
    const containerInfo = await container.inspect();
    const port = containerInfo.NetworkSettings.Ports['4000/tcp'][0].HostPort;
    res.json({ status: 200, message: "container up", puerto: port });
  } catch (error) {
    console.log("ERROR, ", error);
    res.status(500).json({ status: 500, message: "container not fount?" });
  }
};
