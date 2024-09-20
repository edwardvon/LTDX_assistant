import axios from "axios";
import { MD5 } from "crypto-js";
import { generateTimestamp, generateRandomString, encryptByRSA } from "./utils";

function postWithSign(url, param_data) {
    const param = {
        ...param_data,
        token: localStorage.getItem("t"),
        companyId: localStorage.getItem("companyId") || 0,
        from: "WEB",
        organizationId: localStorage.getItem("organizationId") || 0,
        timestamp: generateTimestamp(),
        randomStr: generateRandomString(32),
    };

    const sorted_keys = Object.keys(param).sort();
    const queryStr = sorted_keys.map((key) => (key + '=' + param[key])).join("&") + "&"
    const md5_data = MD5(queryStr).toString();
    const sign = encryptByRSA(md5_data);
    param.sign = sign;

    return axios({
        url,
        method: "POST",
        params: param
    })
}

//theme页课程列表
function getMyAreaInfoCourse(page=1,subjectId="") {
    const url = "https://app.campus.chinaunicom.cn/app/themeColumn/getMyAreaInfoCourse";
    const param = {
        id: window.location.hash.split("=")[1].split('&')[0],
        subjectId: subjectId,
        status: "1",
        name: "",
        currentPage: page,
        pageSize: "8",
        total: "0",
    }
    return postWithSign(url,param);
}

function getMyAreaInfoResourceLibGroup(){
    const url="https://app.campus.chinaunicom.cn/app/themeColumn/getMyAreaInfoResourceLibGroup";
    const param = {
        parentLibGroupId: 0,
        id:  window.location.hash.split("=")[1].split('&')[0],
        parentLibType: "COURSE",
    }
    return postWithSign(url,param)
}

// course页内课程数据
function info(cid=null) {
    const url = "https://app.campus.chinaunicom.cn/app/course/info";
    // const param = {
    //     token: "",
    //     companyId: 0,
    //     from: "",
    //     organizationId: 0,
    //     courseId: JSON.parse(localStorage.getItem("playtimeData")).courseId,
    //     timestamp: "",
    //     randomStr: "",
    //     sign: ""
    // };
    const param = {
        courseId: cid || JSON.parse(localStorage.getItem("playtimeData")).courseId,
    };

    return postWithSign(url, param);
}



//修改课程时间
function playtimeV2(k_data) {
    const url = "https://app.campus.chinaunicom.cn/app/course/playtimeV2";
    return postWithSign(url, k_data);
}

export {
    info,
    playtimeV2,
    getMyAreaInfoCourse,
    getMyAreaInfoResourceLibGroup
}