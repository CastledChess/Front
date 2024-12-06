import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(
    resourcesToBackend((language: string, namespace: string) => import(`./i18n/locales/${language}/${namespace}.json`)),
  )
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    defaultNS: 'common',
    lng: 'en',
    ns: ['common', 'analysis', 'register', 'login'],
    debug: true,
    // backend: {
    //   loadPath: 'i18n/locales/{{lng}}/{{ns}}.json',
    // },
  });

console.log(i18n);

export default i18n;
