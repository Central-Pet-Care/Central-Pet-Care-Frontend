import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Footer from "../../components/footer";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function PaymentAnalytics() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Statistics
  const [totalPayments, setTotalPayments] = useState(0);
  const [waitingApproval, setWaitingApproval] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const paymentsData = res.data;
      setPayments(paymentsData);

      // Calculate statistics
      setTotalPayments(paymentsData.length);
      setWaitingApproval(
        paymentsData.filter((p) => p.status === "pending").length
      );
      setApprovedCount(
        paymentsData.filter((p) => p.status === "completed" || p.status === "approved").length
      );
      
      // Calculate pending payments total amount
      const pendingTotal = paymentsData
        .filter((p) => p.status === "pending")
        .reduce((sum, payment) => sum + payment.amount, 0);
      setPendingAmount(pendingTotal);

      // Calculate total payment amount (excluding failed/cancelled)
      const totalAmount = paymentsData
        .filter((p) => p.status !== "failed" && p.status !== "cancelled")
        .reduce((sum, payment) => sum + payment.amount, 0);
      setTotalPaymentAmount(totalAmount);

      // Calculate approved payments total amount
      const approvedTotal = paymentsData
        .filter((p) => p.status === "completed" || p.status === "approved")
        .reduce((sum, payment) => sum + payment.amount, 0);
      setApprovedAmount(approvedTotal);

      // Extract available years from payment data
      const years = [...new Set(paymentsData.map(p => new Date(p.createdAt).getFullYear()))].sort((a, b) => b - a);
      setAvailableYears(years);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setLoading(false);
    }
  };

  // Payment Type Distribution - Dynamic from database
  const cardCount = payments.filter((p) => p.method === "payhere_direct").length;
  const codCount = payments.filter((p) => p.method === "COD").length;
  const bankTRCount = payments.filter((p) => p.method === "bank_transfer").length;

  // If no data, show default values for visualization
  const hasPaymentData = cardCount + codCount + bankTRCount > 0;

  const paymentTypeData = {
    labels: ["card", "cod", "Bank TR"],
    datasets: [
      {
        data: hasPaymentData ? [cardCount, codCount, bankTRCount] : [1, 1, 1],
        backgroundColor: ["#FFA500", "#FFD700", "#FFEBCD"],
        hoverBackgroundColor: ["#FF8C00", "#FFC700", "#FFE4B5"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // Approval Status Distribution - Show both approved and completed as approved
  const approvedPayments = payments.filter((p) => p.status === "completed" || p.status === "approved").length;
  const notApprovedPayments = payments.filter((p) => p.status !== "completed" && p.status !== "approved").length;

  const approvalStatusData = {
    labels: ["Approved", "Not Approved"],
    datasets: [
      {
        data: [approvedPayments, notApprovedPayments],
        backgroundColor: ["#4169E1", "#87CEEB"],
        borderWidth: 0,
      },
    ],
  };

  // Sales Dynamics by Month - Filter by selected year and show both approved and not approved as stacked bars
  const monthlySalesApproved = Array(12).fill(0);
  const monthlySalesNotApproved = Array(12).fill(0);
  
  payments
    .filter((payment) => new Date(payment.createdAt).getFullYear() === selectedYear)
    .forEach((payment) => {
      const month = new Date(payment.createdAt).getMonth();
      
      if (payment.status === "completed" || payment.status === "approved") {
        monthlySalesApproved[month] += payment.amount;
      } else if (payment.status !== "failed" && payment.status !== "cancelled") {
        // Not approved but not failed/cancelled (pending, etc.)
        monthlySalesNotApproved[month] += payment.amount;
      }
    });

  const salesDynamicsData = {
    labels: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
    datasets: [
      {
        label: "Approved",
        data: monthlySalesApproved,
        backgroundColor: "#4169E1",
        borderRadius: 8,
      },
      {
        label: "Not Approved",
        data: monthlySalesNotApproved,
        backgroundColor: "#87CEEB",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value / 1000 + "k";
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: "500",
          },
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const paymentTypeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 20,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        display: true,
        position: "left",
        align: "center",
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: "500",
          },
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed + ' payments';
            return label;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-4 shadow-lg text-gray-800 relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-medium opacity-80">{title}</h3>
          {icon && <span className="text-xl">{icon}</span>}
        </div>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Analytics
        </h1>
        <p className="text-gray-600 mb-8">
          Overview of payment statistics and trends
        </p>

        {/* Top Row - 3 Equal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="No Payments"
            value={totalPayments}
            bgColor="bg-gradient-to-br from-green-100 to-green-200"
          />
          
          <StatCard
            title="Waiting Approval"
            value={waitingApproval}
            bgColor="bg-gradient-to-br from-yellow-100 to-yellow-200"
          />
          
          <StatCard
            title="Approved"
            value={approvedCount}
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          />
        </div>

        {/* Second Row - 3 Equal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Payment Amount */}
          <StatCard
            title="Total Payment Amount"
            value={`LKR ${totalPaymentAmount.toLocaleString()}`}
            bgColor="bg-gradient-to-br from-teal-100 to-teal-200"
            //icon="💵"
          />
          
          {/* Pending Payments Amount */}
          <StatCard
            title="Pending Payments Amount"
            value={`LKR ${pendingAmount.toLocaleString()}`}
            bgColor="bg-gradient-to-br from-orange-100 to-orange-200"
            //icon="⌚"
          />
          
          {/* Approved Amount */}
          <StatCard
            title="Approved Amount"
            value={`LKR ${approvedAmount.toLocaleString()}`}
            bgColor="bg-gradient-to-br from-green-100 to-green-200"
            //icon="💰"
          />
        </div>

        {/* Third Row - Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Approval Status */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Approval Status
            </h3>
            <div style={{ height: "200px" }}>
              <Pie data={approvalStatusData} options={pieOptions} />
            </div>
          </div>

          {/* Payment Type */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Type
            </h3>
            <div style={{ height: "200px", width: "100%" }}>
              <Doughnut data={paymentTypeData} options={paymentTypeOptions} />
            </div>
            {!hasPaymentData && (
              <p className="text-xs text-gray-400 text-center mt-2">No payment data available</p>
            )}
          </div>
        </div>

        {/* Sales Dynamics Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Sales dynamics
            </h3>
            <select 
              className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div style={{ height: "300px" }}>
            <Bar data={salesDynamicsData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
