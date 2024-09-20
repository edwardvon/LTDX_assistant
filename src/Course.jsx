import { useEffect, useState, useMemo } from "react";
import { info, playtimeV2 } from "./service";
import { sleep } from "./utils";

function VideoPanel({ show }) {
  const [entityData, setEntityData] = useState({
    courseNode: [],
    kpointList: [],
    course: {
      id: "",
    },
  });

  useEffect(() => {
    show && fetchVideoList();
  }, [show]);

  //   const playTimeList = useMemo(() => {
  //     let kList = entityData.kpointList.map((item) => {
  //       if (item.childKpointList && item.childKpointList.length > 0) {
  //         return item.childKpointList.map((child) => ({
  //           id: child.id,
  //           playTime: child.userKopintPlayTime, //平台接口就是写错了的
  //         }));
  //       } else {
  //         return {
  //           id: item.id,
  //           playTime: item.userPlayTime,
  //         };
  //       }
  //     });
  //     // console.log(kList);
  //     return kList;
  //   }, [entityData]);

  const fetchVideoList = () => {
    return info().then((res) => {
      console.log(res.data);
      setEntityData(res.data.entity);
    });
  };

  const handleSubmit = async (kpointId, playedTime) => {
    // const playedTime = playTimeList.filter((i) => i.id == kpointId)[0].playTime;
    console.log(playedTime);
    const node = entityData.courseNode.filter((i) => i.kpointId == kpointId)[0];
    const courseTime = node.courseSeconds + node.courseMinutes * 60;
    // 2024年9月18日 - "修改失败，超出进度范围"
    //const gapTime = courseTime * 1.1;
    // const userPlayTime = entityData.kpointList
    const gapTime = courseTime - playedTime;
    const step = 179; //2024年9月18日 测试发现限制每次小于180秒
    // const count = Math.ceil(gapTime/179);
    for (let i = playedTime + step; i <= courseTime + step; i += step) {
      const n = {
        courseId: entityData.course.id,
        type: "playback",
        kpointId: kpointId,
        studyTime: i,
        breakpoint: 1,
        accrualType: 0,
      };
      let a = await playtimeV2(n).then(
        (res) => {
          return res.data.entity>=100;
        },
        (error) => {
          console.log(error);
          return false;
        }
      );
      if (!a) {
        break;
      }
      //   await sleep(1000);
    }
    // const n = {
    //   courseId: entityData.course.id,
    //   type: "playback",
    //   kpointId: kpointId,
    //   studyTime: playedTime + step,
    //   breakpoint: courseTime.toFixed(),
    //   accrualType: 0,
    // };
    // return playtimeV2(n).then(async (res) => {
    //   await fetchVideoList();
    //   return res.data.entity;
    // });
    return fetchVideoList();
  };

  return (
    <div
      className="el-popover cbg_feedbackPoppver"
      style={{
        width: 400,
        maxHeight: 500,
        overflow: "auto",
        position: "fixed",
        bottom: 80,
        right: 20,
        transformOrigin: "right center",
        zIndex: 2016,
        display: show ? "" : "none",
      }}
    >
      {/* <div className='el-row' style={{ marginBottom: 20 }}>
                <div className='el-col-24'>
                    <button
                        className={`el-button el-button--primary is-plain`}
                    >
                        一键通关！
                    </button>
                </div>
            </div> */}
      {entityData.kpointList.map((item) => {
        let kps = [item];
        if (item.childKpointList && item.childKpointList.length > 0) {
          kps = item.childKpointList;
        }
        return kps.map((i) => (
          <VideoItem item={i} key={i.id} onSubmit={handleSubmit} />
        ));
      })}
    </div>
  );
}

function VideoItem({ item, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const handleClick = (kid) => {
    setLoading(true);
    onSubmit(kid, playedTime()).then(() => {
      setLoading(false);
    },(error)=>{
        alert(error);
      setLoading(false);
    }
    );
  };

  const playedTime = () => {
    if (item.userPlayTime && item.userPlayTime > 0) return item.userPlayTime;
    if (item.userKopintPlayTime && item.userKopintPlayTime > 0)
      return item.userKopintPlayTime;
    return 0;
  };

  const buttonRender = (item) => {
    const { progress, id } = item;
    if (progress < 100) {
      return (
        <button
          className={`el-button el-button--primary el-button--small ${
            loading ? "is-loading" : ""
          }`}
          onClick={() => handleClick(id)}
          disabled={loading}
        >
          {loading ? "修改中" : "修改"}
        </button>
      );
    } else {
      return (
        <button className="el-button el-button--success el-button--small is-disabled">
          已完成
        </button>
      );
    }
  };

  return (
    <div className="el-row" style={{ marginBottom: 10 }}>
      <div className="el-col-20">
        <div className="el-col-24">
          <span>{item.name}</span>
        </div>
        <div className="el-col-12">
          kpoint：
          <span>{item.id}</span>
        </div>
        <div className="el-col-12">
          进度：
          <span>{item.progress}%</span>
        </div>
      </div>
      <div className="el-col-4">{buttonRender(item)}</div>
    </div>
  );
}

export { VideoPanel };
