import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Mail, 
  Apple, 
  Heart, 
  Video, 
  MapPin, 
  Search, 
  ChevronDown, 
  Bell, 
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Share2
} from 'lucide-react';

const mockUpcomingEvents = [
  {
    id: 'buckwheat-nutrition-masterclass',
    title: 'Buckwheat Nutrition Masterclass',
    type: 'Nutrition Session',
    typeColor: 'bg-orange-100 text-orange-800',
    description: 'Learn about the incredible health benefits of buckwheat and how to incorporate it into your daily diet.',
    locationType: 'Online',
    joined: 24,
    date: 'Tomorrow, 2:00 PM',
    icon: Apple,
    detailsHref: '/communityDashBorde/events/buckwheat-nutrition-masterclass',
    actions: ['View Details', 'Add Reminder']
  },
  {
    id: 'wellness-workshop-mindful-eating',
    title: 'Wellness Workshop: Mindful Eating',
    type: 'Wellness Workshop',
    typeColor: 'bg-purple-100 text-purple-800',
    description: 'Discover the art of mindful eating and how it can transform your relationship with food.',
    locationType: 'Community Center',
    joined: 18,
    date: 'March 15, 10:00 AM',
    icon: Heart,
    detailsHref: '/communityDashBorde/events/wellness-workshop-mindful-eating',
    actions: ['Join Event']
  },
  {
    id: 'community-recipe-sharing',
    title: 'Community Recipe Sharing',
    type: 'Community Meetup',
    typeColor: 'bg-blue-100 text-blue-800',
    description: 'Share your favorite buckwheat recipes and learn new cooking techniques from fellow community members.',
    locationType: 'Online',
    joined: 32,
    date: 'March 20, 6:00 PM',
    icon: Users,
    detailsHref: '/communityDashBorde/events/community-recipe-sharing',
    actions: ['Join Event']
  }
];

const mockJoinedEvents = [
  {
    id: 'buckwheat-nutrition-masterclass',
    title: 'Buckwheat Nutrition Masterclass',
    status: 'Confirmed',
    statusBg: 'bg-green-100 text-green-800',
    type: 'Online Event',
    extraInfo: 'Reminder Set',
    extraIcon: Bell,
    dateDay: 'Tomorrow',
    time: '2:00 PM',
    primaryAction: 'Join Now',
    iconAction: ExternalLink,
    detailsHref: '/communityDashBorde/events/buckwheat-nutrition-masterclass'
  },
  {
    id: 'weekly-nutrition-q-and-a',
    title: 'Weekly Nutrition Q&A',
    status: 'Registered',
    statusBg: 'bg-orange-100 text-orange-800',
    type: 'Online Event',
    extraInfo: 'Live Q&A',
    extraIcon: HelpCircle,
    dateDay: 'March 18',
    time: '7:00 PM',
    primaryAction: 'View Details',
    detailsHref: '/communityDashBorde/events/weekly-nutrition-q-and-a'
  }
];

