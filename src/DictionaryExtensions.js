function FirstOrDefaultKeyByValue(dictionary, value) {
  for (const key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      if (dictionary[key] === value) {
        return key;
      }
    }
  }
  return null;
}
