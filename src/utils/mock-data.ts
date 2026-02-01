import { Message, Thread } from '../types/messages';
import { Widget } from '../types/widgets';

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'I want to plan a trip to Europe',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Great choice! Europe has amazing destinations. What\'s your budget and how many days do you have?',
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'Around $2000 for 5 days',
    timestamp: new Date(Date.now() - 3300000),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: 'Perfect! I found some great destinations that fit your budget:',
    widgets: [
      {
        type: 'list',
        id: 'destinations-1',
        props: {
          items: [
            {
              id: 'paris',
              title: 'Paris, France',
              subtitle: '5 days • $1,850',
              description: 'The City of Light with iconic landmarks',
              metadata: { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, price: 1850, days: 5 },
            },
            {
              id: 'rome',
              title: 'Rome, Italy',
              subtitle: '5 days • $1,650',
              description: 'Ancient history meets modern culture',
              metadata: { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, price: 1650, days: 5 },
            },
            {
              id: 'barcelona',
              title: 'Barcelona, Spain',
              subtitle: '5 days • $1,450',
              description: 'Beautiful beaches and Gaudí architecture',
              metadata: { city: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, price: 1450, days: 5 },
            },
          ],
        },
        actions: [
          {
            type: 'select_destination',
            label: 'Select',
            handler: 'client',
            payload: {},
          },
          {
            type: 'view_details',
            label: 'Details',
            handler: 'server',
            payload: {},
          },
        ],
      },
    ],
    timestamp: new Date(Date.now() - 3200000),
  },
];

export const mockThreads: Thread[] = [
  {
    id: 'thread-1',
    title: 'Trip to Europe',
    preview: 'Planning a 5-day trip...',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
    messageCount: 12,
  },
  {
    id: 'thread-2',
    title: 'Restaurant Recommendations',
    preview: 'Looking for good places...',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    messageCount: 8,
  },
  {
    id: 'thread-3',
    title: 'Budget Planning',
    preview: 'Help with monthly budget',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000),
    messageCount: 15,
  },
];

export const mockWidgets: Widget[] = [
  {
    type: 'card',
    id: 'card-1',
    props: {
      title: 'Paris, France',
      description: '5-day adventure in the City of Light',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      footer: 'Total: $1,850',
    },
    actions: [
      {
        type: 'book_trip',
        label: 'Book Now',
        handler: 'client',
        payload: { tripId: 'trip-paris' },
      },
    ],
  },
  {
    type: 'card',
    id: 'card-2',
    props: {
      title: 'Rome, Italy',
      description: 'Explore ancient wonders',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      footer: 'Total: $1,650',
    },
    actions: [
      {
        type: 'book_trip',
        label: 'Book Now',
        handler: 'client',
        payload: { tripId: 'trip-rome' },
      },
    ],
  },
];

export function generateMockResponse(delay: number = 1000): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'This is a mock response. In production, this would come from your AI agent API.',
        timestamp: new Date(),
      });
    }, delay);
  });
}

export function generateMockStreamingResponse(
  text: string,
  onChunk: (chunk: string) => void,
  typingSpeed: number = 30
): Promise<void> {
  return new Promise((resolve) => {
    const words = text.split(' ');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        onChunk(words[currentIndex] + ' ');
        currentIndex++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, typingSpeed);
  });
}

