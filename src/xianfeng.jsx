import { useEffect, useState, useMemo } from "react";
import { info, playtimeV2 } from "./service";
import { sleep } from "./utils";

function PartyPanel({show}) {
  const getCookie = (name) => {
    let cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      let parts = cookies[i].split("=");
      if (parts[0] === name) {
        return parts[1];
      }
    }
    return "";
  };

  const fetchCourseInfo = async () => {
    const s = window.location.search;
    const start = s.indexOf("courseId=") + 9;
    const end = start + 36;
    const partyCourseId = s.slice(start, end);
    const token = getCookie("token");
    const url =
      "https://party.chinaunicom.cn/api/xxpt/courseGetOrSet/getCourseDetailById?token=" +
      token +
      "&courseId=" +
      partyCourseId
      // +"&loading=1";
    return await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // res.data.
        return res.data.courseUrl;
      });
  };

  useEffect(() => {
    async function ins() {
    if (document.querySelectorAll("#cmsang").length>0){return;}
      // const courseId = await fetchCourseInfo();
      // const baseUrl =
      //   "https://campus.chinaunicom.cn/training/pc/curriculum.html#/web/course_courseDetails/";
      // const url = baseUrl + courseId;
      const url =await fetchCourseInfo();
      console.log(url);
      const b = document.querySelector(".detail_title>div");
      const aa = document.createElement("a");
      aa.setAttribute("href", url);
      aa.setAttribute("id","cmsang")
      aa.setAttribute("target", "__blank");
      aa.setAttribute("style", "margin-left:10px;margin-right:10px");
      aa.innerText = "点击跳转到党校学习";
      b.appendChild(aa);
    }
    ins();
  }, []);

  const handleSubmit = async () => {
    const courseId = await fetchCourseInfo();
    const baseUrl =
      "https://campus.chinaunicom.cn/training/pc/curriculum.html#/web/course_courseDetails/";
    const url = baseUrl + courseId;
    console.log(url);
    return window.open(url, (replace = false));
  };

}

export { PartyPanel };
