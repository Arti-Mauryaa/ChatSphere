import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  sendMessageRoute,
  recieveMessageRoute,
} from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  // helper to get logged-in user
  const getUser = () => {
    try {
      const stored = localStorage.getItem(
        process.env.REACT_APP_LOCALHOST_KEY
      );
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("LocalStorage error:", err);
      return null;
    }
  };

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = getUser();
        if (!user || !currentChat) return;

        const { data } = await axios.post(recieveMessageRoute, {
          from: user._id,
          to: currentChat._id,
        });

        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat]);

  //  Send message
  const handleSendMsg = async (msg) => {
    try {
      const user = getUser();
      if (!user) return;

      // socket send
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: user._id,
        msg,
      });

      // save to DB
      await axios.post(sendMessageRoute, {
        from: user._id,
        to: currentChat._id,
        message: msg,
      });

      // update UI instantly
      setMessages((prev) => [
        ...prev,
        { fromSelf: true, message: msg },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Receive messages (REAL-TIME + CLEANUP)
useEffect(() => {
    if (!socket.current) return;

    const handleMessage = (msg) => {
      setArrivalMessage({
        fromSelf: false,
        message: msg.message,
        from: msg.from,
      });
    };

    socket.current.on("msg-receive", handleMessage);

    return () => {
      socket.current.off("msg-receive", handleMessage);
    };
  }, []);

  //  Add incoming message to state
  useEffect(() => {
    if (arrivalMessage) {
      if (currentChat && arrivalMessage.from === currentChat._id) {
        setMessages((prev) => [...prev, arrivalMessage]);
      }
    }
  }, [arrivalMessage, currentChat]);

  //  Auto scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      {/* Header */}
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${
                message.fromSelf ? "sended" : "recieved"
              }`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar img {
        height: 3rem;
      }

      .username h3 {
        color: white;
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ffffff39;
      border-radius: 1rem;
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;