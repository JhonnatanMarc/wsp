const venom = require('venom-bot');
const path = require('path'); // Para manejar rutas de archivos

venom.create({
  session: 'whatsapp-session',
  headless: false,
  useChrome: true,
  debug: true,
  logQR: true,
  browserWS: false,
  chromiumFlags: ['--no-sandbox', '--disable-setuid-sandbox'],
})
  .then((client) => start(client))
  .catch((error) => console.error('Error al iniciar Venom:', error));

function start(client) {
  let catalogSent = false; // Bandera para verificar si ya se envió el catálogo
  let waitingForResponse = false; // Bandera para verificar si se espera una respuesta

  client.onMessage(async (message) => {
    console.log('Mensaje recibido:', message.body);

    // Si el catálogo aún no se ha enviado
    if (!catalogSent) {
      try {
        // Ruta del archivo PDF
        const pdfPath = path.join(__dirname, 'CATALOGO CASCADAS.pdf');
        const pdfName = 'CATALOGO CASCADAS.pdf';

        // Enviar mensaje inicial y el archivo PDF
        await client.sendText(
          message.from,
          'Buenos días de la empresa Cascadas Group. Aquí tienes el archivo de catálogo que te brindamos para que puedas ver nuestros productos.'
        );
        console.log('Mensaje inicial enviado.');

        await client.sendFile(message.from, pdfPath, pdfName, 'Aquí tienes el catálogo. ¡Espero que lo encuentres útil!');
        console.log('Archivo PDF enviado.');

        // Marcar que el catálogo ya fue enviado y esperar una respuesta
        catalogSent = true;
        waitingForResponse = true;
      } catch (error) {
        console.error('Error al enviar el mensaje o archivo:', error);
      }
      return; // Salir para esperar la respuesta del cliente
    }

    // Si estamos esperando una respuesta del cliente
    if (waitingForResponse) {
      try {
        // Enviar el mensaje de cierre
        await client.sendText(
          message.from,
          'En unos momentos te contactará uno de nuestros equipos de venta.'
        );
        console.log('Mensaje de cierre enviado.');

        // Marcar que no se esperan más respuestas
        waitingForResponse = false;
      } catch (error) {
        console.error('Error al enviar el mensaje de cierre:', error);
      }
    }
  });
}
