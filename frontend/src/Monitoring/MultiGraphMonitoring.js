import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

const MultiGraphMonitoring = (props) => {
    //handlers
    const chart_ref = useRef(null)

    //state
    const colors = ["#FF0000", "#00FF00", "#FF4500", "#F5F5F5", "#FF00FF", "#8B4513", "#FFFF00"]
    let data = {
        labels: Array(100).fill(0).map((item, index) => {return index+1}),
        color: "whitesmoke",
        datasets: props.data.map((item, index) => {
            return {
                data: item.data,
                label: item.title,
                borderColor: colors[index],
                lineTension: 0.1,
                pointRadius: 0,
                pointHoverRadius: 6,
            }
        })
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
                    autoSkip: true,
                    maxTicksLimit: 5
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
                    color: "whitesmoke",
                    autoSkip: true,
                    maxTicksLimit: 5
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

    //handlers
    // useEffect(() => {
    //     if (chart_ref.current) {
    //         chart_ref.current.update(); // Принудительно обновляем график
    //     }
    //   }, [props.data]);
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

    return <div className="monitoring_graph">
        <Line ref={chart_ref}
            type="line"
            data={data} 
            options={options}
        />
    </div>
}

export default MultiGraphMonitoring