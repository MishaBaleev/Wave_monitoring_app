import { useRef, useEffect } from "react";
import {Scatter} from "react-chartjs-2";

const ScatterMonitoring = (props) => {
    //state
    const chart_ref = useRef(null)
    const container_ref = useRef(null)

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
        responsive: true,
        maintainAspectRatio: false,
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

    //handlers
    useEffect(() => {
        console.log(2)
        const handleResize = () => {
            console.log(1)
          if (chart_ref.current) {
            chart_ref.current.resize();
          }
        };
      
        window.addEventListener('resize', handleResize);
      
        // return () => {
        //   window.removeEventListener('resize', handleResize);
        // };
      }, []);

    return <div className="monitoring_graph" ref={container_ref}>
        <Scatter ref={chart_ref}
            type="linear"
            data={data} 
            options={options}
        />
    </div>
}

export default ScatterMonitoring