import fs from  'fs'
import path from  'path'

const carpetas = [
    './bot_sessions',
    './Bot-zimer_sessions',
    './Bot-zn_sessions',
    './Bot-zc_sessions',
    './Bot-zs_sessions'
]

const archivosAConservar = ['creds.json', 'baileys_store.json'] // Nombres de los archivos a conservar

export const  cleanFolders = () => {
    carpetas.forEach(folderPath => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error('Error al leer la carpeta:', err)
                return
            }

            files.forEach(file => {
                if (!archivosAConservar.includes(file)) {
                    // Eliminar archivo que no está en la lista de conservación
                    fs.unlink(path.join(folderPath, file), err => {
                        if (err) {
                            console.error(`Error al eliminar ${file} en ${folderPath}:`, err)
                        } else {
                            console.log(`Se eliminó ${file} correctamente en ${folderPath}.`)
                        }
                    })
                }
            })
        })
    })
}