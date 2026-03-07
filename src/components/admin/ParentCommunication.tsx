"use client";

import React, { useState } from "react";
import { Send, MessageSquare, Search, User } from "lucide-react";

type Student = {
  id: number;
  name: string;
  roll: string;
  batch: string;
  phone: string;
  email: string;
};

type Message = {
  id: number;
  studentId: number;
  studentName: string;
  content: string;
  date: string;
  sender: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Aarav Patel",
    content:
      "Aarav has performed exceptionally well in the recent Chemistry test. Keep it up!",
    date: "Mar 05, 2026",
    sender: "Admin",
  },
  {
    id: 2,
    studentId: 3,
    studentName: "Rohan Kumar",
    content:
      "Rohan has been absent for the past two days. Please provide a reason for his absence.",
    date: "Mar 06, 2026",
    sender: "Admin",
  },
];

export default function ParentCommunication({
  students,
  showToast,
}: {
  students: Student[];
  showToast: (m: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">("");
  const [messageContent, setMessageContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSend = () => {
    if (!selectedStudentId || !messageContent.trim()) {
      showToast("Please select a student and write a message.");
      return;
    }
    const student = students.find((s) => s.id === Number(selectedStudentId));
    if (!student) return;

    const newMessage: Message = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      content: messageContent,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      sender: "Admin",
    };

    setMessages([newMessage, ...messages]);
    setMessageContent("");
    setSelectedStudentId("");
    showToast("Message sent to parent successfully!");
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Parent Communication
          </h2>
          <p className="text-slate-500 text-sm">
            Send performance updates and messages to parents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Message Section */}
        <div className="lg:col-span-1 border rounded-2xl p-6 bg-white shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Compose
            Message
          </h3>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) =>
                  setSelectedStudentId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">-- Select a Student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.batch})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium mb-1">
                Message Content
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 flex-1 min-h-[150px] resize-none"></textarea>
            </div>
          </div>

          <button
            onClick={handleSend}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </div>

        {/* Message History Section */}
        <div className="lg:col-span-2 border rounded-2xl p-6 bg-white shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              Message History
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div
            className="space-y-4 overflow-y-auto pr-2"
            style={{ maxHeight: "500px" }}>
            {filteredMessages.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p>No messages found.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {msg.studentName}&apos;s Parents
                        </p>
                        <p className="text-xs text-slate-500">
                          Sent by {msg.sender}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {msg.date}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border">
                    {msg.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
