import { create } from 'zustand';
import type { AppState, IOInput, IOOutput, Step, Setpoint, Timer, Alarm } from './types';

const MTA_INPUTS: IOInput[] = [
  { id: 'X0.0', tag: 'X0.0', description: 'Emergency Stop (EMS-1)', type: 'DI', address: 'X0.0', terminal: 'PG-P/5-6', signalType: 'Dry Contact' },
  { id: 'X0.1', tag: 'X0.1', description: 'EMS-1 Auxiliary Contact', type: 'DI', address: 'X0.1', terminal: 'PG-P/5-6', signalType: 'Dry Contact' },
  { id: 'X0.2', tag: 'X0.2', description: 'Diesel Actuator ST-1 (Open)', type: 'DI', address: 'X0.2', terminal: 'PG-P optional', signalType: 'Dry Contact' },
  { id: 'X0.3', tag: 'X0.3', description: 'Diesel Actuator ST-2 (Close)', type: 'DI', address: 'X0.3', terminal: 'PG-P optional', signalType: 'Dry Contact' },
  { id: 'X0.4', tag: 'X0.4', description: 'Engine ALT / RPM Sensor', type: 'DI', address: 'X0.4', terminal: 'PG-P/7', signalType: 'Pulse' },
  { id: 'X0.5', tag: 'X0.5', description: 'No AC Signal (R-1 N/V)', type: 'DI', address: 'X0.5', terminal: 'R-1(N/V)', signalType: 'Dry Contact' },
  { id: 'X0.6', tag: 'X0.6', description: 'XV-2-1 Valve Open Feedback', type: 'DI', address: 'X0.6', terminal: 'PG-8/1', signalType: 'Dry Contact' },
  { id: 'X0.7', tag: 'X0.7', description: 'XV-2-1 Valve Close Feedback', type: 'DI', address: 'X0.7', terminal: 'PG-8/2', signalType: 'Dry Contact' },
  { id: 'X0.8', tag: 'X0.8', description: 'XV-2-2 Valve Open Feedback', type: 'DI', address: 'X0.8', terminal: 'PG-8/6', signalType: 'Dry Contact' },
  { id: 'X0.9', tag: 'X0.9', description: 'XV-2-2 Valve Close Feedback', type: 'DI', address: 'X0.9', terminal: 'PG-8/7', signalType: 'Dry Contact' },
  { id: 'X0.10', tag: 'X0.10', description: 'XV-2-3 Valve Open Feedback', type: 'DI', address: 'X0.10', terminal: 'PG-8/11', signalType: 'Dry Contact' },
  { id: 'X0.11', tag: 'X0.11', description: 'XV-2-3 Valve Close Feedback', type: 'DI', address: 'X0.11', terminal: 'PG-8/12', signalType: 'Dry Contact' },
  { id: 'X0.12', tag: 'X0.12', description: 'XV-4-1 Valve Open Feedback', type: 'DI', address: 'X0.12', terminal: 'PG-8/16', signalType: 'Dry Contact' },
  { id: 'X0.13', tag: 'X0.13', description: 'XV-4-1 Valve Close Feedback', type: 'DI', address: 'X0.13', terminal: 'PG-8/17', signalType: 'Dry Contact' },
  { id: 'X0.14', tag: 'X0.14', description: 'XV-4-5 Valve Open Feedback', type: 'DI', address: 'X0.14', terminal: 'PG-8/21', signalType: 'Dry Contact' },
  { id: 'X0.15', tag: 'X0.15', description: 'XV-4-5 Valve Close Feedback', type: 'DI', address: 'X0.15', terminal: 'PG-8/22', signalType: 'Dry Contact' },
  { id: 'X1.0', tag: 'X1.0', description: 'Flow Meter 1 - Inlet (FM2)', type: 'DI', address: 'X1.0', terminal: 'PG-16/2', signalType: 'Pulse' },
  { id: 'X1.1', tag: 'X1.1', description: 'Flow Meter 2 - Product (FM4)', type: 'DI', address: 'X1.1', terminal: 'PG-16/4', signalType: 'Pulse' },
  { id: 'X1.2', tag: 'X1.2', description: 'Pressure Switch Low (PSL-4)', type: 'DI', address: 'X1.2', terminal: 'PG-16/6', signalType: 'Dry Contact' },
  { id: 'X1.3', tag: 'X1.3', description: 'Pressure Switch High (PSH-4)', type: 'DI', address: 'X1.3', terminal: 'PG-16/8', signalType: 'Dry Contact' },
  { id: 'X1.4', tag: 'X1.4', description: 'Diff. Pressure Switch (DPSH2)', type: 'DI', address: 'X1.4', terminal: 'PG-16/10', signalType: 'Dry Contact' },
  { id: 'I1', tag: 'I1+', description: 'UF/Feed Pressure (PT2-1)', type: 'AI', address: 'I1+', range: '0-6 bar', terminal: 'PG-16/12', signalType: '4-20mA' },
  { id: 'I2', tag: 'I2+', description: 'RO Feed Pressure (PT6-3)', type: 'AI', address: 'I2+', range: '0-100 bar', terminal: 'PG-16/14', signalType: '4-20mA' },
  { id: 'I3', tag: 'I3+', description: 'RO Outlet Pressure (PT6-4)', type: 'AI', address: 'I3+', range: '0-100 bar', terminal: 'PG-16/16', signalType: '4-20mA' },
  { id: 'I4', tag: 'I4+', description: 'Product Tank Level (PT4-2)', type: 'AI', address: 'I4+', range: '0-50 cm', terminal: 'PG-16/18', signalType: '4-20mA' },
];

