import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import GlassCard from './GlassCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AttendanceChart = ({ series = [72, 80, 84, 79, 88, 92] }) => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance %',
        data: series,
        borderRadius: 18,
        backgroundColor: ['#8B5CF6', '#7C3AED', '#6D28D9', '#A855F7', '#F97316', '#FB923C'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0A0A0A',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { display: false } },
      y: {
        ticks: { color: 'rgba(255,255,255,0.6)' },
        grid: { color: 'rgba(255,255,255,0.08)' },
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Attendance Momentum</h3>
          <p className="text-sm text-white/60">You’re 90% consistent — keep it up!</p>
        </div>
        <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
          Growth trend: +12%
        </div>
      </div>
      <Bar data={data} options={options} />
    </GlassCard>
  );
};

export default AttendanceChart;
