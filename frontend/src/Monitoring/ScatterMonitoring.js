import {Scatter} from "react-chartjs-2";

const ScatterMonitoring = (props) => {
    //state
    let data = {
        datasets: [
            {   
                label: props.title,
                data: props.data,
                borderColor: 'red',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                showLine: true
            }
        ]
    }
    let options = {
        animation: {duration: 0},
        plugins: {
            legend: {
                display: true,
                labels: {color: "whitesmoke", font: {size: 15}},
            },
            tooltip: {
                enabled: true,
            },
        },
        scales:{
            x: {
                grid:{
                    color: "whiteSmoke"
                },
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Долгота',
                    color: "whitesmoke",
                    font: {size: 15}
                },
                ticks:{
                    color: "whitesmoke"
                }
            },
            y: {
                grid:{
                    color: "whiteSmoke"
                },
                title: {
                    display: true,
                    text: 'Широта',
                    color: "whitesmoke",
                    font: {size: 15}
                },
                ticks:{
                    color: "whitesmoke"
                }
            },
        }
    }

    return <div className="monitoring_graph">
        <Scatter
            type="linear"
            data={data} 
            options={options}
        />
    </div>
}

export default ScatterMonitoring