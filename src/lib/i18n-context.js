"use client";

import { createContext, useContext } from "react";

const I18nContext = createContext(null);

export function I18nProvider({ dictionary, locale, children }) {
  return (
    <I18nContext.Provider value={{ dict: dictionary, lang: locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
