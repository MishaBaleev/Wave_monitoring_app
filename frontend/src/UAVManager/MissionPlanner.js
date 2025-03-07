import { useEffect, useState } from "react"
import { connect } from "react-redux"
import PointItem from "./PointItem"

const MissionPlanner = (props) => {
    //state 


    //handlers
    

    return <div className="params_item">
        <div className="params_item_head">
            <div className="left_section">
                <p className="title">Планирование миссии</p>
                <div className="hint" onClick={() => {props.showHint(2)}}><p>?</p></div>
            </div>
        </div>
        <div className="main mission_planner">
            <div className="choose_mission">
                <button onClick={props.toggleUpMis}>Шаблоны</button>
                <button onClick={props.startMission}>Запустисть</button>
                <button onClick={() => {props.map_manager.clearMission()}}>Очистить</button>
            </div>
            <div className="mission_items">
                <div className="top"><span>Элементы миссии</span></div>
                <ul className="mission_items_ul">
                    {props.app.mission.length===0?<li><span className="empty">Пока элементов миссии нет</span></li>:
                    (props.app.mission.map((item, index) => {
                        return <PointItem key={index} item={item} map_manager={props.map_manager}/>
                    }))}
                </ul>
            </div>
        </div>
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {}}

export default connect(mapStateToProps, mapDispatchToProps)(MissionPlanner)