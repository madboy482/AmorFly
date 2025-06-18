import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function PodDashboard() {
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [reflections, setReflections] = useState([]);
  const [reflectionInput, setReflectionInput] = useState("");

  const messagesEndRef = useRef();
  const loadPreviousMessages = async (podId) => {
    try {
      const res = await fetch(`https://amorfly-backend.onrender.com/api/messages/${podId}`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("amorUser");
    if (!storedUser) return navigate("/");

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    socketRef.current = io("https://amorfly-backend.onrender.com");

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
      socketRef.current.emit("joinPod", {
        podId: parsedUser.podId,
        userId: parsedUser._id,
      });
    });

    socketRef.current.on("receiveMessage", (msg) => {
      console.log("📨 Received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // Load previous messages
    loadPreviousMessages(parsedUser.podId);
    
    // Load reflections
    loadReflections(parsedUser.podId);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("👋 Socket disconnected");
      }
    };
  }, [navigate]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      podId: user.podId,
      senderId: user._id,
      content: input.trim(),
      type: input.includes("youtube.com") ? "link" : "text",
    };

    socketRef.current.emit("sendMessage", newMessage);
    setInput("");
  };

  const handleReflectionSubmit = async () => {
    if (!reflectionInput.trim()) return;
    try {
      const res = await fetch("https://amorfly-backend.onrender.com/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          podId: user.podId,
          content: reflectionInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReflectionInput("");
        loadReflections(user.podId);
      } else {
        alert(data.error || "Error submitting reflection");
      }
    } catch (err) {
      alert("Server error submitting reflection.");
    }
  };

  const loadReflections = async (podId) => {
    try {
      const res = await fetch(`https://amorfly-backend.onrender.com/api/reflections/${podId}`);
      const data = await res.json();
      if (res.ok) setReflections(data.reflections);
    } catch (err) {
      console.error("Failed to load reflections:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-100 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-indigo-600">
          Welcome, {user?.username}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          You're in Pod: <strong>{user?.podId}</strong>
        </p>      {/* 💬 Chat Section */}
        <div className="bg-gray-100 h-80 overflow-y-auto rounded p-3 mb-4 space-y-2">
          {messages.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              <p>No messages yet. Be the first to start the conversation!</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx || msg._id}
              className={`p-2 rounded ${
                msg.sender === user._id
                  ? "bg-indigo-200 text-right"
                  : "bg-white text-left"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-600 font-medium">
                  {msg.sender === user._id ? "You" : "Anonymous Pod Member"}
                </p>
                {msg.createdAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              {msg.type === "link" && msg.content.includes("youtube.com") ? (
                <div className="bg-blue-50 p-2 rounded border border-blue-100">
                  <p className="text-xs text-blue-700 mb-1">YouTube Resource:</p>
                  <a
                    href={msg.content}
                    className="text-blue-600 text-sm underline block truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {msg.content}
                  </a>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or YouTube link..."
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
          >
            Send
          </button>
        </div>

        {/* 🧘 Reflections Section */}
        <h3 className="text-lg font-semibold text-purple-700 mb-2">🧘 Pod Reflections</h3>

        <div className="flex gap-2 mb-4">
          <input
            value={reflectionInput}
            onChange={(e) => setReflectionInput(e.target.value)}
            placeholder="Share a reflection..."
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleReflectionSubmit}
            className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700"
          >
            Post
          </button>
        </div>

        <div className="space-y-2">
          {reflections.map((r) => (
            <div
              key={r._id}
              className="bg-white border-l-4 border-purple-300 p-3 rounded shadow-sm"
            >
              <p className="text-sm text-gray-800">{r.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                — {r.userId?.username || "Anonymous"} on{" "}
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {reflections.length === 0 && (
            <p className="text-sm text-gray-500">No reflections yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
