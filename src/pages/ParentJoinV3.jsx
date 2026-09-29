import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLanguage, languages, t } from '../i18n/locales'

export default function ParentJoinV3() {
  const { publicCode } = useParams()
  const storageKey = `lvs:v3:language:${publicCode}`
  const [languageCode, setLanguageCode] = useState(() => sessionStorage.getItem(storageKey) || '')
  const language = getLanguage(languageCode || 'nl')

  useEffect(() => {
    if (languageCode) sessionStorage.setItem(storageKey, languageCode)
  }, [languageCode, storageKey])

  if (!languageCode) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
        <section className="mx-auto max-w-lg">
          <p className="text-sm font-semibold text-slate-500">Sessie {publicCode}</p>
          <h1 className="mt-3 text-3xl font-bold">Kies uw voorkeurstaal</h1>
          <p className="mt-1 text-xl">Choose your preferred language</p>
          <p className="mt-1 text-xl" dir="rtl">اختر لغتك المفضلة</p>
          <div className="mt-8 grid gap-3">
            {languages.map((item) => (
              <button key={item.code} type="button" dir={item.dir} onClick={() => setLanguageCode(item.code)} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-left text-lg font-semibold shadow-sm hover:border-slate-400">
                {item.nativeName}
              </button>
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main dir={language.dir} className="min-h-screen bg-slate-950 px-5 py-12 text-white">
      <section className="mx-auto max-w-xl">
        <button className="mb-8 text-sm text-slate-400 underline" onClick={() => setLanguageCode('')}>{language.nativeName}</button>
        <h1 className="text-4xl font-bold">{t(languageCode, 'welcome')}</h1>
        <p className="mt-3 text-lg text-slate-300">{t(languageCode, 'waiting')}</p>
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Session {publicCode}</p>
          <p className="mt-2 font-semibold">{t(languageCode, 'connection')}</p>
        </div>
      </section>
    </main>
  )
}
