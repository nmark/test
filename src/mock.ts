export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const initialMessages: ChatMessage[] = [
  { role: 'user', content: 'Hey! What is this app?' },
  {
    role: 'assistant',
    content: 'A frontend-only demo: a React + TypeScript chat rendered as a React Flow graph, with mocked replies.',
  },
  { role: 'user', content: 'Does it remember the conversation?' },
  {
    role: 'assistant',
    content: 'Yes — every message you send becomes a new node in the flow, linked to the previous one.',
  },
];

const replies = [
  'Great question! (This is a mocked reply — no server is involved.)',
  'In a real app this would call an API; here the reply is generated locally after a short delay.',
  'Your messages appear as yellow nodes on the left, my replies as white nodes on the right.',
  'Send another message — it will show up as the next node in the flow.',
];

export function mockReply(messageCount: number): Promise<string> {
  const reply = replies[messageCount % replies.length];
  return new Promise((resolve) => setTimeout(() => resolve(reply), 700));
}
