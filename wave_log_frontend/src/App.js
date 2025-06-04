import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// ==== SAMPLE DATA ====
const initialSessions = [
  {
    id: 1,
    date: '2024-06-13',
    spot: 'Seaglass Beach',
    board: 'Shortboard',
    waveCount: 15,
    mood: 'Stoked',
    notes: 'Fun chest-high lefts, light crowd. Dolphins spotted!',
    swellSize: 4,
    wind: 'Offshore',
    tide: 'Mid',
  },
  {
    id: 2,
    date: '2024-06-10',
    spot: 'Crystal Cove',
    board: 'Longboard',
    waveCount: 9,
    mood: 'Relaxed',
    notes: 'Gentle rollers, easy logging.',
    swellSize: 2,
    wind: 'Onshore',
    tide: 'High',
  },
  {
    id: 3,
    date: '2024-06-07',
    spot: 'Seaglass Beach',
    board: 'Funboard',
    waveCount: 11,
    mood: 'Frustrated',
    notes: 'Windy, choppy, hard to catch the set waves.',
    swellSize: 5,
    wind: 'Sideshore',
    tide: 'Low',
  },
];

// ==== CONSTANTS ====
const BOARDS = ['Shortboard', 'Longboard', 'Funboard', 'Fish', 'Soft-top'];
const SPOTS = [
  'Seaglass Beach',
  'Crystal Cove',
  'Coral Point',
  'Tide Rock',
  'Lagoon Bay',
];
const MOODS = [
  { value: 'Stoked', icon: '🌊' },
  { value: 'Relaxed', icon: '😌' },
  { value: 'Frustrated', icon: '😡' },
  { value: 'Tired', icon: '😴' },
  { value: 'Inspired', icon: '🌅' },
];
const WINDS = ['Offshore', 'Onshore', 'Sideshore'];
const TIDES = ['Low', 'Mid', 'High'];

// ==== HOOKS ====
/**
 * PUBLIC_INTERFACE
 * useReminder - Prompts if no session is logged for today and
 * if the reminder wasn't dismissed for this session (uses sessionStorage).
 * Now updated: Handles re-initialization if sessionStorage changes!
 */
function useReminder(sessions, onPrompt) {
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const dismissed = sessionStorage.getItem('surfReminderDismissed');
    if (!sessions.some((s) => s.date === today) && !dismissed) {
      const reminder = setTimeout(() => {
        onPrompt();
      }, 1800); // prompt after launch for demo
      return () => clearTimeout(reminder);
    }
  }, [sessions, onPrompt]);

  // Listen to sessionStorage changes (from other tabs, etc.)
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === "surfReminderDismissed") {
        // could choose to update locally if needed.
        // Optionally, onPrompt(false); // force close modal
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
}

// ==== UTILS ====
function getMoodIcon(mood) {
  const found = MOODS.find((m) => m.value === mood);
  return found ? found.icon : '🌊';
}

// PUBLIC_INTERFACE
function oceanicGradient() {
  // Returns a CSS linear gradient string for headers/backgrounds.
  return 'linear-gradient(90deg, #4FC3F7 30%, #26A69A 71%, #FFF8E1 100%)';
}

