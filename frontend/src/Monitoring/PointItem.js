import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { deleteMissionElement, updateMissionElement } from "../AppSlice";
import delete_icon from "./img/trash.png";

const PointItem = (props) => {
    //state
    const [alt, setAlt] = useState(3)

    //handlers
    const changeAlt = (new_alt) => {
        setAlt(new_alt)
        props.updateMissionElement({id: props.item.id, type: "alt", value: parseInt(new_alt)})
    }

    const deleteItem = () => {
        props.map_manager.deleteElement(props.item.id)
        props.deleteMissionElement({id: props.item.id})
    }


    return <li>
        <div className="point_top">
            <span>Точка № {props.item.id + 1}</span>
        </div>
        <div className="delete_section">
            <button onClick={deleteItem}><img src={delete_icon} alt="delete"/></button>
        </div>
        <div className="point_alt">
            <span>Высота точки</span>
            <input 
                type="number"
                min={0}
                max={20}
                step={1}
                value={alt}
                onChange={(e) => {changeAlt(e.target.value)}}
            />
            <input 
                type="range"
                min={0}
                max={20}
                step={1}
                value={alt}
                onChange={(e) => {changeAlt(e.target.value)}}
            />
        </div>
    </li>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateMissionElement": (data) => {dispatch(updateMissionElement(data))},
    "deleteMissionElement": (data) => {dispatch(deleteMissionElement(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(PointItem)