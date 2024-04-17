const axios = require('axios');

// Función para enviar una notificación push a través de Expo PNS
async function sendPushNotification(token: string, title: string, body: string) {
  try {
    const expoPushEndpoint = 'https://exp.host/--/api/v2/push/send';
    const message = {
      to: token,
      title: title,
      body: body,
      data: { customData: 'custom value' } // Puedes incluir datos adicionales en la notificación
    };

    const response = await axios.post(expoPushEndpoint, message, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Host': 'exp.host'
      }
    });

    console.log('Successfully sent notification:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Ejemplo de uso
const deviceToken = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'; // Token del dispositivo de destino
const notificationTitle = '¡Hola!';
const notificationBody = 'Esta es una notificación de prueba desde el backend';

sendPushNotification(deviceToken, notificationTitle, notificationBody);
