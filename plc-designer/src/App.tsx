import { useRef } from 'react';
import { useStore } from './store';
import { IOManager } from './components/IOManager';
import { StepEditor } from './components/StepEditor';
import { FlowDiagram } from './components/FlowDiagram';
import { IOMatrix } from './components/IOMatrix';
import { SetpointsManager } from './components/SetpointsManager';
import { DocumentViewer } from './components/DocumentViewer';
import { exportJSON, exportExcel, exportPDF } from './utils/exportUtils';
import { Upload, FileJson, FileSpreadsheet, FileText, Download, Activity, Cpu } from 'lucide-react';

type Tab = 'io' | 'steps' | 'flow' | 'matrix' | 'setpoints' | 'documents';

const TABS: { id: Tab; label: string }[] = [
  { id: 'io', label: 'I/O Manager' },
  { id: 'steps', label: 'Step Editor' },
  { id: 'flow', label: 'Flow Diagram' },
  { id: 'matrix', label: 'I/O Matrix' },
  { id: 'setpoints', label: 'Setpoints & Alarms' },
  { id: 'documents', label: 'Documents' },
];

export default function App() {
  const store = useStore();
  const { project, setProject, activeTab, setActiveTab } = store;
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    exportJSON({
      project: store.project,
      inputs: store.inputs,
      outputs: store.outputs,
      steps: store.steps,
      setpoints: store.setpoints,
      timers: store.timers,
      alarms: store.alarms,
      interlocks: store.interlocks,
    }, `${project.name.replace(/\s+/g, '_')}_Rev${project.revision}.json`);
  }

  function handleLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        store.loadProject({
          project: data.project,
          inputs: data.io?.inputs ?? data.inputs ?? [],
          outputs: data.io?.outputs ?? data.outputs ?? [],
          steps: data.steps ?? [],
          setpoints: data.setpoints ?? [],
          timers: data.timers ?? [],
          alarms: data.alarms ?? [],
          interlocks: data.interlocks ?? [],
        });
      } catch {
        alert('Invalid project file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleExportPDF() {
    exportPDF({
      project: store.project,
      inputs: store.inputs,
      outputs: store.outputs,
      steps: store.steps,
      setpoints: store.setpoints,
      timers: store.timers,
      alarms: store.alarms,
      interlocks: store.interlocks,
    }, `${project.name.replace(/\s+/g, '_')}_Rev${project.revision}.pdf`);
  }

  function handleExportExcel() {
    exportExcel({
      project: store.project,
      inputs: store.inputs,
      outputs: store.outputs,
      steps: store.steps,
      setpoints: store.setpoints,
      timers: store.timers,
      alarms: store.alarms,
    }, `${project.name.replace(/\s+/g, '_')}_Rev${project.revision}.xlsx`);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Cpu size={20} className="text-blue-400" />
          <span className="font-bold text-white text-sm">PLC Control Scheme Designer</span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Activity size={14} className="text-green-400" />
          <input value={project.name} onChange={(e) => setProject({ name: e.target.value })}
            className="bg-transparent text-slate-200 font-semibold text-sm outline-none border-b border-transparent focus:border-blue-500 px-1" />
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-500">Rev</span>
          <input value={project.revision} onChange={(e) => setProject({ revision: e.target.value })}
            className="bg-transparent text-slate-300 text-xs outline-none w-8 text-center border-b border-transparent focus:border-blue-500" />
          <span className="text-slate-600">|</span>
          <input type="date" value={project.date} onChange={(e) => setProject({ date: e.target.value })}
            className="bg-transparent text-slate-400 text-xs outline-none border-b border-transparent focus:border-blue-500" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded text-xs">
            <Upload size={13} /> Load
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleLoad} />

          <button onClick={handleSave}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded text-xs">
            <FileJson size={13} /> Save JSON
          </button>

          <button onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-green-100 px-3 py-1.5 rounded text-xs">
            <FileSpreadsheet size={13} /> Excel
          </button>

          <button onClick={handleExportPDF}
            className="flex items-center gap-1.5 bg-red-800 hover:bg-red-700 text-red-100 px-3 py-1.5 rounded text-xs">
            <FileText size={13} /><Download size={13} /> PDF
          </button>
        </div>
      </header>

      {/* Status bar */}
      <div className="flex items-center gap-6 px-4 py-1 border-b border-slate-700/50 text-xs text-slate-500 bg-slate-900 flex-shrink-0">
        <span>DI: {store.inputs.filter(i => i.type === 'DI').length}</span>
        <span>AI: {store.inputs.filter(i => i.type === 'AI').length}</span>
        <span>DO: {store.outputs.filter(o => o.type === 'DO').length}</span>
        <span>Steps: {store.steps.length}</span>
        <span>Setpoints: {store.setpoints.length}</span>
        <span>Timers: {store.timers.length}</span>
        <span>Alarms: {store.alarms.length}</span>
        <span className="ml-auto text-slate-600 truncate max-w-xs">{project.description}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-slate-800 border-b border-slate-700 flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Parameters<typeof setActiveTab>[0])}
            className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-hidden p-4">
        {activeTab === 'io' && <IOManager />}
        {activeTab === 'steps' && <StepEditor />}
        {activeTab === 'flow' && <FlowDiagram />}
        {activeTab === 'matrix' && <IOMatrix />}
        {activeTab === 'setpoints' && <SetpointsManager />}
        {activeTab === 'documents' && <DocumentViewer />}
      </main>
    </div>
  );
}
