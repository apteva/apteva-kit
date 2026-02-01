'use client';

import { Chat, type Message, type Widget } from '@apteva/apteva-kit';
import Link from 'next/link';
import { useState } from 'react';

// Destination data with images
const destinations = {
  paris: {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    lat: 48.8566,
    lng: 2.3522,
    price: 1200,
    days: 4,
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
    bestTime: 'Apr - Jun, Sep - Nov',
  },
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    lat: 35.6762,
    lng: 139.6503,
    price: 2500,
    days: 7,
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Mt. Fuji Day Trip'],
    bestTime: 'Mar - May, Sep - Nov',
  },
  rome: {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    lat: 41.9028,
    lng: 12.4964,
    price: 1100,
    days: 5,
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
    bestTime: 'Apr - Jun, Sep - Oct',
  },
  bali: {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop',
    lat: -8.3405,
    lng: 115.0920,
    price: 1800,
    days: 10,
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Beach Clubs'],
    bestTime: 'Apr - Oct',
  },
  nyc: {
    id: 'nyc',
    name: 'New York City',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    lat: 40.7128,
    lng: -74.0060,
    price: 2200,
    days: 5,
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty'],
    bestTime: 'Apr - Jun, Sep - Nov',
  },
  barcelona: {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop',
    lat: 41.3851,
    lng: 2.1734,
    price: 1000,
    days: 4,
    highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla'],
    bestTime: 'May - Jun, Sep - Oct',
  },
};

type Destination = typeof destinations.paris;

// Pre-populated messages showing trip planning conversation
const tripMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: "Welcome to Trip Planner AI! I'll help you plan your perfect vacation. Where would you like to go, or would you like me to suggest some destinations based on your preferences?",
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: 'msg-2',
    role: 'user',
    content: "I'm thinking about a European trip, maybe 2 weeks. I love history and good food!",
    timestamp: new Date(Date.now() - 550000),
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: "Europe is perfect for history and food lovers! Based on your interests, I'd recommend combining these three incredible cities. Each offers rich history, world-class cuisine, and unique culture.",
    timestamp: new Date(Date.now() - 500000),
    widgets: [
      {
        type: 'card',
        id: 'dest-paris',
        props: {
          title: 'Paris, France',
          description: '4 days • The City of Light awaits with the Louvre, Eiffel Tower, and incredible bistros.',
          image: destinations.paris.image,
          footer: '$1,200 estimated',
        },
        actions: [
          { type: 'add_destination', label: 'Add to Trip', handler: 'client', payload: { destination: 'paris' } },
        ],
      } as Widget,
      {
        type: 'card',
        id: 'dest-rome',
        props: {
          title: 'Rome, Italy',
          description: '5 days • Ancient ruins, Vatican treasures, and the best pasta you\'ll ever taste.',
          image: destinations.rome.image,
          footer: '$1,100 estimated',
        },
        actions: [
          { type: 'add_destination', label: 'Add to Trip', handler: 'client', payload: { destination: 'rome' } },
        ],
      } as Widget,
      {
        type: 'card',
        id: 'dest-barcelona',
        props: {
          title: 'Barcelona, Spain',
          description: '4 days • Gaudí\'s masterpieces, tapas bars, and Mediterranean beaches.',
          image: destinations.barcelona.image,
          footer: '$1,000 estimated',
        },
        actions: [
          { type: 'add_destination', label: 'Add to Trip', handler: 'client', payload: { destination: 'barcelona' } },
        ],
      } as Widget,
    ],
  },
  {
    id: 'msg-4',
    role: 'user',
    content: 'These look amazing! What about somewhere in Asia?',
    timestamp: new Date(Date.now() - 400000),
  },
  {
    id: 'msg-5',
    role: 'assistant',
    content: "For an Asian adventure, Tokyo and Bali offer completely different but equally amazing experiences!",
    timestamp: new Date(Date.now() - 350000),
    widgets: [
      {
        type: 'card',
        id: 'dest-tokyo',
        props: {
          title: 'Tokyo, Japan',
          description: '7 days • Ancient temples meet neon-lit streets. Sushi, ramen, and unforgettable experiences.',
          image: destinations.tokyo.image,
          footer: '$2,500 estimated',
        },
        actions: [
          { type: 'add_destination', label: 'Add to Trip', handler: 'client', payload: { destination: 'tokyo' } },
        ],
      } as Widget,
      {
        type: 'card',
        id: 'dest-bali',
        props: {
          title: 'Bali, Indonesia',
          description: '10 days • Spiritual retreats, rice terraces, and pristine beaches. Perfect for relaxation.',
          image: destinations.bali.image,
          footer: '$1,800 estimated',
        },
        actions: [
          { type: 'add_destination', label: 'Add to Trip', handler: 'client', payload: { destination: 'bali' } },
        ],
      } as Widget,
    ],
  },
];

