import React, { useState, useEffect } from 'react';
import '../styles/dashboard.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js에 필요한 스케일과 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 날씨 API를 사용하여 데이터 가져오기
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&hourly=temperature_2m');
        const data = await response.json();
        setWeatherData(data.hourly.temperature_2m.slice(0, 24)); // 예시로 6시간의 데이터를 사용
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const data = {
    labels: ['0시', '2시', '4시', '6시', '8시', '10시', '12시', '14시', '16시', '18시', '20시', '22시'], // 예시 시간
    datasets: [
      {
        label: '온도 (°C)',
        data: weatherData,
        fill: true,
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgba(255, 255, 255, 1)',
      },
    ],
  };

  return (
    <section id='Dashboard'>
      <div className='dashboard-inner'>
        <h2>대시보드</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Line data={data} />
        )}
      </div>
    </section>
  );
}

export default Dashboard;