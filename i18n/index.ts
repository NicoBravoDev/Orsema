// i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from './translations/languageDetector';
import resources from './translationResources';

// Inicializar i18next
i18n
  // Pasar los módulos i18n a react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,
    // Idioma a usar si no se detecta ninguno
    fallbackLng: 'en',
    // Habilitar el registro de depuración
    debug: __DEV__,
    // Configuración del interpolador
    interpolation: {
      // No necesitamos escapar valores especiales para React
      escapeValue: false,
    },
    // Comportamiento de recarga cuando se cambia el idioma
    react: {
      useSuspense: false,
    },
  });

// Aplicar la detección de idioma manualmente
languageDetector.detect((detectedLang) => {
  i18n.changeLanguage(detectedLang);
});

export default i18n;

// Hook personalizado para cambiar el idioma y mantenerlo persistente
export const useChangeLanguage = () => {
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // También guardamos el idioma usando nuestro detector personalizado
    languageDetector.cacheUserLanguage(language);
  };

  return { changeLanguage, currentLanguage: i18n.language };
};