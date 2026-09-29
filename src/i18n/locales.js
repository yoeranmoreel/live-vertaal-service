export const languages = [
  { code: 'nl', nativeName: 'Nederlands', teacherName: 'Nederlands', dir: 'ltr' },
  { code: 'en', nativeName: 'English', teacherName: 'Engels', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', teacherName: 'Arabisch', dir: 'rtl' },
  { code: 'pl', nativeName: 'Polski', teacherName: 'Pools', dir: 'ltr' },
  { code: 'tr', nativeName: 'Türkçe', teacherName: 'Turks', dir: 'ltr' },
  { code: 'uk', nativeName: 'Українська', teacherName: 'Oekraïens', dir: 'ltr' },
  { code: 'bg', nativeName: 'Български', teacherName: 'Bulgaars', dir: 'ltr' },
  { code: 'ro', nativeName: 'Română', teacherName: 'Roemeens', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', teacherName: 'Duits', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', teacherName: 'Frans', dir: 'ltr' },
]

export const ui = {
  nl: { welcome: 'Welkom', waiting: 'Wachten tot de leerkracht begint…', connection: 'Verbonden', readAloud: 'Voorlezen', summary: 'Download samenvatting' },
  en: { welcome: 'Welcome', waiting: 'Waiting for the teacher to begin…', connection: 'Connected', readAloud: 'Read aloud', summary: 'Download summary' },
  ar: { welcome: 'مرحباً', waiting: 'في انتظار بدء المعلم…', connection: 'متصل', readAloud: 'قراءة بصوت عالٍ', summary: 'تنزيل الملخص' },
  pl: { welcome: 'Witamy', waiting: 'Oczekiwanie na rozpoczęcie przez nauczyciela…', connection: 'Połączono', readAloud: 'Czytaj na głos', summary: 'Pobierz podsumowanie' },
  tr: { welcome: 'Hoş geldiniz', waiting: 'Öğretmenin başlaması bekleniyor…', connection: 'Bağlandı', readAloud: 'Sesli oku', summary: 'Özeti indir' },
  uk: { welcome: 'Ласкаво просимо', waiting: 'Очікуємо початку вчителя…', connection: 'Підключено', readAloud: 'Прочитати вголос', summary: 'Завантажити підсумок' },
}

export function getLanguage(code) {
  return languages.find((language) => language.code === code) ?? languages[0]
}

export function t(code, key) {
  return ui[code]?.[key] ?? ui.en[key] ?? key
}
