import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { AppState } from '../types';

export function exportJSON(state: Partial<AppState>, filename = 'plc-project.json') {
  const { project, inputs, outputs, steps, setpoints, timers, alarms, interlocks } = state;
  const data = { project, io: { inputs, outputs }, steps, setpoints, timers, alarms, interlocks };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  saveAs(blob, filename);
}

export function exportExcel(state: Partial<AppState>, filename = 'plc-project.xlsx') {
  const wb = XLSX.utils.book_new();

  if (state.inputs?.length) {
    const inputData = state.inputs.map((i) => ({
      Tag: i.tag, Description: i.description, Type: i.type,
      Address: i.address, Range: i.range ?? '', Terminal: i.terminal ?? '', SignalType: i.signalType ?? '',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inputData), 'Inputs');
  }

  if (state.outputs?.length) {
    const outputData = state.outputs.map((o) => ({
      Tag: o.tag, Description: o.description, Type: o.type,
      Address: o.address, Power: o.power ?? '', Relay: o.relay ?? '', Breaker: o.breaker ?? '', DeviceType: o.deviceType ?? '',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(outputData), 'Outputs');
  }

  if (state.steps?.length) {
    const stepData = state.steps.map((s) => ({
      Number: s.number, Name: s.name, Description: s.description,
      ActiveOutputs: Object.entries(s.activeOutputs).map(([k, v]) => `${k}:${v}`).join(', '),
      Transitions: s.transitions.map((t) => `→S${t.toStep}: ${t.condition}`).join(' | '),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(stepData), 'Steps');
  }

  if (state.setpoints?.length) {
    const spData = state.setpoints.map((sp) => ({
      Tag: sp.tag, Value: sp.value, Unit: sp.unit, PV: sp.pv, Description: sp.description,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(spData), 'Setpoints');
  }

  if (state.timers?.length) {
    const tData = state.timers.map((t) => ({
      Tag: t.tag, Duration: t.duration, Unit: t.unit, Description: t.description,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tData), 'Timers');
  }

  if (state.alarms?.length) {
    const aData = state.alarms.map((a) => ({
      Tag: a.tag, Transmitter: a.transmitter, Levels: a.levels, Action: a.action, Description: a.description,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(aData), 'Alarms');
  }

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbOut], { type: 'application/octet-stream' }), filename);
}

export function exportPDF(state: Partial<AppState>, filename = 'plc-project.pdf') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const { project, inputs, outputs, steps, setpoints, timers, alarms } = state;

  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  function heading(text: string, size = 14) {
    doc.setFontSize(size);
    doc.setTextColor(30, 90, 200);
    doc.text(text, 15, y);
    y += size / 2 + 4;
  }

  function row(cells: string[], widths: number[], rowY: number, isHeader = false) {
    doc.setFontSize(7);
    doc.setTextColor(isHeader ? 80 : 30, isHeader ? 80 : 30, isHeader ? 80 : 30);
    if (isHeader) doc.setFillColor(230, 236, 250);
    else doc.setFillColor(245, 247, 250);
    doc.rect(15, rowY - 4, pageW - 30, 6, 'F');
    let x = 15;
    cells.forEach((cell, i) => {
      doc.text(String(cell).slice(0, Math.floor(widths[i] / 2.2)), x + 1, rowY);
      x += widths[i];
    });
  }

  // Cover
  doc.setFontSize(22);
  doc.setTextColor(20, 60, 160);
  doc.text(`PLC Control Scheme`, 15, y); y += 12;
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(`${project?.name ?? 'Project'} | Rev ${project?.revision ?? '1'} | ${project?.date ?? ''}`, 15, y); y += 8;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(project?.description ?? '', 15, y); y += 14;

  // I/O Summary
  heading('I/O Summary');
  doc.setFontSize(9); doc.setTextColor(60, 60, 60);
  doc.text(`Digital Inputs: ${inputs?.filter(i => i.type === 'DI').length ?? 0}   Analog Inputs: ${inputs?.filter(i => i.type === 'AI').length ?? 0}   Digital Outputs: ${outputs?.filter(o => o.type === 'DO').length ?? 0}   Total: ${(inputs?.length ?? 0) + (outputs?.length ?? 0)}`, 15, y); y += 10;

  // Inputs table
  heading('Digital & Analog Inputs', 11);
  const inWidths = [22, 70, 12, 22, 28, 26, 22];
  row(['Tag', 'Description', 'Type', 'Address', 'Range', 'Terminal', 'Signal'], inWidths, y, true); y += 6;
  inputs?.forEach((inp) => {
    if (y > 185) { doc.addPage(); y = 20; }
    row([inp.tag, inp.description, inp.type, inp.address, inp.range ?? '', inp.terminal ?? '', inp.signalType ?? ''], inWidths, y); y += 6;
  });
  y += 6;

  // Outputs table
  if (y > 160) { doc.addPage(); y = 20; }
  heading('Digital & Analog Outputs', 11);
  const outWidths = [22, 70, 12, 22, 30, 20, 26];
  row(['Tag', 'Description', 'Type', 'Address', 'Power', 'Relay', 'Breaker'], outWidths, y, true); y += 6;
  outputs?.forEach((out) => {
    if (y > 185) { doc.addPage(); y = 20; }
    row([out.tag, out.description, out.type, out.address, out.power ?? '', out.relay ?? '', out.breaker ?? ''], outWidths, y); y += 6;
  });
  y += 6;

  // Steps
  if (y > 140) { doc.addPage(); y = 20; }
  heading('Control Steps', 11);
  steps?.forEach((step) => {
    if (y > 180) { doc.addPage(); y = 20; }
    doc.setFontSize(9); doc.setTextColor(30, 30, 30);
    doc.text(`STEP ${step.number}: ${step.name}`, 15, y); y += 5;
    doc.setFontSize(7); doc.setTextColor(80, 80, 80);
    if (step.description) { doc.text(`  ${step.description}`, 15, y); y += 4; }
    const outputs_str = Object.entries(step.activeOutputs).map(([k, v]) => `${k}:${v}`).join('  ');
    if (outputs_str) { doc.text(`  Active: ${outputs_str}`, 15, y); y += 4; }
    step.transitions.forEach((t) => {
      doc.text(`  → Step ${t.toStep}: IF ${t.condition}`, 15, y); y += 4;
    });
    y += 2;
  });

  // Setpoints
  if (setpoints?.length) {
    if (y > 160) { doc.addPage(); y = 20; }
    heading('Setpoints', 11);
    const spW = [22, 22, 22, 36, 80];
    row(['Tag', 'Value', 'Unit', 'PV', 'Description'], spW, y, true); y += 6;
    setpoints.forEach((sp) => {
      if (y > 185) { doc.addPage(); y = 20; }
      row([sp.tag, String(sp.value), sp.unit, sp.pv, sp.description], spW, y); y += 6;
    });
    y += 4;
  }

  // Timers
  if (timers?.length) {
    if (y > 160) { doc.addPage(); y = 20; }
    heading('Timers', 11);
    const tW = [22, 28, 22, 110];
    row(['Tag', 'Duration', 'Unit', 'Description'], tW, y, true); y += 6;
    timers.forEach((t) => {
      if (y > 185) { doc.addPage(); y = 20; }
      row([t.tag, String(t.duration), t.unit, t.description], tW, y); y += 6;
    });
    y += 4;
  }

  // Alarms
  if (alarms?.length) {
    if (y > 160) { doc.addPage(); y = 20; }
    heading('Alarms', 11);
    const aW = [22, 40, 36, 40, 80];
    row(['Tag', 'Transmitter', 'Levels', 'Action', 'Description'], aW, y, true); y += 6;
    alarms.forEach((a) => {
      if (y > 185) { doc.addPage(); y = 20; }
      row([a.tag, a.transmitter, a.levels, a.action, a.description], aW, y); y += 6;
    });
  }

  doc.save(filename);
}
