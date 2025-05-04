// i18n/translations/languageDetector.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

// Clave para almacenar el idioma seleccionado en AsyncStorage
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

// Función para obtener el idioma del dispositivo
const getDeviceLanguage = () => {
  try {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;

    // Extraer el código de idioma (primeros 2 caracteres) y convertir a minúsculas
    return deviceLanguage.substring(0, 2).toLowerCase();
  } catch (error) {
    console.error('Error obteniendo idioma del dispositivo:', error);
    return 'en'; // Idioma por defecto en caso de error
  }
};

// Detector de idioma personalizado para i18next
const languageDetector = {
  // Detectar el idioma: primero intentamos desde AsyncStorage, luego del dispositivo
  detect: async (callback: (language: string) => void) => {
    try {
      // Intentar obtener el idioma guardado
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage) {
        // Si hay un idioma guardado, usarlo
        return callback(savedLanguage);
      } else {
        // Si no hay idioma guardado, obtener el idioma del dispositivo
        const deviceLanguage = getDeviceLanguage();
        
        // Verificar si el idioma del dispositivo está entre los soportados
        // Si no, usar el idioma predeterminado 'en'
        const language = ['en', 'es'].includes(deviceLanguage) ? deviceLanguage : 'en';
        
        // Guardar este idioma para uso futuro
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        return callback(language);
      }
    } catch (error) {
      console.error('Error detectando idioma:', error);
      // En caso de error, usar 'en' como idioma predeterminado
      return callback('en');
    }
  },
  
  // Método para cambiar el idioma manualmente
  cacheUserLanguage: async (language: string) => {
    try {
      // Guardar el idioma seleccionado
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error guardando idioma:', error);
    }
  },
};

export default languageDetector;