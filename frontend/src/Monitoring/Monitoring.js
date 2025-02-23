import "./Monitoring.scss";
import { useEffect, useState } from "react"; 
import logo_section from "./img/logo_section.png";
import { connect } from "react-redux";
import { updateModal } from "../AppSlice";
import MultiGraphMonitoring from "./MultiGraphMonitoring";

const Monitoring = (props) => {
    //state
    const [section_state, setSectionState] = useState("")
    const hints = [
        {title: "Координаты", message: "Любое положение БПЛА на плоскости можно описать двумя метриками:\n- Широта - это расстояние от экватора до данной точки на поверхности Земли, выраженная в граудсах от 0° до 90°;\n- Долгота - кратчайшее расстояние от нулевого меридиана до заданного объекта, выраженное в градусах от 0° до 180°"},
        {title: "Высота", message: "В дополнение к координатам БПЛА стоит учитывать высоту взлета БПЛА над поверхностью земли"},
        {title: "Углы", message: "Любое положение БПЛА в трехмерном пространстве можно описать тремя метриками:\n- Roll (крен) - вращение вдоль продольной оси, при котором крылья наклоняются от полёта на уровне до бокового положения;\n - Pitch (тангаж) - движение БПЛА вверх или вниз вдоль боковой оси;\n - Yaw (рыскание) - вращение БПЛА вокруг вертикальной оси, при котором нос двигается влево или вправо"},
        {title: "Заряд батареи", message: "Батарея - источник питания БПЛА, его заряд напрямую влияет на выполнение полетного задания - при нулевом значении заряда БПЛА отключает системы"},
        {title: "Кол-во спутников", message: "БПЛА ориентируется в пространстве в основном при помощи системы GPS, которая в свою очередь использует в качестве источника информации группу спутников. Низкое количество видимых спунтиков может плохо сказаться на возможности БПЛА позиционировать себя в пространстве"}
    ]
    const [active_graph, setActiveGraph] = useState(["alt", "angles"])

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

    const getRoute = () => {
        let lon_list = props.cur_data.lon_list 
        let lat_list = props.cur_data.lat_list 
        let route = []
        lon_list.forEach((lon, index) => {
            route.push({x: lon, y: lat_list[index]})
        })
        return route
    }
    const roundValue = (value) => {
        return Math.round(value * 100) / 100
    }

    const changeActiveGraph = (key) => {
        setActiveGraph(prevValue => {
            let new_value = [...prevValue]
            new_value.shift()
            new_value.push(key)
            return new_value
        })
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
                        <div className="value"><span>{props.cur_data.lat}</span></div>
                    </div>
                    <div className="info_line">
                        <p className="topic">Долгота</p>
                        <div className="value"><span>{props.cur_data.lon}</span></div>
                    </div>
                </div>
            </div>
            <div className="monitoring_item">
                <div className="head_title">
                    <p className="title">Высота над уровнем земли</p>
                    <button className="hint" onClick={() => {showHint(1)}}><span>?</span></button>
                </div>
                <div className="info_monitoring">
                    <div className="info_line">
                        <p className="topic">Высота</p>
                        <div className="value"><span>{roundValue(props.cur_data.altitude_relative)} м</span></div>
                    </div>
                    {active_graph.includes("alt") ? 
                        <MultiGraphMonitoring
                            x_ticks={props.cur_data.altitude_relative_list.map((_, index) => {return index + 1})}
                            data={[{title: "Alt", data: props.cur_data.altitude_relative_list}]}
                        />:
                        <button className="add_graph" onClick={() => {changeActiveGraph("alt")}}><span>Показать график</span></button>
                    }
                </div>
            </div>
            <div className="monitoring_item">
                <div className="head_title">
                    <p className="title">Углы</p>
                    <button className="hint" onClick={() => {showHint(2)}}><span>?</span></button>
                </div>
                <div className="info_monitoring">
                    <div className="info_line">
                        <p className="topic">Roll</p>
                        <div className="value"><span>{roundValue(props.cur_data.roll)}°</span></div>
                    </div>
                    <div className="info_line">
                        <p className="topic">Pitch</p>
                        <div className="value"><span>{roundValue(props.cur_data.pitch)}°</span></div>
                    </div>
                    <div className="info_line">
                        <p className="topic">Yaw</p>
                        <div className="value"><span>{roundValue(props.cur_data.yaw)}°</span></div>
                    </div>
                    {active_graph.includes("angles") ? 
                        <MultiGraphMonitoring
                            x_ticks={props.cur_data.roll_list.map((_, index) => {return index + 1})}
                            data={[{title: "Roll", data: props.cur_data.roll_list}, {title: "Pitch", data: props.cur_data.pitch_list}, {title: "Yaw", data: props.cur_data.yaw_list}]}
                        />:
                        <button className="add_graph" onClick={() => {changeActiveGraph("angles")}}><span>Показать график</span></button>
                    }
                </div>
            </div>
            <div className="monitoring_item">
                <div className="head_title">
                    <p className="title">Уровень заряда батареи</p>
                    <button className="hint" onClick={() => {showHint(3)}}><span>?</span></button>
                </div>
                <div className="info_monitoring">
                    <div className="info_line">
                        <p className="topic">Заряд</p>
                        <div className="value"><span>{roundValue(props.cur_data.battery_remaining)} %</span></div>
                    </div>
                    {active_graph.includes("battery") ? 
                        <MultiGraphMonitoring
                            x_ticks={props.cur_data.battery_remaining_list.map((_, index) => {return index + 1})}
                            data={[{title: "Battery", data: props.cur_data.battery_remaining_list}]}
                        />:
                        <button className="add_graph" onClick={() => {changeActiveGraph("battery")}}><span>Показать график</span></button>
                    }
                </div>
            </div>
            <div className="monitoring_item">
                <div className="head_title">
                    <p className="title">Кол-во спутников</p>
                    <button className="hint" onClick={() => {showHint(4)}}><span>?</span></button>
                </div>
                <div className="info_monitoring">
                    <div className="info_line">
                        <p className="topic">Спутники</p>
                        <div className="value"><span>{roundValue(props.cur_data.satellites_visible)} шт.</span></div>
                    </div>
                    {active_graph.includes("setellites") ? 
                        <MultiGraphMonitoring
                            x_ticks={props.cur_data.satellites_visible_list.map((_, index) => {return index + 1})}
                            data={[{title: "Setellites", data: props.cur_data.satellites_visible_list}]}
                        />:
                        <button className="add_graph" onClick={() => {changeActiveGraph("setellites")}}><span>Показать график</span></button>
                    }
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