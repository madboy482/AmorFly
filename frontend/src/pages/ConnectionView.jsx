import { useEffect, useState } from "react";

export default function ConnectionView() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState("");

  // ⏳ Cooldown timer calculator
  const getRemainingCooldown = (lastDate) => {
    const last = new Date(lastDate);
    const now = new Date();
    const diff = 7 * 24 * 60 * 60 * 1000 - (now - last);
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${mins}m`;
  };

  // ✅ Load user from localStorage + refresh from DB
  useEffect(() => {
    const stored = localStorage.getItem("amorUser");
    if (!stored) return;

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    fetch(`http://localhost:5000/api/users/${parsedUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("amorUser", JSON.stringify(data.user));

          // ⏳ Check for cooldown eligibility
          if (data.user.lastConnectionDate) {
            const remaining = getRemainingCooldown(data.user.lastConnectionDate);
            if (remaining) {
              setCooldownTime(remaining);
              setStatus("cooldown");
              setMessage("You can only connect once per week");
            }
          }
        }
      });
  }, []);

  const handleRequest = async () => {
    if (!user || status === "cooldown") return;
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:5000/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setConnection(data.connection);
        setStatus("matched");
        setMessage("🎉 You've been matched for this week!");

        // update local copy
        const updatedUser = {
          ...user,
          lastConnectionDate: new Date().toISOString(),
        };
        setUser(updatedUser);
        localStorage.setItem("amorUser", JSON.stringify(updatedUser));
      } else {
        setStatus("not-eligible");
        setMessage(data.error || "Not eligible.");
      }
    } catch (err) {
      console.error("Connection error:", err);
      setMessage("Server error. Try again.");
    }
  };

  const submitFeedback = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: user._id,
          to: connection.user1 === user._id ? connection.user2 : connection.user1,
          podId: user.podId,
          rating: feedback.rating,
          comment: feedback.comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackSubmitted(true);
        setMessage("✅ Feedback submitted successfully!");
      } else {
        alert(data.error || "Failed to submit feedback.");
      }
    } catch (err) {
      alert("Server error submitting feedback.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-indigo-600">🧬 1:1 Connection Portal</h2>

        {user && (
          <div className="text-sm text-gray-600">
            <p>👤 <strong>{user.username}</strong></p>
            <p>🎯 Skill: <strong>{user.skill}</strong></p>
            <p>⭐ Progress Points: <strong>{user.progressPoints}</strong></p>
          </div>
        )}

        <button
          onClick={handleRequest}
          disabled={status === "loading" || status === "cooldown"}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {status === "loading"
            ? "Matching..."
            : status === "cooldown"
            ? "Cooldown Active"
            : "Request 1:1 Match"}
        </button>

        {message && <p className="text-sm text-gray-700">{message}</p>}

        {status === "cooldown" && cooldownTime && (
          <p className="text-sm text-red-600">⏳ You can connect again in: <strong>{cooldownTime}</strong></p>
        )}        {status === "matched" && connection && (
          <div className="mt-4 bg-indigo-50 p-3 rounded text-left text-sm">
            <p><strong>✅ Matched With:</strong></p>
            <p className="text-sm flex items-center">
              <span className="inline-block h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2">
                {connection.skill.charAt(0).toUpperCase()}
              </span>
              Anonymous Partner
            </p>
            <p>Skill: {connection.skill}</p>
            <p>Connected At: {new Date(connection.startedAt).toLocaleString()}</p>
            <p>Expires: {new Date(connection.expiresAt).toLocaleString()}</p>
          </div>
        )}

        {status === "matched" && connection && !feedbackSubmitted && (
          <div className="mt-6 text-left bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-indigo-700">💬 Leave Feedback</h3>
            <div className="flex items-center gap-2 my-2">
              <label className="text-sm">Rating:</label>
              <select
                value={feedback.rating}
                onChange={(e) =>
                  setFeedback({ ...feedback, rating: Number(e.target.value) })
                }
                className="border rounded px-2 py-1"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <textarea
              value={feedback.comment}
              onChange={(e) =>
                setFeedback({ ...feedback, comment: e.target.value })
              }
              placeholder="Share how your connection went..."
              className="w-full p-2 border rounded text-sm"
            />

            <button
              onClick={submitFeedback}
              className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
            >
              Submit Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
