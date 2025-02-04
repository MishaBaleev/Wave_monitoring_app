import { connect } from "react-redux";
import "./App.scss";
// import { updateModal } from "./AppSlice";
import { MapManager } from "./MapManager";
import { useEffect, useState } from "react";
import UAVManager from "./UAVManager/UAVManager";
import Modal from "./Modal/Modal";
import Monitoring from "./Monitoring/Monitoring";
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

const App = (props) => {
  //state
  const map_manager = new MapManager()

  //handlers
  useEffect(() => {
    map_manager.init()
  }, [])

  return <div className="App">
    <div id="map"/>
    {props.app.modal.title === "" ? "" : <Modal/>}
    <UAVManager/>
    <Monitoring/>
  </div>
}

const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
  // "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(App)