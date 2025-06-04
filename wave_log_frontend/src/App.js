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

/**
 * Ensures PUBLIC_URL assets for backgrounds exist and provides robust fallback for backgrounds.
 * Forces update if missing to avoid broken hero/background.
 */
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

/**
 * PUBLIC_INTERFACE
 * SessionCard
 * Always includes a surf-overlay-gradient for robust readability.
 */
function SessionCard({ session, onClick }) {
  return (
    <div
      className="session-card"
      style={{
        position: 'relative',
        marginBottom: 16,
        borderRadius: 15,
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: 98,
        background: 'none',
        boxShadow: '0 2.5px 13px #002E4E23, 0 2.5px 18px #26a69a19',
        borderLeft: `7px solid #26A69A`,
        transition: 'transform .07s',
        display: 'flex',
        flexDirection: 'column'
      }}
      tabIndex={0}
      onClick={onClick}
      onKeyPress={e => { if (e.key === 'Enter') onClick(); }}
    >
      {/* Overlay for strong text contrast */}
      <div className="surf-overlay-gradient strong" aria-hidden="true" />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 18
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontWeight: 800,
                color: '#fff',
                textShadow:
                  '0 4px 18px #012957bf, 0 1.5px 3.5px #fff, 0 1.5px 11px #01759e',
                fontSize: 20,
                letterSpacing: '.07em'
              }}
            >
              {session.spot}
            </div>
            <div
              style={{
                fontSize: 15,
                color: '#bbf3fa',
                textShadow: '0 1.2px 7px #013e5b7d'
              }}
            >
              {session.date}
            </div>
          </div>
          <div
            style={{
              fontSize: 32,
              marginRight: 10,
              userSelect: 'none',
              filter: 'drop-shadow(0 4px 7px #01767edc)'
            }}
          >
            {getMoodIcon(session.mood)}
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid #37d5fa23',
            padding: '10px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#fffde9',
            textShadow: '0 2px 8px #01446a95, 0 0.5px 2px #01c7e699',
            fontWeight: 600,
            fontSize: 17
          }}
        >
          <div>
            <span role="img" aria-label="board">🛹</span> {session.board}
          </div>
          <div>
            <span role="img" aria-label="waves">🌊</span> {session.waveCount} waves
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * SessionDetail
 * Adds a blurred gradient overlay and improved color/shadow contrast for legibility over any backgrounds.
 */
