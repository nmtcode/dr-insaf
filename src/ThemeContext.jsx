// ThemeContext.jsx
import React, { useState, useMemo, createContext } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";

// 1. إنشاء السياق
export const ThemeContext = createContext();

// 2. مكون مزود السياق (Provider)
export default function CustomThemeProvider({ children }) {
  // تحديد ما إذا كان وضع الظلام مفضلاً في نظام التشغيل
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
  const [language, setLanguage] = useState("ar");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  };
  // 3. تهيئة الثيم باستخدام useMemo
  const theme = useMemo(
    () =>
      createTheme({
        direction: language === "ar" ? "rtl" : "ltr",
        palette: {
          mode,
          // 🎨 تخصيص لوحة الألوان
          primary: {
            // لون أساسي دافئ (مثل الأزرق الداكن أو البنفسجي)
            main: mode === 'dark' ? '#BB86FC' : '#6200EE', // البنفسجي الغامق/الفاتح
          },
          secondary: {
            // لون ثانوي متباين (للإبراز)
            main: mode === 'dark' ? '#03DAC6' : '#018786', // الأخضر المائي
          },
          success: {
            // فك التشفير (Decrypt)
            main: '#4CAF50', // أخضر
          },
          warning: {
            // عرض الجدول (Show Table)
            main: '#FF9800', // برتقالي
          },
          error: {
            // المسح (Clear)
            main: '#F44336', // أحمر
          },
          background: {
            // خلفية مخصصة
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
          },
        },
        // ... (typography and components)
        typography: {
          fontFamily:
            language === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif",
        },
        components: {
          // ... (MuiCssBaseline)
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '12px', // إضافة حواف مستديرة لعلبة الفورم
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px', // حواف مستديرة للأزرار
              },
            },
          },
        },
      }),
    [mode, language]
  );

  //
  return (
    <ThemeContext.Provider
      value={{ mode, language, toggleTheme, toggleLanguage }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
