import { useState } from 'react';
import { useStore } from '../store';
import type { Step, OutputState, Transition } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const OUTPUT_STATES: OutputState[] = ['run', 'stop', 'open', 'closed', 'LOOP1', '-LOOP1', 'LOOP2', 'on', 'off', ''];
const STATE_COLORS: Record<string, string> = {
  run: 'bg-green-700 text-green-100',
  stop: 'bg-red-900 text-red-200',
  open: 'bg-blue-700 text-blue-100',
  closed: 'bg-slate-600 text-slate-300',
  LOOP1: 'bg-purple-700 text-purple-100',
  '-LOOP1': 'bg-orange-700 text-orange-100',
  LOOP2: 'bg-indigo-700 text-indigo-100',
  on: 'bg-green-700 text-green-100',
  off: 'bg-red-900 text-red-200',
  '': 'bg-slate-800 text-slate-500',
};
const STEP_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'];

function emptyStep(existingNumbers: number[]): Step {
  const maxNum = existingNumbers.length ? Math.max(...existingNumbers) : 0;
  const nextNum = Math.ceil((maxNum + 1) / 10) * 10;
  return {
    number: nextNum, name: 'New Step', description: '',
    activeOutputs: {}, transitions: [], color: '#22c55e',
  };
}

function StepCard({ step }: { step: Step }) {
  const { outputs, updateStep, deleteStep } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(step.name);
  const [descVal, setDescVal] = useState(step.description);

  function setOutputState(address: string, state: OutputState) {
    const ao = { ...step.activeOutputs };
    if (state === '') delete ao[address];
    else ao[address] = state;
    updateStep(step.number, { activeOutputs: ao });
  }

  function addTransition() {
    const t: Transition = { id: `t${Date.now()}`, toStep: 0, condition: '' };
    updateStep(step.number, { transitions: [...step.transitions, t] });
  }

  function updateTransition(id: string, field: keyof Transition, value: string | number) {
    updateStep(step.number, {
      transitions: step.transitions.map((t) => t.id === id ? { ...t, [field]: value } : t),
    });
  }

  function deleteTransition(id: string) {
    updateStep(step.number, { transitions: step.transitions.filter((t) => t.id !== id) });
  }

  const activeCount = Object.keys(step.activeOutputs).length;

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-700/40"
        style={{ borderLeft: `4px solid ${step.color ?? '#6b7280'}` }}
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-mono text-lg font-bold text-slate-400 min-w-[60px]">
            S{step.number}
          </span>
          {editName ? (
            <input value={nameVal} onChange={(e) => setNameVal(e.target.value)}
              onBlur={() => { updateStep(step.number, { name: nameVal, description: descVal }); setEditName(false); }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-700 text-white rounded px-2 py-0.5 text-sm flex-1" autoFocus />
          ) : (
            <span className="font-semibold text-white" onDoubleClick={(e) => { e.stopPropagation(); setEditName(true); }}>
              {step.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="text-slate-400">{activeCount} outputs active</span>
          <span>{step.transitions.length} transitions</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); deleteStep(step.number); }}
          className="text-slate-600 hover:text-red-400 ml-2"><Trash2 size={14} /></button>
        {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-slate-800/50 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <input value={descVal} onChange={(e) => setDescVal(e.target.value)}
              onBlur={() => updateStep(step.number, { description: descVal })}
              placeholder="Step description..."
              className="w-full bg-slate-700 text-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-500 uppercase tracking-wide">Step Color</label>
            </div>
            <div className="flex gap-2">
              {STEP_COLORS.map((c) => (
                <button key={c} onClick={() => updateStep(step.number, { color: c })}
                  style={{ background: c }}
                  className={`w-6 h-6 rounded-full border-2 ${step.color === c ? 'border-white' : 'border-transparent'}`} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Active Outputs</label>
            <div className="grid grid-cols-2 gap-1.5">
              {outputs.map((output) => {
                const state = step.activeOutputs[output.address] ?? '';
                return (
                  <div key={output.id} className="flex items-center gap-2 bg-slate-800 rounded px-2 py-1.5">
                    <span className="font-mono text-xs text-yellow-400 min-w-[40px]">{output.tag}</span>
                    <span className="text-xs text-slate-400 flex-1 truncate">{output.description}</span>
                    <select value={state} onChange={(e) => setOutputState(output.address, e.target.value as OutputState)}
                      className={`text-xs rounded px-1 py-0.5 border-0 outline-none cursor-pointer ${STATE_COLORS[state] || STATE_COLORS['']}`}>
                      {OUTPUT_STATES.map((s) => (
                        <option key={s} value={s} className="bg-slate-800 text-white">{s || '—'}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-slate-500 uppercase tracking-wide">Transitions</label>
              <button onClick={addTransition}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {step.transitions.map((t) => (
                <div key={t.id} className="flex items-center gap-2 bg-slate-800 rounded px-3 py-2">
                  <ArrowRight size={14} className="text-green-500 flex-shrink-0" />
                  <span className="text-xs text-slate-500 flex-shrink-0">Step</span>
                  <input type="number" value={t.toStep}
                    onChange={(e) => updateTransition(t.id, 'toStep', parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-700 text-yellow-400 font-mono rounded px-2 py-1 text-xs outline-none" />
                  <span className="text-xs text-slate-500 flex-shrink-0">IF</span>
                  <input value={t.condition} onChange={(e) => updateTransition(t.id, 'condition', e.target.value)}
                    placeholder="condition..."
                    className="flex-1 bg-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                  <button onClick={() => deleteTransition(t.id)}
                    className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              ))}
              {step.transitions.length === 0 && (
                <p className="text-xs text-slate-600 italic">No transitions defined</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function StepEditor() {
  const { steps, addStep } = useStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-400">{steps.length} steps defined</div>
        <button onClick={() => addStep(emptyStep(steps.map((s) => s.number)))}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm">
          <Plus size={14} /> Add Step
        </button>
      </div>
      <div className="overflow-auto flex-1 space-y-2 pr-1">
        {steps.map((step) => <StepCard key={step.number} step={step} />)}
      </div>
    </div>
  );
}
