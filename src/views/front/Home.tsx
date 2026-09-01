import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import iconUrl from "@/assets/images/like.png";
import "@/styles/front/Home.scss";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content">
        <div className="text">
          <h2 className="title">
            一次温暖的对话
            <br />
            <span className="highlight-text">化孤更改独为慰藉</span>
          </h2>
          <p className="description">
            每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天，李家满
          </p>
          <div className="hero-actions">
            <Button
              size="large"
              style={{ fontSize: 14 }}
              onClick={() => navigate("/consultation")}
            >
              开始倾诉，获得陪伴,增加水果
            </Button>
            <Button
              size="large"
              style={{ borderColor: "#fff", color: "#fff", fontSize: 14 }}
              ghost
              onClick={() => navigate("/emotion-diary")}
            >
              记录心情 释放情感,分支上的改变
            </Button>
          </div>
        </div>
        <div className="robot">
          <img
            src={iconUrl}
            alt="机器人"
            className="robot-image"
            style={{ width: 150, height: 150 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
