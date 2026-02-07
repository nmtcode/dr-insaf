import { clsLocation } from "./clsLocation";

class clsPlayFiar {
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
      if (i === "I" || i === "J") continue;
      list.add(i);
    }

    for (const i of chars) {
      if (i === "I" || i === "J") {
        list.add("IJ");
      } else {
        list.add(i);
      }
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
    let LetterStr = Letter === "I" || Letter === "J" ? "IJ" : Letter.toString();
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
    return this._PlayFiarTable[location.I ?? 0][location.J ?? 0][0];
  }

  _Encrypt2Char(TwoChar) {
    let Location1 = this._GetIndexOfChar(TwoChar[0]);
    let Location2 = this._GetIndexOfChar(TwoChar[1]);

    let Location1AfterEncryption = new clsLocation(Location1.I, Location1.J);
    let Location2AfterEncryption = new clsLocation(Location2.I, Location2.J);

    let CipherTXT = "";

    if (this.IsInTheSameRow(Location1, Location2)) {
      Location1AfterEncryption.MoveToNextIndexInRow();
      Location2AfterEncryption.MoveToNextIndexInRow();
    } else if (this.IsInTheSameColumn(Location1, Location2)) {
      Location1AfterEncryption.MoveToNextIndexInColumn();
      Location2AfterEncryption.MoveToNextIndexInColumn();
    } else {
      Location1AfterEncryption = new clsLocation(Location1.I, Location2.J);
      Location2AfterEncryption = new clsLocation(Location2.I, Location1.J);
    }

    CipherTXT += this._GetValueInPlayFiarTable(Location1AfterEncryption);
    CipherTXT += this._GetValueInPlayFiarTable(Location2AfterEncryption);

    return CipherTXT;
  }

  _Decrypt2Char(TwoChar) {
    let Location1 = this._GetIndexOfChar(TwoChar[0]);
    let Location2 = this._GetIndexOfChar(TwoChar[1]);

    let Location1AfterEncryption = new clsLocation(Location1.I, Location1.J);
    let Location2AfterEncryption = new clsLocation(Location2.I, Location2.J);

    let PlainTXT = "";

    if (this.IsInTheSameRow(Location1, Location2)) {
      Location1AfterEncryption.MoveToPreviousIndexInRow();
      Location2AfterEncryption.MoveToPreviousIndexInRow();
    } else if (this.IsInTheSameColumn(Location1, Location2)) {
      Location1AfterEncryption.MoveToPreviousIndexInColumn();
      Location2AfterEncryption.MoveToPreviousIndexInColumn();
    } else {
      Location1AfterEncryption = new clsLocation(Location1.I, Location2.J);
      Location2AfterEncryption = new clsLocation(Location2.I, Location1.J);
    }

    PlainTXT += this._GetValueInPlayFiarTable(Location1AfterEncryption);
    PlainTXT += this._GetValueInPlayFiarTable(Location2AfterEncryption);

    return PlainTXT;
  }

  IsOddNum(Num) {
    return Num % 2 === 1;
  }

  IsEvenNum(Num) {
    return !this.IsOddNum(Num);
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
    Text = Text.trim().toUpperCase().replace(/ /g, "");

    if (IsEncryption) Text = this._InsertXBetweenDuplicates(Text);

    if (this.IsOddNum(Text.length)) {
      Text += "X";
    }

    return Text;
  }

  Encrypt(PlainTXT) {
    let CipherTXT = "";
    let Text = this._HandleTextToEncyption(PlainTXT);

    for (let i = 0; i < Text.length; i += 2) {
      let twoChar = Text[i] + Text[i + 1];
      CipherTXT += this._Encrypt2Char(twoChar);
    }

    return CipherTXT;
  }

  Decrypt(CipherTXT) {
    let PlainTXT = "";
    let Text = this._HandleTextToEncyption(CipherTXT, false);

    for (let i = 0; i < Text.length; i += 2) {
      let twoChar = Text[i] + Text[i + 1];
      PlainTXT += this._Decrypt2Char(twoChar);
    }

    return PlainTXT;
  }

  Test() {
    return;
  }
  GetTableCipher() {
    return null;
  }
}
