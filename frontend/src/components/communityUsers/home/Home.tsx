import React from 'react';
import { upcomingEventsData, recentOrdersData,myRecipesData } from '../../../../lib/datafile'
import { 
  CalendarClock, 
  Calendar, 
  ShoppingBag, 
  UserRound, 
  Utensils, 
  PenTool, 
  Package,
  Plus,
  Heart,
  MessageSquare,
  HelpCircle,
  Video,
  Info,
  CheckCircle,
  User
} from 'lucide-react';
import StatCard from '../commen/StatCard';

// Mock data for the Recipes section


function Home() {
    return (
        <div className="w-full bg-white py-10 px-2">

            {/* Welcome Banner */}
            <div className="relative w-full h-[180px] md:h-[200px] bg-[#0A4834] rounded-3xl p-6 md:p-10 flex flex-col justify-center overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 md:w-64 md:h-64 bg-[#115C43]/50 rounded-full blur-sm" />
                <div className="relative z-10 space-y-3 max-w-xl md:max-w-2xl">
                    <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">Welcome back, Sarah!</h1>
                    <p className="text-xs md:text-sm text-gray-100/90 leading-relaxed">
                        Your wellness journey continues. Explore new buckwheat recipes, join community events, and stay connected with your nutritionists.
                    </p>
                    <div className="pt-1">
                        <button className="flex items-center gap-2 px-5 py-2 bg-white text-[#0A4834] rounded-xl shadow-md hover:bg-gray-50 transition-colors">
                            <CalendarClock className="w-4 h-4 md:w-5 h-5" strokeWidth={2.5} />
                            <span className="font-semibold text-xs md:text-sm">Book Consultation</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* StatCards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-5">
                <StatCard Icon={ShoppingBag} value="24" label="Total Orders" trend="+12%" iconBgColor="bg-[#E8F0EE]" iconColor="text-[#0A4834]" trendColor="text-[#A68966]" />
                <StatCard Icon={Calendar} value="5" label="Upcoming Events" trend="3 New" iconBgColor="bg-[#F5F1E9]" iconColor="text-[#A68966]" trendColor="text-[#0A4834]" />
                <StatCard Icon={UserRound} value="2" label="Consultations" trend="Active" iconBgColor="bg-[#E8F0EE]" iconColor="text-[#0A4834]" trendColor="text-[#A68966]" />
                <StatCard Icon={Utensils} value="12" label="Submitted Recipes" trend="8 Live" iconBgColor="bg-[#F5F1E9]" iconColor="text-[#A68966]" trendColor="text-[#0A4834]" />
                <StatCard Icon={PenTool} value="7" label="Published Blogs" trend="2 Draft" iconBgColor="bg-[#E8F0EE]" iconColor="text-[#0A4834]" trendColor="text-[#A68966]" />
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-8 p-6 bg-white">
                
                {/* Left Column: Recent Orders & My Recipes */}
                <div className="flex-1 space-y-10">
                    
                    {/* --- Recent Orders --- */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#0A4834]">Recent Orders</h2>
                            <button className="text-sm text-[#A68966] font-semibold hover:underline">View All</button>
                        </div>
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            {recentOrdersData.map((order, index) => (
                                <div key={order.id} className={`flex items-center justify-between p-5 ${index !== recentOrdersData.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#F3EBE1] rounded-lg flex items-center justify-center text-[#0A4834]"><Package size={24} /></div>
                                        <div>
                                            <h4 className="font-bold text-[#0A4834] text-sm md:text-base">{order.name}</h4>
                                            <p className="text-xs text-gray-500">Order {order.id} • {order.date}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.statusColor}`}>{order.status}</span>
                                                <span className="text-[10px] text-gray-400">{order.deliveryDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${order.buttonText === 'Track Order' ? 'border border-[#0A4834] text-[#0A4834] hover:bg-gray-50' : 'bg-[#0A4834] text-white hover:bg-[#083627]'}`}>
                                        {order.buttonText}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- My Recipes --- */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#0A4834]">My Recipes</h2>
                            <button className="flex items-center gap-2 bg-[#A68966] text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:opacity-90">
                                <Plus size={16} /> Add Recipe
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myRecipesData.map((recipe) => (
                                <div key={recipe.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                                    <div className={`h-32 ${recipe.imageBg} flex items-center justify-center`}>
                                        {recipe.status === 'Approved' ? <Utensils className="text-[#0A4834] w-10 h-10" /> : <HelpCircle className="text-[#0A4834] w-8 h-8 opacity-40" />}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${recipe.status === 'Approved' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF8E1] text-[#F9A825]'}`}>{recipe.status}</span>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">{recipe.category}</span>
                                        </div>
                                        <h4 className="font-bold text-[#0A4834] text-sm">{recipe.name}</h4>
                                        <p className="text-[10px] text-gray-400">Submitted on {recipe.date}</p>
                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                                            {recipe.status === 'Approved' ? (
                                                <><span className="text-[10px] text-gray-500 flex items-center gap-1">{recipe.likes} likes <Heart size={10} className="fill-[#A68966] text-[#A68966]" /></span>
                                                <span className="text-[10px] text-gray-500 flex items-center gap-1">{recipe.comments} comments <MessageSquare size={10} /></span></>
                                            ) : (
                                                <><span className="text-[10px] text-gray-400 italic">Under review</span>
                                                <button className="text-[10px] font-bold text-[#A68966] hover:underline">Edit</button></>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Upcoming Events, Consultation & Alerts */}
                <div className="w-full lg:w-80 space-y-8">
                    
                    {/* --- Upcoming Events --- */}
                    <section>
                        <h2 className="text-xl font-bold text-[#0A4834] mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {upcomingEventsData.map((event) => (
                                <div key={event.date} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white ${event.theme === 'golden' ? 'bg-[#A68966]' : 'bg-[#0A4834]'}`}>
                                            <span className="text-[8px] font-bold uppercase">{event.month}</span>
                                            <span className="text-lg font-bold leading-none">{event.date}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0A4834] text-sm">{event.title}</h4>
                                            <p className="text-[10px] text-gray-500">{event.time}</p>
                                        </div>
                                    </div>
                                    <button className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${event.theme === 'outline' ? 'border border-[#0A4834] text-[#0A4834] hover:bg-gray-50' : event.theme === 'golden' ? 'bg-[#A68966] text-white hover:bg-[#947a5b]' : 'bg-[#0A4834] text-white hover:bg-[#083627]'}`}>
                                        {event.theme === 'outline' ? 'View Details' : 'Join Event'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* --- Consultation Card --- */}
                    <section className="bg-[#A68966] rounded-3xl p-5 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Next Consultation</h4>
                                <p className="text-xs opacity-90">Dr. Emily Chen</p>
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 mb-4 space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar size={14} /> <span>Jan 8, 2025 at 3:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Video size={14} /> <span>Video Call Session</span>
                            </div>
                        </div>
                        <button className="w-full bg-white text-[#A68966] py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                            Join Session
                        </button>
                    </section>

                    {/* --- Community Alerts --- */}
                    <section>
                        <h2 className="text-xl font-bold text-[#0A4834] mb-4">Community Alerts</h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-[#EEF4FF] rounded-2xl border border-blue-100">
                                <Info className="text-blue-600 w-5 h-5 shrink-0" />
                                <div>
                                    <h5 className="text-sm font-bold text-[#1E3A8A]">New Recipe Challenge</h5>
                                    <p className="text-[11px] text-blue-700 opacity-80">Submit your best buckwheat recipe by Jan 15</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-[#ECFDF5] rounded-2xl border border-emerald-100">
                                <CheckCircle className="text-emerald-600 w-5 h-5 shrink-0" />
                                <div>
                                    <h5 className="text-sm font-bold text-[#065F46]">Diet Plan Updated</h5>
                                    <p className="text-[11px] text-emerald-700 opacity-80">Your nutritionist added new meal suggestions</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Home;