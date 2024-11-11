import React from "react";
import "../../assets/styles/Charts.scss";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Charts = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Data',
        data: [10, 20, 30, 40, 50, 55, 90, 60, 85, 95, 70, 76],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Data Trends', 
      },
      legend: {
        display: true,
        position: 'top', 
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Data Distribution', 
      },
      legend: {
        display: true,
        position: 'left', 
      },
    },
  };

  return (
    <div>
      <div className="chart-container">
        <div>
          <div className="line-item">
            <Line data={data} options={options} />
          </div>
          <div className="bar-item">
            <Bar data={data} options={options} />
          </div>
        </div>
        <div className="pie-item">
          <Pie data={data} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
