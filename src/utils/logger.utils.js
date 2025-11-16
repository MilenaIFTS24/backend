import fs from 'fs';
import path from 'path';

const errorsLogFile = path.join(process.cwd(), 'log_errores.txt');
export const log = (capa, método, mensaje, datos = null, statusCode = 200) => {
    const hora = new Date().toLocaleTimeString();
    console.log(`[${hora}] Capa ${capa} ---> ${método}: ${mensaje} - Código ${statusCode}`);
    if (datos) {
        console.log(' Datos: ', datos);
    };
};

export const logError = (capa, metodo, error, infoExtra = '', statusCode = 500) => {
    const fechaHora = new Date().toLocaleString();
    const hora = new Date().toLocaleTimeString();

    console.error(`[${hora}] Capa ${capa} ---> ${metodo}: ERROR ${statusCode} `);
    
    if (error.message) {
        console.error(` Mensaje: ${error.message}`);
    } else {
        console.error(` Mensaje: ${error}`);
    }    

    if (infoExtra) {
        console.error(` Info: ${infoExtra}`);
    }

    //Guardo un archivo con los errores con fecha y hora.
    const mensajeError = `
        -- ERROR --
        Fecha: ${fechaHora}
        Codigo HTTP: ${statusCode}
        Capa: ${capa}
        Metodo: ${metodo}
        Mensaje: ${error.message}        
        Info Extra: ${infoExtra}
        Stack: ${error.stack}
        -------------------------
    `

    console.log('Guardando detalles del error en el archivo log_errores.txt...');
    fs.appendFile(errorsLogFile, mensajeError, (err) => {
        if (err) {
            console.error('Error al guardar el error en el archivo:', err);
        } else {
            console.log('Log de errores actualizado correctamente. Revise el archivo log_errores.txt para información más detallada de los errores.');
        }
    });
};