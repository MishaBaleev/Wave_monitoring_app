import { useState } from "react";
import { updateModal } from "../AppSlice";
import send_img from "./img/send.png";
import settings from "./uav_settings.json";
import { connect } from "react-redux";

const UAVSettings = (props) => {
    //state 
    let def_settings_value = {}
    settings.forEach(item => {def_settings_value[item.name] = item.default})
    const [settings_value, setSettingsValue] = useState(def_settings_value)

    //handlers
    const showSettingHint = (data) => {
        props.updateModal({title: data.description.title, message: data.description.message})
    }

    const changeSettingsValue = (key, value) => {
        setSettingsValue(prev_data => {
            let new_data = {...prev_data}
            new_data[key] = value
            return new_data
        })
    }

    const sendNewParam = (key, value) => {
        props.sendCommand("uav_param", {param_key: key, param_value: parseFloat(value)})
    }

    return <div className="params_item big">
        <div className="params_item_head big">
            <div className="left_section">
                <p className="title">Настройка ПК</p>
                <div className="hint" onClick={() => {props.showHint(4)}}><p>?</p></div>
            </div>
        </div>
        <div className="main big_list">
            {settings.map((item, key) => {
                return <div className="item_line" key={key}>
                    <p>{item.name}</p>
                    <input type="number"
                        value={settings_value[item.name]}
                        min={item.min}
                        max={item.max}
                        onChange={(e) => {changeSettingsValue(item.name, e.target.value)}}
                    />
                    <div className="hint" onClick={() => {showSettingHint(item)}}><p>?</p></div>
                    <button className="send_setting" onClick={() => {sendNewParam(item.name, settings_value[item.name])}}><img src={send_img} alt="send"/></button>
                </div>
            })}
        </div>
    </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(UAVSettings)