const MTA_OUTPUTS: IOOutput[] = [
  { id: 'Y0', tag: 'Y.0', description: 'Intake Pump', type: 'DO', address: 'Y.0', power: '220VAC/0.75kW', relay: 'C-1', breaker: 'CB-2', deviceType: 'Pump' },
  { id: 'Y1', tag: 'Y.1', description: 'SSR Linear Speed Control', type: 'DO', address: 'Y.1', power: 'Optional', relay: 'SSR', deviceType: 'Speed Control' },
  { id: 'Y2', tag: 'Y.2', description: 'UF Pump', type: 'DO', address: 'Y.2', power: '220VAC/1.5kW', relay: 'C-2', breaker: 'CB-3', deviceType: 'Pump' },
  { id: 'Y3', tag: 'Y.3', description: 'XV-2-1 Solenoid Valve', type: 'DO', address: 'Y.3', power: '24VDC', relay: 'R-3', breaker: 'F-3 (6A)', deviceType: 'Solenoid Valve' },
  { id: 'Y4', tag: 'Y.4', description: 'XV-2-2 Solenoid Valve', type: 'DO', address: 'Y.4', power: '24VDC', relay: 'R-4', breaker: 'F-4 (6A)', deviceType: 'Solenoid Valve' },
  { id: 'Y5', tag: 'Y.5', description: 'XV-2-3 Solenoid Valve', type: 'DO', address: 'Y.5', power: '24VDC', relay: 'R-5', breaker: 'F-5 (6A)', deviceType: 'Solenoid Valve' },
  { id: 'Y6', tag: 'Y.6', description: 'XV-4-1 Solenoid Valve', type: 'DO', address: 'Y.6', power: '24VDC', relay: 'R-6', breaker: 'F-6 (6A)', deviceType: 'Solenoid Valve' },
  { id: 'Y7', tag: 'Y.7', description: 'XV-4-1 Solenoid Valve (Backup)', type: 'DO', address: 'Y.7', power: '24VDC', relay: 'R-7', deviceType: 'Solenoid Valve' },
  { id: 'Y8', tag: 'Y.8', description: 'XV-4-5 Solenoid Valve', type: 'DO', address: 'Y.8', power: '24VDC', relay: 'R-8', breaker: 'F-7 (6A)', deviceType: 'Solenoid Valve' },
  { id: 'Y9', tag: 'Y.9', description: 'BW Pump', type: 'DO', address: 'Y.9', power: '220VAC/2kW', relay: 'C-3', breaker: 'CB-4', deviceType: 'Pump' },
  { id: 'Y10', tag: 'Y.10', description: 'RO Pump', type: 'DO', address: 'Y.10', power: '24VDC/0.024kW', relay: 'R-2', deviceType: 'Pump' },
  { id: 'Y1_0', tag: 'Y1.0', description: 'Actuator OPEN (ST-1)', type: 'DO', address: 'Y1.0', power: '24VDC', relay: 'R1-1', deviceType: 'Actuator' },
  { id: 'Y1_1', tag: 'Y1.1', description: 'Actuator CLOSE (ST-2)', type: 'DO', address: 'Y1.1', power: '24VDC', relay: 'R1-2', deviceType: 'Actuator' },
  { id: 'Y1_2', tag: 'Y1.2', description: 'Dosing Pump (Acid)', type: 'DO', address: 'Y1.2', power: '220VAC/0.1kW', relay: 'C-4', deviceType: 'Pump' },
];

