import replaceChars from '../allpuntype-data/chars_to_replace.json'
import originalSkipChars from '../allpuntype-data/chars_to_skip.json'
import overwriteChars from '../allpuntype-data/chars_to_overwrite.json'
import kanaChars from '../allpuntype-data/chars_to_replace_kana.json'

const skipChars = originalSkipChars.map((char: string) => char.toUpperCase())

export function isAllpuntypeChar(char: string) {
  let result = false
  const unicodeHex = char.charCodeAt(0).toString(16).toUpperCase()

  // @ts-ignore
  if (replaceChars[unicodeHex] && !skipChars.includes(unicodeHex)) {
    result = true
  }

  // @ts-ignore
  if (overwriteChars[unicodeHex] && !skipChars.includes(unicodeHex)) {
    result = true
  }

  // @ts-ignore
  if (kanaChars[unicodeHex] && !skipChars.includes(unicodeHex)) {
    result = true
  }

  return result
}