export default function TripPlannerExample() {
  const [itinerary, setItinerary] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [tripDates, setTripDates] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'budget'>('map');

  const totalCost = itinerary.reduce((sum, dest) => sum + dest.price, 0);
  const totalDays = itinerary.reduce((sum, dest) => sum + dest.days, 0);

  const handleAction = (action: { type: string; payload?: any }) => {
    console.log('Action received:', action);

    if (action.type === 'add_destination') {
      const destKey = action.payload?.destination;
      const destination = destinations[destKey as keyof typeof destinations];
      if (destination && !itinerary.find(d => d.id === destination.id)) {
        setItinerary([...itinerary, destination]);
        setSelectedDestination(destination);
      }
    }

    if (action.type === 'view_destination') {
      const destKey = action.payload?.destination;
      const destination = destinations[destKey as keyof typeof destinations];
      if (destination) {
        setSelectedDestination(destination);
        setActiveTab('map');
      }
    }
  };

  const removeFromItinerary = (id: string) => {
    setItinerary(itinerary.filter(d => d.id !== id));
    if (selectedDestination?.id === id) {
      setSelectedDestination(null);
    }
  };

  const moveInItinerary = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= itinerary.length) return;
    const newItinerary = [...itinerary];
    [newItinerary[fromIndex], newItinerary[toIndex]] = [newItinerary[toIndex], newItinerary[fromIndex]];
    setItinerary(newItinerary);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-black">
      {/* Header */}
      <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Trip Planner</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">AI-powered travel planning</p>
            </div>
          </div>
        </div>

        {/* Trip Summary in Header */}
        <div className="flex items-center gap-6">
          {itinerary.length > 0 && (
            <>
              <div className="text-right">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Destinations</div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{itinerary.length} places</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Duration</div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{totalDays} days</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Est. Budget</div>
                <div className="text-sm font-semibold text-blue-600">${totalCost.toLocaleString()}</div>
              </div>
            </>
          )}
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={itinerary.length === 0}>
            Book Trip
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat */}
        <div className="w-[420px] border-r border-neutral-200 dark:border-neutral-800 flex flex-col bg-white dark:bg-neutral-900">
          <Chat
            agentId="trip-planner"
            initialMessages={tripMessages}
            useMock={true}
            showHeader={false}
            placeholder="Ask about destinations, activities, or budget..."
            onAction={handleAction}
            className="h-full"
          />
        </div>

        {/* Right Panel - Map/Itinerary/Budget */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center px-4 gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'map'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map
              </span>
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'itinerary'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Itinerary
                {itinerary.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">{itinerary.length}</span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'budget'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Budget
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Map View */}
            {activeTab === 'map' && (
              <div className="h-full flex">
                {/* World Map Visualization */}
                <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-neutral-900 dark:to-neutral-800">
                  {/* SVG World Map (simplified) */}
                  <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
                    <ellipse cx="500" cy="250" rx="480" ry="230" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300 dark:text-blue-800" />
                    <ellipse cx="500" cy="250" rx="480" ry="230" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="20,10" className="text-blue-200 dark:text-blue-900" transform="rotate(30 500 250)" />
                    <ellipse cx="500" cy="250" rx="480" ry="230" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="20,10" className="text-blue-200 dark:text-blue-900" transform="rotate(-30 500 250)" />
                  </svg>

                  {/* Destination Markers */}
                  {itinerary.map((dest, index) => {
                    // Simple lat/lng to x/y conversion
                    const x = ((dest.lng + 180) / 360) * 100;
                    const y = ((90 - dest.lat) / 180) * 100;
                    return (
                      <button
                        key={dest.id}
                        onClick={() => setSelectedDestination(dest)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                          selectedDestination?.id === dest.id ? 'scale-125 z-10' : 'hover:scale-110'
                        }`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                          selectedDestination?.id === dest.id ? 'bg-blue-600 ring-4 ring-blue-300' : 'bg-red-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-white dark:bg-neutral-800 px-2 py-1 rounded text-xs font-medium shadow-md">
                          {dest.name}
                        </div>
                      </button>
                    );
                  })}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {itinerary.slice(0, -1).map((dest, index) => {
                      const next = itinerary[index + 1];
                      const x1 = ((dest.lng + 180) / 360) * 100;
                      const y1 = ((90 - dest.lat) / 180) * 100;
                      const x2 = ((next.lng + 180) / 360) * 100;
                      const y2 = ((90 - next.lat) / 180) * 100;
                      return (
                        <line
                          key={`${dest.id}-${next.id}`}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="rgb(59, 130, 246)"
                          strokeWidth="2"
                          strokeDasharray="8,4"
                          opacity="0.6"
                        />
                      );
                    })}
                  </svg>

                  {/* Empty State */}
                  {itinerary.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No destinations yet</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-sm">
                          Chat with the AI to discover amazing destinations and add them to your trip
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Destination Detail */}
                {selectedDestination && (
                  <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-y-auto">
                    <div className="relative h-48">
                      <img
                        src={selectedDestination.image}
                        alt={selectedDestination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{selectedDestination.name}</h3>
                        <p className="text-white/80 text-sm">{selectedDestination.country}</p>
                      </div>
                      <button
                        onClick={() => setSelectedDestination(null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Recommended</div>
                          <div className="font-semibold text-neutral-900 dark:text-white">{selectedDestination.days} days</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">Est. cost</div>
                          <div className="font-semibold text-blue-600">${selectedDestination.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Best time to visit</div>
                        <div className="text-sm text-neutral-900 dark:text-white">{selectedDestination.bestTime}</div>
                      </div>

                      <div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Highlights</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDestination.highlights.map((h) => (
                            <span key={h} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {itinerary.find(d => d.id === selectedDestination.id) ? (
                        <button
                          onClick={() => removeFromItinerary(selectedDestination.id)}
                          className="w-full py-2 px-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Remove from Trip
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setItinerary([...itinerary, selectedDestination]);
                          }}
                          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add to Trip
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary View */}
            {activeTab === 'itinerary' && (
              <div className="h-full overflow-y-auto p-6">
                {itinerary.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Your itinerary is empty</h3>
                      <p className="text-neutral-500 dark:text-neutral-400">Add destinations from the chat to build your trip</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto space-y-4">
                    {/* Date Picker */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-6">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Trip Dates</h3>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={tripDates.start}
                            onChange={(e) => setTripDates({ ...tripDates, start: e.target.value })}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">End Date</label>
                          <input
                            type="date"
                            value={tripDates.end}
                            onChange={(e) => setTripDates({ ...tripDates, end: e.target.value })}
                            className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Itinerary Items */}
                    {itinerary.map((dest, index) => (
                      <div key={dest.id} className="relative">
                        {/* Connector Line */}
                        {index < itinerary.length - 1 && (
                          <div className="absolute left-6 top-20 w-0.5 h-8 bg-blue-200 dark:bg-blue-800" />
                        )}

                        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex">
                          <div className="w-32 h-24 flex-shrink-0">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-neutral-900 dark:text-white">{dest.name}</h4>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{dest.country} • {dest.days} days</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-blue-600">${dest.price.toLocaleString()}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => moveInItinerary(index, 'up')}
                                  disabled={index === 0}
                                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 disabled:opacity-30"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => moveInItinerary(index, 'down')}
                                  disabled={index === itinerary.length - 1}
                                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 disabled:opacity-30"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeFromItinerary(dest.id)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Trip Summary */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">Total Trip</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{totalDays} days, {itinerary.length} destinations</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-blue-700 dark:text-blue-300">Estimated Budget</div>
                          <div className="text-2xl font-bold text-blue-600">${totalCost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Budget View */}
            {activeTab === 'budget' && (
              <div className="h-full overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto">
                  {itinerary.length === 0 ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No budget to show</h3>
                        <p className="text-neutral-500 dark:text-neutral-400">Add destinations to see your budget breakdown</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Total Budget Card */}
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="text-sm opacity-80 mb-1">Total Estimated Budget</div>
                        <div className="text-4xl font-bold mb-4">${totalCost.toLocaleString()}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {itinerary.length} destinations
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {totalDays} days
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${Math.round(totalCost / totalDays)}/day
                          </div>
                        </div>
                      </div>

                      {/* Budget Breakdown */}
                      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                          <h3 className="font-semibold text-neutral-900 dark:text-white">Cost per Destination</h3>
                        </div>
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {itinerary.map((dest) => {
                            const percentage = (dest.price / totalCost) * 100;
                            return (
                              <div key={dest.id} className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <img src={dest.image} alt={dest.name} className="w-10 h-10 rounded-lg object-cover" />
                                    <div>
                                      <div className="font-medium text-neutral-900 dark:text-white">{dest.name}</div>
                                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{dest.days} days</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-neutral-900 dark:text-white">${dest.price.toLocaleString()}</div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{percentage.toFixed(1)}%</div>
                                  </div>
                                </div>
                                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Budget Tips */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Budget Tips</h4>
                            <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                              <li>• Book flights 2-3 months in advance for best prices</li>
                              <li>• Consider shoulder season for lower accommodation costs</li>
                              <li>• Use public transportation to save on local travel</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