const MTA_STEPS: Step[] = [
  {
    number: 0, name: 'STOP', description: 'System stopped. Safe state with standby valves open.',
    activeOutputs: { 'Y.3': 'open', 'Y.4': 'open' },
    transitions: [{ id: 't0-10', toStep: 10, condition: 'HMI Start triggered AND No alarms active' }],
    color: '#ef4444',
  },
  {
    number: 10, name: 'Intake Priming', description: 'Prime intake pipeline. Run intake pump, open inlet valves.',
    activeOutputs: { 'Y.0': 'run', 'Y.3': 'open', 'Y.4': 'open' },
    transitions: [{ id: 't10-20', toStep: 20, condition: 'T1 done AND I1+ > SP01 (0.2 bar)' }],
    color: '#f97316',
  },
  {
    number: 20, name: 'UF Start', description: 'Start UF membrane filtration.',
    activeOutputs: { 'Y.0': 'run', 'Y.2': 'run', 'Y.3': 'open', 'Y.4': 'open', 'Y.5': 'open' },
    transitions: [
      { id: 't20-40', toStep: 40, condition: 'T2 done AND X1.0 pulse confirmed' },
      { id: 't20-0', toStep: 0, condition: 'X0.0 Emergency Stop' },
    ],
    color: '#eab308',
  },
  {
    number: 30, name: 'UF Flush', description: 'Forward flush UF membranes.',
    activeOutputs: { 'Y.0': 'run', 'Y.2': 'run', 'Y.3': 'open', 'Y.5': 'open', 'Y.6': 'open' },
    transitions: [{ id: 't30-40', toStep: 40, condition: 'T3 done' }],
    color: '#eab308',
  },
  {
    number: 40, name: 'UF Production', description: 'Normal UF production. Feed to RO.',
    activeOutputs: { 'Y.0': 'run', 'Y.2': 'run', 'Y.10': 'run', 'Y.3': 'open', 'Y.4': 'open', 'Y.5': 'open' },
    transitions: [
      { id: 't40-50', toStep: 50, condition: 'T4 done (backwash interval)' },
      { id: 't40-80', toStep: 80, condition: 'I4+ > SP04 (tank full)' },
      { id: 't40-0', toStep: 0, condition: 'X0.0 Emergency Stop OR AL1 active' },
    ],
    color: '#22c55e',
  },
  {
    number: 50, name: 'BW Drain', description: 'Drain before backwash.',
    activeOutputs: { 'Y.3': 'open', 'Y.8': 'open' },
    transitions: [{ id: 't50-60', toStep: 60, condition: 'T5 done' }],
    color: '#3b82f6',
  },
  {
    number: 60, name: 'BW Flush', description: 'Backwash UF membranes with BW pump.',
    activeOutputs: { 'Y.9': 'run', 'Y.4': 'open', 'Y.8': 'open' },
    transitions: [{ id: 't60-70', toStep: 70, condition: 'T6 done' }],
    color: '#3b82f6',
  },
  {
    number: 70, name: 'BW Rinse', description: 'Forward rinse after backwash.',
    activeOutputs: { 'Y.0': 'run', 'Y.2': 'run', 'Y.3': 'open', 'Y.5': 'open', 'Y.8': 'open' },
    transitions: [{ id: 't70-40', toStep: 40, condition: 'T7 done' }],
    color: '#3b82f6',
  },
  {
    number: 80, name: 'Tank Full', description: 'Product tank full. Pause production.',
    activeOutputs: { 'Y.3': 'open', 'Y.4': 'open' },
    transitions: [{ id: 't80-40', toStep: 40, condition: 'I4+ < SP03 (tank low)' }],
    color: '#8b5cf6',
  },
  {
    number: 90, name: 'Shutdown', description: 'Controlled shutdown sequence.',
    activeOutputs: { 'Y.3': 'open', 'Y.4': 'open' },
    transitions: [{ id: 't90-0', toStep: 0, condition: 'T8 done (purge complete)' }],
    color: '#6b7280',
  },
  {
    number: 130, name: 'Alarm Stop', description: 'Emergency stop - alarm triggered.',
    activeOutputs: {},
    transitions: [{ id: 't130-0', toStep: 0, condition: 'Alarm acknowledged AND reset by operator' }],
    color: '#dc2626',
  },
];

