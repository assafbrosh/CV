import { useState } from 'react';
import { useStore } from '../store';
import type { IOInput, IOOutput } from '../types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const emptyInput = (): IOInput => ({
  id: `X_${Date.now()}`, tag: '', description: '', type: 'DI', address: '', range: '', terminal: '', signalType: '',
});
const emptyOutput = (): IOOutput => ({
  id: `Y_${Date.now()}`, tag: '', description: '', type: 'DO', address: '', power: '', relay: '', breaker: '', deviceType: '',
});

function InputRow({ input, onUpdate, onDelete }: { input: IOInput; onUpdate: (v: Partial<IOInput>) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(input);

  function save() { onUpdate(draft); setEditing(false); }
  function cancel() { setDraft(input); setEditing(false); }

  if (editing) {
    return (
      <tr className="bg-slate-700">
        {['tag', 'description', 'type', 'address', 'range', 'terminal', 'signalType'].map((field) => (
          <td key={field} className="px-2 py-1">
            {field === 'type' ? (
              <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as 'DI' | 'AI' })}
                className="bg-slate-600 text-white rounded px-1 py-0.5 w-full text-xs">
                <option value="DI">DI</option>
                <option value="AI">AI</option>
              </select>
            ) : (
              <input value={(draft as unknown as Record<string, string>)[field] ?? ''} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                className="bg-slate-600 text-white rounded px-1 py-0.5 w-full text-xs" />
            )}
          </td>
        ))}
        <td className="px-2 py-1 flex gap-1">
          <button onClick={save} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
          <button onClick={cancel} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-700/50 border-t border-slate-700">
      <td className="px-3 py-2 font-mono text-xs text-cyan-400">{input.tag}</td>
      <td className="px-3 py-2 text-xs text-slate-300">{input.description}</td>
      <td className="px-3 py-2">
        <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${input.type === 'AI' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
          {input.type}
        </span>
      </td>
      <td className="px-3 py-2 font-mono text-xs text-yellow-400">{input.address}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{input.range}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{input.terminal}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{input.signalType}</td>
      <td className="px-3 py-2 flex gap-1">
        <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-blue-400"><Edit2 size={13} /></button>
        <button onClick={onDelete} className="text-slate-400 hover:text-red-400"><Trash2 size={13} /></button>
      </td>
    </tr>
  );
}

function OutputRow({ output, onUpdate, onDelete }: { output: IOOutput; onUpdate: (v: Partial<IOOutput>) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(output);

  function save() { onUpdate(draft); setEditing(false); }
  function cancel() { setDraft(output); setEditing(false); }

  if (editing) {
    return (
      <tr className="bg-slate-700">
        {['tag', 'description', 'type', 'address', 'power', 'relay', 'breaker', 'deviceType'].map((field) => (
          <td key={field} className="px-2 py-1">
            {field === 'type' ? (
              <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as 'DO' | 'AO' })}
                className="bg-slate-600 text-white rounded px-1 py-0.5 w-full text-xs">
                <option value="DO">DO</option>
                <option value="AO">AO</option>
              </select>
            ) : (
              <input value={(draft as unknown as Record<string, string>)[field] ?? ''} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                className="bg-slate-600 text-white rounded px-1 py-0.5 w-full text-xs" />
            )}
          </td>
        ))}
        <td className="px-2 py-1 flex gap-1">
          <button onClick={save} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
          <button onClick={cancel} className="text-red-400 hover:text-red-300"><X size={14} /></button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-700/50 border-t border-slate-700">
      <td className="px-3 py-2 font-mono text-xs text-green-400">{output.tag}</td>
      <td className="px-3 py-2 text-xs text-slate-300">{output.description}</td>
      <td className="px-3 py-2">
        <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${output.type === 'AO' ? 'bg-orange-900 text-orange-300' : 'bg-green-900 text-green-300'}`}>
          {output.type}
        </span>
      </td>
      <td className="px-3 py-2 font-mono text-xs text-yellow-400">{output.address}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{output.power}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{output.relay}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{output.breaker}</td>
      <td className="px-3 py-2 text-xs text-slate-400">{output.deviceType}</td>
      <td className="px-3 py-2 flex gap-1">
        <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-blue-400"><Edit2 size={13} /></button>
        <button onClick={onDelete} className="text-slate-400 hover:text-red-400"><Trash2 size={13} /></button>
      </td>
    </tr>
  );
}

export function IOManager() {
  const { inputs, outputs, addInput, updateInput, deleteInput, addOutput, updateOutput, deleteOutput } = useStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'inputs' | 'outputs'>('inputs');

  const filteredInputs = inputs.filter((i) =>
    i.tag.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase())
  );
  const filteredOutputs = outputs.filter((o) =>
    o.tag.toLowerCase().includes(search.toLowerCase()) ||
    o.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex gap-2">
          {(['inputs', 'outputs'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {t} ({t === 'inputs' ? inputs.length : outputs.length})
            </button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tag or description..."
          className="flex-1 bg-slate-700 text-slate-200 rounded px-3 py-1.5 text-sm placeholder-slate-500 outline-none focus:ring-1 focus:ring-blue-500" />
        <button onClick={() => tab === 'inputs' ? addInput(emptyInput()) : addOutput(emptyOutput())}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm">
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="overflow-auto flex-1 rounded border border-slate-700">
        {tab === 'inputs' ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase sticky top-0">
              <tr>
                {['Tag', 'Description', 'Type', 'Address', 'Range', 'Terminal', 'Signal', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredInputs.map((input) => (
                <InputRow key={input.id} input={input}
                  onUpdate={(v) => updateInput(input.id, v)}
                  onDelete={() => deleteInput(input.id)} />
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400 text-xs uppercase sticky top-0">
              <tr>
                {['Tag', 'Description', 'Type', 'Address', 'Power', 'Relay', 'Breaker', 'Device', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOutputs.map((output) => (
                <OutputRow key={output.id} output={output}
                  onUpdate={(v) => updateOutput(output.id, v)}
                  onDelete={() => deleteOutput(output.id)} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-4 mt-3 text-xs text-slate-500">
        <span>DI: {inputs.filter(i => i.type === 'DI').length}</span>
        <span>AI: {inputs.filter(i => i.type === 'AI').length}</span>
        <span>DO: {outputs.filter(o => o.type === 'DO').length}</span>
        <span>AO: {outputs.filter(o => o.type === 'AO').length}</span>
        <span className="ml-auto">Total I/O: {inputs.length + outputs.length}</span>
      </div>
    </div>
  );
}