function SessionDetail({ session, onBack, onEdit, onDelete }) {
  if (!session) return null;
  return (
    <div
      className="session-detail-card"
      style={{
        position: 'relative',
        background: 'none',
        borderRadius: 18,
        margin: '50px auto 26px auto',
        boxShadow: '0 4px 36px #00778c28, 0 2.5px 7px #26a69a25',
        maxWidth: 570,
        overflow: 'hidden'
      }}
    >
      <div className="surf-overlay-gradient strong" aria-hidden="true" />
      <div style={{ position: 'relative', zIndex: 2, padding: 38 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn"
            style={{
              background: 'linear-gradient(90deg, #26A69A 60%, #4FC3F7 110%)',
              color: '#fff', fontWeight: 700, textShadow: '0 1px 5px #01486b',
              border: 'none'
            }}
            onClick={onBack}
          >← Back</button>
          <div style={{
            fontSize: 29,
            fontWeight: 800,
            color: '#fff',
            marginLeft: 8,
            textShadow: '0 2.5px 11px #017f8990, 0 1px 1px #013857, 0 .5px 0 #fff'
          }}>
            &nbsp;Session Details
          </div>
        </div>
        <hr style={{ margin: '18px 0 14px 0', borderTop: '2.5px solid #4FC3F7bb' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 11 }}>
          <span style={{
            fontSize: 41, marginRight: 18,
            filter: 'drop-shadow(0 2.2px 8px #21d6f8bd)'
          }}>{getMoodIcon(session.mood)}</span>
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: 21,
              color: '#fff',
              textShadow: '0 2px 7px #01616a7a, 0 1px 2px #fff'
            }}>
              {session.spot}
              <span style={{
                color: '#a8feff',
                fontSize: 16,
                marginLeft: 6,
                textShadow: '0 1px 7px #29adc894'
              }}>
                &bull; {session.date}
              </span>
            </div>
            <div style={{
              fontSize: 15,
              color: '#6ef7eb',
              textShadow: '0 1.2px 7px #0996cf6e'
            }}>{session.board}</div>
          </div>
        </div>
        <div style={{
          margin: '16px 0',
          color: '#fff',
          fontWeight: 600,
          textShadow: '0 1.5px 8px #09b7f89c, 0 1px 1px #fff'
        }}>
          <b>Waves ridden:</b> <span>{session.waveCount}</span>
        </div>
        <div style={{
          margin: '6px 0',
          color: '#fff',
          fontWeight: 600,
          textShadow: '0 1.5px 8px #09b7f89c, 0 1px 1px #fff'
        }}>
          <b>Conditions:</b> <span>{session.swellSize}ft swell, {session.wind}, {session.tide} tide</span>
        </div>
        <div style={{
          margin: '8px 0',
          fontWeight: 700,
          color: '#0af7c7',
          background: 'linear-gradient(92deg, #026bceea 30%, #24b0caaa 90%)',
          borderRadius: 10,
          padding: '4.7px 17px',
          display: 'inline-block',
          fontSize: 17,
          boxShadow: '0 1.5px 8px #00afc5'
        }}>
          Mood: {session.mood} {getMoodIcon(session.mood)}
        </div>
        <div style={{
          margin: '19px 0',
          background: 'linear-gradient(102deg, #fffde199 60%, #e1f7faf1 100%)',
          padding: 15,
          borderRadius: 12,
          color: '#013957',
          textShadow: '0 1.2px 7px #26e4f45d'
        }}>
          <b>Notes:</b>
          <div style={{ marginTop: 5, color: '#01547a' }}>{session.notes}</div>
        </div>
        <div style={{ marginTop: 21, display: 'flex', gap: 15 }}>
          <button className="btn"
            style={{
              background: 'linear-gradient(90deg, #26A69A 50%, #4FC3F7 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              boxShadow: '0 2px 11px #01597c5a'
            }}
            onClick={onEdit}
          >Edit</button>
          <button className="btn"
            style={{
              background: '#fff',
              color: '#e53935',
              border: '1.6px solid #e53936bb',
              fontWeight: 700,
              boxShadow: '0 1.5px 7px #00000010'
            }}
            onClick={() => {
              if (window.confirm('Delete this session?')) onDelete();
            }}>Delete
          </button>
        </div>
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
      maxWidth: 410,
      margin: '50px auto',
      borderRadius: 16,
      boxShadow: '0 4px 32px #01738e2c',
      padding: '34px 38px 28px 38px',
      position: 'relative',
      background: 'none',
      overflow: 'hidden'
    }}
      onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      {/* Overlay for always-readable content */}
      <div className="surf-overlay-gradient dark" aria-hidden="true" />
      <h2 style={{
        textAlign: 'center',
        color: '#fff',
        marginBottom: 18,
        fontSize: '1.45rem',
        fontWeight: 900,
        letterSpacing: '0.04em',
        textShadow: '0 4px 18px #1c57a985, 0 2px 3px #fff'
      }}>
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

/**
 * PUBLIC_INTERFACE
 * StatsDashboard
 * Adds extra overlays to dashboard panels for clarity if ever placed on strong backgrounds/images,
 * and boosts contrast of text/headings and data.
 */