const MTA_SETPOINTS: Setpoint[] = [
  { id: 'SP01', tag: 'SP01', value: 0.2, unit: 'bar', pv: 'I1+ (PT2-1)', description: 'Min UF inlet pressure for production', usedInSteps: [10] },
  { id: 'SP02', tag: 'SP02', value: 2.5, unit: 'bar', pv: 'I2+ (PT6-3)', description: 'Max RO feed pressure', usedInSteps: [40] },
  { id: 'SP03', tag: 'SP03', value: 10, unit: 'cm', pv: 'I4+ (PT4-2)', description: 'Tank low level - resume production', usedInSteps: [80] },
  { id: 'SP04', tag: 'SP04', value: 45, unit: 'cm', pv: 'I4+ (PT4-2)', description: 'Tank high level - pause production', usedInSteps: [40] },
  { id: 'SP05', tag: 'SP05', value: 1000, unit: 'uS/cm', pv: 'EC-01 (RS485)', description: 'Max product conductivity', usedInSteps: [40, 70] },
];

const MTA_TIMERS: Timer[] = [
  { id: 'T1', tag: 'T1', duration: 60, unit: 'sec', description: 'Intake priming time', usedInSteps: [10] },
  { id: 'T2', tag: 'T2', duration: 30, unit: 'sec', description: 'UF start stabilisation', usedInSteps: [20] },
  { id: 'T3', tag: 'T3', duration: 120, unit: 'sec', description: 'UF forward flush duration', usedInSteps: [30] },
  { id: 'T4', tag: 'T4', duration: 60, unit: 'min', description: 'UF production interval before BW', usedInSteps: [40] },
  { id: 'T5', tag: 'T5', duration: 30, unit: 'sec', description: 'BW drain time', usedInSteps: [50] },
  { id: 'T6', tag: 'T6', duration: 90, unit: 'sec', description: 'BW flush duration', usedInSteps: [60] },
  { id: 'T7', tag: 'T7', duration: 60, unit: 'sec', description: 'BW rinse duration', usedInSteps: [70] },
  { id: 'T8', tag: 'T8', duration: 30, unit: 'sec', description: 'Shutdown purge time', usedInSteps: [90] },
];

