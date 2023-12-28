import axios from "axios";
import CryptoJS from "crypto-js";
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

function info() {
    const url = "https://app.campus.chinaunicom.cn/app/course/info";
    const param = {
        token: localStorage.getItem("t"),
        companyId: localStorage.getItem("companyId") || 0,
        from: "WEB",
        organizationId: localStorage.getItem("organizationId") || 0,
        courseId: JSON.parse(localStorage.getItem("playtimeData")).courseId,
        timestamp:generateTimestamp(),
        randomStr:"PWysCbnKGZOd7kiHSvAj6RpihjvW4DWV",
        sign:"ZX0QBw1qejwKoICOCkHgKE7beTE/71M/ycK5D4JkNu1nP0BlFibhFZRuoRLp0FRUzK077UgpqnM+zDavbFBREfaStFx+KxJsQmyUOTbYtza7bM5EWMCDQx7MWKVctXdkTdCxErN7LmtWxA+ToygwguFudKEdaddIg6SJDp003gkDxdVqljJUxitpUcWx78nD+JGIBNXCEAjY6xh7uvgf6HZCKWlPl8Ky1P8ElDqFb/JXoTa477eWLrLYGsjuuOH736wbifIw1mZcNX0JgMTIJuSC4a4cG/mX0eywxXoK5SSEiemOukdutjOow33xzaf7ASfa/qJzoqr8T5cmqY1iKw=="
    };

    return axios({
        url,
        method:"POST",
        params:param,
    })
}

const pKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAooxomrujIP9vcxxNmS+Q1xxnaoxAfluwFvDR3+G+p84QMsePXDD67cLjJ+7n+79u2xoG7fVvDnzHDW+X5D/0/Dv9ajUaBpFQl3jqKwRiP3Lrx08seYzWIWDGHEjurbZrWGHRJNdoM7tEQPdPZftZC6iOm7kSjDIDiuqaIh9g3hqFSVQ5r15Dvae6qtREo1nDWKsf3tH6nkvVD2pIh3TBJUoGdfbPqnw/tNvzhwOX9tg7NjhZ8Yet1ctVt297G5HCwPSIBjhUKEtLYLk/8scPrzXnQpAU05m5WnHfDhfvvG2xoVXckveNvZhv6lvxTZqRkUBOI1pU16U9Tz4aDpCU7QIDAQAB
-----END PUBLIC KEY-----`;

//RSA加密
function encryptByRSA(message, publicKey=pKey) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var dd = encrypt.encrypt(message);
    return dd;
}

function playtimeV2(k_data){
    const url = "https://app.campus.chinaunicom.cn/app/course/playtimeV2";
    const param = {
        token: localStorage.getItem("t"),
        companyId: localStorage.getItem("companyId") || 0,
        from: "WEB",
        organizationId: localStorage.getItem("organizationId") || 0,
        timestamp:generateTimestamp(),
        randomStr:generateRandomString(32),
        ...k_data
    };
    console.log(param);
    const sorted_keys = Object.keys(param).sort();
    const queryStr = sorted_keys.map((key)=>(key+'='+param[key])).join("&") + "&"
    console.log(queryStr);
    const md5_data = CryptoJS.MD5(queryStr).toString();
    console.log(md5_data);
    const sign = encryptByRSA(md5_data);
    param.sign=sign;
    console.log(param);
    return axios({
        url,
        method:"POST",
        params:param,
    })
}

export {
    info,
    playtimeV2
}