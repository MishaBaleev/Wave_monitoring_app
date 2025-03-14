import { Line } from 'react-chartjs-2';
import { useEffect, useRef } from 'react';

const LogGraph = (props) => {
    //state 
    const chart_ref = useRef(null)
    // const colors = ["#FF0000", "#00FF00", "#FF4500", "#F5F5F5", "#FF00FF", "#8B4513", "#FFFF00"]
    let data = {
        labels: props.data.map((_, index) => {return index + 1}),
        color: "whitesmoke",
        datasets: [
            {
                data: props.data,
                label: props.title,
                borderColor: props.color,
                lineTension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 5,
            }
        ]
    }
    let options = {
        responsive: true,
        animation: {
            duration: 200,
        },
        hover: {
            mode: null
        },
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
                ticks:{
                    color: "whitesmoke",
                },
                title: {
                    display: true,
                    text: props.title,
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
                    color: "whitesmoke",
                },
                title: {
                    display: false,
                    text: 'Метка времени',
                    color: "whitesmoke",
                    font: {size: 15}
                },
            }
        }
    }

    //handlers
    useEffect(() => { //resize
        const handleResize = () => {
            if (chart_ref.current) {
            chart_ref.current.resize()
            }
        };
        
        window.addEventListener('resize', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return <div className="log_graph">
        <Line ref={chart_ref}
            type="line"
            data={data} 
            options={options}
        />
    </div>
}
export default LogGraph