// ==== COMPONENTS ====
// PUBLIC_INTERFACE
function Navbar({ onGoHome, onShowStats }) {
  return (
    <nav className="navbar surf-navbar" style={{
      background: oceanicGradient(),
      borderBottom: '2px solid #26A69A33',
    }}>
      <div className="container" style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
        <div className="logo" onClick={onGoHome} style={{ cursor: 'pointer', fontSize: 22, fontWeight: 600 }}>
          <span role="img" aria-label="wave" className="logo-symbol" style={{fontSize: 27, marginRight: 6}}>🌊</span>
          SurfSync
        </div>
        <div style={{display: 'flex', gap: 14}}>
          <button className="btn btn-navbar" onClick={onShowStats}>Stats Dashboard 📊</button>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function SessionCard({ session, onClick }) {
  // Card preview for session listing
  return (
    <div className="session-card" style={{
      background: 'rgba(255,248,225,0.89)',
      borderLeft: `6px solid #26A69A`,
      marginBottom: 16,
      borderRadius: 12,
      boxShadow: '0 2px 10px #026b7986',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform .07s',
    }} tabIndex={0} onClick={onClick}
      onKeyPress={e => {if (e.key==='Enter') onClick();}}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding:16}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{ fontWeight: 700, color: '#1A1A1A' }}>{session.spot}</div>
          <div style={{ fontSize: 13, color: '#4FC3F7' }}>{session.date}</div>
        </div>
        <div style={{ fontSize: 32, marginRight: 10, userSelect:'none' }}>{getMoodIcon(session.mood)}</div>
      </div>
      <div style={{borderTop: '1px solid #4FC3F722', padding: '10px 16px', display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <span role="img" aria-label="board">🛹</span> {session.board}
        </div>
        <div>
          <span role="img" aria-label="waves">🌊</span> {session.waveCount} waves
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function SessionDetail({ session, onBack, onEdit, onDelete }) {
  // Shows all details of a surf session, allows edit/delete.
  if (!session) return null;
  return (
    <div className="session-detail-card" style={{
      background: '#FFF8E1',
      borderRadius: 16,
      padding: 32,
      boxShadow: '0 4px 32px #01738e28',
      margin: '50px auto 26px auto',
      maxWidth: 550
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <button className="btn" style={{ background: '#4FC3F7', color: '#FFF', fontWeight:600 }} onClick={onBack}>← Back</button>
        <div style={{fontSize:26, fontWeight:700, color:'#1A1A1A', marginLeft:8}}>&nbsp;Session Details</div>
      </div>
      <hr style={{margin: '18px 0 14px 0', borderTop:'2px solid #4FC3F7cc'}} />
      <div style={{display:'flex', alignItems:'center', marginBottom: 10}}>
        <span style={{fontSize:35, marginRight:16}}>{getMoodIcon(session.mood)}</span>
        <div>
          <div style={{fontWeight:600, fontSize:19}}>{session.spot} <span style={{color:'#26A69A', fontSize:16}}>&bull; {session.date}</span>
          </div>
          <div style={{fontSize:15, color:'#4FC3F7'}}>{session.board}</div>
        </div>
      </div>
      <div style={{margin:'16px 0'}}>
        <b>Waves ridden:</b> <span>{session.waveCount}</span>
      </div>
      <div style={{margin:'6px 0'}}>
        <b>Conditions:</b> <span>{session.swellSize}ft swell, {session.wind}, {session.tide} tide</span>
      </div>
      <div style={{margin:'8px 0', fontWeight:500}}>
        <span style={{background:'#4FC3F7',color:'white',borderRadius:8, padding:'2px 12px', marginRight:8, fontSize:16}}>
          Mood: {session.mood} {getMoodIcon(session.mood)}</span>
      </div>
      <div style={{margin: '18px 0', background:'#26A69A16', padding:12, borderRadius:8}}>
        <b>Notes:</b>
        <div style={{marginTop:4, color:'#01738e'}}>{session.notes}</div>
      </div>
      <div style={{marginTop:18, display:'flex', gap:12}}>
        <button className="btn" style={{background:'#26A69A', color:'#fff'}} onClick={onEdit}>Edit</button>
        <button className="btn" style={{background:'#fff', color:'#e53935', border:'1.1px solid #e53936bb'}} onClick={() => {
          if(window.confirm('Delete this session?')) onDelete();
        }}>Delete</button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function LogSessionForm({ onSubmit, onCancel, initial }) {
  // Form to log or edit a surf session
  const [form, setForm] = useState(() => initial || {
    date: new Date().toISOString().slice(0, 10),
    spot: SPOTS[0],
    board: BOARDS[0],
    waveCount: 1,
    mood: MOODS[0].value,
    notes: '',
    swellSize: 2,
    wind: WINDS[0],
    tide: TIDES[1],
  });

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
  }
  return (
    <form className="log-session-form" style={{
      maxWidth: 410, background:'#FFF8E1', margin:'50px auto', borderRadius:16, 
      boxShadow:'0 4px 32px #01738e2c', padding: '30px 32px 24px 32px'
    }}
      onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <h2 style={{textAlign:'center', color:'#26A69A', marginBottom:18}}>
        {initial ? 'Edit Session' : 'Log New Session'}
      </h2>
      {/* Date */}
      <div className="form-row">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={{ border: '1.1px solid #26A69A88', borderRadius: 5, padding: 4 }}
          required
        />
      </div>
      {/* Spot */}
      <div className="form-row">
        <label>Spot:</label>
        <select name='spot' value={form.spot} onChange={handleChange}
          style={{border:'1.1px solid #26A69A', borderRadius: 5, padding:6}}>
          {SPOTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {/* Board */}
      <div className="form-row">
        <label>Board:</label>
        <select name='board' value={form.board} onChange={handleChange}
          style={{border:'1.1px solid #26A69A', borderRadius: 5, padding:6}}>
          {BOARDS.map(b => <option key={b} value={b}>🛹 {b}</option>)}
        </select>
      </div>
      {/* Mood */}
      <div className="form-row">
        <label>Mood:</label>
        <div className="mood-inputs" style={{display:'flex',gap:9}}>
          {MOODS.map(m => (
            <label key={m.value} style={{
              background: form.mood===m.value?'#4FC3F7':'#E1F7FA',
              color: form.mood===m.value?'white':'#01738e',
              border:'1.2px solid #26A69A',
              borderRadius:8, cursor:'pointer',
              padding:'4px 11px', fontSize:18,
              transition:'.15s'
            }}>
              <input
                type="radio"
                name="mood"
                value={m.value}
                checked={form.mood===m.value}
                onChange={handleChange}
                style={{display:'none'}}
              />
              {m.icon}
            </label>
          ))}
        </div>
      </div>
      {/* Wave Count */}
      <div className="form-row">
        <label>Waves:</label>
        <input style={{width:65, borderRadius:5, border:'1.1px solid #4FC3F7'}}
          type="number" min={0} name="waveCount" value={form.waveCount} max={99}
          onChange={handleChange} required
        />
      </div>
      {/* Swell Size */}
      <div className="form-row">
        <label>Swell size (ft):</label>
        <input type="range" min={1} max={8} name="swellSize" value={form.swellSize}
          onChange={handleChange} style={{ accentColor: '#4FC3F7', width:150 }}/>
        <span style={{marginLeft:8, fontWeight:500, color:'#4FC3F7'}}>{form.swellSize}</span>
      </div>
      {/* Wind */}
      <div className="form-row">
        <label>Wind:</label>
        <select name="wind" value={form.wind} onChange={handleChange}
          style={{border:'1.1px solid #26A69A', borderRadius: 5, padding:6}}>
          {WINDS.map(w => <option key={w}>{w}</option>)}
        </select>
      </div>
      {/* Tide */}
      <div className="form-row">
        <label>Tide:</label>
        <select name="tide" value={form.tide} onChange={handleChange}
          style={{border:'1.1px solid #26A69A', borderRadius: 5, padding:6}}>
          {TIDES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      {/* Notes */}
      <div className="form-row">
        <label>Notes:</label>
        <textarea name="notes" value={form.notes} onChange={handleChange}
          rows={3}
          style={{ border:'1.1px solid #4FC3F7', borderRadius: 6, padding: 6, width:'99%' }}
        />
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:18}}>
        <button className="btn btn-large" style={{background:'#4FC3F7', color:'#fff'}} type="submit">
          {initial ? 'Save' : 'Add'}
        </button>
        <button className="btn btn-large" style={{
            background:'#FFF',border:'1.1px solid #4FC3F7'
          }} type='button' onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// PUBLIC_INTERFACE
function SessionList({ sessions, onSelect, filters, setFilters, onAdd }) {
  // Renders filtering controls + session list
  const filteredSessions = useMemo(() => {
    let filtered = sessions;
    if (filters.spot && filters.spot !== 'All') {
      filtered = filtered.filter(s => s.spot === filters.spot);
    }
    if (filters.board && filters.board !== 'All') {
      filtered = filtered.filter(s => s.board === filters.board);
    }
    if (filters.mood && filters.mood !== 'All') {
      filtered = filtered.filter(s => s.mood === filters.mood);
    }
    return filtered.sort((a,b) => b.date.localeCompare(a.date));
  }, [sessions, filters]);
  // Filter controls
  return (
    <div style={{maxWidth:650, margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between', alignItems:'center',marginTop:78, marginBottom:22}}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#4FC3F7',
          background: oceanicGradient(),
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin:0
        }}>
          Surf Sessions
        </h1>
        <button className="btn btn-large" onClick={onAdd} style={{
          background:'#26A69A', color:'#fff', fontWeight:800, fontSize:18,
          boxShadow:'0 2px 10px #01738e2a'
        }}>
          + Log New Session
        </button>
      </div>
      <div style={{
        display:'flex', gap:13, justifyContent:'flex-start', flexWrap:'wrap', marginBottom:14,
        marginLeft:2, marginTop:3
      }}>
        <select value={filters.spot} onChange={e=>setFilters(f=>({...f,spot:e.target.value}))}
          style={{border:'1px solid #26A69A', borderRadius:6, padding:5}}>
          <option>All</option>
          {SPOTS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.board} onChange={e=>setFilters(f=>({...f,board:e.target.value}))}
          style={{border:'1px solid #26A69A', borderRadius:6, padding:5}}>
          <option>All</option>
          {BOARDS.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={filters.mood} onChange={e=>setFilters(f=>({...f,mood:e.target.value}))}
          style={{border:'1px solid #26A69A', borderRadius:6, padding:5}}>
          <option>All</option>
          {MOODS.map(m => <option key={m.value}>{m.value}</option>)}
        </select>
      </div>
      {filteredSessions.length === 0 ? (
        <div style={{textAlign:'center',color:'#01738e',margin:'60px 0', fontSize:19}}>
          No sessions found for the selected filter.
        </div>
      ) : (
        <div style={{marginTop:9}}>
          {filteredSessions.map(s =>
            <SessionCard key={s.id} session={s} onClick={()=>onSelect(s.id)} />
          )}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function StatsDashboard({ sessions, onBack }) {
  // Visualizes: most visited spot, board usage %, mood trend
  // Chart rendering is simple manual with CSS (no dependency)
  const spotCounts = {};
  const boardCounts = {};
  const moodCounts = {};
  const moodTrend = [];
  sessions.forEach(s => {
    spotCounts[s.spot]=(spotCounts[s.spot]||0)+1;
    boardCounts[s.board]=(boardCounts[s.board]||0)+1;
    moodCounts[s.mood]=(moodCounts[s.mood]||0)+1;
    moodTrend.push({date:s.date, mood:s.mood});
  });
  const spotsRanked = Object.entries(spotCounts).sort((a,b)=>b[1]-a[1]);
  const boardsRanked = Object.entries(boardCounts).sort((a,b)=>b[1]-a[1]);
  const moodsRanked = Object.entries(moodCounts).sort((a,b)=>b[1]-a[1]);
  const totalSessions = sessions.length;

  function boardColor(board) {
    const idx = BOARDS.indexOf(board);
    return ['#4FC3F7','#26A69A','#039be5','#B2EBF2','#00838f'][idx%5];
  }

  return (
    <div style={{
      maxWidth: 680, margin:'80px auto 0 auto', background:'#FFF8E1f2', borderRadius:18,
      boxShadow:'0 4px 32px #01738e1a', padding:'32px 30px 28px 30px'
    }}>
      <button className="btn" style={{marginBottom:12, background:'#26A69A', color:'#fff'}} onClick={onBack}>← Back</button>
      <h2 style={{
        color:'#4FC3F7', fontWeight:800, fontSize:32, marginBottom:8, textAlign:'center'
      }}>Your Surf Stats</h2>
      <div style={{display:'flex', flexWrap:'wrap', gap:26, marginTop:28}}>
        {/* Most Visited Spot */}
        <div style={{
          background:'#26A69A12', borderRadius:9, padding:'12px 22px', flex:1, minWidth:180
        }}>
          <h4 style={{margin:'0 0 8px 0',color:'#01738E'}}>Most Visited Spot</h4>
          {spotsRanked.length
           ? <>
               <div style={{fontWeight:700, fontSize:21, marginTop:3}}>
                 {spotsRanked[0][0]}
               </div>
               <span style={{color:'#26A69A'}}>({spotsRanked[0][1]} sessions)</span>
             </>
           : <span style={{color:'#bdbdbd'}}>No sessions</span>}
        </div>
        {/* Board Usage */}
        <div style={{
          background:'#4FC3F714', borderRadius:9, padding:'12px 21px', flex:1, minWidth:195
        }}>
          <h4 style={{margin:'0 0 8px 0',color:'#01738E'}}>Board Usage (%)</h4>
          {boardsRanked.map(([board, count])=>(
            <div key={board} style={{fontSize:15, margin:'5px 0', display:'flex', alignItems:'center'}}>
              <span role="img" aria-label="board" style={{marginRight:5}}>🛹</span>
              {board}: 
              <div style={{
                background: boardColor(board),
                width: ((count/totalSessions)*60+11)+'px', height:'10px', borderRadius:5, margin:'0 8px'
              }}/>
              <span style={{fontWeight:600}}> {Math.round((count/totalSessions)*100)}%</span>
            </div>
          ))}
        </div>
        {/* Mood Trend */}
        <div style={{
          background:'#4FC3F734', borderRadius:9, padding:'14px 17px', flex:1, minWidth:180
        }}>
          <h4 style={{
            margin:'0 0 8px 0',color:'#01738E'
          }}>Mood Trend</h4>
          <div className="mood-trend-bar" style={{display:'flex',gap:4, alignItems:'flex-end', height: 48}}>
            {moodTrend
              .sort((a,b)=>a.date.localeCompare(b.date))
              .map((m, idx)=> (
              <div key={idx} title={m.date + ": " + m.mood}
                aria-label={m.mood}
                style={{
                  width:10, height:28,
                  background:'#4FC3F7',
                  borderRadius:5,
                  marginBottom: [0,2,5,10].includes(idx%4)?8:2,
                  display: 'flex', alignItems:'center', justifyContent:'center',
                }}>
                <span role="img" aria-label="mood" style={{fontSize:18, verticalAlign:'middle'}}>
                  {getMoodIcon(m.mood)}
                </span>
              </div>
            ))}
          </div>
          <div style={{fontSize:13, color:'#4FC3F7', marginTop:4, textAlign:'right'}}>Oldest &rarr; Newest</div>
        </div>
      </div>
      <div style={{marginTop:32, background:'#4FC3F705', borderRadius:13, padding:17}}>
        <h4 style={{marginBottom:5, color:'#01738E'}}>Mood Statistics:</h4>
        {moodsRanked.length
         ? moodsRanked.map(([mood,count]) =>
            <span key={mood} style={{marginRight:15}}>
              <b>{mood}</b> {getMoodIcon(mood)}: {count}
            </span>)
         : <span style={{color:'#bdbdbd'}}>No sessions logged.</span>}
      </div>
    </div>
  );
}

/*
  WaveLog "Did you surf today?" Reminder Modal
  - 'Later' button high-contrast styling for guaranteed visibility.
  - When 'Later' is pressed, stores dismissal state in sessionStorage,  
    so the reminder doesn't appear again within the same session.
  - Modal logic/JSX is accessible and unobtrusive (not blocking background keyboard).
  - Logic handled in `useReminder()` and reminderOpen state.
*/

// ==== MAIN APP ====
// PUBLIC_INTERFACE
export default function App() {
  /**
   * SurfSync App main component.
   * Handles navigation, state logic, and rendering of screens.
   */
  const [sessions, setSessions] = useState(initialSessions);
  const [view, setView] = useState('list'); // 'list' | 'details' | 'log' | 'edit' | 'dashboard'
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ spot: 'All', board: 'All', mood: 'All' });
  // Reminder modal state, initially checks sessionStorage to sync up
  const [reminderOpen, setReminderOpen] = useState(() => {
    return !sessionStorage.getItem('surfReminderDismissed');
  });

  // Ensure that opening/closing modal also (re)syncs with sessionStorage: truly persistent in-session
  useEffect(() => {
    // Listen for dismissal event (e.g., user hit Later elsewhere or in new tab)
    function storageListener(e) {
      if (e.key === 'surfReminderDismissed') {
        setReminderOpen(!e.newValue ? true : false);
      }
    }
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  // When the modal is opened, re-check sessionStorage in case user cleared session
  useEffect(() => {
    if (!reminderOpen && !sessionStorage.getItem('surfReminderDismissed')) {
      setReminderOpen(true);
    }
  }, []); // on mount only

  // Reminder hook for daily logging
  useReminder(sessions, () => {
    // Modal will display only if not dismissed for this session
    if (!sessionStorage.getItem('surfReminderDismissed')) setReminderOpen(true);
  });

  // Routing logic
  function goHome() {
    setView('list');
    setSelected(null);
  }
  function openSessionDetail(id) {
    setSelected(id);
    setView('details');
  }
  function openLogForm() {
    setView('log');
    setSelected(null);
  }
  function openEditForm() {
    setView('edit');
  }
  function openStats() {
    setView('dashboard');
  }

  // Mutations
  function handleSubmit(newSession) {
    if (view === 'edit') {
      setSessions(sessions => sessions.map(s => s.id === selected ? { ...newSession, id: selected } : s));
      setView('details');
    } else {
      setSessions(sessions => [
        ...sessions,
        { ...newSession, id: Math.max(0, ...sessions.map(s => s.id)) + 1 }
      ]);
      setView('list');
    }
  }
  function handleDelete() {
    setSessions(sessions => sessions.filter(s => s.id !== selected));
    setSelected(null);
    setView('list');
  }
  // For ocean theme background and subtle wave image
  const oceanBG = {
    minHeight:'100vh',
    background: 'linear-gradient(170deg, #4FC3F7 0%, #26A69A 68%, #FFF8E1 100%)',
    backgroundAttachment:'fixed'
  };
  // Compose the main screen based on view
  let mainContent = null;
  if (view === 'list') {
    mainContent = (
      <SessionList
        sessions={sessions}
        onSelect={openSessionDetail}
        filters={filters}
        setFilters={setFilters}
        onAdd={openLogForm}
      />
    );
  } else if (view === 'details') {
    const session = sessions.find(s => s.id === selected);
    mainContent = (
      <SessionDetail
        session={session}
        onBack={goHome}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />
    );
  } else if (view === 'log') {
    mainContent = (
      <LogSessionForm
        onSubmit={handleSubmit}
        onCancel={goHome}
      />
    );
  } else if (view === 'edit') {
    const session = sessions.find(s => s.id === selected);
    mainContent = (
      <LogSessionForm
        initial={session}
        onSubmit={handleSubmit}
        onCancel={goHome}
      />
    );
  } else if (view === 'dashboard') {
    mainContent = (
      <StatsDashboard sessions={sessions} onBack={goHome} />
    );
  }

  return (
    <div className="app" style={oceanBG}>
      <Navbar onGoHome={goHome} onShowStats={openStats} />
      <main>
        <div className="container" style={{paddingTop:80}}>
          {mainContent}
        </div>
      </main>
      {/* Reminder Modal */}
      {reminderOpen && (
        <div
          className="reminder-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: 'rgba(16,24,32,0.26)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div
            style={{
              background: '#FFF8E1',
              borderRadius: 16,
              padding: '34px 38px',
              maxWidth: 365,
              minWidth: 244,
              boxShadow: '0 2px 24px #026b79aa',
              textAlign: 'center',
              border: '2px solid #4FC3F799',
              outline: 'none'
            }}
          >
            <span style={{ fontSize: 47, display: 'block', marginBottom: 14 }}>
              🌊
            </span>
            <div style={{ fontWeight: 800, fontSize: 24, color: '#26A69A', letterSpacing: 0.1, marginBottom: 6 }}>
              Did you surf today?
            </div>
            <div style={{ color: '#01738e', margin: '10px 0 8px 0', fontWeight: 500 }}>
              Don&apos;t forget to log your session!
            </div>
            <div style={{ display: 'flex', flexDirection:'column', gap: 10, justifyContent: 'center', marginTop: 18 }}>
              <button
                className="btn btn-large"
                style={{
                  background: '#26A69A',
                  color: '#fff',
                  fontWeight: 800,
                  border: '2px solid #01896c',
                  boxShadow: '0 1px 7px #26a69a46',
                  minWidth: 120,
                  fontSize: '1.13rem',
                  letterSpacing: '.1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7
                }}
                onClick={() => {
                  setReminderOpen(false);
                  setView('log');
                  sessionStorage.setItem('surfReminderDismissed', '1');
                }}
                autoFocus
                tabIndex={0}
                aria-label="Log your session now"
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    setReminderOpen(false);
                    setView('log');
                    sessionStorage.setItem('surfReminderDismissed', '1');
                  }
                }}
              >
                <span role="img" aria-label="Log">📝</span>
                Log Now
              </button>
              <button
                className="btn btn-large btn-reminder-later"
                onClick={() => {
                  setReminderOpen(false);
                  sessionStorage.setItem('surfReminderDismissed', '1');
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    setReminderOpen(false);
                    sessionStorage.setItem('surfReminderDismissed', '1');
                  }
                }}
                tabIndex={0}
                aria-label="Later (dismiss reminder popup)"
              >
                <span role="img" aria-label="Clock">⏰</span>
                Later
              </button>
              <span style={{
                marginTop: 6,
                color: '#01738eaa',
                fontSize: '0.96em',
                fontWeight: 500
              }}>
                (You can always log a session later from the home screen.)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
