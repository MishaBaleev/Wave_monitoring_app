import { useEffect, useState } from "react"

const LogTable = (props) => {
    //state
    const table_header_bad = [
        "№", "roll", "pitch", "yaw", "lat", "lon", "eph", "epv", "satellites", "battery", "altitude", "vel"
    ]
    const [rows, setRows] = useState([])

    //handlers
    const getTableRows = (log_data, start) => {
        const table_header_real = [
            "roll", "pitch", "yaw", "lat", "lon", "eph", "epv", "satellites_visible", "battery_remaining", "altitude_relative", "vel"
        ]
        let result = log_data.slice(start, start+10)
        let result_len = result.length
        if (result.length < 10){
            for (let i=0; i<=9-result_len; i++){
                let row = []
                row.push(-1)
                table_header_real.forEach(h => {
                    row.push(-1)
                })
                result.push(row)
            }
        }
        return result
    }

    useEffect(() => {
        setRows(getTableRows(props.rows, props.cursor*10))
    }, [props.rows, props.cursor])

    return <table className="log_table" cellSpacing={0}>
        <thead>
            <tr>
                {table_header_bad.map((h, index) => {return <th key={index}>{h}</th>})}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => {
                return <tr key={index} className={index%2===0?"light":""}> 
                    {row.map((r, r_index) => {
                        return <td key={r_index}>{Math.round(r * 100000) / 100000}</td>
                    })}
                </tr>
            })}
        </tbody>
        
    </table>
}
export default LogTable