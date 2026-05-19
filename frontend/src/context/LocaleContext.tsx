"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Locale = "en" | "ar";

interface LocaleContextType {
  locale: Locale;
  changeLocale: (lang: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  changeLocale: () => {},
});

export const LocaleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const savedLang =
      localStorage.getItem("lang") as Locale;

    if (savedLang) {
      setLocale(savedLang);
    }
  }, []);

  useEffect(() => {
    const path = window.location.pathname;

    const adminRoutes = [
      "/admindashboard",
      "/communityDashBoard",
      "/consultant",
    ];

    const isAdminRoute = adminRoutes.some((route) =>
      path.startsWith(route)
    );

    const finalLocale = isAdminRoute
      ? "en"
      : locale;

    document.documentElement.lang = finalLocale;

    document.documentElement.dir =
      finalLocale === "ar" ? "rtl" : "ltr";

    localStorage.setItem("lang", locale);
  }, [locale]);

  const changeLocale = (lang: Locale) => {
    setLocale(lang);
  };

  return (
    <LocaleContext.Provider
      value={{ locale, changeLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () =>
  useContext(LocaleContext);