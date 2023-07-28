const crypto = require("crypto");

const IV_LENGTH = 16;

class CipherUtil {

    static encrypt(text) {
        const funcName = "encrypt";
        try {
            const iv = crypto.randomBytes(IV_LENGTH);
        } catch(err) {
            console.error(`[${funcName}]`, err);
        }
    }

}

module.exports = CipherUtil;