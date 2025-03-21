
export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'Can we meet tomorrow?',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    lastMessage: 'Thanks for the info!',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    lastMessage: 'The project is looking good!',
    time: 'Monday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Michael Brown',
    lastMessage: 'Did you see the latest changes?',
    time: 'Monday',
    unread: 3,
    online: true,
  },
];

export const sampleMessageHistory: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      content: 'Hey, how are you doing?',
      sender: 'contact',
      timestamp: '2023-06-10T10:30:00',
    },
    {
      id: '1-2',
      content: 'I\'m good, thanks! How about you?',
      sender: 'user',
      timestamp: '2023-06-10T10:32:00',
      status: 'read',
    },
    {
      id: '1-3',
      content: 'I\'m doing well. Just finished the project we discussed last time.',
      sender: 'contact',
      timestamp: '2023-06-10T10:33:00',
    },
    {
      id: '1-4',
      content: 'That\'s great to hear! How did it turn out?',
      sender: 'user',
      timestamp: '2023-06-10T10:35:00',
      status: 'read',
    },
    {
      id: '1-5',
      content: 'It turned out really well. The client was very happy with the results.',
      sender: 'contact',
      timestamp: '2023-06-10T10:36:00',
    },
  ],
  '2': [
    {
      id: '2-1',
      content: 'Can we meet tomorrow?',
      sender: 'contact',
      timestamp: '2023-06-09T15:20:00',
    },
    {
      id: '2-2',
      content: 'Sure, what time works for you?',
      sender: 'user',
      timestamp: '2023-06-09T15:25:00',
      status: 'read',
    },
  ],
  '3': [
    {
      id: '3-1',
      content: 'Thanks for the info!',
      sender: 'contact',
      timestamp: '2023-06-09T09:10:00',
    },
  ],
  '4': [
    {
      id: '4-1',
      content: 'The project is looking good!',
      sender: 'contact',
      timestamp: '2023-06-05T14:30:00',
    },
  ],
  '5': [
    {
      id: '5-1',
      content: 'Did you see the latest changes?',
      sender: 'contact',
      timestamp: '2023-06-05T11:20:00',
    },
    {
      id: '5-2',
      content: 'No, let me check. What was updated?',
      sender: 'user',
      timestamp: '2023-06-05T11:25:00',
      status: 'delivered',
    },
    {
      id: '5-3',
      content: 'I made some design adjustments and improved the performance.',
      sender: 'contact',
      timestamp: '2023-06-05T11:28:00',
    },
  ],
};
