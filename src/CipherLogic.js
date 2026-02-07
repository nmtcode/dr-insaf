export class clsLocation {
  constructor(I, J) {
    this.I = I;
    this.J = J;
  }
  static NullLocation() {
    return new clsLocation(null, null);
  }
  MoveToNextIndexInRow() {
    this.J = this.J === 4 ? 0 : this.J + 1;
  }
  MoveToNextIndexInColumn() {
    this.I = this.I === 4 ? 0 : this.I + 1;
  }
  MoveToPreviousIndexInRow() {
    this.J = this.J === 0 ? 4 : this.J - 1;
  }
  MoveToPreviousIndexInColumn() {
    this.I = this.I === 0 ? 4 : this.I - 1;
  }
}

export function FirstOrDefaultKeyByValue(dictionary, value) {
  for (const key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      if (dictionary[key] === value) {
        return key;
      }
    }
  }
  return null;
}

export class clsCaesar {
  _Alphapet = {};
  _Key = 0;
  constructor(Key) {
    this._Key = Key;
    this._FullAlphapet();
  }
  _IsAsciiLatter(C1) {
    return (
      (C1.charCodeAt(0) >= 65 && C1.charCodeAt(0) <= 90) ||
      (C1.charCodeAt(0) >= 97 && C1.charCodeAt(0) <= 122)
    );
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
    if (!this._IsAsciiLatter(C1)) return C1;
    let IsLower = C1 === C1.toLowerCase() && C1 !== C1.toUpperCase();
    let UpperC1 = C1.toUpperCase();
    let value = (this._Alphapet[UpperC1] + this._Key) % 26;
    let returnValue = FirstOrDefaultKeyByValue(this._Alphapet, value);
    return !IsLower ? returnValue : returnValue.toLowerCase();
  }
  _DecryptChar(C1) {
    if (C1 === " ") return " ";
    if (!this._IsAsciiLatter(C1)) return C1;
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
  GetCipherTable() {
    const result = {};
    for (const c in this._Alphapet) {
      const encryptedValue = (this._Alphapet[c] + this._Key) % 26;
      result[c] = FirstOrDefaultKeyByValue(this._Alphapet, encryptedValue);
    }
    return result;
  }
}

export class clsPlayFiar {
  _PlayFiarTable = [];
  _Key;
  constructor(Key) {
    this._Key = Key.toUpperCase();
    this._FullPlayFiarTable();
  }
  _FullPlayFiarTable() {
    let list = new Set();
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const i of this._Key) {
      if (i === "J") continue;
      list.add(i);
    }
    for (const i of chars) {
      if (i === "J") continue;
      list.add(i);
    }
    let MyList = Array.from(list);
    let Counter = 0;
    for (let i = 0; i < 5; i++) {
      this._PlayFiarTable[i] = [];
      for (let j = 0; j < 5; j++) {
        this._PlayFiarTable[i][j] = MyList[Counter];
        Counter++;
      }
    }
  }
  IsInTheSameRow(L1, L2) {
    return L1.I === L2.I;
  }
  IsInTheSameColumn(L1, L2) {
    return L1.J === L2.J;
  }
  _GetIndexOfChar(Letter) {
    let LetterStr = Letter === "I" || Letter === "J" ? "I" : Letter.toString();
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (LetterStr === this._PlayFiarTable[i][j]) {
          return new clsLocation(i, j);
        }
      }
    }
    return clsLocation.NullLocation();
  }
  _GetValueInPlayFiarTable(location) {
    return this._PlayFiarTable[location.I ?? 0][location.J ?? 0];
  }
  _InsertXBetweenDuplicates(input) {
    let result = "";
    for (let i = 0; i < input.length; i++) {
      let currentChar = input[i];
      result += currentChar;
      if (i < input.length - 1) {
        let nextChar = input[i + 1];
        if (currentChar === nextChar) {
          result += "X";
        }
      }
    }
    return result;
  }
  _HandleTextToEncyption(Text, IsEncryption = true) {
    Text = Text.trim().toUpperCase().replace(/ /g, "").replace(/J/g, "I");
    if (IsEncryption) Text = this._InsertXBetweenDuplicates(Text);
    if (Text.length % 2 !== 0) {
      Text += "X";
    }
    return Text;
  }
  _EncryptDecrypt2Char(TwoChar, isEncrypt) {
    let Location1 = this._GetIndexOfChar(TwoChar[0]);
    let Location2 = this._GetIndexOfChar(TwoChar[1]);
    let L1After = new clsLocation(Location1.I, Location1.J);
    let L2After = new clsLocation(Location2.I, Location2.J);

    if (this.IsInTheSameRow(Location1, Location2)) {
      isEncrypt
        ? L1After.MoveToNextIndexInRow()
        : L1After.MoveToPreviousIndexInRow();
      isEncrypt
        ? L2After.MoveToNextIndexInRow()
        : L2After.MoveToPreviousIndexInRow();
    } else if (this.IsInTheSameColumn(Location1, Location2)) {
      isEncrypt
        ? L1After.MoveToNextIndexInColumn()
        : L1After.MoveToPreviousIndexInColumn();
      isEncrypt
        ? L2After.MoveToNextIndexInColumn()
        : L2After.MoveToPreviousIndexInColumn();
    } else {
      L1After = new clsLocation(Location1.I, Location2.J);
      L2After = new clsLocation(Location2.I, Location1.J);
    }
    return (
      this._GetValueInPlayFiarTable(L1After) +
      this._GetValueInPlayFiarTable(L2After)
    );
  }
  Encrypt(PlainTXT) {
    let CipherTXT = "";
    let Text = this._HandleTextToEncyption(PlainTXT, true);
    for (let i = 0; i < Text.length; i += 2) {
      CipherTXT += this._EncryptDecrypt2Char(Text[i] + Text[i + 1], true);
    }
    return CipherTXT;
  }
  Decrypt(CipherTXT) {
    let PlainTXT = "";
    let Text = this._HandleTextToEncyption(CipherTXT, false);
    for (let i = 0; i < Text.length; i += 2) {
      PlainTXT += this._EncryptDecrypt2Char(Text[i] + Text[i + 1], false);
    }
    return PlainTXT;
  }
  GetCipherTable() {
    return this._PlayFiarTable.flat();
  }
}