// Generate mock plan based on command content
export function generateMockPlan(command: string): string {
  const lowerCommand = command.toLowerCase();

  if (lowerCommand.includes('analyze') || lowerCommand.includes('analysis')) {
    return `**Plan:**\n\n1. Fetch data from the analytics database\n2. Apply filters and aggregations\n3. Calculate key metrics and trends\n4. Generate visualization data\n5. Compile insights and recommendations`;
  }

  if (lowerCommand.includes('sales') || lowerCommand.includes('revenue')) {
    return `**Plan:**\n\n1. Query sales records for the specified period\n2. Calculate total revenue and growth rates\n3. Break down performance by product category\n4. Analyze regional distribution\n5. Present findings in charts and summary`;
  }

  if (lowerCommand.includes('report') || lowerCommand.includes('summary')) {
    return `**Plan:**\n\n1. Gather data from all relevant sources\n2. Aggregate metrics across categories\n3. Identify key trends and anomalies\n4. Generate executive summary\n5. Create detailed breakdowns with visualizations`;
  }

  if (lowerCommand.includes('customer') || lowerCommand.includes('user')) {
    return `**Plan:**\n\n1. Pull customer data from CRM\n2. Calculate engagement metrics\n3. Segment users by behavior patterns\n4. Analyze satisfaction scores\n5. Generate customer insights report`;
  }

  if (lowerCommand.includes('task') || lowerCommand.includes('todo') || lowerCommand.includes('work') || lowerCommand.includes('completed')) {
    return `**Plan:**\n\n1. Retrieve task records from the database\n2. Filter by status and date range\n3. Organize by priority and category\n4. Calculate completion metrics\n5. Display in interactive list format`;
  }

  // Default plan
  return `**Plan:**\n\n1. Parse and understand the command requirements\n2. Gather necessary data from available sources\n3. Process and analyze the information\n4. Format results for optimal presentation\n5. Return response with any relevant visualizations`;
}

// Generate mock command response based on command content
export function generateMockCommandResponse(command: string): string {
  const lowerCommand = command.toLowerCase();

  if (lowerCommand.includes('analyze') || lowerCommand.includes('analysis')) {
    return `Analysis complete for "${command}". Found 247 records with an average value of $1,234. The data shows a 23% increase compared to last quarter. Key insights: Revenue is up, customer satisfaction improved by 15%, and operational costs decreased by 8%.`;
  }

  if (lowerCommand.includes('sales') || lowerCommand.includes('revenue')) {
    return `Sales data processed: Q4 2024 revenue reached $2.4M, representing 18% growth year-over-year. Top performing products: Enterprise Plan (+45%), Pro Plan (+32%), Basic Plan (+12%). Regional breakdown: North America (52%), Europe (31%), APAC (17%).`;
  }

  if (lowerCommand.includes('report') || lowerCommand.includes('summary')) {
    return `Report generated successfully. Executive Summary: Overall performance exceeded targets by 12%. Marketing ROI improved to 3.2x, customer acquisition cost reduced by 18%, and lifetime value increased by 24%. Detailed breakdown available in attached widgets.`;
  }

  if (lowerCommand.includes('data') || lowerCommand.includes('metrics')) {
    return `Data metrics retrieved: 1,847 active users, 12,394 sessions this month, 94.2% uptime, average response time 127ms. Performance is within acceptable parameters. No critical issues detected.`;
  }

  if (lowerCommand.includes('customer') || lowerCommand.includes('user')) {
    return `Customer analysis complete: 523 new customers this month, 89% retention rate, average satisfaction score 4.6/5. Top feedback themes: excellent support (87%), easy to use (72%), good value (68%). 3 support tickets pending review.`;
  }

  // Default response
  return `This is a mock response showing how your agent would process and respond to commands. The actual response would be generated by your AI agent based on real data and context.`;
}

