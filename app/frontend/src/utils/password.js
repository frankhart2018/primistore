const shuffleString = (inputString) => {
  let charArray = inputString.split("");
  for (let i = charArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
  }
  return charArray.join("");
};

const generateSafePassword = (length) => {
  const uppercase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const lowercase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );

  const alphabets = uppercase.concat(lowercase);
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
  const specials = [
    "@",
    "#",
    "*",
    "(",
    ")",
    "+",
    "=",
    "{",
    "}",
    "/",
    "?",
    "~",
    ";",
    ",",
    ".",
    "-",
    "_",
  ];

  const numSpecials = Math.floor(0.2 * length);
  const numNumbers = Math.floor(0.2 * length);
  let numAlphabets = Math.floor(0.6 * length);

  const sumVal = numSpecials + numNumbers + numAlphabets;
  const diff = length - sumVal;
  numAlphabets += diff > 0 ? diff : 0;

  let password = alphabets
    .sort(() => Math.random() - 0.5)
    .slice(0, numAlphabets)
    .join("");

  password += numbers
    .sort(() => Math.random() - 0.5)
    .slice(0, numNumbers)
    .join("");

  password += specials
    .sort(() => Math.random() - 0.5)
    .slice(0, numSpecials)
    .join("");

  return shuffleString(password);
};

export { generateSafePassword };
