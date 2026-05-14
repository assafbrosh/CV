import { useStore } from '../store';
import type { OutputState } from '../types';

const STATE_CELL: Record<string, { bg: string; label: string }> = {
  run:   { bg: 'bg-green-700', label: 'RUN' },
  stop:  { bg: 'bg-red-900',   label: 'STP' },
  open:  { bg: 'bg-blue-700',  label: 'OPN' },
  closed:{ bg: 'bg-slate-700', label: 'CLS' },
  LOOP1: { bg: 'bg-purple-700',label: 'L1' },
  '-LOOP1':{ bg: 'bg-orange-700',label: '-L1' },
  LOOP2: { bg: 'bg-indigo-700',label: 'L2' },
  on:    { bg: 'bg-green-700', label: 'ON' },
  off:   { bg: 'bg-red-900',   label: 'OFF' },
  '':    { bg: '',             label: '' },
};

export function IOMatrix() {
  const { steps, outputs } = useStore();

  if (steps.length === 0 || outputs.length === 0) {
    return <div className="text-slate-500 text-sm p-4">No steps or outputs defined.</div>;
  }

  return (
    <div className="h-full overflow-auto">
      <table className="border-collapse text-xs min-w-max">
        <thead>
          <tr className="sticky top-0 z-10">
            <th className="bg-slate-800 border border-slate-700 px-3 py-2 text-left text-slate-400 min-w-[160px] sticky left-0 z-20">
              Step
            </th>
            {outputs.map((o) => (
              <th key={o.id} className="bg-slate-800 border border-slate-700 px-1 py-1 text-center min-w-[56px]">
                <div className="font-mono text-yellow-400">{o.tag}</div>
                <div className="text-slate-500 font-normal truncate max-w-[56px]" title={o.description}>
                  {o.description.split(' ').slice(0, 2).join(' ')}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {steps.map((step) => (
            <tr key={step.number} className="hover:bg-slate-800/60">
              <td className="border border-slate-700 px-3 py-2 sticky left-0 bg-slate-900 z-10"
                style={{ borderLeft: `3px solid ${step.color ?? '#6b7280'}` }}>
                <span className="font-mono text-slate-400 mr-2">S{step.number}</span>
                <span className="text-slate-300">{step.name}</span>
              </td>
              {outputs.map((o) => {
                const state: OutputState = step.activeOutputs[o.address] ?? '';
                const cell = STATE_CELL[state] ?? STATE_CELL[''];
                return (
                  <td key={o.id} className={`border border-slate-700 text-center ${cell.bg}`}>
                    <span className={`font-mono font-bold ${cell.label ? 'text-white' : 'text-slate-800'}`}>
                      {cell.label}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4 mt-4 text-xs text-slate-500 flex-wrap">
        {Object.entries(STATE_CELL).filter(([k]) => k !== '').map(([state, { bg, label }]) => (
          <span key={state} className="flex items-center gap-1">
            <span className={`inline-block w-8 h-4 rounded text-center font-mono font-bold text-white text-xs leading-4 ${bg}`}>{label}</span>
            <span className="capitalize">{state}</span>
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="inline-block w-8 h-4 rounded border border-slate-700" />
          <span>Inactive</span>
        </span>
      </div>
    </div>
  );
}
