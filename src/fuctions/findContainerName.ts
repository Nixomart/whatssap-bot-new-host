import fs from "fs";
export const findContainerName = () => {
  /* return new Promise((resolve, reject) => {
    const filePath = "./id";
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        reject(err);
        return;
      }
      try {
        const credsData = JSON.parse(data);
        if (credsData.id) {
          console.log(
            "Número ID:",
            credsData.id
          );
          resolve(credsData.id);
        } else {
          console.error(
            'El atributo "processedHistoryMessages" no está presente o no es un arreglo en el archivo.'
          );
          resolve("nada");
        }
      } catch (error) {
        console.error("Error al analizar el archivo JSON:", error);
        reject(error);
      }
    });
  }); */
};
