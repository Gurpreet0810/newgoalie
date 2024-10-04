// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './components/locales/en/translation.json';
import frTranslation from './components/locales/fr/translation.json';

i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
    },
    fallbackLng: 'en', // Default language if the browser language is not found
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;