function StatsDashboard({ sessions, onBack }) {
  const spotCounts = {};
  const boardCounts = {};
  const moodCounts = {};
  const moodTrend = [];
  sessions.forEach(s => {
    spotCounts[s.spot] = (spotCounts[s.spot] || 0) + 1;
    boardCounts[s.board] = (boardCounts[s.board] || 0) + 1;
    moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
    moodTrend.push({ date: s.date, mood: s.mood });
  });
  const spotsRanked = Object.entries(spotCounts).sort((a, b) => b[1] - a[1]);
  const boardsRanked = Object.entries(boardCounts).sort((a, b) => b[1] - a[1]);
  const moodsRanked = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const totalSessions = sessions.length;

  function boardColor(board) {
    const idx = BOARDS.indexOf(board);
    return ['#4FC3F7', '#26A69A', '#039be5', '#B2EBF2', '#00838f'][idx % 5];
  }

  return (
    <div style={{
      maxWidth: 690,
      margin: '80px auto 0 auto',
      borderRadius: 20,
      position: 'relative',
      boxShadow: '0 6px 34px #01738e1f, 0 6px 33px #01517e17, 0 1.5px 9px #26a69a25',
      overflow: 'hidden',
      background: 'none'
    }}>
      {/* Extra overlay for stat cards */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(118deg,#012b4577 10%, #028ca777 94%, #f8e1 100%)',
          opacity: 0.85,
          zIndex: 1,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
      <div style={{ position: 'relative', zIndex: 2, padding: '32px 30px 28px 30px' }}>
        <button className="btn"
          style={{
            marginBottom: 14,
            background: 'linear-gradient(90deg, #26A69A 74%, #4FC3F7 100%)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            textShadow: '0 1px 5px #044c6b'
          }}
          onClick={onBack}>← Back
        </button>
        <h2 style={{
          color: '#fff',
          fontWeight: 900,
          fontSize: 34,
          marginBottom: 8,
          textAlign: 'center',
          letterSpacing: '.02em',
          textShadow: '0 3.5px 21px #017f899d, 0 1.5px 1.5px #fff'
        }}>Your Surf Stats</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 26, marginTop: 28 }}>
          {/* Most Visited Spot */}
          <div style={{
            background: 'rgba(38,166,154,0.22)',
            borderRadius: 12,
            padding: '13px 25px',
            flex: 1,
            minWidth: 185,
            color: '#fff',
            boxShadow: '0 1px 7px #01738e13',
            textShadow: '0 1.5px 7px #0996cf6a'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#a6f4fb', textShadow: '0 1px 7px #18f7fd6e' }}>
              Most Visited Spot
            </h4>
            {spotsRanked.length
              ? <>
                <div style={{ fontWeight: 900, fontSize: 23, marginTop: 3, color: '#fff' }}>
                  {spotsRanked[0][0]}
                </div>
                <span style={{ color: '#7efefe', fontWeight: 600 }}>
                  ({spotsRanked[0][1]} sessions)
                </span>
              </>
              : <span style={{ color: '#fff9' }}>No sessions</span>}
          </div>
          {/* Board Usage */}
          <div style={{
            background: 'rgba(79,195,247,0.25)',
            borderRadius: 12,
            padding: '13px 25px',
            flex: 1,
            minWidth: 200,
            color: '#fff',
            boxShadow: '0 1.5px 8px #4fc3f720',
            textShadow: '0 1.5px 7px #0996cf6e'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#cffcff', textShadow: '0 1px 7px #4fc6cf7e' }}>
              Board Usage (%)
            </h4>
            {boardsRanked.map(([board, count]) => (
              <div key={board} style={{ fontSize: 15, margin: '5px 0', display: 'flex', alignItems: 'center' }}>
                <span role="img" aria-label="board" style={{ marginRight: 5 }}>🛹</span>
                {board}:
                <div style={{
                  background: boardColor(board),
                  width: `${(count / totalSessions) * 60 + 11}px`,
                  height: '10px',
                  borderRadius: 5,
                  margin: '0 8px'
                }} />
                <span style={{ fontWeight: 700, color: '#fff', textShadow: '0 1.5px 6px #0177eb6d' }}>
                  {' '}{Math.round((count / totalSessions) * 100)}%
                </span>
              </div>
            ))}
          </div>
          {/* Mood Trend */}
          <div style={{
            background: 'rgba(79,195,247,0.34)',
            borderRadius: 12,
            padding: '15px 16px',
            flex: 1,
            minWidth: 185,
            color: '#fff',
            boxShadow: '0 1.5px 8px #4fc3f722',
            textShadow: '0 1.5px 6px #0996cf6d'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#fff', textShadow: '0 1px 7px #26e4f4c4' }}>
              Mood Trend
            </h4>
            <div className="mood-trend-bar" style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 48 }}>
              {moodTrend
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((m, idx) => (
                  <div key={idx} title={m.date + ": " + m.mood}
                    aria-label={m.mood}
                    style={{
                      width: 10, height: 28,
                      background: '#4FC3F7',
                      borderRadius: 5,
                      marginBottom: [0, 2, 5, 10].includes(idx % 4) ? 9 : 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      filter: 'drop-shadow(0 1px 7px #017c7e48)'
                    }}>
                    <span role="img" aria-label="mood" style={{ fontSize: 18, verticalAlign: 'middle', filter: 'drop-shadow(0 2px 6px #25a3e766)' }}>
                      {getMoodIcon(m.mood)}
                    </span>
                  </div>
                ))}
            </div>
            <div style={{ fontSize: 13, color: '#adecf9', marginTop: 4, textAlign: 'right' }}>Oldest &rarr; Newest</div>
          </div>
        </div>
        <div style={{
          marginTop: 35,
          background: 'rgba(79,195,247,0.11)',
          borderRadius: 15,
          padding: 18,
          color: '#fff',
          fontWeight: 700,
          textShadow: '0 1.5px 8px #14badf79'
        }}>
          <h4 style={{ marginBottom: 7, color: '#c4fff2', textShadow: '0 1px 9px #19eafac8' }}>Mood Statistics:</h4>
          {moodsRanked.length
            ? moodsRanked.map(([mood, count]) =>
              <span key={mood} style={{ marginRight: 18 }}>
                <b>{mood}</b> {getMoodIcon(mood)}: {count}
              </span>
            )
            : <span style={{ color: '#fff9' }}>No sessions logged.</span>}
        </div>
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
  // Moved complex backgrounds to inline style in the hero/above main content.

  // --- HERO/HEADER: Robust PUBLIC_URL asset for ocean-hero background ---
  // Use process.env.PUBLIC_URL and guarantee fallback gradient if asset is missing.
  const heroImageUrl = process.env.PUBLIC_URL + '/assets/ocean-hero.jpg';

  // True asset existence checking for best experience (avoids broken images)
  const [oceanImgExists, setOceanImgExists] = useState(true);
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setOceanImgExists(true);
    img.onerror = () => setOceanImgExists(false);
    img.src = heroImageUrl;
  }, [heroImageUrl]);

  // Compose hero/hero background style – always try to use ocean image then overlay for text readability.
  const oceanHeroBG = useMemo(() => {
    if (oceanImgExists) {
      return {
        minHeight: '260px',
        width: '100%',
        backgroundImage:
          `linear-gradient(120deg, #002640bb 9%, #016b7fa0 68%, #26A69Aa2 100%), url("${heroImageUrl}")`,
        backgroundSize: 'cover, cover',
        backgroundBlendMode: 'overlay',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#01748C',
        boxShadow: '0 4px 22px #02748933, 0 0.5px 2px #01657144'
      };
    } else {
      return {
        minHeight: '260px',
        width: '100%',
        backgroundImage: 'linear-gradient(120deg, #0074ba 18%, #016b7fcc 64%, #26A69Ad7 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#01748C',
        boxShadow: '0 4px 22px #02748933, 0 0.5px 2px #01657144'
      };
    }
  }, [heroImageUrl, oceanImgExists]);


  // Session/main section background – force use of PUBLIC_URL for background pattern asset, fallback to pure gradient if missing.
  const sectionBgUrl = process.env.PUBLIC_URL + '/assets/ocean-bg-pattern.png';
  const [sectionImgExists, setSectionImgExists] = useState(true);
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setSectionImgExists(true);
    img.onerror = () => setSectionImgExists(false);
    img.src = sectionBgUrl;
  }, [sectionBgUrl]);

  // Compose the main screen based on view
  let mainContent = null;

  if (view === 'list') {
    mainContent = (
      <div
        style={{
          position: 'relative',
          minHeight: 320,
          backgroundImage: sectionImgExists
            ? `linear-gradient(120deg, #003957be 5%, #026b79b8 69%, #22bac799 97%), url("${sectionBgUrl}")`
            : 'linear-gradient(170deg, #4FC3F7 0%, #26A69A 70%, #FFF8E1 100%)',
          backgroundSize: sectionImgExists ? 'cover, cover' : 'cover',
          backgroundPosition: sectionImgExists ? 'center top, center' : 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: 19,
          boxShadow: '0 2px 32px #02768a25',
          marginBottom: 16,
          overflow: 'hidden'
        }}
        aria-label={sectionImgExists ? 'waves background section' : undefined}
      >
        {/* Strong enough dark overlay for all backgrounds for text visibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: sectionImgExists
              ? 'linear-gradient(120deg, #012b4588 10%, #0177bb77 59%, #fff0 100%)'
              : 'linear-gradient(120deg, #003957be 10%, #026b7988 79%, #1ca8bb20 100%)',
            zIndex: 1,
            borderRadius: 19,
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <SessionList
            sessions={sessions}
            onSelect={openSessionDetail}
            filters={filters}
            setFilters={setFilters}
            onAdd={openLogForm}
          />
        </div>
      </div>
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
    <div className="app">
      <div className="surf-hero-bg" style={oceanHeroBG}>
        {/* Color overlay for contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(122deg, #01367e88 18%, #15777ecc 90%, #fff0 100%)",
            opacity: oceanImgExists ? 0.74 : 0.86,
            pointerEvents: "none"
          }}
          aria-hidden="true"
        />
        <div className="surf-hero-content" style={{
          zIndex: 2,
          color: "#fff",
          textShadow:
            "0 4px 22px #034d5fcc, 0 2px 7px #016571c8, 0 1px 1px #013857ba"
        }}>
          <span className="surf-icon-circle"
            style={{
              boxShadow: "0 1.5px 8px #02768a5c",
              border: "3px solid #fffdddaa"
            }}>🌊</span>
          <span className="surf-title-glow"
            style={{
              fontSize: "2.15rem",
              fontWeight: 900,
              letterSpacing: ".04em",
              color: "#fff",
              textShadow:
                "0 8px 40px #027f8932, 0 2.5px 3px #003758a8, 0 1px 1px #fff"
            }}
          >
            Welcome to SurfSync
          </span>
          <div
            style={{
              fontSize: "1.18rem",
              color: "#fffde8",
              marginTop: 10,
              fontWeight: 500,
              textShadow: "0 2.2px 9.5px #025c779d, 0 1px 2px #01456e91"
            }}
          >
            Your private surf session log and ocean-inspired dashboard
          </div>
        </div>
      </div>
      <Navbar onGoHome={goHome} onShowStats={openStats} />
      <main>
        <div className="container" style={{paddingTop:40}}>
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
