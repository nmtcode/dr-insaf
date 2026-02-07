import React from "react";
import CustomThemeProvider from "./ThemeContext";
import EncryptionForm from "./EncryptionForm";

//https://nmtcode-dr-Insaf-app.netlify.app/
export default function App() {
  return (
    <CustomThemeProvider>
      <EncryptionForm />
    </CustomThemeProvider>
  );
}
