import { useEffect, useState } from 'react';
import { info, playtimeV2 } from './service';

function VideoPanel({ show }) {
    const [entityData, setEntityData] = useState({
        courseNode: [],
        kpointList: [],
        course: {
            id: ""
        }
    });

    useEffect(() => {
        show && fetchVideoList();
    }, [show])

    const fetchVideoList = () => {
        return info()
            .then((res) => {
                console.log(res.data);
                setEntityData(res.data.entity);
            })
    }

    const handleSubmit = (kpointId) => {
        const node = entityData.courseNode.filter((i) => (i.kpointId == kpointId))[0];
        const courseTime = (node.courseSeconds + node.courseMinutes * 60);
        const gapTime = courseTime * 1.1;
        const n = {
            courseId: entityData.course.id,
            type: "playback",
            kpointId: kpointId,
            studyTime: gapTime.toFixed(),
            breakpoint: 1
        }
        return playtimeV2(n).then(() => { return fetchVideoList() });
    }

    return (
        <div
            className='el-popover cbg_feedbackPoppver'
            style={{
                width: 400,
                maxHeight: 500,
                overflow: 'auto',
                position: 'fixed',
                bottom: 80,
                right: 20,
                transformOrigin: 'right center',
                zIndex: 2016,
                display: show ? '' : 'none'
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
                    kps = item.childKpointList
                }
                return kps.map((i) => 
                <VideoItem item={i} key={i.id} onSubmit={handleSubmit} />
                )
            })
            }
        </div >
    )
}

function VideoItem({ item, onSubmit }) {
    const [loading, setLoading] = useState(false);

    const handleClick = (kid) => {
        setLoading(true);
        onSubmit(kid).then(() => {
            setLoading(false);
        });
    };

    const buttonRender = (item) => {
        const { progress, id } = item;
        if (progress < 100) {
            return (
                <button
                    className={`el-button el-button--primary el-button--small ${loading ? "is-loading" : ""}`}
                    onClick={() => handleClick(id)}
                    disabled={loading}
                >
                    {loading ? "修改中" : "修改"}
                </button>
            )
        } else {
            return (<button className="el-button el-button--success el-button--small is-disabled">已完成</button>)
        }
    }

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
            <div className="el-col-4">
                {buttonRender(item)}
            </div>
        </div>
    )
}

export {
    VideoPanel
}