// Generate mock command response with widgets
export function generateMockCommandWithWidgets(command: string): { message: string; widgets: Widget[]; action?: { type: string; payload: any } } {
  const message = generateMockCommandResponse(command);
  const lowerCommand = command.toLowerCase();

  let widgets: Widget[] = [];
  let action: { type: string; payload: any } | undefined;

  // Add relevant widgets based on command type
  if (lowerCommand.includes('sales') || lowerCommand.includes('revenue') || lowerCommand.includes('analyze')) {
    widgets.push({
      type: 'card',
      id: `widget-${Date.now()}-1`,
      props: {
        title: 'Q4 2024 Performance',
        description: 'Revenue: $2.4M (+18% YoY)',
        footer: 'Updated: ' + new Date().toLocaleDateString(),
      },
      actions: [
        {
          type: 'view_details',
          label: 'View Details',
          handler: 'client',
          payload: { reportId: 'q4-2024' },
        },
      ],
    });
  }

  if (lowerCommand.includes('customer') || lowerCommand.includes('user')) {
    widgets.push({
      type: 'list',
      id: `widget-${Date.now()}-2`,
      props: {
        items: [
          {
            id: 'metric-1',
            title: 'Active Users',
            subtitle: '1,847 users',
            description: '+12% from last month',
          },
          {
            id: 'metric-2',
            title: 'Retention Rate',
            subtitle: '89%',
            description: 'Above industry average',
          },
          {
            id: 'metric-3',
            title: 'Satisfaction Score',
            subtitle: '4.6/5',
            description: 'Based on 234 reviews',
          },
        ],
      },
    });
  }

  // Add task widget for task-related commands
  if (lowerCommand.includes('task') || lowerCommand.includes('todo') || lowerCommand.includes('work') || lowerCommand.includes('completed')) {
    widgets.push({
      type: 'list',
      id: `widget-${Date.now()}-tasks`,
      props: {
        items: [
          {
            id: 'task-1',
            title: 'Implement user authentication',
            subtitle: 'Created just now',
            description: 'Added OAuth 2.0 support with Google and GitHub providers',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            metadata: {
              status: 'created',
              priority: 'high',
              tags: ['backend', 'security']
            }
          },
          {
            id: 'task-2',
            title: 'Update API documentation',
            subtitle: 'Modified 2 minutes ago',
            description: 'Changed endpoint descriptions and added new examples',
            backgroundColor: 'rgba(234, 179, 8, 0.15)',
            metadata: {
              status: 'modified',
              priority: 'medium',
              tags: ['docs']
            }
          },
          {
            id: 'task-3',
            title: 'Fix login redirect bug',
            subtitle: 'Completed 5 minutes ago',
            description: 'Users now properly redirected after successful login',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            metadata: {
              status: 'completed',
              priority: 'urgent',
              tags: ['bugfix', 'auth']
            }
          }
        ],
      },
      actions: [
        {
          type: 'view_task',
          label: 'View',
          handler: 'client',
          payload: {}
        },
        {
          type: 'undo',
          label: 'Undo',
          handler: 'server',
          payload: {}
        }
      ]
    });

    // Agent also wants to update the database after showing tasks
    action = {
      type: 'update_database',
      payload: {
        table: 'tasks',
        operation: 'mark_as_viewed',
        taskIds: ['task-1', 'task-2', 'task-3'],
        timestamp: new Date().toISOString()
      }
    };
  }

  // Add agent action for analysis commands
  if (lowerCommand.includes('analyze') || lowerCommand.includes('analysis')) {
    action = {
      type: 'send_notification',
      payload: {
        recipient: 'team@company.com',
        subject: 'Analysis Complete',
        message: 'Your requested analysis has been completed and is ready for review.'
      }
    };
  }

  return { message, widgets, action };
}

// Simulate streaming command response
export function generateMockCommandStream(
  command: string,
  onChunk: (chunk: { type: 'token' | 'widget' | 'complete'; content?: string; widget?: Widget }) => void,
  onComplete: (threadId: string) => void,
  onError: (error: Error) => void,
  typingSpeed: number = 30
): void {
  const { message, widgets } = generateMockCommandWithWidgets(command);
  const words = message.split(' ');
  let currentIndex = 0;

  const interval = setInterval(() => {
    try {
      if (currentIndex < words.length) {
        onChunk({ type: 'token', content: words[currentIndex] + ' ' });
        currentIndex++;
      } else {
        clearInterval(interval);

        // Send widgets after text is complete
        widgets.forEach(widget => {
          onChunk({ type: 'widget', widget });
        });

        // Signal completion
        const threadId = `mock_thread_${Date.now()}`;
        onChunk({ type: 'complete' });
        onComplete(threadId);
      }
    } catch (error) {
      clearInterval(interval);
      onError(error instanceof Error ? error : new Error('Mock streaming error'));
    }
  }, typingSpeed);
}
