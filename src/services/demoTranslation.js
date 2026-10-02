// Pilot-only deterministic translations for testing the realtime delivery chain.
// Azure will replace this provider; unknown text is visibly marked as demo output.
const phrases={
 'Fijn dat u er bent.':{en:'Nice to have you here.',ar:'يسعدني وجودكم هنا.',pl:'Miło, że jesteście.',tr:'Burada olmanız çok güzel.',uk:'Раді, що ви тут.',bg:'Радваме се, че сте тук.',ro:'Ne bucurăm că sunteți aici.',de:'Schön, dass Sie da sind.',fr:'Nous sommes heureux de vous accueillir.'},
 'Hoe gaat het thuis?':{en:'How are things going at home?',ar:'كيف تسير الأمور في المنزل؟',pl:'Jak sytuacja wygląda w domu?',tr:'Evde durum nasıl?',uk:'Як справи вдома?',bg:'Как вървят нещата у дома?',ro:'Cum merg lucrurile acasă?',de:'Wie läuft es zu Hause?',fr:'Comment cela se passe-t-il à la maison ?'},
 'Heeft u nog vragen?':{en:'Do you have any questions?',ar:'هل لديكم أي أسئلة؟',pl:'Czy mają Państwo jeszcze jakieś pytania?',tr:'Başka sorunuz var mı?',uk:'У вас є ще запитання?',bg:'Имате ли още въпроси?',ro:'Mai aveți întrebări?',de:'Haben Sie noch Fragen?',fr:'Avez-vous encore des questions ?'}
}
export function demoTranslate(text,targetCodes=[]){
 const source=text.trim(),translated=phrases[source]||{}
 return Object.fromEntries(targetCodes.filter(code=>code!=='nl').map(code=>[code,translated[code]||`[DEMO ${code.toUpperCase()}] ${source}`]))
}
export const demoPhrases=Object.keys(phrases)
