import { useState } from "react";
import "./UAVManager.scss";
import logo from "./img/logo.png";
import section_logo from "./img/section_logo.png";
import { connect } from "react-redux";
import { updateModal } from "../AppSlice";
import send_img from "./img/send.png";

const UAVManager = (props) => {
    //state
    const [section_state, setSectionState] = useState("")
    const hints = [
        {title: "Адрес устройства", message: "В данное поле необходимо ввести IP-адрес устройства + порт, при помощи которого будет осуществляться соединение. Данную информацию можно узнать в конфигурационном файле прошивки БПЛА"},
        {title: "Управление", message: "Здесь Вы можете отправить команду на БПЛА.\n- Takeoff - команда отрыва БПЛА от земли;\n- Upload Mission - команда загрузки полетного задания на БПЛА;\n- Land - команда посадки БПЛА;\n- RTL - команда возврата БПЛА к точке старта;\n- ARM - команда перевода БПЛА в армированный режим;\n- Disarm - команда вывода БПЛА из армированного режима"},
        {title: "Настройка ПК", message: "ПК (полетный контроллер) - электронное устройство, представляющее собой вычислительную систему, работающую по сложным алгоритмам и управляющую полётом БПЛА. ПК обладает рядом параметров, которые можно настроить непосредственно на лету.\n- ASPD scale - \n- BAT crit thr - \n- Bat1 n cells - \n- Bat v load drop - "}
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
                    <div className="uav_indicator off"/>
                </div>
                <div className="main">
                    <div className="item_line">
                        <p>Адрес устройства</p>
                        <input type="text"
                            placeholder="ip-адрес:порт"
                        />
                    </div>
                    <button className="on_off"><span>Подключить</span></button>
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
                    <button className="small_button"><span>Takeoff</span></button>
                    <button className="small_button"><span>Upload Mission</span></button>
                    <button className="small_button"><span>Land</span></button>
                    <button className="small_button"><span>RTL</span></button>
                    <button className="small_button"><span>ARM</span></button>
                    <button className="small_button"><span>DisARM</span></button>
                </div>
            </div>  
            <div className="params_item big">
                <div className="params_item_head big">
                    <div className="left_section">
                        <p className="title">Настройка ПК</p>
                        <div className="hint" onClick={() => {showHint(2)}}><p>?</p></div>
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
    </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(UAVManager)