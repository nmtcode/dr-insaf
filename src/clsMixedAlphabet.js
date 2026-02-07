import { FirstOrDefaultKeyByValue } from "./DictionaryExtensions";

class clsCaesar {
  _Alphapet = {};
  _Key = 0;

  constructor(Key) {
    this._Key = Key;
    this._FullAlphapet();
  }

  _IsUpparAsciiLatter(C1) {
    return C1.charCodeAt(0) >= 65 && C1.charCodeAt(0) <= 90;
  }

  _IsLowerAsciiLatter(C1) {
    return C1.charCodeAt(0) >= 97 && C1.charCodeAt(0) <= 122;
  }

  _IsAsciiLatter(C1) {
    return this._IsUpparAsciiLatter(C1) || this._IsLowerAsciiLatter(C1);
  }

  _FullAlphapet() {
    let j = 0;
    for (let i = 65; i <= 90; i++) {
      this._Alphapet[String.fromCharCode(i)] = j;
      j++;
    }
  }

  _HandleNigativeNumbers(NigativeNumber) {
    return NigativeNumber < 0
      ? this._HandleNigativeNumbers(26 + NigativeNumber)
      : NigativeNumber;
  }

  _EncryptChar(C1) {
    if (C1 === " ") return " ";
    if (!this._IsAsciiLatter(C1)) return "?";

    let IsLower = C1 === C1.toLowerCase() && C1 !== C1.toUpperCase();

    let UpperC1 = C1.toUpperCase();
    let value = (this._Alphapet[UpperC1] + this._Key) % 26;

    let returnValue = FirstOrDefaultKeyByValue(this._Alphapet, value);

    return !IsLower ? returnValue : returnValue.toLowerCase();
  }

  _DecryptChar(C1) {
    if (C1 === " ") return " ";
    if (!this._IsAsciiLatter(C1)) return "?";

    let IsLower = C1 === C1.toLowerCase() && C1 !== C1.toUpperCase();

    let UpperC1 = C1.toUpperCase();

    let value = this._Alphapet[UpperC1] - this._Key;
    let handledValue = this._HandleNigativeNumbers(value);
    let decryptedValue = handledValue % 26;

    let returnValue = FirstOrDefaultKeyByValue(this._Alphapet, decryptedValue);

    return !IsLower ? returnValue : returnValue.toLowerCase();
  }

  Encrypt(PlaintTXT) {
    let CipherTXT = "";
    for (const c of PlaintTXT) {
      CipherTXT += this._EncryptChar(c);
    }
    return CipherTXT;
  }

  Decrypt(CipherTXT) {
    let PlaintTXT = "";
    for (const c of CipherTXT) {
      PlaintTXT += this._DecryptChar(c);
    }
    return PlaintTXT;
  }

  Test() {}

  GetCipherTable() {
    let CipherTable = {};
    for (const c in this._Alphapet) {
      if (this._Alphapet.hasOwnProperty(c)) {
        CipherTable[c.toString()] = this._Alphapet[c].toString();
      }
    }
    return CipherTable;
  }
}
