import { useState } from "react";
import { connect } from "react-redux";
import { updateModal } from "../AppSlice";

const Destruct = (props) => {
    //state
    const [button_state, setButtonState] = useState({
        gps: {state: 0, states: ["GPS ON", "GPS OFF"]},
        compass: {state: 0, states: ["Compass ON", "Compass OFF"]},
        acel: {state: 0, states: ["Acel ON", "Acel OFF"]},
    }) 

    //handlers
    const toggleButtonState = (key) => {
        props.sendCommand(key, {})
        if (props.app.is_connected === true){
            setButtonState(prev_data => {
                let new_data = {...prev_data}
                if (new_data[key].state === 0){
                    new_data[key].state = 1
                }else{
                    new_data[key].state = 0
                }
                return new_data
            })
        }
    }
    
    const getStyleType = (key) => {
        let cur_state = button_state[key].state 
        if (cur_state === 0){
            return "green"
        }else{
            return "red"
        }
    }

    return <div className="params_item destruct">
        <div className="params_item_head">
            <div className="left_section">
                <p className="title">Деструктивное воздействие</p>
                <div className="hint" onClick={() => {props.showHint(3)}}><p>?</p></div>
            </div>
        </div>
        <div className="main small_list">
            <button className={"small_button "+getStyleType("gps")} onClick={() => {toggleButtonState("gps")}}>
                <span>{button_state.gps.states[button_state.gps.state]}</span>
            </button>
            <button className={"small_button "+getStyleType("compass")} onClick={() => {toggleButtonState("compass")}}>
                <span>{button_state.compass.states[button_state.compass.state]}</span>
            </button>
            <button className={"big_button "+getStyleType("acel")} onClick={() => {toggleButtonState("acel")}}>
                <span>{button_state.acel.states[button_state.acel.state]}</span>
            </button>
        </div>
    </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
   
}}
export default connect(mapStateToProps, mapDispatchToProps)(Destruct)