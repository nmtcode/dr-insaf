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
} from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import ClearIcon from "@mui/icons-material/Clear";
// import TableChartIcon from "@mui/icons-material/TableChart";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";

import { ThemeContext } from "./ThemeContext";
import { AR_LABELS, EN_LABELS, ENCRYPTION_TYPES } from "./constants";
import { clsCaesar, clsPlayFiar, clsMixedAlphabet, clsLine } from "./CipherLogic"; 


export default function EncryptionForm() {
  const { mode, language, toggleTheme, toggleLanguage } =
    useContext(ThemeContext);
  const L = language === "ar" ? AR_LABELS : EN_LABELS;
  const direction = language === "ar" ? "rtl" : "ltr";

  const [key, setKey] = useState("");
  const [encryptionType, setEncryptionType] = useState("Caesar");
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [keyError, setKeyError] = useState("");
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [cipherTable, setCipherTable] = useState({});

  const validateKey = (currentKey, type) => {
    if (type === "Caesar") {
      if (
        currentKey === "" ||
        isNaN(currentKey) ||
        !Number.isInteger(Number(currentKey))
      ) {
        setKeyError(L.caesarError);
        return false;
      }
    }
    // التحقق من مفتاح الأسطر (Rail Fence)
    if (type === "LineEncryption") {
        const numKey = Number(currentKey);
        if (
            currentKey === "" ||
            isNaN(numKey) ||
            !Number.isInteger(numKey) ||
            numKey < 2
        ) {
            setKeyError(L.lineKeyError || "يجب إدخال عدد صحيح موجب (أسطر) لا يقل عن 2."); 
            return false;
        }
    }
    if (
      (type === "Playfair" || type === "MixedAlphabet") &&
      currentKey.trim() === ""
    ) {
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
      let result;
      if (encryptionType === "LineEncryption") {
        result = cipher.RailEncrypt(plainText);
      } else {
        result = cipher.Encrypt(plainText);
      }
      setCipherText(result);
    } catch (error) {
      alert(`Encryption Error: ${error.message}`);
      console.error(error);
    }
  };

  const handleDecrypt = () => {
    if (!validateKey(key, encryptionType)) return;
    if (cipherText.trim() === "") return;

    try {
      const cipher = getCipherInstance(key, encryptionType);
      let result;
      if (encryptionType === "LineEncryption") {
        result = cipher.RailDecrypt(cipherText);
      } else {
        result = cipher.Decrypt(cipherText);
      }
      setPlainText(result);
    } catch (error) {
      alert(`Decryption Error: ${error.message}`);
      console.error(error);
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
      const table = cipher.GetCipherTable();
      setCipherTable(table);
      setIsTableOpen(true);
    } catch (error) {
      alert(`Error showing table: ${error.message}`);
    }
  };

  const handleClear = () => {
    setKey("");
    setPlainText("");
    setCipherText("");
    setKeyError("");
  };

  const handleKeyChange = (event) => {
    const newKey = event.target.value;
    setKey(newKey);
    validateKey(newKey, encryptionType);
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setEncryptionType(newType);
    validateKey(key, newType);
  };

  const tableRows = useMemo(() => {
    if (encryptionType === "Playfair") {
      return (Object.values(cipherTable) || []).map((char, index) => ({
        key: index.toString(),
        value: char,
      }));
    } 
    if (encryptionType === "Caesar" || encryptionType === "MixedAlphabet") {
      return Object.entries(cipherTable).map(([key, value]) => ({
        key: key,
        value: value,
      }));
    }
    return []; 
  }, [cipherTable, encryptionType]);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ mt: 4, mb: 4 }}
      style={{ direction }}
    >
      <Paper elevation={8} sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {L.title}
            </Typography>
            <Typography
              component="p"
              variant="subtitle2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              {L.author}
            </Typography>
            <Typography
              component="p"
              variant="caption" 
              sx={{ color: "text.secondary", mt: 0.5, fontWeight: 'bold' }}
            >
              {L.supervisor}
            </Typography>
          </Box>

          <Box>
            <IconButton
              onClick={toggleLanguage}
              color="inherit"
              title="Toggle Language"
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              title="Toggle Dark/Light Mode"
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Box>

        <Box component="form" noValidate autoComplete="off">
          {/* المفتاح ونوع التشفير */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={L.key}
                value={key}
                onChange={handleKeyChange}
                error={!!keyError}
                helperText={
                  keyError ||
                  (encryptionType === "Caesar"
                    ? L.caesarKeyNote
                    : encryptionType === "LineEncryption"
                    ? L.lineKeyNote || "أدخل عدد الأسطر (قيمة صحيحة > 1)."
                    : L.textKeyNote)
                }
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="filled">
                <InputLabel>{L.type}</InputLabel>
                <Select
                  value={encryptionType}
                  onChange={handleTypeChange}
                  label={L.type}
                >
                  {ENCRYPTION_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {language === "ar" ? type.ar : type.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            multiline
            rows={5}
            label={L.plain}
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={5}
            label={L.cipher}
            value={cipherText}
            onChange={(e) => setCipherText(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEncrypt}
                sx={{ minWidth: 150 }}
                // startIcon={<LockIcon />}
              >
                {L.encrypt}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={handleDecrypt}
                sx={{ minWidth: 150 }}
                // startIcon={<LockOpenIcon />}
              >
                {L.decrypt}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClear}
                sx={{ minWidth: 150 }}
                // startIcon={<ClearIcon />}
              >
                {L.clear}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="warning"
                onClick={handleShowTable}
                sx={{ minWidth: 150 }}
                disabled={encryptionType === "LineEncryption"} 
              >
                {L.showTable}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <CipherTableDialog
        L={L}
        direction={direction}
        isTableOpen={isTableOpen}
        setIsTableOpen={setIsTableOpen}
        encryptionType={encryptionType}
        tableRows={tableRows}
      />
    </Container>
  );
}

function CipherTableDialog({
  L,
  direction,
  isTableOpen,
  setIsTableOpen,
  encryptionType,
  tableRows,
}) {
  return (
    <Dialog
      open={isTableOpen}
      onClose={() => setIsTableOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          textAlign: direction === "rtl" ? "right" : "left",
          fontWeight: "bold",
        }}
      >
        {encryptionType === "Playfair" ? L.playfairTitle : L.tableTitle}
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table size="small">
            {/* عرض جدول Playfair (مصفوفة 5x5) */}
            {encryptionType === "Playfair" ? (
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell
                        key={j}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          border: "1px solid #ddd",
                          padding: "5px",
                        }}
                      >
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
                    <TableCell>{L.original}</TableCell>
                    <TableCell>{L.encrypted}</TableCell>
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