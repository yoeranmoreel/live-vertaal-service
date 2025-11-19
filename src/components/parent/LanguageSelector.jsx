// src/components/parent/LanguageSelector.jsx
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, Loader2 } from "lucide-react";
import { translationApi } from "@/api/sheetsClient";

// Spijkenisse/Rotterdam prioriteit talen (bovenaan de lijst)
const priorityLanguages = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية (Arabisch)', flag: '🇸🇦' },
  { code: 'pl', name: 'Polski (Pools)', flag: '🇵🇱' },
  { code: 'bg', name: 'Български (Bulgaars)', flag: '🇧🇬' },
  { code: 'ro', name: 'Română (Roemeens)', flag: '🇷🇴' },
  { code: 'tr', name: 'Türkçe (Turks)', flag: '🇹🇷' },
  { code: 'uk', name: 'Українська (Oekraïens)', flag: '🇺🇦' },
];

// Andere ondersteunde talen
const otherLanguages = [
  { code: 'fr', name: 'Français (Frans)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (Duits)', flag: '🇩🇪' },
  { code: 'es', name: 'Español (Spaans)', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano (Italiaans)', flag: '🇮🇹' },
  { code: 'pt', name: 'Português (Portugees)', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский (Russisch)', flag: '🇷🇺' },
  { code: 'zh', name: '中文 (Chinees)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (Japans)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Koreaans)', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی (Perzisch)', flag: '🇮🇷' },
  { code: 'he', name: 'עברית (Hebreeuws)', flag: '🇮🇱' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamees)', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'sv', name: 'Svenska (Zweeds)', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk (Deens)', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk (Noors)', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi (Fins)', flag: '🇫🇮' },
  { code: 'el', name: 'Ελληνικά (Grieks)', flag: '🇬🇷' },
  { code: 'cs', name: 'Čeština (Tsjechisch)', flag: '🇨🇿' },
  { code: 'hu', name: 'Magyar (Hongaars)', flag: '🇭🇺' },
  { code: 'sr', name: 'Српски (Servisch)', flag: '🇷🇸' },
  { code: 'hr', name: 'Hrvatski (Kroatisch)', flag: '🇭🇷' },
];

export default function LanguageSelector({ selectedLanguage, onSelect }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <Label htmlFor="language-select" className="text-gray-700 font-medium flex items-center gap-2">
        <Languages className="w-5 h-5 text-indigo-500" />
        Selecteer uw taal
      </Label>
      <Select value={selectedLanguage} onValueChange={onSelect} disabled={loading}>
        <SelectTrigger 
          id="language-select"
          className="w-full h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
        >
          <SelectValue placeholder="Kies een taal..." />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {/* Prioriteit talen - meest gebruikt in Spijkenisse/Rotterdam */}
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-indigo-50">
            Meest gebruikt
          </div>
          {priorityLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-base py-3">
              <span className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
          
          {/* Scheidingslijn */}
          <div className="my-2 border-t border-gray-200" />
          
          {/* Andere talen */}
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
            Andere talen
          </div>
          {otherLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-base py-3">
              <span className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">
        Kies de taal waarin u de vertaling wilt ontvangen
      </p>
    </div>
  );
}
