export default function decodeTurkishCharacters(text: String) {
  return text
    .replace(/\ğ/g, "g")
    .replace(/\ü/g, "u")
    .replace(/\ş/g, "s")
    .replace(/\ı/g, "i")
    .replace(/\ö/g, "o")
    .replace(/\ç/g, "c")
    .replace(/\Ğ/g, "G")
    .replace(/\Ü/g, "U")
    .replace(/\Ş/g, "S")
    .replace(/\İ/g, "I")
    .replace(/\Ö/g, "O")
    .replace(/\Ç/g, "C");
}
