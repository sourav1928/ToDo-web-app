import { useState, useEffect, useRef } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "https://todo-web-app-s3gf.onrender.com/api/todos" });

const STATUS = { ALL: "all", PENDING: "pending", COMPLETED: "completed" };
const PRIORITY = ["low", "medium", "high"];

function Badge({ priority }) {
  const map = {
    low: { bg: "#EAF3DE", color: "#3B6D11" },
    medium: { bg: "#FAEEDA", color: "#854F0B" },
    high: { bg: "#FCEBEB", color: "#A32D2D" },
  };
  const s = map[priority] || map.low;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 8px",
      borderRadius: 20, background: s.bg, color: s.color,
      textTransform: "capitalize", letterSpacing: "0.03em"
    }}>{priority}</span>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const colors = { success: "#EAF3DE", error: "#FCEBEB", info: "#E6F1FB" };
  const textColors = { success: "#3B6D11", error: "#A32D2D", info: "#185FA5" };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      background: colors[type] || colors.info,
      color: textColors[type] || textColors.info,
      border: `0.5px solid currentColor`,
      borderRadius: 10, padding: "12px 20px",
      fontSize: 14, fontWeight: 500,
      animation: "slideUp 0.25s ease",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
    }}>
      {message}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--color-background-primary)",
        borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 460,
        border: "0.5px solid var(--color-border-tertiary)"
      }}>
        {children}
      </div>
    </div>
  );
}

function TaskForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    priority: initial?.priority || "medium",
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : "",
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" }}>
        {initial ? "Edit task" : "New task"}
      </h2>
      <input
        placeholder="Task title *"
        value={form.title}
        onChange={set("title")}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={set("description")}
        rows={3}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Priority</label>
          <select value={form.priority} onChange={set("priority")} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 14 }}>
            {PRIORITY.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Due date</label>
          <input type="date" value={form.dueDate} onChange={set("dueDate")}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={loading || !form.title.trim()}
          style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer",
            background: "#185FA5", color: "#fff", border: "none", fontWeight: 500,
            opacity: loading || !form.title.trim() ? 0.6 : 1
          }}>
          {loading ? "Saving…" : "Save task"}
        </button>
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const [confirming, setConfirming] = useState(false);
  const overdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderLeft: task.completed ? "3px solid #1D9E75" : overdue ? "3px solid #E24B4A" : "3px solid #185FA5",
      borderRadius: 12, padding: "14px 16px",
      display: "flex", gap: 14, alignItems: "flex-start",
      opacity: task.completed ? 0.75 : 1,
      transition: "opacity 0.2s"
    }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        style={{ marginTop: 3, cursor: "pointer", width: 16, height: 16, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 15, fontWeight: 500,
            color: "var(--color-text-primary)",
            textDecoration: task.completed ? "line-through" : "none",
            wordBreak: "break-word"
          }}>{task.title}</span>
          <Badge priority={task.priority} />
        </div>
        {task.description && (
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            {task.description}
          </p>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          {task.dueDate && (
            <span style={{ fontSize: 12, color: overdue ? "#A32D2D" : "var(--color-text-secondary)" }}>
              {overdue ? "⚠ " : ""}Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 20,
            background: task.completed ? "#EAF3DE" : "#E6F1FB",
            color: task.completed ? "#3B6D11" : "#185FA5",
            fontWeight: 500
          }}>
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={() => onEdit(task)} title="Edit" style={{
          background: "none", border: "0.5px solid var(--color-border-secondary)",
          borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 13,
          color: "var(--color-text-secondary)"
        }}>Edit</button>
        {confirming ? (
          <button onClick={() => onDelete(task._id)} style={{
            background: "#FCEBEB", border: "none", borderRadius: 7,
            padding: "5px 10px", cursor: "pointer", fontSize: 13, color: "#A32D2D", fontWeight: 500
          }}>Confirm</button>
        ) : (
          <button onClick={() => setConfirming(true)} title="Delete" style={{
            background: "none", border: "0.5px solid var(--color-border-secondary)",
            borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 13,
            color: "var(--color-text-secondary)"
          }}>Delete</button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(STATUS.ALL);
  const [sortBy, setSortBy] = useState("createdAt");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter !== STATUS.ALL) params.status = filter;
      if (priorityFilter !== "all") params.priority = priorityFilter;
      params.sortBy = sortBy;
      const { data } = await api.get("/", { params });
      setTasks(data.todos || data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [search, filter, sortBy, priorityFilter]);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await api.post("/", form);
      setModalOpen(false);
      await fetchTasks();
      showToast("Task created!");
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await api.put(`/${editTask._id}`, form);
      setEditTask(null);
      await fetchTasks();
      showToast("Task updated!");
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      await fetchTasks();
      showToast("Task deleted!", "info");
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
    }
  };

  const handleToggle = async (task) => {
    try {
      await api.patch(`/${task._id}/status`, { completed: !task.completed });
      await fetchTasks();
      showToast(task.completed ? "Marked as pending" : "Marked as complete!");
    } catch (e) {
      showToast(e.response?.data?.message || e.message, "error");
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => t.dueDate && !t.completed && new Date(t.dueDate) < new Date()).length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; }
        input, select, textarea { background: var(--color-background-secondary, #F1EFE8); border: 0.5px solid #ccc; color: inherit; font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: 2px solid #185FA5; outline-offset: 0; border-color: #185FA5; }
        button { font-family: inherit; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "0.5px solid #E0DDD5",
        padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>✓</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em" }}>TodoApp</span>
        </div>
        <button onClick={() => setModalOpen(true)} style={{
          background: "#185FA5", color: "#fff", border: "none",
          borderRadius: 8, padding: "7px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer"
        }}>+ New task</button>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Total", value: stats.total, color: "#185FA5", bg: "#E6F1FB" },
            { label: "Pending", value: stats.pending, color: "#854F0B", bg: "#FAEEDA" },
            { label: "Done", value: stats.completed, color: "#3B6D11", bg: "#EAF3DE" },
            { label: "Overdue", value: stats.overdue, color: "#A32D2D", bg: "#FCEBEB" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 500, marginBottom: 4, opacity: 0.8 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <input
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 9, fontSize: 14, width: "100%" }}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[STATUS.ALL, STATUS.PENDING, STATUS.COMPLETED].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                background: filter === s ? "#185FA5" : "#fff",
                color: filter === s ? "#fff" : "#666",
                border: filter === s ? "none" : "0.5px solid #ddd",
                fontWeight: filter === s ? 500 : 400,
                textTransform: "capitalize"
              }}>{s === "all" ? "All" : s}</button>
            ))}
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{
              padding: "6px 12px", borderRadius: 20, fontSize: 13, cursor: "pointer"
            }}>
              <option value="all">All priorities</option>
              {PRIORITY.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: "6px 12px", borderRadius: 20, fontSize: 13, cursor: "pointer", marginLeft: "auto"
            }}>
              <option value="createdAt">Newest first</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⋯</div>
            Loading tasks…
          </div>
        ) : error ? (
          <div style={{
            background: "#FCEBEB", color: "#A32D2D", borderRadius: 10,
            padding: 20, textAlign: "center", fontSize: 14
          }}>
            <strong>Could not connect to backend</strong><br />
            <span style={{ fontSize: 12, opacity: 0.8 }}>Make sure your Node.js server is running on port 5000</span>
          </div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>☑</div>
            <div style={{ fontSize: 15 }}>No tasks found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Create one with the button above</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={t => setEditTask(t)}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <TaskForm
          onSave={handleCreate}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTask} onClose={() => setEditTask(null)}>
        {editTask && (
          <TaskForm
            initial={editTask}
            onSave={handleUpdate}
            onCancel={() => setEditTask(null)}
            loading={saving}
          />
        )}
      </Modal>

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
