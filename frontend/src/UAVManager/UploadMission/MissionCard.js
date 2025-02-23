const MissionCard = (props) => {
    return <li className="mission_card" onClick={() => {props.showMission(props.mission.id)}}>
        <div className="mission_title"><h3>{props.mission.name}</h3></div>
        <img src={props.mission.img} alt="mission"/>
    </li>
}

export default MissionCard