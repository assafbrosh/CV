export type IOType = 'DI' | 'DO' | 'AI' | 'AO';

export interface IOInput {
  id: string;
  tag: string;
  description: string;
  type: 'DI' | 'AI';
  address: string;
  range?: string;
  terminal?: string;
  signalType?: string;
}

export interface IOOutput {
  id: string;
  tag: string;
  description: string;
  type: 'DO' | 'AO';
  address: string;
  power?: string;
  relay?: string;
  breaker?: string;
  deviceType?: string;
}

export type OutputState = 'run' | 'stop' | 'open' | 'closed' | 'LOOP1' | '-LOOP1' | 'LOOP2' | 'on' | 'off' | '';

export interface Transition {
  id: string;
  toStep: number;
  condition: string;
}

export interface Step {
  number: number;
  name: string;
  description: string;
  activeOutputs: Record<string, OutputState>;
  transitions: Transition[];
  color?: string;
}

export interface Setpoint {
  id: string;
  tag: string;
  value: number;
  unit: string;
  pv: string;
  description: string;
  usedInSteps: number[];
}

export interface Timer {
  id: string;
  tag: string;
  duration: number;
  unit: 'sec' | 'min';
  description: string;
  usedInSteps: number[];
}

export interface Alarm {
  id: string;
  tag: string;
  transmitter: string;
  levels: string;
  action: string;
  description: string;
}

export interface Interlock {
  id: string;
  equipment: string;
  condition1: string;
  condition2: string;
  timer?: string;
  alarm?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  dataUrl: string;
}

export interface Project {
  name: string;
  revision: string;
  date: string;
  description: string;
}

export interface AppState {
  project: Project;
  documents: Document[];
  inputs: IOInput[];
  outputs: IOOutput[];
  steps: Step[];
  setpoints: Setpoint[];
  timers: Timer[];
  alarms: Alarm[];
  interlocks: Interlock[];

  activeTab: 'io' | 'steps' | 'matrix' | 'setpoints' | 'documents' | 'flow';

  setProject: (p: Partial<Project>) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;

  addInput: (input: IOInput) => void;
  updateInput: (id: string, input: Partial<IOInput>) => void;
  deleteInput: (id: string) => void;

  addOutput: (output: IOOutput) => void;
  updateOutput: (id: string, output: Partial<IOOutput>) => void;
  deleteOutput: (id: string) => void;

  addStep: (step: Step) => void;
  updateStep: (number: number, step: Partial<Step>) => void;
  deleteStep: (number: number) => void;

  addSetpoint: (sp: Setpoint) => void;
  updateSetpoint: (id: string, sp: Partial<Setpoint>) => void;
  deleteSetpoint: (id: string) => void;

  addTimer: (t: Timer) => void;
  updateTimer: (id: string, t: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;

  addAlarm: (a: Alarm) => void;
  updateAlarm: (id: string, a: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;

  addInterlock: (i: Interlock) => void;
  updateInterlock: (id: string, i: Partial<Interlock>) => void;
  deleteInterlock: (id: string) => void;

  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;

  loadProject: (state: Partial<AppState>) => void;
}
