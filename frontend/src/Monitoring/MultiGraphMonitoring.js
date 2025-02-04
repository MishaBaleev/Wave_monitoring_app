import { Line } from 'react-chartjs-2';

const MultiGraphMonitoring = (props) => {
    //handlers

    //state
    const colors = ["#FF0000", "#00FF00", "#FF4500", "#F5F5F5", "#FF00FF", "#8B4513", "#FFFF00"]
    let data = {
        labels: props.x_ticks,
        color: "whitesmoke",
        datasets: props.data.map((item, index) => {
            return {
                data: item.data,
                label: item.title,
                borderColor: colors[index],
                lineTension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        })
    }
    let options = {
        plugins: {
            legend: {
                display: true,
                labels: {color: "whitesmoke", font: {size: 15}},
            }
        },
        scales:{
            y:{
                grid:{
                    color: "whiteSmoke"
                },
                suggestedMin:0,
                ticks:{
                    color: "whitesmoke"
                },
                title: {
                    display: true,
                    text: 'Значение',
                    color: "whitesmoke",
                    font: {size: 15}
                },
                suggestedMin: 0
            },
            x:{
                grid:{
                    color: "whitesmoke"
                },
                ticks:{
                    color: "whitesmoke"
                },
                title: {
                    display: true,
                    text: 'Метка времени',
                    color: "whitesmoke",
                    font: {size: 15}
                },
            }
        }
    }

    return <div className="monitoring_graph">
        <Line
            type="line"
            data={data} 
            options={options}
        />
    </div>
}

export default MultiGraphMonitoring