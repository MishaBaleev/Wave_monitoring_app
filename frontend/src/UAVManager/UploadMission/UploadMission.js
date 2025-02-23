import "./UploadMission.scss";
import MissionCard from "./MissionCard";
import card_0 from "./img/0.png";
import card_1 from "./img/1.png";
import card_2 from "./img/2.png";
import card_3 from "./img/3.png";

const UploadMission = (props) => {
    //state
    const missions = [
        {name: "Миссия 1", id: 0, img: card_0},
        {name: "Миссия 2", id: 1, img: card_1},
        {name: "Миссия 3", id: 2, img: card_2},
        {name: "Миссия 4", id: 3, img: card_3},
    ]

    return <div className="upload_mission">
        <div className="title"><h3>Выбор полетного задания</h3></div>
        <ul className="missions">
            {missions.map((mission, index) => {
                return <MissionCard key={index} mission={mission} showMission={props.showMission}/>
            })}
        </ul>
    </div>
}

export default UploadMission