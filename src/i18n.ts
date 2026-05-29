import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enCourses from './locales/en/courses.json';
import enContact from './locales/en/contact.json';
import enAbout from './locales/en/about.json';
import enWaitlistForm from './locales/en/waitlistForm.json';
import enNotFound from './locales/en/notFound.json';

import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esCourses from './locales/es/courses.json';
import esContact from './locales/es/contact.json';
import esAbout from './locales/es/about.json';
import esWaitlistForm from './locales/es/waitlistForm.json';
import esNotFound from './locales/es/notFound.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        courses: enCourses,
        contact: enContact,
        about: enAbout,
        waitlistForm: enWaitlistForm,
        notFound: enNotFound,
      },
      es: {
        common: esCommon,
        home: esHome,
        courses: esCourses,
        contact: esContact,
        about: esAbout,
        waitlistForm: esWaitlistForm,
        notFound: esNotFound,
      },
    },
    defaultNS: 'common',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
