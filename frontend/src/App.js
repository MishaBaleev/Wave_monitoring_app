import { connect } from "react-redux";
import "./App.scss";
import { addMissionElement, clearMission, deleteMissionElement, updateMissionElement, updateModal } from "./AppSlice";
import { MapManager } from "./MapManager";
import { useEffect, useState } from "react";
import UAVManager from "./UAVManager/UAVManager";
import Modal from "./Modal/Modal";
import Monitoring from "./Monitoring/Monitoring";
import Loading from "./Loading/Loading";
import { Chart, registerables} from 'chart.js';
import axios from "axios";

Chart.register(...registerables);

const App = (props) => {
  //state
  const [map_manager, _] = useState(new MapManager(props.addMissionElement, props.deleteMissionElement, props.updateMissionElement, props.clearMission))
  const [is_int_ready, setIntReady] = useState(false)
  const [main_socket, setMainSocket] = useState(null)
  const [cur_data, setCurData] = useState({
    roll: null,
    roll_list: [],
    pitch: null,
    pitch_list: [],
    yaw: null,
    yaw_list: [],
    lat: null,
    lat_list: [],
    lon: null,
    lon_list: [],
    satellites_visible: null,
    satellites_visible_list: [],
    battery_remaining: null,
    battery_remaining_list: [],
    altitude_relative: null,
    altitude_relative_list: [],
    vel: null,
    vel_list: []
  })

  //handlers
  const checkBack = () => {
    axios.get("http://127.0.0.1:8000/checkBack").then(response => {
        setIntReady(true)
        map_manager.init()
    }).catch(() => {
      setTimeout(() => {checkBack()}, 1000)
    })
  }

  useEffect(() => {
    checkBack()
  }, [])
  useEffect(() => {
    if (is_int_ready === true){
      let main_socket_new = new WebSocket(`ws://localhost:${props.app.backend_port}/main`)
      main_socket_new.onmessage = onMessage
      setMainSocket(main_socket_new)
    }
  }, [is_int_ready])

  const appendData2CurData = (cur_data_list, value) => {
    if (cur_data_list.length <= 99){
      cur_data_list.push(value)
    }else{
      cur_data_list.shift()
      cur_data_list.push(value)
    }
    return cur_data_list
  }

  const onMessage = (e) => {
    let input_message = JSON.parse(e.data)
    if (input_message.type === "frame"){
      setCurData(prevData => {
        let cur_data_new = {...prevData}
        cur_data_new[input_message.frame_part.key] = input_message.frame_part.value
        cur_data_new[`${input_message.frame_part.key}_list`] = appendData2CurData(cur_data_new[`${input_message.frame_part.key}_list`], input_message.frame_part.value)
        if (cur_data_new.lat !== null && cur_data_new.lon !== null){
          map_manager.setUAVCoords([cur_data_new.lon, cur_data_new.lat], cur_data_new.yaw)
        }
        return cur_data_new
      })
    }
  }

  const sendCommand = (type, data) => {
    console.log(type, data)
    if (type === "connect"){
      main_socket.send(JSON.stringify({type: type, data: data}))
    }else{
      if (props.app.is_connected === true){
        main_socket.send(JSON.stringify({type: type, data: data}))
      }else{
        props.updateModal({title: "Ошибка", message: "Сначала подключите БПЛА к программе управления и мониторинга Волна"})
      }
    }
  }

  return <div className="App">
    {is_int_ready===true?
      <div className="main_window">
        <div id="map"/>
        {props.app.modal.title === "" ? "" : <Modal/>}
        <UAVManager sendCommand={sendCommand} map_manager={map_manager}/>
        <Monitoring cur_data={cur_data}/>
      </div>:<Loading/>
    }
  </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
  "updateModal": (data) => {dispatch(updateModal(data))},
  "updateMissionElement": (data) => {dispatch(updateMissionElement(data))},
  "addMissionElement": (data) => {dispatch(addMissionElement(data))},
  "deleteMissionElement": (data) => {dispatch(deleteMissionElement(data))},
  "clearMission": (data) => {dispatch(clearMission(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(App)