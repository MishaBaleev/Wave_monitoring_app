import { useState, useCallback } from "react";
import { updateModal } from "../AppSlice";
import "./LogPlayer.scss";
import { connect } from "react-redux";
import axios from "axios";
import app_logo from "../UAVManager/img/logo.png";
import LogNav from "./LogNav";
import LogGraph from "./LogGraph";
import LogTable from "./LogTable";
import debounce from "lodash.debounce";

const LogPlayer = (props) => {
    //state 
    const [log_data, setLogData] = useState(null)
    const [log_params, setLogParams] = useState({
        name: "",
        duration: 0
    })
    const [cursor, setCursor] = useState(0)
    const [cur_frame, setCurFrame] = useState(null)
    const [graph_titles, setGraphTitles] = useState(["roll", "roll", "roll"])
    const [table_rows, setTableRows] = useState([])
    const table_header_real = [
        "roll", "pitch", "yaw", "lat", "lon", "eph", "epv", "satellites_visible", "battery_remaining", "altitude_relative", "vel"
    ]

    //handlers
    const updateLogParams = (data, log_name) => {
        setLogParams(prev_data => {
            let new_data = {...prev_data}
            new_data.name = log_name
            let time_list = Object.values(data.lon_time)
            new_data.duration = Math.round(time_list[time_list.length-1] - time_list[0])
            return new_data
        })
    }

    const fileSelect = (e) => {
        let data = new FormData()
        data.append("log_data", e.target.files[0], e.target.files[0].name)
        axios.post(`http://localhost:${props.app.backend_port}/getLogData`, data).then(response => {
            if (response.data.status === "success"){
                console.log(response.data.data)
                setLogData(response.data.data)
                updateLogParams(response.data.data, e.target.files[0].name)
                changeCurFrame(response.data.data, cursor)
                setTableRows(getRows(response.data.data))
            }else{props.updateModal({title: "Ошибка открытия лога", message: "Данный файл не соответствует логу, записанному при помощи платформы Волна"})}
        })
    }

    const cutText = (text, text_len) => {
        return text.substring(0, text_len)
    }

    const refresh = () => {
        setLogData(null)
        setLogParams({
            name: "",
            duration: 0
        })
        setCursor(0)
        setCurFrame(null)
        setGraphTitles(["roll", "roll"])
        setTableRows([])
    }

    const changeCurFrame = (full_data, cur_cursor) => {
        let new_frame = {}
        table_header_real.forEach(key => {
            new_frame[key] = Object.values(full_data[key]).slice(cur_cursor*10, cur_cursor*10+10)
        })
        setCurFrame(new_frame)
    }

    const changeCursor = useCallback(
        debounce((value) => {
            if (log_data===null){
                props.updateModal({title: "Ошибка", message: "Сначала загрузите лог-запись"})
            }else{
                setCursor(parseInt(value, 10))
                changeCurFrame(log_data, parseInt(value, 10))
            }
        }, 1),
        [log_data]
    )

    const changeGraphTitles = (index, value) => {
        setGraphTitles(prev_data => {
            let new_data = [...prev_data]
            new_data[index] = value
            return new_data
        })
    }

    const uploadLog = () => {
        let log_data_part = {}
        graph_titles.forEach(key => {log_data_part[key] = log_data[key]})
        const data = new FormData()
        data.append("data", JSON.stringify(log_data_part))
        axios.post(`http://localhost:${props.app.backend_port}/uploadLogPart`, data).then(response => {
            if (response.status === 500){
                props.updateModal({title: "Ошибка", message: "Ошибка при сохранении отчета по выбранным параметрам"})
            }
        })
    }

    const getRows = (data) => {
        let rows = [] 
        let max_len = Object.values(data.altitude_relative).length
        for (let i=0; i<=max_len-1; i++){
            let row = []
            row.push(i+1)
            table_header_real.forEach(h => {
                row.push(Object.values(data[h])[rows.length])
            })
            rows.push(row)
        }
        return rows
    }
    
    return <div className={"log_player " + props.log_player_active}>
        <div className="log_player_header">
            {log_data===null?
                <label className="input-file">
                    <input 
                        type="file" 
                        className="input" 
                        accept=".xlsx" 
                        onChange={fileSelect}
                    />
                    <span>Выберите лог-запись</span>
                </label>:
                <div className="log_info">
                    <img className="log_logo" src={app_logo} alt="app_logo"/>
                    <div className="log_name"><span>Лог: {cutText(log_params.name, 40)}</span></div>
                    <div className="block"/>
                    <div className="log_time"><span>Продолжительность: {log_params.duration} сек.</span></div>
                    <div className="block"/>
                    <div className="log_refresh" onClick={uploadLog}>Выгрузить параметры</div>
                    <div className="block"/>
                    <button className="log_refresh" onClick={refresh}>Очистить</button>
                </div>
            }
            <button className="close_log_player" onClick={props.changeLogPlayerActive}/>
        </div>
        <LogNav 
            max={log_data===null?10:parseInt((Object.values(log_data.altitude_relative).length-1)/10)} 
            cursor={cursor} 
            changeCursor={changeCursor}
            changeGraphTitles={changeGraphTitles}
            graph_titles={graph_titles}
        />
        <div className="log_data">
            <LogTable rows={table_rows} cursor={cursor}/>
            <div className="log_graphs">
                <LogGraph data={cur_frame===null?[]:cur_frame[graph_titles[0]]} labels={[]} title={graph_titles[0]} color={"#FF0000"}/>
                <LogGraph data={cur_frame===null?[]:cur_frame[graph_titles[1]]} labels={[]} title={graph_titles[1]} color={"#FFFF00"}/>
                <LogGraph data={cur_frame===null?[]:cur_frame[graph_titles[2]]} labels={[]} title={graph_titles[2]} color={"#00FF00"}/>
            </div>
        </div>
    </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(LogPlayer)