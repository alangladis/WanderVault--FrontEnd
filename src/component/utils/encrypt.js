// utils/encrypt.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Use a more secure key in production

// Encrypt data function
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt data function
export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
