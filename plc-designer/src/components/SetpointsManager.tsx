import { useStore } from '../store';
import type { Setpoint, Timer, Alarm, Interlock } from '../types';
import { Plus, Trash2 } from 'lucide-react';

function genId() { return `id_${Date.now()}`; }

function SetpointsTable() {
  const { setpoints, addSetpoint, updateSetpoint, deleteSetpoint } = useStore();
  const empty = (): Setpoint => ({ id: genId(), tag: `SP0${setpoints.length + 1}`, value: 0, unit: 'bar', pv: '', description: '', usedInSteps: [] });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300">Setpoints</h3>
        <button onClick={() => addSetpoint(empty())}
          className="flex items-center gap-1 text-xs bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded">
          <Plus size={12} /> Add
        </button>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-slate-800 text-slate-400">
          <tr>{['Tag', 'Value', 'Unit', 'PV', 'Description', 'Steps', ''].map((h) => (
            <th key={h} className="px-2 py-1.5 text-left">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {setpoints.map((sp) => (
            <tr key={sp.id} className="border-t border-slate-700 hover:bg-slate-800/50">
              <td className="px-2 py-1.5">
                <input value={sp.tag} onChange={(e) => updateSetpoint(sp.id, { tag: e.target.value })}
                  className="bg-transparent text-cyan-400 font-mono w-16 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input type="number" value={sp.value} onChange={(e) => updateSetpoint(sp.id, { value: parseFloat(e.target.value) || 0 })}
                  className="bg-transparent text-yellow-400 font-mono w-16 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={sp.unit} onChange={(e) => updateSetpoint(sp.id, { unit: e.target.value })}
                  className="bg-transparent text-slate-300 w-16 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={sp.pv} onChange={(e) => updateSetpoint(sp.id, { pv: e.target.value })}
                  className="bg-transparent text-slate-300 w-28 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={sp.description} onChange={(e) => updateSetpoint(sp.id, { description: e.target.value })}
                  className="bg-transparent text-slate-400 w-full outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5 text-slate-500">{sp.usedInSteps.join(', ')}</td>
              <td className="px-2 py-1.5">
                <button onClick={() => deleteSetpoint(sp.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimersTable() {
  const { timers, addTimer, updateTimer, deleteTimer } = useStore();
  const empty = (): Timer => ({ id: genId(), tag: `T${timers.length + 1}`, duration: 60, unit: 'sec', description: '', usedInSteps: [] });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300">Timers</h3>
        <button onClick={() => addTimer(empty())}
          className="flex items-center gap-1 text-xs bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded">
          <Plus size={12} /> Add
        </button>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-slate-800 text-slate-400">
          <tr>{['Tag', 'Duration', 'Unit', 'Description', 'Steps', ''].map((h) => (
            <th key={h} className="px-2 py-1.5 text-left">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {timers.map((t) => (
            <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-800/50">
              <td className="px-2 py-1.5">
                <input value={t.tag} onChange={(e) => updateTimer(t.id, { tag: e.target.value })}
                  className="bg-transparent text-cyan-400 font-mono w-12 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input type="number" value={t.duration} onChange={(e) => updateTimer(t.id, { duration: parseInt(e.target.value) || 0 })}
                  className="bg-transparent text-yellow-400 font-mono w-16 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <select value={t.unit} onChange={(e) => updateTimer(t.id, { unit: e.target.value as 'sec' | 'min' })}
                  className="bg-slate-800 text-slate-300 rounded px-1 py-0.5 outline-none">
                  <option value="sec">sec</option>
                  <option value="min">min</option>
                </select>
              </td>
              <td className="px-2 py-1.5">
                <input value={t.description} onChange={(e) => updateTimer(t.id, { description: e.target.value })}
                  className="bg-transparent text-slate-400 w-full outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5 text-slate-500">{t.usedInSteps.join(', ')}</td>
              <td className="px-2 py-1.5">
                <button onClick={() => deleteTimer(t.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlarmsTable() {
  const { alarms, addAlarm, updateAlarm, deleteAlarm } = useStore();
  const empty = (): Alarm => ({ id: genId(), tag: `AL${alarms.length + 1}`, transmitter: '', levels: '', action: '', description: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300">Alarms</h3>
        <button onClick={() => addAlarm(empty())}
          className="flex items-center gap-1 text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded">
          <Plus size={12} /> Add
        </button>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-slate-800 text-slate-400">
          <tr>{['Tag', 'Transmitter', 'Levels', 'Action', 'Description', ''].map((h) => (
            <th key={h} className="px-2 py-1.5 text-left">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {alarms.map((a) => (
            <tr key={a.id} className="border-t border-slate-700 hover:bg-slate-800/50">
              <td className="px-2 py-1.5">
                <input value={a.tag} onChange={(e) => updateAlarm(a.id, { tag: e.target.value })}
                  className="bg-transparent text-red-400 font-mono w-12 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={a.transmitter} onChange={(e) => updateAlarm(a.id, { transmitter: e.target.value })}
                  className="bg-transparent text-slate-300 w-28 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={a.levels} onChange={(e) => updateAlarm(a.id, { levels: e.target.value })}
                  className="bg-transparent text-orange-400 font-mono w-24 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={a.action} onChange={(e) => updateAlarm(a.id, { action: e.target.value })}
                  className="bg-transparent text-slate-300 w-28 outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <input value={a.description} onChange={(e) => updateAlarm(a.id, { description: e.target.value })}
                  className="bg-transparent text-slate-400 w-full outline-none focus:bg-slate-700 rounded px-1" />
              </td>
              <td className="px-2 py-1.5">
                <button onClick={() => deleteAlarm(a.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InterlocksTable() {
  const { interlocks, addInterlock, updateInterlock, deleteInterlock } = useStore();
  const empty = (): Interlock => ({ id: genId(), equipment: '', condition1: '', condition2: '', timer: '', alarm: '' });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-300">Interlocks</h3>
        <button onClick={() => addInterlock(empty())}
          className="flex items-center gap-1 text-xs bg-purple-800 hover:bg-purple-700 text-white px-2 py-1 rounded">
          <Plus size={12} /> Add
        </button>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-slate-800 text-slate-400">
          <tr>{['Equipment', 'Condition 1', 'Condition 2', 'Timer', 'Alarm', ''].map((h) => (
            <th key={h} className="px-2 py-1.5 text-left">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {interlocks.map((il) => (
            <tr key={il.id} className="border-t border-slate-700 hover:bg-slate-800/50">
              {(['equipment', 'condition1', 'condition2', 'timer', 'alarm'] as const).map((field) => (
                <td key={field} className="px-2 py-1.5">
                  <input value={il[field] ?? ''} onChange={(e) => updateInterlock(il.id, { [field]: e.target.value })}
                    className="bg-transparent text-slate-300 w-full outline-none focus:bg-slate-700 rounded px-1" />
                </td>
              ))}
              <td className="px-2 py-1.5">
                <button onClick={() => deleteInterlock(il.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
              </td>
            </tr>
          ))}
          {interlocks.length === 0 && (
            <tr><td colSpan={6} className="px-3 py-3 text-slate-600 italic">No interlocks defined</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function SetpointsManager() {
  return (
    <div className="h-full overflow-auto space-y-8">
      <SetpointsTable />
      <TimersTable />
      <AlarmsTable />
      <InterlocksTable />
    </div>
  );
}
