import React, { useState, useMemo, useContext } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

// استيراد الأيقونات
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import { ThemeContext } from "./ThemeContext";
import { AR_LABELS, EN_LABELS, ENCRYPTION_TYPES } from "./constants";
import {
  clsCaesar,
  clsPlayFiar,
  clsMixedAlphabet,
  clsLine,
} from "./CipherLogic";

export default function EncryptionForm() {
  const { mode, language, toggleTheme, toggleLanguage } = useContext(ThemeContext);
  const L = language === "ar" ? AR_LABELS : EN_LABELS;
  const direction = language === "ar" ? "rtl" : "ltr";

  const [key, setKey] = useState("");
  const [encryptionType, setEncryptionType] = useState("Caesar");
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [keyError, setKeyError] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [cipherTable, setCipherTable] = useState({});

  // حالة التنبيه (Snackbar)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showMessage = (msg, sev = "success") => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // دالة النسخ مع التنبيه
  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      showMessage(language === "ar" ? "تم النسخ إلى الحافظة" : "Copied to clipboard!");
    } else {
      showMessage(language === "ar" ? "لا يوجد نص لنسخه" : "No text to copy", "warning");
    }
  };

  // دالة اللصق مع التنبيه
  const handlePaste = async (target) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (target === "plain") setPlainText(text);
        if (target === "cipher") setCipherText(text);
        showMessage(language === "ar" ? "تم اللصق بنجاح" : "Pasted successfully!");
      }
    } catch (err) {
      showMessage(language === "ar" ? "فشل الوصول للحافظة" : "Clipboard access denied", "error");
    }
  };

  const validateKey = (currentKey, type) => {
    if (type === "Caesar") {
      if (currentKey === "" || isNaN(currentKey) || !Number.isInteger(Number(currentKey))) {
        setKeyError(L.caesarError);
        return false;
      }
    }
    if (type === "LineEncryption") {
      const numKey = Number(currentKey);
      if (currentKey === "" || isNaN(numKey) || !Number.isInteger(numKey) || numKey < 2) {
        setKeyError(L.lineKeyError || "يجب إدخال عدد صحيح موجب لا يقل عن 2.");
        return false;
      }
    }
    if ((type === "Playfair" || type === "MixedAlphabet") && currentKey.trim() === "") {
      setKeyError(L.textKeyNote);
      return false;
    }
    setKeyError("");
    return true;
  };

  const getCipherInstance = (currentKey, type) => {
    if (type === "Caesar") return new clsCaesar(Number(currentKey));
    if (type === "Playfair") return new clsPlayFiar(currentKey);
    if (type === "MixedAlphabet") return new clsMixedAlphabet(currentKey);
    if (type === "LineEncryption") return new clsLine(Number(currentKey));
    throw new Error("Unsupported encryption type.");
  };

  const handleEncrypt = () => {
    if (!validateKey(key, encryptionType)) return;
    if (plainText.trim() === "") return;
    try {
      const cipher = getCipherInstance(key, encryptionType);
      const result = encryptionType === "LineEncryption" ? cipher.RailEncrypt(plainText) : cipher.Encrypt(plainText);
      setCipherText(result);
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleDecrypt = () => {
    if (!validateKey(key, encryptionType)) return;
    if (cipherText.trim() === "") return;
    try {
      const cipher = getCipherInstance(key, encryptionType);
      const result = encryptionType === "LineEncryption" ? cipher.RailDecrypt(cipherText) : cipher.Decrypt(cipherText);
      setPlainText(result);
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleShowTable = () => {
    if (encryptionType === "LineEncryption") {
      alert(L.noTableForRail || "طريقة الأسطر لا تحتوي على جدول إبدال.");
      return;
    }
    if (!validateKey(key, encryptionType)) return;
    try {
      const cipher = getCipherInstance(key, encryptionType);
      setCipherTable(cipher.GetCipherTable());
      setIsTableOpen(true);
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const handleClear = () => {
    setKey("");
    setPlainText("");
    setCipherText("");
    setKeyError("");
    showMessage(language === "ar" ? "تم مسح البيانات" : "Data cleared", "info");
  };

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    validateKey(e.target.value, encryptionType);
  };

  const handleTypeChange = (e) => {
    setEncryptionType(e.target.value);
    validateKey(key, e.target.value);
  };

  const tableRows = useMemo(() => {
    if (encryptionType === "Playfair") {
      return (Object.values(cipherTable) || []).map((char, index) => ({ key: index.toString(), value: char }));
    }
    if (encryptionType === "Caesar" || encryptionType === "MixedAlphabet") {
      return Object.entries(cipherTable).map(([k, v]) => ({ key: k, value: v }));
    }
    return [];
  }, [cipherTable, encryptionType]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{ direction }}>
      {/* Header */}
      <Box sx={{
        p: 3, mb: 3, borderRadius: "16px",
        background: mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(25, 118, 210, 0.05)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        border: "1px solid", borderColor: "divider"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box component="img" src="/Logo.png" alt="Logo"
            sx={{
              height: { xs: 45, md: 70 }, width: "auto", objectFit: "contain",
              filter: mode === "dark" ? "drop-shadow(0 0 5px rgba(255,255,255,0.2))" : "none",
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main", letterSpacing: -1, fontSize: { xs: "1.2rem", md: "2.125rem" } }}>
              {L.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: "bold", display: "block", fontSize: { xs: "0.6rem", md: "0.75rem" } }}>
              {L.author} | {L.supervisor}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton onClick={toggleLanguage} color="primary"><LanguageIcon /></IconButton>
          <IconButton onClick={toggleTheme} color="primary">{mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Settings Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider", height: "100%" }}>
            <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.6, fontWeight: "bold" }}>CONFIGURATIONS</Typography>
            <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
              <InputLabel>{L.type}</InputLabel>
              <Select value={encryptionType} onChange={handleTypeChange}>
                {ENCRYPTION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{language === "ar" ? type.ar : type.en}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField fullWidth label={L.key} value={key} onChange={handleKeyChange} error={!!keyError} helperText={keyError} variant="filled" sx={{ mb: 3 }} />
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button fullWidth variant="contained" size="large" onClick={handleEncrypt} sx={{ borderRadius: "12px", py: 1.5, fontWeight: "bold" }}>{L.encrypt}</Button>
              <Button fullWidth variant="contained" color="success" size="large" onClick={handleDecrypt} sx={{ borderRadius: "12px", py: 1.5, fontWeight: "bold" }}>{L.decrypt}</Button>
              <Grid container spacing={1}>
                <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={handleClear}>{L.clear}</Button></Grid>
                <Grid item xs={6}><Button fullWidth variant="outlined" color="warning" onClick={handleShowTable} disabled={encryptionType === "LineEncryption"}>{L.showTable}</Button></Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Text Areas Column */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}>
            {/* Plain Text Paper */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: "16px", border: "1px solid", borderColor: "divider", flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: "bold", color: "primary.main" }}>{L.plain}</Typography>
                <Box>
                  <Tooltip title={L.copy}><IconButton size="small" onClick={() => handleCopy(plainText)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title={L.paste}><IconButton size="small" onClick={() => handlePaste("plain")}><ContentPasteIcon fontSize="small" /></IconButton></Tooltip>
                </Box>
              </Box>
              <TextField fullWidth multiline rows={5} value={plainText} onChange={(e) => setPlainText(e.target.value)} variant="standard" 
                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", lineHeight: 1.6 } }} placeholder={L.typehere } />
            </Paper>

            {/* Cipher Text Paper */}
            <Paper elevation={0} sx={{ 
                p: 2, borderRadius: "16px", border: "2px solid", borderColor: "primary.light", flex: 1,
                bgcolor: mode === "dark" ? "rgba(25, 118, 210, 0.05)" : "#f0f7ff" 
              }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: "bold", color: "primary.main" }}>{L.cipher}</Typography>
                <Box>
                  <Tooltip title={L.copy}><IconButton size="small" color="primary" onClick={() => handleCopy(cipherText)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title={L.paste}><IconButton size="small" color="primary" onClick={() => handlePaste("cipher")}><ContentPasteIcon fontSize="small" /></IconButton></Tooltip>
                </Box>
              </Box>
              <TextField fullWidth multiline rows={5} value={cipherText} onChange={(e) => setCipherText(e.target.value)} variant="standard"
                InputProps={{ disableUnderline: true, sx: { fontSize: "1.1rem", fontWeight: "bold", color: "primary.main" } }} />
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar التنبيهات */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <CipherTableDialog L={L} direction={direction} isTableOpen={isTableOpen} setIsTableOpen={setIsTableOpen} encryptionType={encryptionType} tableRows={tableRows} />
    </Container>
  );
}

// Dialog Component (يبقى كما هو)
function CipherTableDialog({ L, direction, isTableOpen, setIsTableOpen, encryptionType, tableRows }) {
  return (
    <Dialog open={isTableOpen} onClose={() => setIsTableOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: direction === "rtl" ? "right" : "left", fontWeight: "bold" }}>
        {encryptionType === "Playfair" ? L.playfairTitle : L.tableTitle}
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table size="small">
            {encryptionType === "Playfair" ? (
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j} align="center" sx={{ fontWeight: "bold", border: "1px solid #ddd", padding: "5px" }}>
                        {tableRows[i * 5 + j] ? tableRows[i * 5 + j].value : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{L.original}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{L.encrypted}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.key} hover>
                      <TableCell>{row.key}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}