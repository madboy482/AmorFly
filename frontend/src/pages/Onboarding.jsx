import { useState } from "react";
import { useNavigate } from "react-router-dom";

const skillOptions = ["guitar", "cooking", "mindfulness", "coding", "fitness", "writing", "painting", "photography", "language learning", "public speaking"];
const personalityOptions = ["introvert", "extrovert", "ambivert"];

export default function Onboarding() {
  const navigate = useNavigate();

  const [skill, setSkill] = useState("");
  const [personality, setPersonality] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skill || !personality) return alert("Please select both fields.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, personalityType: personality }),
      });

      const data = await res.json();

      if (data.user) {
        localStorage.setItem("amorUser", JSON.stringify(data.user));
        navigate("/pod");
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">🚀 Amor Fly</h1>
        <p className="text-center text-gray-500">Choose your learning path</p>

        <div>
          <label className="block text-sm mb-1 font-medium">Skill</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">-- Select Skill --</option>
            {skillOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Personality Type</label>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">-- Select Personality --</option>
            {personalityOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Joining Pod..." : "Start Journey"}
        </button>
      </form>
    </div>
  );
}