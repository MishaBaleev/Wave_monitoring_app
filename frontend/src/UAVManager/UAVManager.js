import { useState } from "react";
import "./UAVManager.scss";
import logo from "./img/logo.png";
import section_logo from "./img/section_logo.png";
import { connect } from "react-redux";
import { changeConnected, updateModal } from "../AppSlice";
import send_img from "./img/send.png";
import UploadMission from "./UploadMission/UploadMission";
import axios from "axios";
import MissionPlanner from "../Monitoring/MissionPlanner";

const UAVManager = (props) => {
    //state
    const [section_state, setSectionState] = useState("")
    const hints = [
        {title: "Адрес устройства", message: "В данное поле необходимо ввести IP-адрес устройства + порт, при помощи которого будет осуществляться соединение. Данную информацию можно узнать в конфигурационном файле прошивки БПЛА"},
        {title: "Управление", message: "Здесь Вы можете отправить команду на БПЛА.\n- Takeoff - команда отрыва БПЛА от земли;\n- Start Mission - команда загрузки полетного задания на БПЛА;\n- Land - команда посадки БПЛА;\n- RTL - команда возврата БПЛА к точке старта;\n- ARM - команда перевода БПЛА в армированный режим;\n- Disarm - команда вывода БПЛА из армированного режима"},
        {title: "Планирование миссий", message: "Здесь Вы можете редактировать полетное задание для БПЛА: для создания путевой точки необходимо нажать на карту, для удаления полетного элемента необходимо нажать на соотвтетвующую кнопку в данном разделе.\nТакже Вы можете выбрать заранее подготовленные маршруты."},
        {title: "Настройка ПК", message: "ПК (полетный контроллер) - электронное устройство, представляющее собой вычислительную систему, работающую по сложным алгоритмам и управляющую полётом БПЛА. ПК обладает рядом параметров, которые можно настроить непосредственно на лету.\n- ASPD scale - \n- BAT crit thr - \n- Bat1 n cells - \n- Bat v load drop - "}
    ]
    const [address, setAddress] = useState("192.168.0.197:14550")
    const [is_active_up_mis, setActiveUpMis] = useState(false)

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
    const onOffUAV = () => {
        const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
        if (regex.test(address)){
            if (props.app.is_connected === true){
                props.sendCommand("disconnect", {})
                props.changeConnected(false)
            }else{
                props.sendCommand("connect", {address: address})
                props.changeConnected(true)
            }
        }else{
            props.updateModal({title: "Ошибка адреса", message: "Проверьте корректность введеного адреса БПЛА"})
        }
    }
    const toggleUpMis = () => {
        if (is_active_up_mis === true){
            setActiveUpMis(false)
        }else{
            setActiveUpMis(true)
        }
    }

    const showMission = (type) => {
        const data = new FormData()
        data.append("mission_id", type)
        axios.post(`http://localhost:${props.app.backend_port}/getMissionPlan`, data).then(response => {
            props.map_manager.showMission(response.data.waypoints)
        })
        setActiveUpMis(false)
    }
    const startMission = () => {
        // console.log("--save mission--")
        // props.app.mission.forEach(item => {
        //     console.log(JSON.parse(JSON.stringify(item)))
        // })
        if (props.app.is_connected === true){
            if (props.app.mission.length === 0){
                props.updateModal({title: "Ошибка", message: "Добавьте минимум 1 путевую точку для миссии, чтобы ее запустить"})
            }else{
                props.sendCommand("start_mission", {mission: props.app.mission})       
            }
        }else{
            props.updateModal({title: "Ошибка", message: "Сначала подключите БПЛА к программе управления и мониторинга Волна"})
        }
    }

    return <div className={"uav_manager " + section_state}>
        <button className="close_section_left" onClick={changeSectionState}>
            <img src={section_logo}/>
            <div className={"arrow " + section_state}>
                <div className="line_1"/>
                <div className="line_2"/>
            </div>
        </button>
        <div className="uav_header">
            <img className="logo" src={logo} alt="logo"/>
            <p>ВОЛНА</p>
        </div>
        <section className="params_list">
            <div className="params_item">
                <div className="params_item_head">
                    <div className="left_section">
                        <p className="title">Подключение</p>
                        <div className="hint" onClick={() => {showHint(0)}}><p>?</p></div>
                    </div>
                    <div className={"uav_indicator "+(props.app.is_connected==true?"on":"off")}/>
                </div>
                <div className="main">
                    <div className="item_line">
                        <p>Адрес устройства</p>
                        <input type="text"
                            placeholder="ip-адрес:порт"
                            value={address}
                            onChange={(e) => {setAddress(e.target.value)}}
                        />
                    </div>
                    <button className="on_off" onClick={onOffUAV}><span>{props.app.is_connected==true?"Отключить":"Подключить"}</span></button>
                </div>
            </div>  
            <div className="params_item">
                <div className="params_item_head">
                    <div className="left_section">
                        <p className="title">Управление</p>
                        <div className="hint" onClick={() => {showHint(1)}}><p>?</p></div>
                    </div>
                </div>
                <div className="main small_list">
                    <button className="small_button" onClick={() => {props.sendCommand("takeoff", {})}}><span>Takeoff</span></button>
                    {/* <button className="small_button" onClick={toggleUpMis}><span>Start Mission</span></button> */}
                    <button className="small_button" onClick={() => {props.sendCommand("rtl", {})}}><span>RTL</span></button>
                    <button className="small_button" onClick={() => {props.sendCommand("arm", {})}}><span>ARM</span></button>
                    <button className="small_button" onClick={() => {props.sendCommand("disarm", {})}}><span>DisARM</span></button>
                    <button className="big_button" onClick={() => {props.sendCommand("land", {})}}><span>Land</span></button>
                    {/* <button className="big_button" onClick={() => {props.map_manager.clearMission()}}><span>Очистить линии миссии</span></button> */}
                </div>
            </div>  
            <MissionPlanner showHint={showHint} map_manager={props.map_manager} toggleUpMis={toggleUpMis} startMission={startMission}/>
            <div className="params_item big">
                <div className="params_item_head big">
                    <div className="left_section">
                        <p className="title">Настройка ПК</p>
                        <div className="hint" onClick={() => {showHint(3)}}><p>?</p></div>
                    </div>
                </div>
                <div className="main big_list">
                    <div className="item_line">
                        <p>ASPD scale</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT CRIT THR</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT1 N CELLS</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT V LOAD DROP</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT V LOAD DROP</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT V LOAD DROP</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT V LOAD DROP</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT V LOAD DROP</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                    <div className="item_line">
                        <p>BAT V LOAD DROP</p>
                        <input type="number"
                            placeholder="0"
                        />
                        <button className="send_setting"><img src={send_img} alt="send"/></button>
                    </div>
                </div>
            </div>  
        </section>
        {is_active_up_mis === true?<UploadMission showMission={showMission}/>:""}
    </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))},
    "changeConnected": (data) => {dispatch(changeConnected(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(UAVManager)