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

const domain = lowerCaseCharacters.concat(
  upperCaseCharacters,
  numbers,
  specials
);

const generateCharset = (): string => {
    let array = [...domain];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array.join("\n");
}

const mapNumberToPaddedBinaryString = (num: number) => {
    return num.toString(2).padStart(8, "0");
}

const encryptWithCharset = (charset: string, password: string): string => {
    const binaryPassword = password.split("").map((char) => {
        const indexOfChar = charset.indexOf(char) + 1;
        return mapNumberToPaddedBinaryString(indexOfChar);
    });

    return binaryPassword.join("");
}

export { generateCharset, encryptWithCharset };
