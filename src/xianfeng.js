function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
b = JSON.parse(window.localStorage.courseInfo);
c = b.courseNode[0];
fulltime = c.courseMinutes * 60 + c.courseSeconds;
const ss = async () => {
  a = document.querySelector(".n-ctCont-box").__vue__;
  while (a.$store.state.playtimeData.studyTime <= fulltime) {
    a.$store.state.playtimeData.studyTime += 179;
    a.postCoursePlaytime();
    await sleep(3 * 1e3);
  }
  console.log("修改完成");
};
ss();
