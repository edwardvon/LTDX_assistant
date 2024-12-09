import { useState } from "react";
import { VideoPanel } from "./Course";
import { ThemePanel } from "./Theme";
import icon from "./assets/icon2.png";
import "./App.css";

function idenUrl() {
  const url = window.location.href;
  if (url.indexOf("ThemeCourses") > 0) return "theme";
  if (url.indexOf("curriculum.html") > 0) return "course";
  if (url.indexOf("lawplatform.unicom.local") > 0) return "lawplatform";
  return false;
}

function App() {
  const [showPanel, setShowPanel] = useState(false);

  const urlFlag = idenUrl();

  const handleShowPanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <div>
      {urlFlag && (
        <img
          src={icon}
          style={{
            width: 64,
            position: "fixed",
            bottom: 0,
            right: 0,
            opacity: 0.6,
          }}
          onClick={handleShowPanel}
        />
      )}
      {urlFlag == "course" && <VideoPanel show={showPanel} />}
      {urlFlag == "theme" && <ThemePanel show={showPanel} />}
    </div>
  );
}

export default App;
