"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import socketIO from "socket.io-client";

let socket;

const Chat = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);
  const [strangerStatus, setStrangerStatus] = useState("Finding Stranger to talk... Have patience!");
  const [strangerLeft, setStrangerLeft] = useState(false);
  const messageEndRef = useRef(null);
  const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT;

  const send = (e) => {
    e.preventDefault();
    const message = document.getElementById("chatInput").value;
    if (message) {
      socket.emit("message", { message, id });
      document.getElementById("chatInput").value = "";
    }
  };

  useEffect(() => {

    document.title = "Randomly - Chat with Stranger";

    socket = socketIO(ENDPOINT);

    socket.on("connect", () => {
      setId(socket.id);
    });

    socket.emit("joined");

    socket.on("waiting", (data) => {
      setStrangerStatus("Finding Stranger to talk... Have patience!"); // Exclamation mark added
    });

    socket.on("welcome", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setStrangerStatus(""); // Clear waiting message when the second user joins
    });

    socket.on("strangerJoined", (data) => {
      setStrangerStatus("Stranger has joined, say hi!"); // Show the message when the stranger joins
      setStrangerLeft(false); // Reset the stranger left flag when a new stranger joins
    });

    socket.on("sendMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("leave", (data) => {
      setStrangerStatus("Stranger has left the chat!"); // Update the status message
      setStrangerLeft(true); // Enable "Find more" button
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Authentication check
  useEffect(() => {
    const token = document.cookie.split("; ").find((row) => row.startsWith("token="));
    if (!token) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [router]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFindMore = () => {
    window.location.reload(); // Reload the page to start finding a new stranger
  };

  return (
    <main className="fixed inset-0 flex flex-col items-center bg-gray-900 text-white p-4 overflow-hidden z-40">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-3xl">
        <span className="lg:text-2xl text-xl font-bold text-center flex gap-2">
          <h1 className="text-blue-500">Randomly</h1> Chat
        </span>
        <Link href="/">
          <button className="text-red-500 hover:text-red-700">End Chat</button>
        </Link>
      </header>

      {/* Chat Box */}
<div className="flex-grow mt-4 bg-gray-800 rounded-lg p-4 w-full max-w-3xl flex flex-col justify-between overflow-hidden">
  {/* Scrollable chat messages */}
  <div className="space-y-6 lg:h-[478px] h-[537px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800 mt-4">
    {messages.map((item, index) => (
      <div key={index} className="mb-6">
        {item.id === id ? (
          <div className="right flex justify-end">
            <div className="flex flex-col items-end space-y-1 w-full mt-2">
              <p className="text-sm text-blue-500">You:</p>
              <div className="bg-blue-500 text-white p-2 rounded-lg w-auto max-w-full break-words shadow-md">
                {item.message}
              </div>
            </div>
          </div>
        ) : (
          <div className="left flex justify-start">
            <div className="flex flex-col items-start space-y-1 w-full mt-4">
              <p className="text-sm text-gray-400">Stranger:</p>
              <div className="bg-gray-600 text-white p-2 rounded-lg w-auto max-w-full break-words shadow-md">
                {item.message}
              </div>
            </div>
          </div>
        )}
      </div>
    ))}
    {/* Empty div to act as scroll target */}
    <div ref={messageEndRef} />
  </div>

  {/* Status Message and "Find more" button */}
  <div className="mt-2 text-gray-300 w-full flex justify-center items-center flex-col">
    <div className="text-sm md:text-base">{strangerStatus}</div>
    {strangerLeft && (
      <button
        onClick={handleFindMore}
        className="mt-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
      >
        Find more
      </button>
    )}
  </div>
</div>

      {/* Input Box */}
      <div className="mt-4 w-full max-w-3xl">
        <form onSubmit={send} className="flex">
          <input
            type="text"
            name="message"
            className={`flex-grow px-4 py-2 rounded-lg focus:outline-none ${
              strangerStatus === "Finding Stranger to talk... Have patience!" || strangerStatus === "Stranger has left the chat!"
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white"
            }`}
            placeholder="Type your message..."
            id="chatInput"
            disabled={strangerStatus === "Finding Stranger to talk... Have patience!" || strangerLeft} // Only disable when searching or stranger left
          />
          <button
            type="submit"
            className={`ml-2 px-4 py-2 rounded-lg transition duration-300 ${
              strangerStatus === "Finding Stranger to talk... Have patience!" || strangerLeft
                ? "bg-gray-500 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            disabled={strangerStatus === "Finding Stranger to talk... Have patience!" || strangerLeft} // Only disable when searching or stranger left
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
};

export default Chat;
