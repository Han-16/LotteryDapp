const crypto = require("crypto");
const path = require("path");
const envType = process.env.NODE_ENV || "development";
require("dotenv").config({ path: path.join(__dirname, `../config/${envType}.env`)});

const IV_LENGTH = 16;

class CipherUtil {
    static encrypt(text) {
        const funcName = "encrypt";
        try {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv(
                "aes-256-cbc",
                Buffer.from(process.env.ENCRYPTION_KEY),
                iv
            );
            const encrypted = cipher.update(text);

            return (
                iv.toString("hex") +
                ":" + 
                Buffer.concat([encrypted, cipher.final()]).toString("hex")
            );
        } catch(err) {
            console.error(`[${funcName}]`, err);
        }
    }

    static decrypt(text) {
        const funcName = "decrypt"
        try {
            const textParts = text.split(":");
            const iv = Buffer.from(textParts.shift(), "hex");
            const encrypted = Buffer.from(textParts.join(":"), "hex");
            const deciphter = crypto.createDecipteriv(
                "aes-256-cbc",
                Buffer.from(process.env.ENCRYPTION_KEY),
                iv
            );
            const decrypted = decipher.update(encrypted);

            return Buffer.concat([decrypted, decipher.final()]).toString();
        } catch (err) {
            console.err(`[${funcName}] err : `, err);
        }
    }
}

module.exports = CipherUtil;