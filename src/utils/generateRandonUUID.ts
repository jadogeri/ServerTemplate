import nolookalikes from "nanoid-dictionary/nolookalikes";

export function generateRandomUUID(length : number) {
    const characters = nolookalikes;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
