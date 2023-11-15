const lowerCaseCharacters = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode("a".charCodeAt(0) + index)
);

const upperCaseCharacters = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode("A".charCodeAt(0) + index)
);

const numbers = Array.from({ length: 10 }, (_, index) =>
  String.fromCharCode("0".charCodeAt(0) + index)
);

const specials = ["+", "=", "/", " "];

const domain = lowerCaseCharacters
  .concat(upperCaseCharacters)
  .concat(numbers)
  .concat(specials);

const generateCharset = () => {
  let array = [...domain];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  let charset = "";
  array.forEach((val) => {
    charset += `${val}\n`;
  });
  return charset;
};

const mapNumberToPaddedBinaryString = (number) => {
  const binaryString = number.toString(2);
  return binaryString.padStart(8, "0");
};

const encryptWithCharset = (charset, password) => {
  const binaryPassword = password.split("").map((char) => {
    const indexOfChar = charset.indexOf(char);
    return mapNumberToPaddedBinaryString(indexOfChar);
  });

  return binaryPassword.join("");
};

export { generateCharset, encryptWithCharset };
