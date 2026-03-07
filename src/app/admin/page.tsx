"use client";

import React, { useState, ReactNode, ReactElement } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  AlertCircle,
  Plus,
  Wallet,
  Search,
  Clock,
  Mail,
  Phone,
  GraduationCap,
  Edit,
  Trash2,
  Download,
  RotateCcw,
  Save,
  Shield,
  Moon,
  BellRing,
  X,
  BookOpen,
  MessageSquare,
} from "lucide-react";

import AssignmentPublisher from "@/components/admin/AssignmentPublisher";
import ParentCommunication from "@/components/admin/ParentCommunication";

// ============================================
// TYPES
// ============================================

type Student = {
  id: number;
  name: string;
  roll: string;
  batch: string;
  phone: string;
  email: string;
  feeStatus: string;
  attendance: string;
};
type ClassItem = {
  time: string;
  subject: string;
  batch: string;
  teacher: string;
  room: string;
};
type FeeRecord = {
  id: number;
  name: string;
  roll: string;
  amount: number;
  paid: number;
  due: number;
  status: string;
  lastPayment: string;
};

// ============================================
// INITIAL DATA
// ============================================

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Aarav Patel",
    roll: "22F101",
    batch: "JEE Advanced",
    phone: "+91 98765 43210",
    email: "aarav@email.com",
    feeStatus: "Paid",
    attendance: "92%",
  },
  {
    id: 2,
    name: "Sneha Gupta",
    roll: "22F102",
    batch: "NEET",
    phone: "+91 98765 43211",
    email: "sneha@email.com",
    feeStatus: "Paid",
    attendance: "88%",
  },
  {
    id: 3,
    name: "Rohan Kumar",
    roll: "22F103",
    batch: "JEE Mains",
    phone: "+91 98765 43212",
    email: "rohan@email.com",
    feeStatus: "Pending",
    attendance: "76%",
  },
  {
    id: 4,
    name: "Priya Singh",
    roll: "22F104",
    batch: "NEET",
    phone: "+91 98765 43213",
    email: "priya@email.com",
    feeStatus: "Overdue",
    attendance: "94%",
  },
  {
    id: 5,
    name: "Amit Sharma",
    roll: "22F105",
    batch: "JEE Advanced",
    phone: "+91 98765 43214",
    email: "amit@email.com",
    feeStatus: "Paid",
    attendance: "89%",
  },
  {
    id: 6,
    name: "Kavya Reddy",
    roll: "22F106",
    batch: "Foundation",
    phone: "+91 98765 43215",
    email: "kavya@email.com",
    feeStatus: "Paid",
    attendance: "95%",
  },
];

const INITIAL_SCHEDULE: { id: number; day: string; classes: ClassItem[] }[] = [
  {
    id: 1,
    day: "Monday",
    classes: [
      {
        time: "09:00 - 10:30",
        subject: "Organic Chemistry",
        batch: "JEE Advanced",
        teacher: "Dr. Roy",
        room: "Room 101",
      },
      {
        time: "11:00 - 12:30",
        subject: "Physics",
        batch: "NEET",
        teacher: "Prof. Das",
        room: "Room 102",
      },
    ],
  },
  {
    id: 2,
    day: "Tuesday",
    classes: [
      {
        time: "09:00 - 10:30",
        subject: "Inorganic Chemistry",
        batch: "NEET",
        teacher: "Dr. Mehta",
        room: "Room 101",
      },
      {
        time: "11:00 - 12:30",
        subject: "Biology",
        batch: "NEET",
        teacher: "Dr. Sharma",
        room: "Lab 1",
      },
    ],
  },
  {
    id: 3,
    day: "Wednesday",
    classes: [
      {
        time: "09:00 - 10:30",
        subject: "Mathematics",
        batch: "JEE Advanced",
        teacher: "Mr. Sen",
        room: "Room 103",
      },
    ],
  },
  {
    id: 4,
    day: "Thursday",
    classes: [
      {
        time: "09:00 - 10:30",
        subject: "Organic Chemistry",
        batch: "NEET",
        teacher: "Dr. Roy",
        room: "Room 102",
      },
    ],
  },
  {
    id: 5,
    day: "Friday",
    classes: [
      {
        time: "09:00 - 12:00",
        subject: "Weekly Test",
        batch: "All Batches",
        teacher: "-",
        room: "Exam Hall",
      },
    ],
  },
];

