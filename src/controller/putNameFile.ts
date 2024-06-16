import fs from "fs"
export const putNameFile = async (req, res) =>{
    const { name } = req.body;
    const fileName = `id`; // Nombre del archivo con extensión txt
    
    // Contenido del archivo, un objeto JSON con el nombre
    const fileContent = JSON.stringify({ id: `"${name}"` });

    // Ruta donde se guardará el archivo
    const filePath = `./${fileName}`; // Ajusta la ruta según tu estructura de carpetas

    // Escribe el contenido en el archivo
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al crear el archivo');
        } else {
            console.log(`Archivo ${fileName} creado correctamente`);
            // Envía el nombre del archivo creado junto con su ruta
            res.send({ fileName, filePath });
        }
    });
}