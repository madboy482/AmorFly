import { useEffect, useState } from "react";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch analytics:", err));
  }, []);

  if (!data) {
    return <p className="text-center mt-10 text-gray-500">Loading analytics...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">📊 Community Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Card title="👥 Total Users" value={data.totalUsers} />
        <Card title="💬 Total Messages" value={data.totalMessages} />
        <Card title="🧘 Total Reflections" value={data.totalReflections} />
        <Card title="⭐ Avg Feedback Rating" value={data.avgRating.toFixed(1)} />
        <Card title="📝 Total Feedbacks" value={data.totalFeedbacks} />
      </div>

      {/* Top Skills */}
      <Section title="🎯 Top Skills">
        <ul className="list-disc pl-5 text-sm">
          {data.topSkills.map((s) => (
            <li key={s._id}>
              {s._id} — <span className="font-medium">{s.count} users</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Top Users */}
      <Section title="🏆 Top Users (by Progress)">
        <ul className="list-decimal pl-5 text-sm">
          {data.topUsers.map((u) => (
            <li key={u._id}>
              {u.username} — <span className="font-medium">{u.progressPoints} pts</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 text-center">
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-xl font-bold text-indigo-700">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      <h2 className="text-lg font-semibold text-indigo-600 mb-2">{title}</h2>
      {children}
    </div>
  );
}
