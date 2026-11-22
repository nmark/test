import { useMemo } from 'react';
import { Background, Controls, Edge, Node, ReactFlow } from '@xyflow/react';
import { ChatMessage } from './api';

function labelFor(content: string): string {
  return content.length > 140 ? `${content.slice(0, 140)}…` : content;
}

function nodeStyle(role: string) {
  return {
    background: role === 'user' ? '#ffd803' : '#ffffff',
    border: '1px solid #d4d4d8',
    borderRadius: 12,
    width: 260,
    whiteSpace: 'pre-wrap',
    fontSize: 13,
    padding: 10,
  } as const;
}

export default function ChatFlow({ messages, busy }: { messages: ChatMessage[]; busy: boolean }) {
  const nodes: Node[] = useMemo(() => {
    const list: Node[] = messages.map((m, i) => ({
      id: `m-${i}`,
      position: { x: m.role === 'user' ? 0 : 340, y: i * 120 },
      data: { label: labelFor(m.content) },
      style: nodeStyle(m.role),
    }));
    if (busy) {
      list.push({
        id: 'pending',
        position: { x: messages.length % 2 === 0 ? 0 : 340, y: messages.length * 120 },
        data: { label: '…' },
        style: nodeStyle('assistant'),
      });
    }
    return list;
  }, [messages, busy]);

  const edges: Edge[] = useMemo(() => {
    const list: Edge[] = messages.slice(1).map((_, i) => ({
      id: `e-${i}`,
      source: `m-${i}`,
      target: `m-${i + 1}`,
      animated: true,
    }));
    if (busy && messages.length > 0) {
      list.push({ id: 'e-pending', source: `m-${messages.length - 1}`, target: 'pending', animated: true });
    }
    return list;
  }, [messages, busy]);

  return (
    <div className="flow">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
