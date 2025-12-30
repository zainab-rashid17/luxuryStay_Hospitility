import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import './Chat.css';

const Chat = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations();
      fetchAvailableUsers();
      // Reset selected conversation when opening chat
      setSelectedConversation(null);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConversation._id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data.conversations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      console.error('Error details:', error.response?.data);
      setConversations([]);
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages/users');
      console.log('Available users response:', response.data);
      console.log('Current user role:', user?.role);
      setAvailableUsers(response.data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching available users:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setAvailableUsers([]);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/messages/${conversationId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      console.error('Error details:', error.response?.data);
      if (error.response?.status === 404) {
        setMessages([]);
      }
    }
  };

  const startConversation = async (userId) => {
    try {
      const response = await axios.get(`/api/messages/conversation/${userId}`);
      
      if (!response.data || !response.data.conversation) {
        throw new Error('Invalid response from server');
      }
      
      const conversation = response.data.conversation;
      
      // Find other participant - handle both populated and non-populated cases
      let otherParticipant = null;
      if (conversation.participants && conversation.participants.length > 0) {
        otherParticipant = conversation.participants.find(
          p => {
            const participantId = p._id?.toString() || p?.toString();
            const currentUserId = user._id?.toString() || user._id?.toString();
            return participantId !== currentUserId;
          }
        );
      }
      
      if (!otherParticipant) {
        console.error('Other participant not found in conversation:', conversation);
        // Try to get user info from availableUsers
        const userInfo = availableUsers.find(u => u._id.toString() === userId);
        if (userInfo) {
          otherParticipant = userInfo;
        }
      }
      
      setSelectedConversation({
        ...conversation,
        otherParticipant: otherParticipant
      });
      fetchMessages(conversation._id);
    } catch (error) {
      console.error('Error starting conversation:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Error getting conversation';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || `Error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      // Show user-friendly error message
      alert(errorMessage);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    if (!selectedConversation) {
      alert('Please select a conversation first');
      return;
    }

    setSending(true);
    try {
      // Get receiver ID - try multiple methods to ensure we get it
      let receiverId = null;
      
      // Method 1: From otherParticipant (most reliable)
      if (selectedConversation?.otherParticipant?._id) {
        receiverId = selectedConversation.otherParticipant._id;
      }
      
      // Method 2: From participants array (populated objects)
      if (!receiverId && selectedConversation?.participants) {
        const otherUser = selectedConversation.participants.find(
          p => {
            const participantId = p._id?.toString() || p?._id || p?.toString();
            const currentUserId = user._id?.toString() || user._id;
            return participantId && participantId !== currentUserId;
          }
        );
        if (otherUser) {
          receiverId = otherUser._id || otherUser._id?.toString() || otherUser;
        }
      }

      // Method 3: If receiverId is still not found, try to extract from string IDs
      if (!receiverId && selectedConversation?.participants) {
        const currentUserId = user._id?.toString() || user._id;
        for (const p of selectedConversation.participants) {
          const participantId = p._id?.toString() || p?._id || p?.toString();
          if (participantId && participantId !== currentUserId) {
            receiverId = participantId;
            break;
          }
        }
      }

      // Ensure receiverId is a string if found
      if (receiverId && typeof receiverId !== 'string') {
        receiverId = receiverId.toString();
      }

      // Prepare request payload - backend can extract receiverId from conversationId if needed
      const requestPayload = {
        conversationId: selectedConversation._id,
        message: newMessage
      };
      
      // Add receiverId if we found it, but backend can handle without it
      if (receiverId) {
        requestPayload.receiverId = receiverId;
      } else {
        console.warn('ReceiverId not found, but sending with conversationId only. Backend will extract it.');
      }

      console.log('Sending message with payload:', requestPayload);
      const response = await axios.post('/api/messages', requestPayload);

      setMessages(prev => [...prev, response.data.message]);
      setNewMessage('');
      fetchConversations(); // Refresh conversations list
      // Refresh messages to get updated list
      fetchMessages(selectedConversation._id);
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'Error sending message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now - messageDate;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return messageDate.toLocaleDateString();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('chat-open');
      document.documentElement.classList.add('chat-open');
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('chat-open');
      document.documentElement.classList.remove('chat-open');
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('chat-open');
      document.documentElement.classList.remove('chat-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="chat-overlay" 
      onClick={onClose}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw'
      }}
    >
      <div 
        className="chat-container" 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000000,
          margin: 0
        }}
      >
        <div className="chat-header">
          <h3>Messages</h3>
          <button className="chat-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chat-content">
          {/* Conversations List */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h4>Conversations</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedConversation(null)}
              >
                New Chat
              </button>
            </div>

            {loading ? (
              <div className="chat-empty">Loading...</div>
            ) : !selectedConversation ? (
              <div className="chat-users-list">
                <h5>Start a conversation:</h5>
                {availableUsers.length === 0 ? (
                  <div className="chat-empty">
                    <p>No users available to chat</p>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>
                      {user?.role === 'admin'
                        ? 'No guests available to chat with'
                        : 'No admins available to chat with'}
                    </p>
                  </div>
                ) : (
                  availableUsers.map(userItem => (
                    <div
                      key={userItem._id}
                      className="chat-user-item"
                      onClick={() => startConversation(userItem._id)}
                    >
                      <div className="chat-user-avatar">
                        {userItem.firstName?.[0]}{userItem.lastName?.[0]}
                      </div>
                      <div className="chat-user-info">
                        <div className="chat-user-name">
                          {userItem.firstName} {userItem.lastName}
                        </div>
                        <div className="chat-user-role">{userItem.role}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="chat-conversations-list">
                {conversations.length === 0 ? (
                  <p className="chat-empty">No conversations yet</p>
                ) : (
                  conversations.map(conv => {
                    const otherUser = conv.otherParticipant || conv.participants.find(
                      p => p._id.toString() !== user._id.toString()
                    );
                    return (
                      <div
                        key={conv._id}
                        className={`chat-conversation-item ${
                          selectedConversation?._id === conv._id ? 'active' : ''
                        }`}
                        onClick={async () => {
                          // Ensure otherParticipant is properly set
                          let finalOtherUser = otherUser;
                          if (!finalOtherUser && conv.participants) {
                            finalOtherUser = conv.participants.find(
                              p => {
                                const participantId = p._id?.toString() || p?._id || p?.toString();
                                const currentUserId = user._id?.toString() || user._id;
                                return participantId && participantId !== currentUserId;
                              }
                            );
                          }
                          
                          const updatedConversation = {
                            ...conv,
                            otherParticipant: finalOtherUser,
                            _id: conv._id
                          };
                          
                          console.log('Selected conversation:', updatedConversation);
                          setSelectedConversation(updatedConversation);
                          fetchMessages(conv._id);
                        }}
                      >
                        <div className="chat-user-avatar">
                          {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                        </div>
                        <div className="chat-conversation-info">
                          <div className="chat-conversation-header">
                            <span className="chat-conversation-name">
                              {otherUser?.firstName} {otherUser?.lastName}
                            </span>
                            {conv.unreadCount > 0 && (
                              <span className="chat-unread-badge">{conv.unreadCount}</span>
                            )}
                          </div>
                          <div className="chat-conversation-preview">
                            {conv.lastMessage || 'No messages yet'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="chat-messages-area">
            {selectedConversation ? (
              <>
                <div className="chat-messages-header">
                  <div className="chat-messages-user">
                    <div className="chat-user-avatar">
                      {selectedConversation.otherParticipant?.firstName?.[0]}
                      {selectedConversation.otherParticipant?.lastName?.[0]}
                    </div>
                    <div>
                      <div className="chat-messages-name">
                        {selectedConversation.otherParticipant?.firstName}{' '}
                        {selectedConversation.otherParticipant?.lastName}
                      </div>
                      <div className="chat-messages-role">
                        {selectedConversation.otherParticipant?.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chat-messages-list" ref={messagesContainerRef}>
                  {messages.length === 0 ? (
                    <div className="chat-empty-messages">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map(message => {
                      const isOwn = message.senderId._id === user._id;
                      return (
                        <div
                          key={message._id}
                          className={`chat-message ${isOwn ? 'own' : 'other'}`}
                        >
                          <div className="chat-message-content">
                            <div className="chat-message-text">{message.message}</div>
                            <div className="chat-message-time">
                              {formatTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-form" onSubmit={sendMessage}>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!newMessage.trim() || sending}
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="chat-welcome">
                <div className="chat-welcome-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
                    <path d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3>Select a conversation or start a new one</h3>
                <p>Choose from the list on the left to view and send messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;



