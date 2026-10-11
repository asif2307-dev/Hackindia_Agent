import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../i18n/translations';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'header' | 'mobile' | 'compact';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { language, setLanguage, languages, currentLanguageOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  if (variant === 'mobile') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5 px-1">
          <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">translate</span>
          {t('nav.selectLanguage', 'Select Language')}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#006D77] text-white font-bold border border-[#20B8B0] shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/10'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[14px] text-[#E8B86D]">check</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#20B8B0] focus:ring-offset-1 focus:ring-offset-[#0d283e] cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${t('nav.selectLanguage', 'Select Language')}: ${currentLanguageOption.nativeName}`}
        id="language-selector-button"
      >
        <span className="material-symbols-outlined text-[16px] text-[#20B8B0]">translate</span>
        <span className="font-medium text-white">{currentLanguageOption.nativeName}</span>
        <span className="material-symbols-outlined text-[14px] text-white/60 transition-transform duration-200">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-labelledby="language-selector-button"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0e273c] border border-[#20B8B0]/30 shadow-2xl backdrop-blur-xl py-1.5 z-50 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/20"
        >
          <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/70 uppercase tracking-wider">
            <span>{t('nav.selectLanguage', 'Select Language')}</span>
            <span className="text-[#20B8B0] font-bold">6 Languages</span>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors text-xs ${
                    isSelected
                      ? 'bg-[#006D77]/50 text-white font-bold border-l-2 border-[#20B8B0]'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-xs">{lang.nativeName}</span>
                      <span className="text-[10px] text-white/60">{lang.label}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-[#E8B86D]">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