export class clsMixedAlphabet {
  _Key = "";
  _Alphabet = [];
  _KeyUniuqe = new Set();
  _MixedAlphabet = {};
  constructor(Key) {
    this._Key = Key;
    this._FullAlphabet();
    this._FullKeyUniuqe();
    this._FullMixedAlphabet();
  }
  _FullAlphabet() {
    for (let i = 65; i <= 90; i++) {
      this._Alphabet.push(String.fromCharCode(i));
    }
  }
  _FullKeyUniuqe() {
    for (const c of this._Key) {
      this._KeyUniuqe.add(c.toUpperCase());
    }
    for (const c of this._Alphabet) {
      this._KeyUniuqe.add(c);
    }
  }
  _FullMixedAlphabet() {
    for (const c of this._Alphabet) {
      this._MixedAlphabet[c] = " ";
    }
    let i = 65;
    let uniqueChars = Array.from(this._KeyUniuqe);
    for (const c of uniqueChars) {
      if (i <= 90) {
        this._MixedAlphabet[String.fromCharCode(i)] = c;
        i++;
      }
    }
    this._MixedAlphabet[" "] = " ";
  }
  Encrypt(PlaintTXT) {
    let CipherTXT = "";
    PlaintTXT = PlaintTXT.toUpperCase();
    for (const p of PlaintTXT) {
      CipherTXT += this._MixedAlphabet[p] || p;
    }
    return CipherTXT;
  }
  Decrypt(CipherTXT) {
    let PlaintTXT = "";
    CipherTXT = CipherTXT.toUpperCase();
    for (const c of CipherTXT) {
      PlaintTXT += FirstOrDefaultKeyByValue(this._MixedAlphabet, c) || c;
    }
    return PlaintTXT;
  }
  GetCipherTable() {
    return this._MixedAlphabet;
  }
}


export class clsLine {
    _CountOfLines = 2; 
    _SpaceChar = '*';

    constructor(Key) {
        // مفتاح ثابت 2
    }

    RailEncrypt(PlaintTXT) {
        let processedText = PlaintTXT.toUpperCase().replace(/\s/g, this._SpaceChar);
        const n = processedText.length;
        const key = this._CountOfLines; 

        if (n === 0) return "";

        const fence = Array.from({ length: key }, () => Array(n).fill('\n'));
        
        let row = 0;
        let dirDown = true; 

        for (let i = 0; i < n; i++) {
            fence[row][i] = processedText[i];
            
            if (row === 0) {
                dirDown = true;
            } else if (row === key - 1) { 
                dirDown = false;
            }

            row += dirDown ? 1 : -1;
        }
        

        let ciphertext = '';
        for (let r = 0; r < key; r++) {
            for (let c = 0; c < n; c++) {
                if (fence[r][c] !== '\n') {
                    ciphertext += fence[r][c];
                }
            }
        }

        return ciphertext;
    }

    RailDecrypt(CipherTXT) {
        const n = CipherTXT.length;
        const key = this._CountOfLines;
        if (n === 0) return "";
        
        const fence = Array.from({ length: key }, () => Array(n).fill('\n'));
        let row = 0;
        let dirDown = true;
        const positions = [];

        for (let i = 0; i < n; i++) {
            positions.push({ r: row, c: i });
            
            if (row === 0) {
                dirDown = true;
            } else if (row === key - 1) {
                dirDown = false;
            }

            row += dirDown ? 1 : -1;
        }

        positions.sort((a, b) => a.r - b.r || a.c - b.c);

        let charIndex = 0;
        for (const pos of positions) {
            if (charIndex < n) {
                fence[pos.r][pos.c] = CipherTXT[charIndex];
                charIndex++;
            }
        }
        
        positions.sort((a, b) => a.c - b.c);
        

        let plaintext = '';
        for (const pos of positions) {
            plaintext += fence[pos.r][pos.c];
        }

        plaintext = plaintext.replace(new RegExp(this._SpaceChar, 'g'), ' ');
        
        return plaintext;
    }
    
    GetCipherTable() {
        return {}; 
    }
}