const MTA_ALARMS: Alarm[] = [
  { id: 'AL1', tag: 'AL1', transmitter: 'I1+ (PT2-1)', levels: 'LL / L / H / HH', action: 'Stop system', description: 'UF/Feed pressure out of range' },
  { id: 'AL2', tag: 'AL2', transmitter: 'I2+ (PT6-3)', levels: 'H / HH', action: 'Stop RO pump', description: 'RO feed pressure too high' },
  { id: 'AL3', tag: 'AL3', transmitter: 'I4+ (PT4-2)', levels: 'HH', action: 'Stop intake', description: 'Tank overflow protection' },
  { id: 'AL4', tag: 'AL4', transmitter: 'EC-01 (RS485)', levels: 'H', action: 'Divert to drain', description: 'Product conductivity exceeded SP05' },
  { id: 'AL5', tag: 'AL5', transmitter: 'X1.4 (DPSH2)', levels: 'HH', action: 'Stop and BW', description: 'UF differential pressure too high - membrane fouled' },
];

export const useStore = create<AppState>((set) => ({
  project: {
    name: 'MTA Water Treatment',
    revision: '2',
    date: '2026-05-14',
    description: 'Condor MTA seawater desalination control scheme - Siemens S228PA PLC',
  },
  documents: [],
  inputs: MTA_INPUTS,
  outputs: MTA_OUTPUTS,
  steps: MTA_STEPS,
  setpoints: MTA_SETPOINTS,
  timers: MTA_TIMERS,
  alarms: MTA_ALARMS,
  interlocks: [],
  activeTab: 'io',

  setProject: (p) => set((s) => ({ project: { ...s.project, ...p } })),
  setActiveTab: (tab) => set({ activeTab: tab }),

  addInput: (input) => set((s) => ({ inputs: [...s.inputs, input] })),
  updateInput: (id, input) => set((s) => ({ inputs: s.inputs.map((i) => i.id === id ? { ...i, ...input } : i) })),
  deleteInput: (id) => set((s) => ({ inputs: s.inputs.filter((i) => i.id !== id) })),

  addOutput: (output) => set((s) => ({ outputs: [...s.outputs, output] })),
  updateOutput: (id, output) => set((s) => ({ outputs: s.outputs.map((o) => o.id === id ? { ...o, ...output } : o) })),
  deleteOutput: (id) => set((s) => ({ outputs: s.outputs.filter((o) => o.id !== id) })),

  addStep: (step) => set((s) => ({ steps: [...s.steps, step].sort((a, b) => a.number - b.number) })),
  updateStep: (number, step) => set((s) => ({ steps: s.steps.map((st) => st.number === number ? { ...st, ...step } : st) })),
  deleteStep: (number) => set((s) => ({ steps: s.steps.filter((st) => st.number !== number) })),

  addSetpoint: (sp) => set((s) => ({ setpoints: [...s.setpoints, sp] })),
  updateSetpoint: (id, sp) => set((s) => ({ setpoints: s.setpoints.map((x) => x.id === id ? { ...x, ...sp } : x) })),
  deleteSetpoint: (id) => set((s) => ({ setpoints: s.setpoints.filter((x) => x.id !== id) })),

  addTimer: (t) => set((s) => ({ timers: [...s.timers, t] })),
  updateTimer: (id, t) => set((s) => ({ timers: s.timers.map((x) => x.id === id ? { ...x, ...t } : x) })),
  deleteTimer: (id) => set((s) => ({ timers: s.timers.filter((x) => x.id !== id) })),

  addAlarm: (a) => set((s) => ({ alarms: [...s.alarms, a] })),
  updateAlarm: (id, a) => set((s) => ({ alarms: s.alarms.map((x) => x.id === id ? { ...x, ...a } : x) })),
  deleteAlarm: (id) => set((s) => ({ alarms: s.alarms.filter((x) => x.id !== id) })),

  addInterlock: (i) => set((s) => ({ interlocks: [...s.interlocks, i] })),
  updateInterlock: (id, i) => set((s) => ({ interlocks: s.interlocks.map((x) => x.id === id ? { ...x, ...i } : x) })),
  deleteInterlock: (id) => set((s) => ({ interlocks: s.interlocks.filter((x) => x.id !== id) })),

  addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
  removeDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

  loadProject: (state) => set((s) => ({ ...s, ...state })),
}));
