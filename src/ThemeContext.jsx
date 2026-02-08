// ThemeContext.jsx
import React, { useState, useMemo, createContext } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";

export const ThemeContext = createContext();

export default function CustomThemeProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
  const [language, setLanguage] = useState("ar");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        direction: language === "ar" ? "rtl" : "ltr",
        palette: {
          mode,
          primary: {
            // أزرق احترافي (Navy Blue) يعطي انطباع بالثقة والأمان
            main: mode === 'dark' ? '#90caf9' : '#0a192f', 
          },
          secondary: {
            // لون متباين (Cyan) للمسات البرمجية
            main: mode === 'dark' ? '#64ffda' : '#00bfa5', 
          },
          background: {
            // تدرجات الرمادي الداكن جداً بدلاً من الأسود الصريح
            default: mode === 'dark' ? '#0a192f' : '#f8fafc',
            paper: mode === 'dark' ? '#112240' : '#ffffff',
          },
          // ألوان العمليات لتكون أقل حدة وأكثر تناسقاً
          success: { main: '#2e7d32' },
          warning: { main: '#ed6c02' },
          error: { main: '#d32f2f' },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        },
        typography: {
          // استخدام خط Tajawal أو Cairo للعربي يعطي فخامة أكثر
          fontFamily: language === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif",
          h4: { fontWeight: 800 },
          button: { fontWeight: 600, textTransform: 'none' }, // إلغاء الحروف الكبيرة التلقائية
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '16px', 
                boxShadow: mode === 'dark' 
                  ? '0 4px 20px 0 rgba(0,0,0,0.5)' 
                  : '0 2px 12px 0 rgba(0,0,0,0.05)',
                backgroundImage: 'none', // لإلغاء التدرج الافتراضي في الوضع الداكن
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '10px',
                padding: '10px 20px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)', // حركة بسيطة عند التمرير
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              },
            },
          },
        },
      }),
    [mode, language]
  );

  return (
    <ThemeContext.Provider value={{ mode, language, toggleTheme, toggleLanguage }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}