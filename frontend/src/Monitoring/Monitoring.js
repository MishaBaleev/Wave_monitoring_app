import "./Monitoring.scss";
import { useState } from "react"; 
import logo_section from "./img/logo_section.png";
import ScatterMonitoring from "./ScatterMonitoring";
import { connect } from "react-redux";
import { updateModal } from "../AppSlice";
import MultiGraphMonitoring from "./MultiGraphMonitoring";

const Monitoring = (props) => {
    //state
    const [section_state, setSectionState] = useState("")
    const hints = [
        {title: "Координаты", message: "Любое положение БПЛА на плоскости можно описать двумя метриками:\n- Широта - это расстояние от экватора до данной точки на поверхности Земли, выраженная в граудсах от 0° до 90°;\n- Долгота - кратчайшее расстояние от нулевого меридиана до заданного объекта, выраженное в градусах от 0° до 180°"},
        {title: "Углы", message: "Любое положение БПЛА в трехмерном пространстве можно описать тремя метриками:\n- Roll (крен) - вращение вдоль продольной оси, при котором крылья наклоняются от полёта на уровне до бокового положения;\n - Pitch (тангаж) - движение БПЛА вверх или вниз вдоль боковой оси;\n - Yaw (рыскание) - вращение БПЛА вокруг вертикальной оси, при котором нос двигается влево или вправо"}
    ]

    //handlers
    const changeSectionState = () => {
        if (section_state === "active" || section_state === ""){
            setSectionState("unactive")
        }else{
            setSectionState("active")
        }
    }
    const showHint = (hint_index) => {
        props.updateModal({title: hints[hint_index].title, message: hints[hint_index].message})
    }

    return <div className={"monitoring " + section_state}>
        <button className="close_section_right" onClick={changeSectionState}>
            <img src={logo_section}/>
            <div className={"arrow " + section_state}>
                <div className="line_1"/>
                <div className="line_2"/>
            </div>
        </button>
        <div className="monitoring_main">
            <div className="monitoring_item">
                <div className="head_title">
                    <p className="title">Координаты</p>
                    <button className="hint" onClick={() => {showHint(0)}}><span>?</span></button>
                </div>
                <div className="info_monitoring">
                    <div className="info_line">
                        <p className="topic">Широта</p>
                        <div className="value"><span>47.122121</span></div>
                    </div>
                    <div className="info_line">
                        <p className="topic">Долгота</p>
                        <div className="value"><span>47.122121</span></div>
                    </div>
                    <ScatterMonitoring
                        title="Маршрут движения"
                        data={[{x:1,y:1}, {x:2,y:2}, {x:2,y:3}, {x:3,y:3}, {x:3,y:4}, {x:4,y:4}, {x:7,y:5}, {x:4,y:6}, {x:2,y:4}]}
                    />
                </div>
            </div>
            <div className="monitoring_item">
                <div className="head_title">
                    <p className="title">Углы</p>
                    <button className="hint" onClick={() => {showHint(1)}}><span>?</span></button>
                </div>
                <div className="info_monitoring">
                    <div className="info_line">
                        <p className="topic">Roll</p>
                        <div className="value"><span>10°</span></div>
                    </div>
                    <div className="info_line">
                        <p className="topic">Pitch</p>
                        <div className="value"><span>20°</span></div>
                    </div>
                    <div className="info_line">
                        <p className="topic">Yaw</p>
                        <div className="value"><span>30°</span></div>
                    </div>
                    <MultiGraphMonitoring
                        x_ticks={[1,2,3,4,5,6]}
                        data={[{title: "Roll", data: [1,2,3,4,5,6]}, {title: "Pitch", data: [1,3,5,7,9,0]}, {title: "Yaw", data: [5,2,3,8,5,9]}]}
                    />
                </div>
            </div>
        </div>
    </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(Monitoring)