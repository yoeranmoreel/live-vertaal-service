export const languages=[
{code:'nl',nativeName:'Nederlands',teacherName:'Nederlands',dir:'ltr'},{code:'en',nativeName:'English',teacherName:'Engels',dir:'ltr'},{code:'ar',nativeName:'العربية',teacherName:'Arabisch',dir:'rtl'},{code:'pl',nativeName:'Polski',teacherName:'Pools',dir:'ltr'},{code:'tr',nativeName:'Türkçe',teacherName:'Turks',dir:'ltr'},{code:'uk',nativeName:'Українська',teacherName:'Oekraïens',dir:'ltr'},{code:'bg',nativeName:'Български',teacherName:'Bulgaars',dir:'ltr'},{code:'ro',nativeName:'Română',teacherName:'Roemeens',dir:'ltr'},{code:'de',nativeName:'Deutsch',teacherName:'Duits',dir:'ltr'},{code:'fr',nativeName:'Français',teacherName:'Frans',dir:'ltr'}]
export const ui={
nl:{welcome:'Welkom',waiting:'Wachten tot de leerkracht begint…',live:'Het gesprek is gestart.',connection:'Verbonden',ended:'Het gesprek is afgelopen. U kunt dit venster sluiten.',readAloud:'Voorlezen',summary:'Download samenvatting'},
en:{welcome:'Welcome',waiting:'Waiting for the teacher to begin…',live:'The conversation has started.',connection:'Connected',ended:'The conversation has ended. You can close this window.',readAloud:'Read aloud',summary:'Download summary'},
ar:{welcome:'مرحباً',waiting:'في انتظار بدء المعلم…',live:'بدأت المحادثة.',connection:'متصل',ended:'انتهت المحادثة. يمكنك إغلاق هذه النافذة.',readAloud:'قراءة بصوت عالٍ',summary:'تنزيل الملخص'},
pl:{welcome:'Witamy',waiting:'Oczekiwanie na rozpoczęcie przez nauczyciela…',live:'Rozmowa się rozpoczęła.',connection:'Połączono',ended:'Rozmowa dobiegła końca. Możesz zamknąć to okno.'},
tr:{welcome:'Hoş geldiniz',waiting:'Öğretmenin başlaması bekleniyor…',live:'Görüşme başladı.',connection:'Bağlandı',ended:'Görüşme sona erdi. Bu pencereyi kapatabilirsiniz.'},
uk:{welcome:'Ласкаво просимо',waiting:'Очікуємо початку вчителя…',live:'Розмова розпочалася.',connection:'Підключено',ended:'Розмову завершено. Ви можете закрити це вікно.'},
bg:{welcome:'Добре дошли',waiting:'Изчакване на учителя…',live:'Разговорът започна.',connection:'Свързано',ended:'Разговорът приключи. Можете да затворите този прозорец.'},
ro:{welcome:'Bun venit',waiting:'Așteptăm ca profesorul să înceapă…',live:'Conversația a început.',connection:'Conectat',ended:'Conversația s-a încheiat. Puteți închide această fereastră.'},
de:{welcome:'Willkommen',waiting:'Warten, bis die Lehrkraft beginnt…',live:'Das Gespräch hat begonnen.',connection:'Verbunden',ended:'Das Gespräch ist beendet. Sie können dieses Fenster schließen.'},
fr:{welcome:'Bienvenue',waiting:'En attente du début par l’enseignant…',live:'La conversation a commencé.',connection:'Connecté',ended:'La conversation est terminée. Vous pouvez fermer cette fenêtre.'}}
export function getLanguage(code){return languages.find(l=>l.code===code)??languages[0]}
export function t(code,key){return ui[code]?.[key]??ui.en[key]??key}