export default function EventsDashboard() {
  return (
    <div className="flex-1 p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#06402B] mb-1">My Events</h1>
          <p className="text-gray-500 text-sm">Stay connected with wellness sessions, community meetups, and expert-led events.</p>
        </div>
        <button className="flex items-center space-x-2 bg-[#06402B] text-white px-4 py-2 rounded-md hover:bg-[#053020] transition">
          <Search size={16} />
          <span>Explore Events</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <div className="bg-green-100 p-2 rounded-md">
              <Calendar size={20} className="text-[#06402B]" />
            </div>
            <span className="text-2xl font-bold text-[#06402B]">3</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Upcoming Events</h3>
            <p className="text-xs text-gray-500 mt-1">Next: Tomorrow 2:00 PM</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-28">
           <div className="flex justify-between items-start">
            <div className="bg-orange-100 p-2 rounded-md">
              <Users size={20} className="text-orange-700" />
            </div>
            <span className="text-2xl font-bold text-orange-700">7</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Joined Events</h3>
            <p className="text-xs text-gray-500 mt-1">Active registrations</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-28">
           <div className="flex justify-between items-start">
            <div className="bg-green-100 p-2 rounded-md">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">12</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Completed</h3>
            <p className="text-xs text-gray-500 mt-1">Events attended</p>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-28">
           <div className="flex justify-between items-start">
            <div className="bg-orange-100 p-2 rounded-md">
              <Mail size={20} className="text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">2</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Invitations</h3>
            <p className="text-xs text-gray-500 mt-1">Pending responses</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex space-x-2">
          {['All Events', 'Upcoming', 'Joined', 'Completed', 'Invitations'].map((tab, idx) => (
            <button 
              key={tab} 
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${idx === 0 ? 'bg-[#06402B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#06402B]"
            />
          </div>
          <div className="relative">
            <button className="flex items-center justify-between space-x-4 border border-gray-200 rounded-md px-4 py-1.5 text-sm text-gray-700 bg-white">
              <span>All Types</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          {/* Upcoming Events Section */}
          <section>
            <h2 className="text-[#06402B] font-bold text-lg mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {mockUpcomingEvents.map((ev) => (
                <div key={ev.id} className="bg-white border text-left border-gray-200 rounded-lg p-0 flex shadow-sm overflow-hidden">
                  {/* Left Icon Block */}
                  <div className="bg-[#06402B] w-24 flex items-center justify-center flex-shrink-0">
                    <ev.icon size={28} className="text-white" />
                  </div>
                  {/* Content */}
                  <div className="p-4 flex-1 flex justify-between items-start">
                    <div className="pr-4 max-w-[70%]">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-gray-800 text-[15px]">{ev.title}</h3>
                      </div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium mb-3 ${ev.typeColor}`}>
                        {ev.type}
                      </span>
                      <p className="text-sm text-gray-600 mb-4">{ev.description}</p>
                      
                      <div className="flex items-center space-x-6 text-xs text-gray-500 font-medium">
                        <div className="flex items-center space-x-1.5">
                          {ev.locationType === 'Online' ? <Video size={14} /> : <MapPin size={14} />}
                          <span>{ev.locationType}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Users size={14} />
                          <span>{ev.joined} joined</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between h-full space-y-8 min-w-[140px]">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{ev.date}</span>
                      <div className="flex space-x-2">
                        {ev.actions.map(action => (
                          action === 'View Details' ? (
                            <Link
                              key={action}
                              href={ev.detailsHref}
                              className="bg-[#06402B] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#053020]"
                            >
                              {action}
                            </Link>
                          ) : action === 'Join Event' ? (
                            <button key={action} className="bg-[#06402B] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#053020]">
                              {action}
                            </button>
                          ) : (
                            <button key={action} className="border border-gray-300 text-gray-600 text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-50">
                              {action}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* My Joined Events Section */}
          <section>
            <h2 className="text-[#06402B] font-bold text-lg mb-4">My Joined Events</h2>
            <div className="space-y-4">
               {mockJoinedEvents.map((ev) => (
                <div key={ev.id} className="bg-white border text-left border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-800 text-[15px] mb-2">{ev.title}</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded-xl text-[11px] font-medium mb-4 ${ev.statusBg}`}>
                      {ev.status}
                    </span>
                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                      <div className="flex items-center space-x-1.5">
                        <Video size={14} />
                        <span>{ev.type}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <ev.extraIcon size={14} />
                        <span>{ev.extraInfo}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                       <p className="text-sm font-semibold text-gray-800">{ev.dateDay}</p>
                       <p className="text-xs text-gray-500">{ev.time}</p>
                    </div>
                    {ev.iconAction ? (
                      <button className="flex items-center space-x-2 bg-[#06402B] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#053020]">
                        <ev.iconAction size={14} />
                        <span>{ev.primaryAction}</span>
                      </button>
                    ) : ev.primaryAction === 'View Details' ? (
                      <Link href={ev.detailsHref} className="border border-gray-300 text-gray-600 text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-50">
                        {ev.primaryAction}
                      </Link>
                    ) : (
                      <button className="border border-gray-300 text-gray-600 text-xs font-semibold px-4 py-2 rounded-md hover:bg-gray-50">
                        {ev.primaryAction}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="w-80 space-y-6">
          {/* Event Calendar */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-[#06402B] font-bold text-[15px] mb-4">Event Calendar</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <div className="relative flex items-center justify-between md:-my-5r">
                <div className="flex items-center w-full bg-[#f3ecd9] p-3 rounded-md">
                  <div className="w-2.5 h-2.5 bg-[#06402B] rounded-full mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Tomorrow</h4>
                    <p className="text-[11px] text-gray-600">Nutrition Masterclass</p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:-my-5r">
                <div className="flex items-center w-full p-2 hover:bg-gray-50 rounded-md transition cursor-pointer">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">March 15</h4>
                    <p className="text-[11px] text-gray-600">Wellness Workshop</p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:-my-5r">
                <div className="flex items-center w-full p-2 hover:bg-gray-50 rounded-md transition cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">March 20</h4>
                    <p className="text-[11px] text-gray-600">Recipe Sharing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Alerts */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
             <h3 className="text-[#06402B] font-bold text-[15px] mb-4">Event Alerts</h3>
             <div className="space-y-3">
               <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                 <div className="flex items-center space-x-2 mb-1.5">
                   <Bell size={14} className="text-orange-600" />
                   <span className="text-xs font-bold text-orange-900">New Event Available</span>
                 </div>
                 <p className="text-xs text-orange-800 mb-2 leading-relaxed">Advanced Buckwheat Cooking - Limited seats</p>
                 <button className="text-xs font-semibold text-orange-600 hover:text-orange-700">Register Now</button>
               </div>
               
               <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                 <div className="flex items-center space-x-2 mb-1.5">
                   <Mail size={14} className="text-blue-600" />
                   <span className="text-xs font-bold text-blue-900">Event Invitation</span>
                 </div>
                 <p className="text-xs text-blue-800 mb-2 leading-relaxed">VIP Nutrition Consultation Session</p>
                 <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View Invitation</button>
               </div>
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
             <h3 className="text-[#06402B] font-bold text-[15px] mb-4">Quick Actions</h3>
             <div className="space-y-1">
               <button className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md transition text-sm font-medium text-gray-700">
                 <RefreshCw size={16} className="text-[#06402B]" />
                 <span>Sync Calendar</span>
               </button>
               <button className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md transition text-sm font-medium text-gray-700">
                 <Share2 size={16} className="text-[#06402B]" />
                 <span>Invite Friends</span>
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
