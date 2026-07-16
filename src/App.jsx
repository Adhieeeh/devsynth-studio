import React, { useState, useRef } from 'react';


const NOTE_BANK = [
  { note: 'C4', label: 'C', freq: 261.63 },
  { note: 'D4', label: 'D', freq: 293.66 },
  { note: 'E4', label: 'E', freq: 329.63 },
  { note: 'F4', label: 'F', freq: 349.23 },
  { note: 'G4', label: 'G', freq: 392.00 },
  { note: 'A4', label: 'A', freq: 440.00 },
  { note: 'B4', label: 'B', freq: 493.88 },
  { note: 'C5', label: 'C+', freq: 523.25 }
];

function App() {
 
  const [oscillatorType, setOscillatorType] = useState('sine'); // sine, square, sawtooth, triangle
  const [cutoffFrequency, setCutoffFrequency] = useState(2000); // Lowpass filter threshold
  const [attackTime, setAttackTime] = useState(0.1); // ADSR Parameters
  const [releaseTime, setReleaseTime] = useState(0.4);
  const [studioLogs, setStudioLogs] = useState([' Web Audio context baseline compiled. Audio core engine standing by...']);

  
  const audioCtxRef = useRef(null);

  const initAudioEngine = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };


  const handleTriggerNote = (frequency, noteName) => {
    try {
      initAudioEngine();
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

     
      const oscillator = ctx.createOscillator();
      oscillator.type = oscillatorType;
      oscillator.frequency.value = frequency;

      
      const lowpassFilter = ctx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.value = cutoffFrequency;

      
      const gainNode = ctx.createGain();
      
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.6, now + attackTime);
      
     
      gainNode.gain.setValueAtTime(0.6, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + releaseTime);

     
      oscillator.connect(lowpassFilter);
      lowpassFilter.connect(gainNode);
      gainNode.connect(ctx.destination);

     
      oscillator.start(now);
      oscillator.stop(now + attackTime + releaseTime);

      setStudioLogs(prev => [
        `🎵 OSCILLATOR TRIGGER: Emitted [${oscillatorType.toUpperCase()}] wave at ${frequency} Hz (${noteName})`,
        ...prev.slice(0, 7)
      ]);
    } catch (err) {
      setStudioLogs(prev => [` AUDIO CRASH: Thread failed compilation: ${err.message}`, ...prev]);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', fontFamily: 'monospace', backgroundColor: '#070a13', color: '#f8fafc', minHeight: '90vh' }}>
      
     
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '25px', marginBottom: '35px', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#f43f5e', letterSpacing: '-0.5px' }}> DevSynth Binary DAW Studio</h1>
          <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: '12px' }}>A low-level synthesis workbench generating custom sound waves via the native HTML5 Web Audio API.</p>
        </div>
      </header>

    
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        
      
        <section style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#475569', textTransform: 'uppercase', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>Synthesizer Control Core</h3>

        
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '8px' }}>Geometric Oscillator Waveform</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {['sine', 'square', 'sawtooth', 'triangle'].map(type => (
                <button
                  key={type}
                  onClick={() => setOscillatorType(type)}
                  style={{ border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: oscillatorType === type ? '#f43f5e' : '#070a13', color: oscillatorType === type ? '#070a13' : '#94a3b8', border: '1px solid #1e293b', transition: '0.15s' }}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

        
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '8px' }}>Lowpass Filter Cutoff ({cutoffFrequency} Hz)</label>
            <input type="range" min="200" max="5000" step="50" value={cutoffFrequency} onChange={(e) => setCutoffFrequency(Number(e.target.value))} style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }} />
          </div>

         
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px' }}>Attack Time ({attackTime}s)</label>
              <input type="range" min="0.01" max="0.5" step="0.05" value={attackTime} onChange={(e) => setAttackTime(Number(e.target.value))} style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }} />
            </div>
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '6px' }}>Release Decay ({releaseTime}s)</label>
              <input type="range" min="0.1" max="1.5" step="0.1" value={releaseTime} onChange={(e) => setReleaseTime(Number(e.target.value))} style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ padding: '12px 14px', backgroundColor: '#070a13', borderLeft: '4px solid #f43f5e', borderRadius: '0 8px 8px 0', fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
            <strong>Low-Level Architecture Note:</strong> This pipeline routes digital sound vectors manually into dynamic hardware channels by mapping envelope nodes to time signatures.
          </div>
        </section>

       
        <section style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '13px', color: '#475569', textTransform: 'uppercase', margin: '0 0 15px 0' }}>Polyphonic Trigger Array Canvas</h3>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
              {NOTE_BANK.map(item => (
                <button
                  key={item.note}
                  onClick={() => handleTriggerNote(item.freq, item.note)}
                  style={{ flex: '1', minWidth: '45px', height: '120px', backgroundColor: '#f8fafc', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', alignItems: 'center', fontWeight: 'bold', transition: 'transform 0.1s, background-color 0.1s' }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{item.note}</span>
                  <span style={{ fontSize: '16px' }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '14px', flexGrow: '1' }}>
            <h3 style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Audio Stream Thread Logs</h3>
            <div style={{ backgroundColor: '#070a13', borderRadius: '10px', padding: '15px', height: '110px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #1e293b' }}>
              {studioLogs.map((log, index) => (
                <div key={index} style={{ fontSize: '11px', color: log.startsWith('❌') ? '#f43f5e' : log.startsWith('🎵') ? '#34d399' : '#475569' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}

export default App;