import React, { useState, useEffect } from "react";

const StudyPlanner = () => {
  // 1. Load saved data from localStorage on initial render
  const [subjects, setSubjects] = useState(() => {
    const savedData = localStorage.getItem("studyPlannerData");
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [form, setForm] = useState({ name: "", hours: "", deadline: "" });

  // 2. Save to localStorage whenever the 'subjects' array changes
  useEffect(() => {
    localStorage.setItem("studyPlannerData", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = (e) => {
    e.preventDefault();
    const newSub = {
      id: Date.now(),
      ...form,
      hours: parseFloat(form.hours),
      completed: 0,
    };
    setSubjects([...subjects, newSub]);
    setForm({ name: "", hours: "", deadline: "" });
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  const calculateDailyTarget = (sub) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day counts
    const target = new Date(sub.deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const remainingHours = sub.hours - sub.completed;
    if (remainingHours <= 0) return "Done! ✅";
    if (diffDays < 0) return "Past Due! ⚠️";
    if (diffDays === 0) return "Due Today! 🔥";
    
    return `${(remainingHours / diffDays).toFixed(1)} hrs/day`;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "system-ui, sans-serif" }}>
      <h2>📚 Smart Study Planner</h2>
      
      <form onSubmit={addSubject} style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <input style={{flex: "1 1 120px", padding: "8px"}} type="text" placeholder="Subject Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input style={{flex: "1 1 120px", padding: "8px"}} type="number" placeholder="Total Hours" value={form.hours} onChange={e => setForm({...form, hours: e.target.value})} min="1" required />
        <input style={{flex: "1 1 120px", padding: "8px"}} type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required />
        <button type="submit" style={{ flex: "1 1 100%", backgroundColor: "#4CAF50", color: "white", border: "none", padding: "10px", cursor: "pointer", fontWeight: "bold" }}>Add to Schedule</button>
      </form>

      {subjects.length === 0 && <p style={{textAlign: "center", color: "#666"}}>No subjects yet. Add one above!</p>}

      {subjects.map(sub => (
        <div key={sub.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "15px", backgroundColor: "#fdfdfd" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{sub.name}</h3>
            <button onClick={() => deleteSubject(sub.id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "16px" }}>✖</button>
          </div>
          
          <p style={{ margin: "0 0 10px 0" }}>Target: <strong>{calculateDailyTarget(sub)}</strong></p>
          
          <div style={{ background: "#eee", height: "12px", borderRadius: "6px", overflow: "hidden", marginBottom: "10px" }}>
            <div style={{ width: `${Math.min((sub.completed / sub.hours) * 100, 100)}%`, background: "#2196F3", height: "100%", transition: "width 0.3s ease" }}></div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", color: "#555" }}>Progress: {sub.completed} / {sub.hours} hrs</span>
            <button 
              onClick={() => {
                const updated = subjects.map(s => s.id === sub.id ? {...s, completed: s.completed + 1} : s);
                setSubjects(updated);
              }} 
              disabled={sub.completed >= sub.hours}
              style={{ padding: "5px 10px", cursor: sub.completed >= sub.hours ? "not-allowed" : "pointer" }}
            >
              +1 Hour
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyPlanner;