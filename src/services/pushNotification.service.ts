import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { EXPO_ACCESS_TOKEN } from '../config';

class PushNotification {
  private static expo: Expo = new Expo({
    accessToken: EXPO_ACCESS_TOKEN,
    useFcmV1: true
  });;


  public static async sendPushNotifications(expoTokens: string[], title: string, message: string): Promise<void> {
    try {
      const validTokens = expoTokens.filter(expoToken => Expo.isExpoPushToken(expoToken));

      let messages: ExpoPushMessage[] = validTokens.map(pushToken => ({
        to: pushToken,
        sound: "default",
        title,
        body: message,
      }));
      const chunks = PushNotification.expo.chunkPushNotifications(messages);
      await Promise.all(chunks.map(async (chunk) => {
        try {
        await PushNotification.expo.sendPushNotificationsAsync(chunk);
          console.log("Notificación push enviada con éxito.");
        } catch (error) {
          console.error("Error al enviar la notificación push:", error);
          throw error;
        }
      }));
    } catch (error) {
      console.error('Error al enviar la notificación push:', error);
      throw error;
    }
  }
}

export default PushNotification;
