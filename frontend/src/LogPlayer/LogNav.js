
const LogNav = (props) => {
    //state
    const params = [
        "roll", "pitch", "yaw", "lat", "lon", "eph", "epv", "satellites_visible", "battery_remaining", "altitude_relative", "vel"
    ]

    //handlers


    return <div className="log_nav">
        <div className="choose_param">
            <div className="param">
                <span className="param_title">Параметр анализа 1:</span>
                <select onChange={(e) => {props.changeGraphTitles(0, e.target.value)}} >
                    {params.map((param, index) => {return <option key={index} value={param}>
                        {param}
                    </option>})}
                </select>
            </div>
            <div className="param">
                <span className="param_title">Параметр анализа 2:</span>
                <select onChange={(e) => {props.changeGraphTitles(1, e.target.value)}} value={props.graph_titles[1]}>
                    {params.map((param, index) => {return <option key={index} value={param}>
                        {param}
                    </option>})}
                </select>
            </div>
            <div className="param">
                <span className="param_title">Параметр анализа 3:</span>
                <select onChange={(e) => {props.changeGraphTitles(2, e.target.value)}} value={props.graph_titles[2]}>
                    {params.map((param, index) => {return <option key={index} value={param}>
                        {param}
                    </option>})}
                </select>
            </div>
        </div>
        <div className="log_line">
            <input type="range"
                max={props.max}
                step={1}
                value={props.cursor}
                onChange={(e) => {props.changeCursor(e.target.value)}}
            />
        </div>
    </div>
}

export default LogNav