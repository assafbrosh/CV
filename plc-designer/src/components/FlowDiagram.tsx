import { useMemo } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  BackgroundVariant, MarkerType,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store';

const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;
const COLS = 4;
const H_GAP = 200;
const V_GAP = 120;

export function FlowDiagram() {
  const { steps } = useStore();

  const nodes: Node[] = useMemo(() =>
    steps.map((step, idx) => ({
      id: String(step.number),
      position: {
        x: (idx % COLS) * H_GAP + 40,
        y: Math.floor(idx / COLS) * V_GAP + 40,
      },
      data: {
        label: (
          <div className="text-center">
            <div className="font-mono text-xs text-slate-400">S{step.number}</div>
            <div className="font-semibold text-white text-xs leading-tight mt-0.5">{step.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {Object.keys(step.activeOutputs).length} outputs
            </div>
          </div>
        ),
      },
      style: {
        background: step.color ?? '#374151',
        border: `2px solid ${step.color ?? '#6b7280'}`,
        borderRadius: '8px',
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        color: 'white',
        fontSize: '12px',
      },
    })),
    [steps]
  );

  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];
    steps.forEach((step) => {
      step.transitions.forEach((t) => {
        result.push({
          id: t.id,
          source: String(step.number),
          target: String(t.toStep),
          label: t.condition.length > 30 ? t.condition.slice(0, 27) + '...' : t.condition,
          labelStyle: { fontSize: '9px', fill: '#94a3b8', fontFamily: 'monospace' },
          labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9 },
          labelBgPadding: [4, 2] as [number, number],
          style: { stroke: '#475569', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
          type: 'smoothstep',
          animated: step.number > t.toStep,
        });
      });
    });
    return result;
  }, [steps]);

  return (
    <div style={{ height: '100%', background: '#0f172a' }} className="rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} color="#334155" gap={20} size={1} />
        <Controls style={{ background: '#1e293b', border: '1px solid #334155' }} />
        <MiniMap
          style={{ background: '#1e293b', border: '1px solid #334155' }}
          nodeColor={(n) => (n.style?.background as string) ?? '#374151'}
          maskColor="rgba(15,23,42,0.8)"
        />
      </ReactFlow>
    </div>
  );
}
