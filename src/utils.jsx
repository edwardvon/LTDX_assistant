import JSEncrypt from "jsencrypt";

const generateTimestamp = () => {
    return new Date().getTime().toString().slice(0, 10);
}

//创建随机字符串
function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const pKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAooxomrujIP9vcxxNmS+Q1xxnaoxAfluwFvDR3+G+p84QMsePXDD67cLjJ+7n+79u2xoG7fVvDnzHDW+X5D/0/Dv9ajUaBpFQl3jqKwRiP3Lrx08seYzWIWDGHEjurbZrWGHRJNdoM7tEQPdPZftZC6iOm7kSjDIDiuqaIh9g3hqFSVQ5r15Dvae6qtREo1nDWKsf3tH6nkvVD2pIh3TBJUoGdfbPqnw/tNvzhwOX9tg7NjhZ8Yet1ctVt297G5HCwPSIBjhUKEtLYLk/8scPrzXnQpAU05m5WnHfDhfvvG2xoVXckveNvZhv6lvxTZqRkUBOI1pU16U9Tz4aDpCU7QIDAQAB
-----END PUBLIC KEY-----`;

//RSA加密
function encryptByRSA(message, publicKey = pKey) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var dd = encrypt.encrypt(message);
    return dd;
}

export { generateRandomString, generateTimestamp, encryptByRSA }