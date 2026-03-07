"use client";

import { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Tag,
  Search,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  tag: string;
  upvotes: number;
  replies: number;
  isVerified: boolean; // Answer verified by teacher
  timestamp: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "Confusion about SN1 vs SN2 mechanisms",
    author: "Sarah Jenkins",
    content:
      "I keep getting confused about when to apply SN1 and when SN2. Is it just about the solvent?",
    tag: "Organic Chemistry",
    upvotes: 12,
    replies: 3,
    isVerified: true,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Thermodynamics: Entropy change calculation",
    author: "Mike Ross",
    content:
      "Can someone explain step-by-step how to calculate entropy change for a reversible isothermal process?",
    tag: "Physical Chemistry",
    upvotes: 8,
    replies: 1,
    isVerified: false,
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    title: "Coordination Compounds Nomenclature",
    author: "Emily Blunt",
    content: "Whats the rule for naming anionic ligands ending in -ide?",
    tag: "Inorganic Chemistry",
    upvotes: 5,
    replies: 0,
    isVerified: false,
    timestamp: "1 day ago",
  },
];

export default function DoubtForum() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      id: Date.now().toString(),
      title: newTitle,
      author: "You", // Mock user
      content: newContent,
      tag: "General",
      upvotes: 0,
      replies: 0,
      isVerified: false,
      timestamp: "Just now",
    };
    setPosts([newPost, ...posts]);
    setIsPosting(false);
    setNewTitle("");
    setNewContent("");
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Doubt Forum</h1>
          <p className="text-slate-500">
            Ask questions, get answers from peers and teachers.
          </p>
        </div>
        <button
          onClick={() => setIsPosting(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30">
          <PlusCircle className="w-5 h-5" /> Post a Doubt
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for topics, tags, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
        />
      </div>

      {/* New Post Modal (Inline for simplicity) */}
      <AnimatePresence>
        {isPosting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden">
            <form
              onSubmit={handlePost}
              className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Post your Question
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g., Question about Periodic Trends"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Details
                  </label>
                  <textarea
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Describe your doubt in detail..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPosting(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
                    Post Question
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex gap-4">
              {/* Vote Column */}
              <div className="flex flex-col items-center gap-1 text-slate-500">
                <button className="p-1 hover:bg-slate-100 rounded hover:text-indigo-600 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <span className="font-bold text-sm">{post.upvotes}</span>
              </div>

              {/* Content Column */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>
                        Posted by{" "}
                        <span className="font-medium text-slate-700">
                          {post.author}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                  {post.isVerified && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-100">
                      <CheckCircle2 className="w-3 h-3" /> Teacher Verified
                    </div>
                  )}
                </div>

                <p className="text-slate-600 mb-4 line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">
                    <Tag className="w-3 h-3" /> {post.tag}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                    <MessageSquare className="w-4 h-4" /> {post.replies} Replies
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
