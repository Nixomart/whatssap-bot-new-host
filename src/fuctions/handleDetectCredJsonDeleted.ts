import chokidar from "chokidar";
export const handleDetectCredJsonDeleted = async () => {
  const directoryPath = "./bot_sessions/creds.json";
  // Configura el observador
  const watcher = chokidar.watch(directoryPath, {
    persistent: true, // Mantener el observador activo incluso si el proceso de Node.js se cierra
  });

  // Evento cuando se crea un archivo
  watcher.on("add", async (filePath) => {
    console.log(`Archivo creado: ${filePath} SE ACTUALIZA EL DOCUMENTO`);
    /* const id = await findContainerName();
    const docRef = doc(db, "consults", id); */
  /*   updateDoc(docRef, {
      ownBot: true,
    }); */

    // Realiza cualquier acción que desees cuando se crea un archivo
  });

  // Evento cuando se elimina un archivo
  watcher.on("unlink", async (filePath) => {
    console.log(`Archivo eliminado: ${filePath} SE ACTUALIZA EL DOCUMENTO`);
    //enviar correo ami
    /* await handleDetectBotNotWork(); */

    // Realiza cualquier acción que desees cuando se elimina un archivo
  });
};
