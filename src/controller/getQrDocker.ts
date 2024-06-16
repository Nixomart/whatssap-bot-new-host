import axios from "axios"
export const getQrDocker = async (req, res) =>{
    const { port, uid } = req.params;
    try {
        const response = await axios.get(`http://${uid}:4000/getqr`, { responseType: 'arraybuffer' });
        // Envía los datos de la imagen como respuesta
        res.status(200).send(response.data);
    } catch (error) {
        // eslint-disable-next-line no-prototype-builtins
        if (error.hasOwnProperty("errors")) {
            console.error('Error al obtener el QR:', error.errors[0] );
        }else{
            console.error('Error al obtener el QR:', error );
        }
        res.status(500).json({ error: 'Error al obtener el QR' });
    }
}