const INITIAL_FEES: FeeRecord[] = [
  {
    id: 1,
    name: "Aarav Patel",
    roll: "22F101",
    amount: 45000,
    paid: 45000,
    due: 0,
    status: "Paid",
    lastPayment: "Feb 5, 2026",
  },
  {
    id: 2,
    name: "Sneha Gupta",
    roll: "22F102",
    amount: 45000,
    paid: 45000,
    due: 0,
    status: "Paid",
    lastPayment: "Feb 3, 2026",
  },
  {
    id: 3,
    name: "Rohan Kumar",
    roll: "22F103",
    amount: 45000,
    paid: 30000,
    due: 15000,
    status: "Pending",
    lastPayment: "Jan 15, 2026",
  },
  {
    id: 4,
    name: "Priya Singh",
    roll: "22F104",
    amount: 45000,
    paid: 20000,
    due: 25000,
    status: "Overdue",
    lastPayment: "Dec 20, 2025",
  },
];

// ============================================
// MODAL COMPONENT
// ============================================

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
      {message}
    </div>
  );
}

// ============================================
// MAIN DASHBOARD
// ============================================

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [fees, setFees] = useState(INITIAL_FEES);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => setToast(msg);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              C
            </span>
            ChemManager
          </h2>
          <p className="text-xs text-slate-500 uppercase mt-1 pl-10">
            Admin Console
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { icon: <LayoutDashboard />, label: "Overview" },
            { icon: <Users />, label: "Students" },
            { icon: <Calendar />, label: "Schedule" },
            { icon: <CreditCard />, label: "Fee Manager" },
            { icon: <BookOpen />, label: "Assignments" },
            { icon: <MessageSquare />, label: "Messages" },
            { icon: <Settings />, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium transition-all ${activeTab === item.label ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              {React.cloneElement(item.icon as ReactElement, {
                className: "w-5 h-5",
              })}{" "}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeTab === "Overview" && (
            <OverviewModule students={students} fees={fees} />
          )}
          {activeTab === "Students" && (
            <StudentsModule
              students={students}
              setStudents={setStudents}
              showToast={showToast}
            />
          )}
          {activeTab === "Schedule" && (
            <ScheduleModule
              schedule={schedule}
              setSchedule={setSchedule}
              showToast={showToast}
            />
          )}
          {activeTab === "Fee Manager" && (
            <FeeModule fees={fees} setFees={setFees} showToast={showToast} />
          )}
          {activeTab === "Assignments" && (
            <AssignmentPublisher showToast={showToast} />
          )}
          {activeTab === "Messages" && (
            <ParentCommunication students={students} showToast={showToast} />
          )}
          {activeTab === "Settings" && <SettingsModule showToast={showToast} />}
        </div>
      </main>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

// ============================================
// OVERVIEW MODULE
// ============================================

function OverviewModule({
  students,
  fees,
}: {
  students: Student[];
  fees: FeeRecord[];
}) {
  const totalCollected = fees.reduce((a, f) => a + f.paid, 0);
  const totalDue = fees.reduce((a, f) => a + f.due, 0);
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Students"
          value={String(students.length)}
          trend="+5 this month"
          icon={<Users className="w-5 h-5 text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          label="Avg. Attendance"
          value="88%"
          trend="-2% vs last week"
          trendColor="text-red-500"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          bg="bg-emerald-50"
        />
        <StatCard
          label="Fees Collected"
          value={`₹ ${(totalCollected / 1000).toFixed(0)}K`}
          trend="85% of total"
          icon={<Wallet className="w-5 h-5 text-purple-600" />}
          bg="bg-purple-50"
        />
        <StatCard
          label="Pending Dues"
          value={`₹ ${(totalDue / 1000).toFixed(0)}K`}
          trend="Urgent"
          trendColor="text-red-600"
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
          bg="bg-red-50"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  trendColor = "text-green-600",
  icon,
  bg,
}: {
  label: string;
  value: string;
  trend: string;
  trendColor?: string;
  icon: ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
        <span
          className={`text-xs font-bold ${trendColor} bg-slate-50 px-2 py-1 rounded-full`}>
          {trend}
        </span>
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
      <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{value}</h3>
    </div>
  );
}

// ============================================
// STUDENTS MODULE
// ============================================

function StudentsModule({
  students,
  setStudents,
  showToast,
}: {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  showToast: (m: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterBatch, setFilterBatch] = useState("All");
  const [form, setForm] = useState({
    name: "",
    roll: "",
    batch: "JEE Advanced",
    phone: "",
    email: "",
  });

  const batches = ["All", ...Array.from(new Set(students.map((s) => s.batch)))];
  const filtered = students.filter(
    (s) =>
      (filterBatch === "All" || s.batch === filterBatch) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toLowerCase().includes(search.toLowerCase())),
  );

  const openAdd = () => {
    setForm({
      name: "",
      roll: "",
      batch: "JEE Advanced",
      phone: "",
      email: "",
    });
    setEditStudent(null);
    setModalOpen(true);
  };
  const openEdit = (s: Student) => {
    setForm({
      name: s.name,
      roll: s.roll,
      batch: s.batch,
      phone: s.phone,
      email: s.email,
    });
    setEditStudent(s);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.roll) return;
    if (editStudent) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editStudent.id ? { ...s, ...form } : s)),
      );
      showToast("Student updated!");
    } else {
      setStudents((prev) => [
        ...prev,
        { id: Date.now(), ...form, feeStatus: "Pending", attendance: "0%" },
      ]);
      showToast("Student added!");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setStudents((prev) => prev.filter((s) => s.id !== deleteId));
      showToast("Student deleted!");
      setDeleteId(null);
    }
  };

  const exportCSV = () => {
    const csv = [
      "Name,Roll,Batch,Phone,Email,Fee Status,Attendance",
      ...students.map(
        (s) =>
          `${s.name},${s.roll},${s.batch},${s.phone},${s.email},${s.feeStatus},${s.attendance}`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    showToast("Exported to CSV!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Student Directory
          </h2>
          <p className="text-slate-500 text-sm">{students.length} students</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm">
          {batches.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Batch</th>
              <th className="px-6 py-4">Fee</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.roll}</p>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {s.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {s.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                    {s.batch}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${s.feeStatus === "Paid" ? "bg-green-100 text-green-700" : s.feeStatus === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {s.feeStatus}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editStudent ? "Edit Student" : "Add Student"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Roll Number
            </label>
            <input
              value={form.roll}
              onChange={(e) => setForm({ ...form, roll: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch</label>
            <select
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg">
              <option>JEE Advanced</option>
              <option>JEE Mains</option>
              <option>NEET</option>
              <option>Foundation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg font-medium">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
              {editStudent ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Student">
        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this student? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// SCHEDULE MODULE
// ============================================

function ScheduleModule({
  schedule,
  setSchedule,
  showToast,
}: {
  schedule: typeof INITIAL_SCHEDULE;
  setSchedule: React.Dispatch<React.SetStateAction<typeof INITIAL_SCHEDULE>>;
  showToast: (m: string) => void;
}) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState({
    time: "",
    subject: "",
    batch: "JEE Advanced",
    teacher: "",
    room: "",
  });

  const dayData = schedule.find((d) => d.day === selectedDay);

  const openAdd = () => {
    setForm({
      time: "",
      subject: "",
      batch: "JEE Advanced",
      teacher: "",
      room: "",
    });
    setEditIdx(null);
    setModalOpen(true);
  };
  const openEdit = (idx: number, cls: ClassItem) => {
    setForm(cls);
    setEditIdx(idx);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.subject || !form.time) return;
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === selectedDay
          ? {
              ...d,
              classes:
                editIdx !== null
                  ? d.classes.map((c, i) => (i === editIdx ? form : c))
                  : [...d.classes, form],
            }
          : d,
      ),
    );
    showToast(editIdx !== null ? "Class updated!" : "Class added!");
    setModalOpen(false);
  };

  const handleDelete = (idx: number) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.day === selectedDay
          ? { ...d, classes: d.classes.filter((_, i) => i !== idx) }
          : d,
      ),
    );
    showToast("Class deleted!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Weekly Schedule</h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {schedule.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.day)}
            className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap ${selectedDay === d.day ? "bg-indigo-600 text-white shadow-lg" : "bg-white border text-slate-600 hover:bg-slate-50"}`}>
            {d.day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dayData?.classes.map((cls, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border shadow-sm p-6 group hover:shadow-lg transition-all">
            <div className="flex justify-between mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                {cls.time}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(idx, cls)}
                  className="p-1.5 hover:bg-indigo-50 rounded text-slate-400 hover:text-indigo-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {cls.subject}
            </h3>
            <p className="text-sm text-slate-500">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              {cls.batch}
            </p>
            <p className="text-sm text-slate-500">
              <Users className="w-4 h-4 inline mr-1" />
              {cls.teacher}
            </p>
            <p className="text-sm text-slate-500">
              <Calendar className="w-4 h-4 inline mr-1" />
              {cls.room}
            </p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIdx !== null ? "Edit Class" : "Add Class"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time Slot</label>
            <input
              placeholder="09:00 - 10:30"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch</label>
            <select
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg">
              <option>JEE Advanced</option>
              <option>JEE Mains</option>
              <option>NEET</option>
              <option>All Batches</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teacher</label>
            <input
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room</label>
            <input
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg font-medium">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">
              {editIdx !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// FEE MODULE
// ============================================

function FeeModule({
  fees,
  setFees,
  showToast,
}: {
  fees: FeeRecord[];
  setFees: React.Dispatch<React.SetStateAction<FeeRecord[]>>;
  showToast: (m: string) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const filtered =
    filter === "All" ? fees : fees.filter((f) => f.status === filter);
  const totalCollected = fees.reduce((a, f) => a + f.paid, 0);
  const totalDue = fees.reduce((a, f) => a + f.due, 0);

  const openPayment = (f: FeeRecord) => {
    setSelectedFee(f);
    setPaymentAmount("");
    setModalOpen(true);
  };

  const recordPayment = () => {
    const amount = parseInt(paymentAmount);
    if (!selectedFee || !amount || amount <= 0) return;
    setFees((prev) =>
      prev.map((f) =>
        f.id === selectedFee.id
          ? {
              ...f,
              paid: f.paid + amount,
              due: Math.max(0, f.due - amount),
              status: f.due - amount <= 0 ? "Paid" : "Pending",
              lastPayment: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : f,
      ),
    );
    showToast(`Payment of ₹${amount.toLocaleString()} recorded!`);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Fee Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-500">Total Collected</p>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">
            ₹ {(totalCollected / 1000).toFixed(0)}K
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-slate-500">Pending Dues</p>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">
            ₹ {(totalDue / 1000).toFixed(0)}K
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-slate-500">Overdue</p>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">
            {fees.filter((f) => f.status === "Overdue").length}
          </h3>
        </div>
      </div>

      <div className="flex gap-2">
        {["All", "Paid", "Pending", "Overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === f ? "bg-indigo-600 text-white" : "bg-white border text-slate-600 hover:bg-slate-50"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Due</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{f.name}</p>
                  <p className="text-xs text-slate-500">{f.roll}</p>
                </td>
                <td className="px-6 py-4 font-bold">
                  ₹ {f.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-emerald-600 font-bold">
                  ₹ {f.paid.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-red-600 font-bold">
                  ₹ {f.due.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${f.status === "Paid" ? "bg-green-100 text-green-700" : f.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {f.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {f.due > 0 && (
                    <button
                      onClick={() => openPayment(f)}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100">
                      Record Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Payment">
        {selectedFee && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="font-bold text-slate-800">{selectedFee.name}</p>
              <p className="text-sm text-slate-500">
                Outstanding: ₹ {selectedFee.due.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg font-medium">
                Cancel
              </button>
              <button
                onClick={recordPayment}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold">
                Record Payment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================
// SETTINGS MODULE
// ============================================

function SettingsModule({ showToast }: { showToast: (m: string) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@chemmanager.com",
    phone: "+91 98765 43210",
  });

  const saveSettings = () => showToast("Settings saved successfully!");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-400" /> Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" /> Preferences
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BellRing className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-xs text-slate-500">Receive alerts</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${notifications ? "bg-indigo-600" : "bg-slate-200"}`}>
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Moon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-xs text-slate-500">Switch theme</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-indigo-600" : "bg-slate-200"}`}>
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-6" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-400" /> Security
        </h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Change Password</span>
            </div>
            <span className="text-slate-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="font-medium">Two-Factor Auth</span>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
              Not Enabled
            </span>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}
