import { useEffect, useState } from "react";
import { getMyAreaInfoCourse, info, playtimeV2, getMyAreaInfoResourceLibGroup } from "./service";
import { Pagination, Select } from "antd";
import './App.css';

function ThemePanel({ show }) {
    const [entityData, setEntityData] = useState({
        courseList: [],
        page: {},
        id: ""
    });
    const [subjectId, setSubjectId] = useState("");
    const [groupList, setGroupList] = useState([]);

    const fetchCourseList = (currentPage = 1, subjectId = "") => {
        return getMyAreaInfoCourse(currentPage, subjectId).then((res) => {
            console.log(res.data);
            setEntityData(res.data.entity)
        })
    }

    const handlePageChange = (page) => {
        return fetchCourseList(page, subjectId);
    }

    useEffect(() => {
        show && fetchCourseList(1, subjectId);
    }, [show, subjectId]);

    useEffect(() => {
        getMyAreaInfoResourceLibGroup().then((res) => {
            const ll = res.data.entity.planLibGroupList;
            setGroupList(ll.map(item => ({ value: item.id, label: item.name })))
        })
    }, []);

    const handleGroupSelect = (subjectId) => {
        setSubjectId(subjectId)
    }

    const handleCourseSubmit = (courseId) => {
        return info(courseId).then(res => {
            const entity = res.data.entity;
            console.log(entity);
            entity.kpointList.map((kItem) => {
                let kps = [kItem];
                if (kItem.childKpointList && kItem.childKpointList.length > 0) {
                    kps = kItem.childKpointList;
                }
                kps.map((k) => {
                    const kpointId = k.id;
                    const node = entity.courseNode.filter((i) => (i.kpointId == kpointId))[0];
                    const courseTime = (node.courseSeconds + node.courseMinutes * 60);
                    const gapTime = courseTime * 1.1;
                    const n = {
                        courseId: entity.course.id,
                        type: "playback",
                        kpointId: kpointId,
                        studyTime: gapTime.toFixed(),
                        breakpoint: 1
                    }
                    playtimeV2(n);
                })
            });
        }).then(() => { fetchCourseList() });


    }
    return (
        <div
            className='el-popover cbg_feedbackPoppver'
            style={{
                width: 460,
                maxHeight: 680,
                overflow: 'auto',
                position: 'fixed',
                bottom: 80,
                right: 20,
                transformOrigin: 'right center',
                zIndex: 100,
                display: show ? '' : 'none'
            }}
        >
            {groupList.length > 1 &&
                <>
                    分类：<Select options={groupList} style={{ minWidth: 180 }} onChange={(value) => { handleGroupSelect(value) }} />
                    <div className="el-divider el-divider--horizontal" style={{ margin: "10px 0" }}></div>
                </>
            }

            {entityData.courseList.map((i) => <CourseItem item={i} key={i.id} onSubmit={handleCourseSubmit} />)}
            <Pagination
                current={entityData.page.currentPage}
                total={entityData.page.totalPageSize * 10}
                hideOnSinglePage={true}
                showSizeChanger={false}
                onChange={handlePageChange}
            />
            <div className="sticky-text">
                <p style={{ fontSize: 16, fontWeight: 800 }}>进度数据非实时，点一次修改就好，过几分钟刷新确认进度</p>

            </div>
        </div >
    )
}

function CourseItem({ item, onSubmit }) {
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);

    const handleClick = (kid) => {
        setLoading(true);
        onSubmit(kid).then(() => {
            setLoading(false);
            setFinished(true);
        });
    };

    const buttonRender = (item) => {
        const { courseProgress, id } = item;
        if (courseProgress < 100) {
            return (
                <button
                    className={`el-button el-button--primary el-button--small ${loading ? "is-loading" : ""}`}
                    onClick={() => handleClick(id)}
                    disabled={loading || finished}
                >
                    {loading ? "修改中" : (finished ? "已修改" : "修改")}
                </button>
            )
        } else {
            return (<button className="el-button el-button--success el-button--small is-disabled">已完成</button>)
        }
    }

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
                    <div className="el-col-22">
                        <div className="el-progress el-progress--line">
                            <div className="el-progress-bar">
                                <div className="el-progress-bar__outer" style={{ height: 6, backgroundColor: 'rgb(235, 238, 245)' }}>
                                    <div className="el-progress-bar__inner" style={{ width: `${item.courseProgress}%` }}></div>
                                </div>
                            </div>
                            <div className="el-progress__text" style={{ fontSize: '14px', color: 'rgb(96, 98, 102)' }}>{item.courseProgress}%</div>
                        </div>
                    </div>
                </div>
                <div className="el-col-4">
                    {buttonRender(item)}
                </div>
            </div>
            <div className="el-divider el-divider--horizontal" style={{ margin: "10px 0" }}></div>
        </>

    )
}

export { ThemePanel }