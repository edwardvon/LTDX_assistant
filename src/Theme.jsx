import { useEffect, useMemo, useState } from "react";
import {
  getMyAreaInfoCourse,
  info,
  playtimeV2,
  getMyAreaInfoResourceLibGroup,
} from "./service";
import { Button, Pagination, Select } from "antd";
import "./App.css";
import { sleep } from "./utils";

function ThemePanel({ show }) {
  const [entityData, setEntityData] = useState({
    courseList: [],
    page: {},
    id: "",
  });
  const [subjectId, setSubjectId] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("2");

  const fetchCourseList = (page, subjectId = "") => {
    return getMyAreaInfoCourse(page, subjectId,statusFilter).then((res) => {
      console.log(res.data);
      setEntityData(res.data.entity);
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    return fetchCourseList(page, subjectId);
  };

  useEffect(() => {
    show && fetchCourseList(currentPage, subjectId);
  }, [show, subjectId, statusFilter]);

  useEffect(() => {
    getMyAreaInfoResourceLibGroup().then((res) => {
      const ll = res.data.entity.planLibGroupList;
      setGroupList(ll.map((item) => ({ value: item.id, label: item.name })));
    });
  }, []);

  const handleGroupSelect = (subjectId) => {
    setCurrentPage(1);
    setSubjectId(subjectId);
  };

  const handleCourseSubmit = (courseId) => {
    return info(courseId).then((res) => {
      const entity = res.data.entity;
      console.log(entity);
      entity.kpointList.map(async (kItem) => {
        let kps = [kItem];
        if (kItem.childKpointList && kItem.childKpointList.length > 0) {
          kps = kItem.childKpointList;
        }
        //   let finishedCount = 0;
        for (let idx = 0; idx < kps.length; idx++) {
          const k = kps[idx];
          const kpointId = k.id;
          const playedTime = k.userPlayTime || k.userKopintPlayTime || 0;
          const node = entity.courseNode.filter(
            (i) => i.kpointId == kpointId
          )[0];
          const courseTime = node.courseSeconds + node.courseMinutes * 60;
          // 2024-9-18 发现平台限制单次请求studyTime上限（<180）
          const step = 179;
          for (let i = playedTime + step; i <= courseTime + step; i += step) {
            const n = {
              courseId: entity.course.id,
              type: "playback",
              kpointId: kpointId,
              studyTime: i,
              breakpoint: 1,
            };
            await sleep(500)
            await playtimeV2(n);
          }
        }
      });
      return fetchCourseList(currentPage, subjectId);
    });
  };

  const oneClick = async () => {
    const courseList = entityData.courseList
    for (let i = 0; i < courseList.length; i++) {
      const course = courseList[i];
      console.log(course.name,course.id,course.courseProgress);
      if (course.courseProgress >= 100) {
        continue;
      } else {
        console.log("启动",course.name)
        await handleCourseSubmit(course.id)
      }
    }
    fetchCourseList(currentPage, subjectId);
  };
  return (
    <div
      className="el-popover cbg_feedbackPoppver"
      style={{
        width: 460,
        maxHeight: 680,
        overflow: "auto",
        position: "fixed",
        bottom: 80,
        right: 20,
        transformOrigin: "right center",
        zIndex: 100,
        display: show ? "" : "none",
      }}
    >
        {groupList.length > 1 && (
          <div className="el-row">
            分类：
            <Select
              options={[{ value: "", label: "全部" }, ...groupList]}
              style={{ minWidth: 180 }}
              onChange={(value) => {
                handleGroupSelect(value);
              }}
            />
            <div
              className="el-divider el-divider--horizontal"
              style={{ margin: "10px 0" }}
            ></div>
          </div>
        )}
      <div className="el-row" style={{marginBottom:14}}>
        <div className="el-col-6">
          <Button type="primary" onClick={oneClick}>一键通关！</Button>
        </div>
        <div className="el-col-12">
          <Button onClick={()=>{fetchCourseList(currentPage, subjectId)}}>刷新</Button>
        </div>
        <div className="el-col-6">
            <Select
              options={[{ value: "1", label: "全部" }, {value:"2",label:"未学习"},{ value: "3", label: "已完成" }, {value:"4",label:"未完成"}]}
              style={{ minWidth: 120 }}
              onChange={(value) => {
                setStatusFilter(value);
              }}
              defaultValue={"2"}
            />
        </div>
      </div>
      {entityData.courseList.map((i) => (
        <CourseItem item={i} key={i.id} onSubmit={handleCourseSubmit} />
      ))}
      <Pagination
        current={entityData.page.currentPage}
        total={entityData.page.totalPageSize * 10}
        hideOnSinglePage={true}
        showSizeChanger={false}
        onChange={handlePageChange}
      />
      <div className="sticky-text">
        <p style={{ fontSize: 16, fontWeight: 800 }}>
          点修改后不要马上关闭页面，等1分钟刷新确认进度（非实时，可进入课程内确认）
        </p>
      </div>
    </div>
  );
}

function CourseItem({ item, onSubmit }) {
  const [loading, setLoading] = useState(false);

  const handleClick = (kid) => {
    setLoading(true);
    onSubmit(kid).then(() => {
      setLoading(false);
    });
  };
  const finished = useMemo(() => {
    return item.courseProgress >= 100;
  }, [item]);

  const buttonRender = (item) => {
    const { courseProgress, id } = item;
    if (courseProgress < 100) {
      return (
        <button
          className={`el-button el-button--primary el-button--small ${
            loading ? "is-loading" : ""
          }`}
          onClick={() => handleClick(id)}
          disabled={loading || finished}
        >
          {loading ? "修改中" : finished ? "已启动" : "修改"}
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
    <>
      <div className="el-row">
        <div className="el-col-20">
          <div className="el-col-22">
            <p style={{ fontSize: 14 }}>{item.name}</p>
          </div>
          {/* <div className="el-col-10">
                        courseId：
                        <span>{item.id}</span>
                    </div> */}
          {/* <div className="el-col-10">
                        进度：
                        <span>{item.courseProgress}%</span>
                    </div> */}
          <div className="el-col-18">
            <div className="el-progress el-progress--line">
              <div className="el-progress-bar">
                <div
                  className="el-progress-bar__outer"
                  style={{ height: 6, backgroundColor: "rgb(235, 238, 245)" }}
                >
                  <div
                    className="el-progress-bar__inner"
                    style={{ width: `${item.courseProgress}%` }}
                  ></div>
                </div>
              </div>
              <div
                className="el-progress__text"
                style={{ fontSize: "14px", color: "rgb(96, 98, 102)" }}
              >
                {item.courseProgress}%
              </div>
            </div>
          </div>
        </div>
        <div className="el-col-4">{buttonRender(item)}</div>
      </div>
      <div
        className="el-divider el-divider--horizontal"
        style={{ margin: "10px 0" }}
      ></div>
    </>
  );
}

const OneClickItem = (item) => {
  return <>
    
  </>;
};

export { ThemePanel };
