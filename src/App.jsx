import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  MapPin, 
  CreditCard, 
  User, 
  ChevronLeft, 
  Clock, 
  Ticket, 
  Star, 
  LogOut,
  Wallet,
  QrCode,
  CheckCircle,
  Plus,
  Minus,
  History,
  Settings,
  Bell,
  Trophy,
  X,
  Share2,
  PlayCircle,
  Download,
  Edit2,
  HelpCircle,
  Tag,
  MessageCircle,
  ChevronRight,
  Grid
} from 'lucide-react';

/**
 * EPIKO SHOWS - QA FINAL VERSION (v3.0)
 * * Changelog:
 * - Payment: Added Credit/Debit Card Input Form & Flow
 * - Logic: Functional Coupon Code System (WELCOME50, BLOCKBUSTER)
 * - UI: "See All" Movies View
 * - UI: Hidden Scrollbars CSS Injection
 * - UX: Enhanced Touch Feedback & Toast Messages
 */

// --- MOCK DATABASE ---
const MOCK_DB = {
  user: {
    name: "Arjun Mehta",
    email: "arjun.m@epiko.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60",
    walletBalance: 850.00,
    loyaltyPoints: 1240
  },
  movies: [
    {
      id: 1,
      title: "Interstellar 2",
      genre: "Sci-Fi / Drama",
      rating: 4.8,
      language: "English",
      duration: "2h 45m",
      poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=60", 
      synopsis: "Cooper returns to find a new wormhole opening near Saturn, threatening the fragile existence of humanity's new colony.",
      status: "Now Showing",
      cast: ["Matthew McConaughey", "Jessica Chastain"]
    },
    {
      id: 2,
      title: "The Batman: Part II",
      genre: "Action / Crime",
      rating: 4.6,
      language: "English",
      duration: "2h 55m",
      poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      synopsis: "Bruce Wayne faces a new threat in Gotham as the Penguin rises to power in the flooded city.",
      status: "Now Showing",
      cast: ["Robert Pattinson", "Colin Farrell"]
    },
    {
      id: 3,
      title: "Dune: Messiah",
      genre: "Sci-Fi / Epic",
      rating: 4.9,
      language: "English",
      duration: "3h 05m",
      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", 
      synopsis: "Paul Atreides struggles with his destiny as the Emperor of the Known Universe.",
      status: "Upcoming",
      cast: ["Timothée Chalamet", "Zendaya"]
    },
    {
      id: 4,
      title: "Spider-Man: Beyond",
      genre: "Animation / Action",
      rating: 4.9,
      language: "English",
      duration: "2h 20m",
      poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      synopsis: "Miles Morales travels through the multiverse to save his father from a predestined fate.",
      status: "Now Showing",
      cast: ["Shameik Moore", "Hailee Steinfeld"]
    },
    {
      id: 5,
      title: "Oppenheimer Re-Release",
      genre: "Biography / Drama",
      rating: 4.7,
      language: "English",
      duration: "3h 00m",
      poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      status: "Now Showing",
      cast: ["Cillian Murphy", "Robert Downey Jr."]
    },
    {
      id: 6,
      title: "Gladiator II",
      genre: "Action / History",
      rating: 4.5,
      language: "English",
      duration: "2h 30m",
      poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmf4ooJ74GX8f.jpg",
      synopsis: "Lucius, the son of Maximus's love Lucilla, becomes a gladiator after his home is conquered.",
      status: "Upcoming",
      cast: ["Paul Mescal", "Denzel Washington"]
    }
  ],
  theatres: [
    { id: 1, name: "PVR: Phoenix Marketcity", location: "Viman Nagar", times: ["10:00 AM", "01:30 PM", "05:00 PM", "09:30 PM"] },
    { id: 2, name: "INOX: Laserplex", location: "Bund Garden", times: ["11:00 AM", "02:00 PM", "06:15 PM", "10:00 PM"] },
    { id: 3, name: "Cinepolis: VIP Seasons", location: "Hadapsar", times: ["12:30 PM", "04:30 PM", "08:00 PM"] }
  ],
  transactions: [
    { id: 101, title: "Added Money", amount: 500, type: "credit", date: "2024-05-20" },
    { id: 102, title: "Interstellar 2", amount: -450, type: "debit", date: "2024-05-18" },
    { id: 103, title: "Refund: The Batman", amount: 300, type: "credit", date: "2024-05-10" }
  ],
  coupons: {
    'WELCOME50': { type: 'percent', value: 50, max: 150 },
    'BLOCKBUSTER': { type: 'flat', value: 100 }
  }
};

const SEAT_ROWS = [
  { id: 'A', price: 150, type: 'Standard' },
  { id: 'B', price: 150, type: 'Standard' },
  { id: 'C', price: 220, type: 'Premium' },
  { id: 'D', price: 220, type: 'Premium' },
  { id: 'E', price: 450, type: 'VIP' },
];

// --- UTILS ---
const generateDates = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    let label = days[d.getDay()];
    if (i === 0) label = 'Today';
    if (i === 1) label = 'Tomorrow';
    
    dates.push({
      fullLabel: label,
      day: d.getDate(),
      iso: d.toISOString().split('T')[0]
    });
  }
  return dates;
};

// --- APP COMPONENT ---

const App = () => {
  // Global State
  const [currentScreen, setCurrentScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(null);

  // Selection State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Refs for scroll management
  const screenRef = useRef(null);
  const upcomingDates = useMemo(() => generateDates(), []);

  // CSS Injection for Hide Scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Helpers
  const navigate = (screen) => {
    setCurrentScreen(screen);
    if (screenRef.current) screenRef.current.scrollTop = 0;
  };
  
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Initialize Mock Data on Login
  const loginUser = () => {
    setUser(MOCK_DB.user);
    setWallet(MOCK_DB.user.walletBalance);
    setLoyaltyPoints(MOCK_DB.user.loyaltyPoints);
    setTransactions(MOCK_DB.transactions);
    
    setBookings([
      {
        id: 999,
        movie: MOCK_DB.movies[1],
        theatre: MOCK_DB.theatres[0],
        date: upcomingDates[0].iso,
        time: "09:30 PM",
        seats: [{id: "C4", price: 220}, {id: "C5", price: 220}],
        total: 440,
        status: "Completed"
      }
    ]);
    navigate('home');
    showToast(`Welcome back, ${MOCK_DB.user.name.split(' ')[0]}!`);
  };

  // --- SUB-SCREENS ---

  const SeeAllMoviesScreen = ({ filter }) => {
    const filtered = MOCK_DB.movies.filter(m => filter === 'All' ? true : m.status === filter);

    return (
      <div className="min-h-full bg-gray-950 flex flex-col">
         <div className="p-4 flex items-center gap-4 border-b border-gray-900 bg-gray-950 sticky top-0 z-10">
            <button onClick={() => navigate('home')} className="text-white p-2 -ml-2"><ChevronLeft /></button>
            <h2 className="text-white font-bold text-lg">{filter === 'All' ? 'All Movies' : filter}</h2>
         </div>
         <div className="p-4 grid grid-cols-2 gap-4">
            {filtered.map(movie => (
               <div key={movie.id} onClick={() => { setSelectedMovie(movie); navigate('movie-details'); }} className="cursor-pointer">
                 <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative shadow-lg bg-gray-900">
                   <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                 </div>
                 <h4 className="text-white font-bold text-sm truncate">{movie.title}</h4>
                 <p className="text-gray-500 text-xs">{movie.genre.split('/')[0]}</p>
               </div>
            ))}
         </div>
      </div>
    );
  };

  const EditProfileScreen = () => {
    const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone });
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);

    const handleSave = () => {
      setUser({ ...user, ...formData, avatar: avatarPreview });
      navigate('profile');
      showToast('Profile updated successfully');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
      <div className="min-h-full bg-gray-950 flex flex-col p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('profile')} className="text-white bg-gray-900 p-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-white font-bold text-xl">Edit Profile</h2>
        </div>
        <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800">
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-500 border-4 border-gray-950">
                    <Edit2 className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
            </div>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:border-red-500 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-2">
                <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Email Address</label>
                <input type="email" value={formData.email} disabled className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 text-gray-500 cursor-not-allowed text-sm font-medium" />
            </div>
            <div className="space-y-2">
                <label className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white focus:border-red-500 outline-none text-sm font-medium" />
            </div>
        </div>
        <button onClick={handleSave} className="mt-auto w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 hover:bg-red-500 transition-colors">Save Changes</button>
      </div>
    );
  };

  const RoyaltyScreen = () => (
      <div className="min-h-full bg-gray-950 flex flex-col p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('profile')} className="text-white bg-gray-900 p-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-white font-bold text-xl">Epiko Royalty</h2>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-6 text-white shadow-2xl mb-8 relative overflow-hidden border border-yellow-600/30">
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
             <div className="flex justify-between items-start mb-4">
                <div><p className="text-yellow-200 text-[10px] font-bold uppercase tracking-widest">Total Points</p><h3 className="text-4xl font-black mt-1 tracking-tight">{loyaltyPoints}</h3></div>
                <div className="bg-yellow-900/40 p-2 rounded-full backdrop-blur-sm"><Trophy className="w-6 h-6 text-yellow-300" /></div>
             </div>
             <div className="w-full bg-black/20 h-2 rounded-full mb-2 overflow-hidden"><div className="bg-white h-full rounded-full shadow-[0_0_10px_white]" style={{ width: '65%' }}></div></div>
             <p className="text-xs font-medium text-yellow-100 flex justify-between"><span>Silver Tier</span><span>760 pts to Gold</span></p>
        </div>
        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Redeem Rewards</h3>
        <div className="space-y-3 overflow-y-auto pb-10">
            {[{ title: "Free Popcorn (Regular)", points: 500, icon: "🍿" }, { title: "₹100 Off Voucher", points: 1000, icon: "🎟️" }].map((r, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-4"><span className="text-2xl bg-gray-800 w-10 h-10 flex items-center justify-center rounded-full">{r.icon}</span><div><p className="text-white font-bold text-sm">{r.title}</p><p className="text-gray-500 text-xs">{r.points} pts</p></div></div>
                    <button disabled={loyaltyPoints < r.points} onClick={() => showToast(`Redeemed: ${r.title}`)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${loyaltyPoints >= r.points ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Redeem</button>
                </div>
            ))}
        </div>
      </div>
  );

  const VouchersScreen = () => (
    <div className="min-h-full bg-gray-950 flex flex-col p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('profile')} className="text-white bg-gray-900 p-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-white font-bold text-xl">Passes & Vouchers</h2>
        </div>
        <div className="space-y-4">
            {[{ code: "WELCOME50", desc: "Get 50% off on your first booking upto ₹150", valid: "Valid till 30 Dec" }, { code: "BLOCKBUSTER", desc: "Flat ₹100 off on IMAX shows", valid: "Valid till Sun" }].map((v, i) => (
                <div key={i} className="bg-white text-black p-5 rounded-2xl relative overflow-hidden shadow-lg">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-950 rounded-full"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-950 rounded-full"></div>
                    <div className="flex justify-between items-start mb-2 pl-2"><span className="bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Coupon</span><span className="text-xs font-bold text-gray-500">{v.valid}</span></div>
                    <h3 className="font-black text-2xl pl-2 mb-1 tracking-tight">{v.code}</h3>
                    <p className="text-xs text-gray-600 pl-2 leading-relaxed font-medium">{v.desc}</p>
                    <button onClick={() => showToast('Code copied!')} className="mt-4 w-full py-3 border-t border-dashed border-gray-300 font-bold text-xs uppercase hover:bg-gray-50 transition-colors text-gray-800">Tap to Copy Code</button>
                </div>
            ))}
        </div>
    </div>
  );

  // --- MAIN SCREENS ---

  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if(!email || !password) { showToast("Please enter email and password", "error"); return; }
        loginUser();
    };

    return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="mb-8 text-center z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-900/50 rotate-3 border border-white/10"><Ticket className="w-10 h-10 text-white" /></div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">EPIKO SHOWS</h1>
        <p className="text-gray-400 tracking-widest text-xs uppercase font-semibold">Cinematic Experience</p>
      </div>
      <div className="w-full space-y-4 z-10">
        <div className="space-y-3">
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
            <div className="flex justify-end"><button onClick={() => navigate('forgot-password')} className="text-xs text-gray-500 hover:text-white transition-colors">Forgot Password?</button></div>
        </div>
        <button onClick={handleLogin} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-900/20">Login</button>
        
        <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div><div className="relative flex justify-center text-xs"><span className="bg-gray-950 px-2 text-gray-500">Or continue with</span></div></div>
        
        <div className="grid grid-cols-2 gap-3">
            <button onClick={loginUser} className="py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" /><span className="text-sm font-bold">Google</span></button>
            <button onClick={loginUser} className="py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"><svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.54 1.85.08 3.2.76 4.08 1.97-3.61 1.92-3 6.45.54 7.78-.62 1.62-1.59 3.31-3.08 4.02zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path></svg><span className="text-sm font-bold">Apple</span></button>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500">Don't have an account? <button onClick={() => navigate('signup')} className="text-red-500 font-bold hover:underline">Sign Up</button></p>
    </div>
    );
  };

  const SignupScreen = () => {
      const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
      const handleSignup = () => {
          if(!formData.name || !formData.email || !formData.password) { showToast("Please fill all fields", "error"); return; }
          if(formData.password !== formData.confirmPassword) { showToast("Passwords do not match", "error"); return; }
          showToast("Account created successfully!");
          loginUser();
      };
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 bg-gray-950 text-white relative overflow-hidden">
            <div className="w-full max-w-sm z-10">
                <h2 className="text-3xl font-black text-white mb-8 text-center">Create Account</h2>
                <div className="space-y-3 mb-6">
                    <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
                    <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
                    <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
                    <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
                </div>
                <button onClick={handleSignup} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-900/20 mb-6">Sign Up</button>
                
                <div className="relative py-2 mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div><div className="relative flex justify-center text-xs"><span className="bg-gray-950 px-2 text-gray-500">Or continue with</span></div></div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button onClick={loginUser} className="py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" /><span className="text-sm font-bold">Google</span></button>
                    <button onClick={loginUser} className="py-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"><svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.54 1.85.08 3.2.76 4.08 1.97-3.61 1.92-3 6.45.54 7.78-.62 1.62-1.59 3.31-3.08 4.02zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path></svg><span className="text-sm font-bold">Apple</span></button>
                </div>

                <p className="text-center text-sm text-gray-500">Already have an account? <button onClick={() => navigate('login')} className="text-red-500 font-bold hover:underline">Login</button></p>
            </div>
        </div>
      );
  };

  const ForgotPasswordScreen = () => {
      const [email, setEmail] = useState('');
      const handleReset = () => {
          if(!email) { showToast("Please enter your email", "error"); return; }
          showToast("Reset link sent to your email");
          navigate('login');
      };
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 bg-gray-950 text-white relative overflow-hidden">
            <div className="w-full max-w-sm z-10">
                <button onClick={() => navigate('login')} className="mb-8 text-gray-500 hover:text-white flex items-center gap-2"><ChevronLeft className="w-5 h-5" /> Back to Login</button>
                <h2 className="text-3xl font-black text-white mb-2">Forgot Password?</h2>
                <p className="text-gray-500 mb-8 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                <div className="space-y-4 mb-6">
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-red-500 transition-colors" />
                </div>
                <button onClick={handleReset} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition shadow-lg shadow-red-900/20">Send Reset Link</button>
            </div>
        </div>
      );
  };

  const HomeScreen = () => {
    const [filter, setFilter] = useState('Now Showing');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMovies = useMemo(() => {
      return MOCK_DB.movies.filter(m => {
        const matchesStatus = filter === 'All' ? true : m.status === filter;
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      });
    }, [filter, searchTerm]);

    return (
      <div className="min-h-full pb-20 bg-gray-950">
        <div className="p-6 flex justify-between items-center sticky top-0 bg-gray-950/90 backdrop-blur-md z-20 border-b border-gray-800/50">
          <div><p className="text-gray-400 text-xs font-medium mb-0.5">Welcome back,</p><h2 className="text-white text-xl font-bold tracking-tight">{user?.name.split(' ')[0]} 👋</h2></div>
          <div onClick={() => navigate('profile')} className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 p-[2px] cursor-pointer hover:scale-105 transition"><img src={user?.avatar} className="w-full h-full rounded-full object-cover" alt="Profile" /></div>
        </div>
        <div className="px-6 mb-6 mt-2">
          <div className="bg-gray-900 rounded-2xl flex items-center px-4 py-3 border border-gray-800 focus-within:border-red-500/50 transition-colors shadow-lg shadow-black/20">
            <Search className="text-gray-500 w-5 h-5" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Movies, genres, theatres..." className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-600 text-sm font-medium" />
            {searchTerm && <button onClick={() => setSearchTerm('')}><X className="w-4 h-4 text-gray-500" /></button>}
          </div>
        </div>
        <div className="px-6 flex gap-4 mb-6 overflow-x-auto no-scrollbar">
          {['Now Showing', 'Upcoming'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${filter === f ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'}`}>{f}</button>
          ))}
        </div>
        <div className="px-6 pb-4">
          <div className="flex justify-between items-end mb-4">
             <h3 className="text-white font-bold text-lg">All Movies</h3>
             <button onClick={() => navigate('see-all-movies')} className="text-red-500 text-xs font-bold flex items-center">See All <ChevronRight className="w-3 h-3 ml-1" /></button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {filteredMovies.slice(0, 4).map(movie => (
              <div key={movie.id} onClick={() => { setSelectedMovie(movie); navigate('movie-details'); }} className="group cursor-pointer">
                <div className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 relative shadow-2xl bg-gray-900">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-black mb-1"><Star className="w-3 h-3 fill-current" />{movie.rating}</div>
                    <p className="text-white text-xs line-clamp-1 font-medium opacity-80">{movie.genre.split('/')[0]}</p>
                  </div>
                </div>
                <h4 className="text-white font-bold text-sm truncate leading-tight group-hover:text-red-500 transition-colors">{movie.title}</h4>
                <p className="text-gray-600 text-[10px] mt-1">{movie.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const MovieDetailsScreen = () => (
    <div className="min-h-full flex flex-col bg-gray-950 relative">
      <button onClick={() => navigate('home')} className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"><ChevronLeft className="w-5 h-5" /></button>
      <div className="h-[50vh] relative shrink-0"><img src={selectedMovie.poster} className="w-full h-full object-cover" alt="cover" /><div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950"></div></div>
      <div className="px-6 -mt-20 relative z-10 flex-1 flex flex-col pb-6">
        <div className="flex justify-between items-start mb-4"><h1 className="text-3xl font-black text-white leading-tight w-3/4">{selectedMovie.title}</h1><div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg flex flex-col items-center border border-white/10"><span className="text-xs text-gray-400 uppercase font-bold">IMDB</span><span className="text-white font-bold">{selectedMovie.rating}</span></div></div>
        <div className="flex items-center gap-3 text-gray-400 text-xs font-medium mb-6"><span className="bg-gray-800 px-2 py-0.5 rounded border border-gray-700">U/A</span><span>{selectedMovie.language}</span><span className="w-1 h-1 rounded-full bg-gray-600"></span><span>{selectedMovie.duration}</span><span className="w-1 h-1 rounded-full bg-gray-600"></span><span>{selectedMovie.genre.split(' / ')[0]}</span></div>
        <div className="flex gap-3 mb-6"><button className="flex-1 bg-gray-900 border border-gray-800 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition"><PlayCircle className="w-4 h-4" /> Watch Trailer</button><button onClick={() => showToast("Link copied to clipboard")} className="bg-gray-900 border border-gray-800 p-3 rounded-xl text-white hover:bg-gray-800 transition"><Share2 className="w-4 h-4" /></button></div>
        <div className="mb-6"><h3 className="text-white font-bold text-sm mb-2">Synopsis</h3><p className="text-gray-400 text-sm leading-relaxed font-light">{selectedMovie.synopsis}</p></div>
        <button onClick={() => { setSelectedDate(upcomingDates[0]); navigate('theatre-selection'); }} className="mt-auto w-full bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-900/30 hover:bg-red-500 active:scale-[0.98] transition-all">Book Tickets</button>
      </div>
    </div>
  );

  const TheatreSelectionScreen = () => (
    <div className="min-h-full bg-gray-950 flex flex-col">
      <div className="p-4 flex items-center gap-4 border-b border-gray-900 bg-gray-950 sticky top-0 z-10">
        <button onClick={() => navigate('movie-details')} className="text-white p-2 -ml-2"><ChevronLeft /></button>
        <div><h2 className="text-white font-bold text-lg leading-none mb-1">{selectedMovie.title}</h2><p className="text-gray-500 text-xs font-medium">{selectedMovie.duration} • {selectedMovie.language}</p></div>
      </div>
      <div className="flex-1">
        <div className="pt-6 pb-6 px-4 bg-gray-950">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {upcomingDates.map((d, i) => (
                    <div key={i} onClick={() => setSelectedDate(d)} className={`min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border ${selectedDate?.iso === d.iso ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40 scale-105' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{d.fullLabel}</span><span className="text-xl font-black">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>
        <div className="px-4 space-y-4 pb-6">
            {MOCK_DB.theatres.map(theatre => (
            <div key={theatre.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition">
                <div className="flex justify-between items-start mb-5"><div className="flex gap-3"><div className="mt-1"><Star className="w-3 h-3 text-red-500 fill-current" /></div><div><h3 className="text-white font-bold text-sm">{theatre.name}</h3><p className="text-gray-500 text-xs mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {theatre.location}</p></div></div><div className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900/50">M-Ticket</div></div>
                <div className="grid grid-cols-3 gap-3">{theatre.times.map(time => (<button key={time} onClick={() => { setSelectedTheatre(theatre); setSelectedTime(time); setSelectedSeats([]); navigate('seat-selection'); }} className="py-2.5 border border-gray-700 rounded-xl text-white text-xs font-medium hover:bg-gray-800 hover:border-gray-500 transition active:scale-95">{time}</button>))}</div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );

  const SeatSelectionScreen = () => {
    const toggleSeat = (seatId, price) => {
      if (selectedSeats.find(s => s.id === seatId)) {
        setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
      } else {
        if(selectedSeats.length >= 6) { showToast("Maximum 6 seats allowed", "error"); return; }
        setSelectedSeats([...selectedSeats, { id: seatId, price }]);
      }
    };
    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    return (
      <div className="min-h-full bg-gray-950 flex flex-col">
        <div className="p-4 flex justify-between items-center bg-gray-950 z-10 border-b border-gray-900">
            <div className="flex items-center gap-3"><button onClick={() => navigate('theatre-selection')} className="text-white p-1"><ChevronLeft /></button><div><h2 className="text-white font-bold text-sm">{selectedTheatre.name}</h2><p className="text-gray-500 text-[10px]">{selectedDate.fullLabel}, {selectedDate.day} • {selectedTime}</p></div></div>
            <div className="bg-gray-900 px-3 py-1 rounded-full border border-gray-800"><span className="text-xs text-white font-medium">{selectedSeats.length}/6 Seats</span></div>
        </div>
        <div className="flex-1 p-4 relative overflow-x-hidden">
          <div className="w-full h-16 bg-gradient-to-b from-red-600/20 to-transparent rounded-t-[50%] mb-6 relative border-t-2 border-red-600/30 shadow-[0_-10px_40px_rgba(220,38,38,0.15)] transform scale-x-110"><div className="absolute -top-8 w-full text-center text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">Screen this way</div></div>
          <div className="flex justify-center gap-6 mb-8 text-[10px] font-medium text-gray-400">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-900 border border-gray-700 rounded-sm"></div> Available</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-800 rounded-sm"></div> Sold</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm border border-red-500"></div> Selected</div>
          </div>
          <div className="space-y-8 pb-32 px-2">
            {SEAT_ROWS.map(row => (
              <div key={row.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2"><span className="text-gray-600 text-[10px] font-bold w-4">{row.id}</span><div className="h-[1px] bg-gray-800 flex-1"></div><span className="text-gray-500 text-[10px] uppercase tracking-wider">{row.type} — ₹{row.price}</span></div>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {[...Array(8)].map((_, i) => {
                    const seatId = `${row.id}${i + 1}`;
                    const isBookedGlobal = bookings.some(b => b.movie.id === selectedMovie.id && b.theatre.id === selectedTheatre.id && b.date === selectedDate.iso && b.time === selectedTime && b.seats.some(s => s.id === seatId));
                    const isHardcodedBlocked = (row.id === 'C' && i > 4) || (row.id === 'D' && i < 2);
                    const isBooked = isBookedGlobal || isHardcodedBlocked;
                    const isSelected = selectedSeats.find(s => s.id === seatId);
                    return (
                      <button key={seatId} disabled={isBooked} onClick={() => toggleSeat(seatId, row.price)} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-[10px] font-bold transition-all duration-200 flex items-center justify-center ${isBooked ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50 border border-transparent' : isSelected ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110 border border-red-500' : 'bg-gray-900 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-500'}`}>{i + 1}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-5 rounded-t-3xl border-t border-gray-800 shadow-2xl sticky bottom-0 z-20">
          <div className="flex justify-between items-center mb-4"><div><p className="text-gray-400 text-xs font-medium mb-1">Total Price</p><h3 className="text-white text-2xl font-black tracking-tight">₹{totalPrice}</h3></div></div>
          <button disabled={selectedSeats.length === 0} onClick={() => navigate('payment')} className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${selectedSeats.length > 0 ? 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Proceed to Pay</button>
        </div>
      </div>
    );
  };

  const PaymentScreen = () => {
    const baseTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const [discount, setDiscount] = useState(0);
    const total = Math.max(0, baseTotal - discount);
    
    const [processing, setProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null); // 'wallet' | 'card'
    const [showCardModal, setShowCardModal] = useState(false);

    const applyCoupon = () => {
        if(!couponCode) return;
        const coupon = MOCK_DB.coupons[couponCode.toUpperCase()];
        if(coupon) {
            let d = coupon.type === 'flat' ? coupon.value : (baseTotal * coupon.value / 100);
            if(coupon.max && d > coupon.max) d = coupon.max;
            setDiscount(d);
            showToast(`Coupon Applied! ₹${d} Saved`);
        } else {
            showToast("Invalid Coupon Code", "error");
            setDiscount(0);
        }
    };

    const processBooking = () => {
        setProcessing(true);
        setShowCardModal(false);
        setTimeout(() => {
            const newBooking = {
                id: Math.floor(Math.random() * 100000),
                movie: selectedMovie,
                theatre: selectedTheatre,
                time: selectedTime,
                seats: selectedSeats,
                total: total,
                date: selectedDate.iso,
                displayDate: selectedDate.fullLabel + ", " + selectedDate.day,
                status: "Confirmed",
                qrData: `EPIKO-${Date.now()}`
            };
            
            setBookings([newBooking, ...bookings]);
            if(paymentMethod === 'wallet') setWallet(prev => prev - total);
            setLoyaltyPoints(prev => prev + Math.floor(total / 10)); 
            
            setTransactions([{
                id: Date.now(),
                title: `Booking: ${selectedMovie.title}`,
                amount: -total,
                type: 'debit',
                date: 'Just now'
            }, ...transactions]);

            setProcessing(false);
            navigate('confirmation');
            showToast("Booking Confirmed!", "success");
        }, 2500);
    };

    const handlePaymentClick = () => {
        if(!paymentMethod) { showToast("Select a payment method", "error"); return; }
        if(paymentMethod === 'wallet') {
            if(wallet < total) { showToast("Insufficient wallet balance", "error"); return; }
            processBooking();
        }
        if(paymentMethod === 'card') {
            setShowCardModal(true);
        }
    };

    return (
      <div className="min-h-full bg-gray-950 flex flex-col p-6 relative">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('seat-selection')} className="text-white bg-gray-900 p-2 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-white font-bold text-xl">Payment</h2>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-6 border border-gray-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-6">Order Summary</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-start"><div><h4 className="text-white font-bold text-lg">{selectedMovie.title}</h4><p className="text-gray-400 text-xs mt-1">{selectedTheatre.name}</p></div><div className="text-right"><span className="block text-white font-bold">₹{baseTotal}</span><span className="text-gray-500 text-xs">{selectedSeats.length} Seats</span></div></div>
                {discount > 0 && <div className="flex justify-between text-green-500 text-sm"><span>Discount</span><span>- ₹{discount}</span></div>}
                <div className="w-full h-[1px] bg-gray-700 border-dashed"></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Convenience Fee</span><span className="text-white text-sm">₹0 <span className="text-[10px] text-green-500 ml-1">(Waived)</span></span></div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-end"><span className="text-gray-400 font-medium">Total Payable</span><span className="text-3xl font-black text-white">₹{total}</span></div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6 flex items-center gap-3 focus-within:border-red-500 transition">
            <Tag className="w-5 h-5 text-red-500" /><input type="text" placeholder="Apply Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="bg-transparent w-full text-sm outline-none text-white placeholder-gray-600 font-medium uppercase" />
            <button onClick={applyCoupon} className="text-xs font-bold text-red-500 uppercase hover:text-white transition">Apply</button>
        </div>

        <h3 className="text-white font-bold mb-4 px-1">Payment Methods</h3>
        <div className="space-y-3 mb-24">
            <div onClick={() => setPaymentMethod('wallet')} className={`p-5 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${paymentMethod === 'wallet' ? 'border-green-500 bg-green-900/10' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${wallet >= total ? 'bg-green-500 text-black' : 'bg-red-900 text-red-200'}`}><Wallet className="w-6 h-6" /></div><div><p className="text-white font-bold">Epiko Wallet</p><p className={`${wallet >= total ? 'text-green-400' : 'text-red-400'} text-xs font-mono mt-1`}>Balance: ₹{wallet.toFixed(2)}</p></div></div>
                    {paymentMethod === 'wallet' && <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>}
                </div>
            </div>

            <div onClick={() => setPaymentMethod('card')} className={`p-5 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${paymentMethod === 'card' ? 'border-green-500 bg-green-900/10' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"><CreditCard className="text-white w-6 h-6" /></div><div><p className="text-white font-bold">Credit / Debit Card</p><p className="text-gray-500 text-xs">Visa, Mastercard, Rupay</p></div></div>
                    {paymentMethod === 'card' && <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full"></div></div>}
                </div>
            </div>
        </div>

        <button onClick={handlePaymentClick} className="fixed bottom-6 left-6 right-6 py-4 rounded-xl font-bold text-lg transition-all bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10">Pay ₹{total}</button>

        {/* Card Modal */}
        {showCardModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in slide-in-from-bottom-10">
                <div className="bg-gray-900 w-full max-w-sm rounded-2xl border border-gray-800 p-6 relative">
                    <button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 text-gray-400"><X className="w-5 h-5" /></button>
                    <h3 className="text-white font-bold text-lg mb-6">Enter Card Details</h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Card Number" className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-green-500" />
                        <div className="flex gap-4">
                            <input type="text" placeholder="MM/YY" className="w-1/2 bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-green-500" />
                            <input type="text" placeholder="CVV" className="w-1/2 bg-black border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-green-500" />
                        </div>
                        <button onClick={processBooking} className="w-full py-3 bg-green-500 text-black font-bold rounded-xl mt-4">Pay Securely</button>
                    </div>
                </div>
            </div>
        )}

        {/* Loading Overlay */}
        {processing && (
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50">
                <div className="relative"><div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center"><Ticket className="w-6 h-6 text-red-600 animate-pulse" /></div></div>
                <h3 className="text-white font-bold text-xl mt-6">Securing your seats...</h3>
                <p className="text-gray-500 text-sm mt-2">Please do not close the app</p>
            </div>
        )}
      </div>
    );
  };

  const ConfirmationScreen = () => {
    const booking = bookings[0];
    return (
      <div className="min-h-full bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">{[...Array(20)].map((_,i) => (<div key={i} className="absolute w-2 h-2 bg-red-500 rounded-full" style={{top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', transform: `scale(${Math.random()})`}}></div>))}</div>
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative z-10 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-3 drop-shadow-md" /><h2 className="text-white font-black text-2xl tracking-tight">YOU'RE GOING!</h2><p className="text-green-100 text-xs font-medium mt-1 opacity-90">Booking ID: #{booking.id}</p>
            </div>
            <div className="p-6 bg-white">
                <h3 className="font-black text-2xl text-gray-900 mb-1 leading-tight">{booking.movie.title}</h3>
                <p className="text-gray-500 text-sm mb-6 font-medium">{booking.movie.language} • {booking.movie.genre.split('/')[0]}</p>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Date</p><p className="font-bold text-gray-800 text-lg">{booking.displayDate || booking.date}</p></div>
                    <div><p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Time</p><p className="font-bold text-gray-800 text-lg">{booking.time}</p></div>
                    <div className="col-span-2"><p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Theatre</p><p className="font-bold text-gray-800 text-sm">{booking.theatre.name}</p></div>
                    <div className="col-span-2 bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center"><div><p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Seats</p><p className="font-black text-gray-900 text-lg">{booking.seats.map(s=>s.id).join(', ')}</p></div><div className="text-right"><p className="text-[10px] text-gray-400 uppercase font-bold">Screen</p><p className="font-bold text-gray-900">AUDI 04</p></div></div>
                </div>
                <div className="flex flex-col items-center justify-center pt-6 border-t border-dashed border-gray-300 relative">
                    <div className="absolute -top-3 -left-9 w-6 h-6 bg-gray-950 rounded-full"></div><div className="absolute -top-3 -right-9 w-6 h-6 bg-gray-950 rounded-full"></div>
                    <QrCode className="w-28 h-28 text-gray-900 mb-3" /><p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">Scan at entrance</p>
                </div>
            </div>
        </div>
        <div className="flex gap-3 w-full max-w-sm mt-6">
            <button onClick={() => showToast('Ticket saved to device')} className="flex-1 bg-gray-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white hover:bg-gray-700 transition"><Download className="w-4 h-4" /> Save PDF</button>
            <button onClick={() => showToast('Share link copied')} className="flex-1 bg-gray-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white hover:bg-gray-700 transition"><Share2 className="w-4 h-4" /> Share</button>
        </div>
        <button onClick={() => navigate('home')} className="mt-8 text-gray-500 font-medium hover:text-white transition-colors flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Back to Home</button>
      </div>
    );
  };

  const WalletScreen = () => {
    const [amountToAdd, setAmountToAdd] = useState('');
    const quickAdd = [100, 200, 500, 1000];
    const handleAddFunds = () => {
        const val = parseInt(amountToAdd);
        if(!val || val <= 0) { showToast("Please enter a valid amount", "error"); return; }
        setWallet(prev => prev + val);
        setTransactions([{ id: Date.now(), title: "Added Money", amount: val, type: 'credit', date: 'Just now' }, ...transactions]);
        setAmountToAdd('');
        showToast(`Added ₹${val} to wallet`, "success");
    };
    return (
        <div className="min-h-full bg-gray-950 flex flex-col">
            <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 sticky top-0 z-10">
                <h2 className="text-white font-black text-2xl mb-6">Wallet</h2>
                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <p className="text-red-200 text-xs font-medium uppercase tracking-widest mb-2">Current Balance</p>
                    <h3 className="text-4xl font-black tracking-tight mb-6">₹ {wallet.toFixed(2)}</h3>
                    <div className="flex justify-between items-end"><div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm"><Trophy className="w-4 h-4 text-yellow-400" /><span className="text-xs font-bold text-yellow-100">{loyaltyPoints} Points</span></div><div className="text-right"><p className="text-xs opacity-70 font-mono">**** 8821</p></div></div>
                </div>
            </div>
            <div className="p-6 flex-1">
                <h4 className="text-white font-bold mb-4">Top-up Wallet</h4>
                <div className="flex gap-2 mb-4"><div className="relative flex-1"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span><input type="number" min="1" value={amountToAdd} onChange={(e) => setAmountToAdd(e.target.value)} placeholder="Enter amount" className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-8 pr-4 text-white font-bold focus:border-red-500 outline-none transition-colors" /></div><button onClick={handleAddFunds} disabled={!amountToAdd} className="bg-white text-black px-6 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors">Add</button></div>
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">{quickAdd.map(amt => (<button key={amt} onClick={() => setAmountToAdd(amt.toString())} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap">+ ₹{amt}</button>))}</div>
                <h4 className="text-white font-bold mb-4 flex items-center gap-2"><History className="w-4 h-4 text-gray-500" /> Recent Transactions</h4>
                <div className="space-y-3 pb-20">{transactions.map((t) => (<div key={t.id} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800/50"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'}`}>{t.type === 'credit' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}</div><div><p className="text-white font-bold text-sm">{t.title}</p><p className="text-gray-500 text-[10px]">{t.date}</p></div></div><span className={`font-bold text-sm ${t.type === 'credit' ? 'text-green-500' : 'text-white'}`}>{t.amount > 0 ? '+' : ''}{t.amount}</span></div>))}</div>
            </div>
        </div>
    );
  };

  const BookingsScreen = () => {
    const [tab, setTab] = useState('Upcoming');
    const [selectedQr, setSelectedQr] = useState(null);
    const filtered = bookings.filter(b => { if(tab === 'Upcoming') return b.status !== 'Completed'; return b.status === 'Completed'; });
    return (
        <div className="min-h-full bg-gray-950 flex flex-col relative">
             <div className="p-6 sticky top-0 bg-gray-950 z-10"><h2 className="text-white font-black text-2xl mb-6">My Bookings</h2><div className="flex bg-gray-900 p-1 rounded-xl">{['Upcoming', 'Past'].map(t => (<button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === t ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500'}`}>{t}</button>))}</div></div>
             <div className="px-6 pb-24 space-y-4">
                {filtered.length === 0 ? (<div className="text-center py-20 opacity-50"><Ticket className="w-16 h-16 text-gray-700 mx-auto mb-4" /><p className="text-gray-500">No {tab.toLowerCase()} bookings</p></div>) : (
                    filtered.map(b => (
                        <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="flex h-24"><img src={b.movie.poster} className="w-20 h-full object-cover" alt="poster" /><div className="flex-1 p-3 flex flex-col justify-between"><div><h3 className="text-white font-bold text-sm truncate">{b.movie.title}</h3><p className="text-gray-500 text-xs">{b.theatre.name}</p></div><div className="flex justify-between items-end"><p className="text-white text-xs font-medium bg-gray-800 px-2 py-1 rounded">{b.displayDate || b.date}, {b.time}</p></div></div></div>
                            <div className="relative h-4 bg-gray-950 mx-2 border-x border-gray-800 flex items-center"><div className="w-full border-t border-dashed border-gray-700"></div><div className="absolute left-[-8px] w-4 h-4 bg-gray-950 rounded-full"></div><div className="absolute right-[-8px] w-4 h-4 bg-gray-950 rounded-full"></div></div>
                            <div className="bg-gray-900 p-3 flex justify-between items-center"><div className="text-xs text-gray-400">{b.seats.length} Seats: <span className="text-white font-bold">{b.seats.map(s=>s.id).join(', ')}</span></div><button onClick={() => setSelectedQr(b)} className="text-red-500 text-xs font-bold border border-red-900/30 px-3 py-1.5 rounded-lg hover:bg-red-900/10 transition-colors">View QR</button></div>
                        </div>
                    ))
                )}
             </div>
             {selectedQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-xs overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
                        <button onClick={() => setSelectedQr(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"><X className="w-5 h-5 text-gray-900" /></button>
                        <div className="bg-red-600 p-6 text-center"><h3 className="font-black text-xl text-white mb-1">{selectedQr.movie.title}</h3><p className="text-red-100 text-xs font-medium">{selectedQr.theatre.name}</p></div>
                        <div className="p-8 flex flex-col items-center">
                            <div className="p-4 border-2 border-dashed border-gray-900 rounded-xl mb-6"><QrCode className="w-40 h-40 text-gray-900" /></div>
                            <div className="w-full grid grid-cols-2 gap-4 text-center mb-4"><div><p className="text-[10px] text-gray-400 uppercase font-bold">Date</p><p className="text-gray-900 font-bold">{selectedQr.displayDate || selectedQr.date}</p></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Time</p><p className="text-gray-900 font-bold">{selectedQr.time}</p></div></div>
                            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest bg-gray-100 px-3 py-1 rounded">ID: {selectedQr.id}</p><p className="text-[10px] text-gray-400 mt-4">Show this code at the entrance</p>
                        </div>
                    </div>
                </div>
             )}
        </div>
    );
  };

  const ProfileScreen = () => (
      <div className="min-h-full bg-gray-950 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8"><h2 className="text-white font-black text-2xl">Profile</h2><button onClick={() => navigate('profile-settings')} className="text-gray-500 hover:text-white"><Settings className="w-6 h-6" /></button></div>
          <div className="flex items-center gap-4 mb-8"><div className="w-20 h-20 rounded-full bg-gray-800 p-1 border-2 border-red-600 relative"><img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" /><div onClick={() => navigate('profile-edit')} className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full border-2 border-gray-950 cursor-pointer hover:bg-red-500"><Edit2 className="w-3 h-3" /></div></div><div><h3 className="text-white font-bold text-xl">{user.name}</h3><p className="text-gray-500 text-sm">{user.email}</p><p className="text-red-500 text-xs font-bold mt-1">{user.phone}</p></div></div>
          <div className="space-y-4">
            <div onClick={() => navigate('profile-royalty')} className="bg-gray-900 p-4 rounded-2xl flex items-center justify-between border border-gray-800 hover:border-gray-700 transition cursor-pointer group"><div className="flex items-center gap-3"><div className="bg-yellow-900/20 p-2 rounded-full text-yellow-500 group-hover:scale-110 transition-transform"><Trophy className="w-5 h-5" /></div><div><p className="text-white font-bold">Epiko Royalty</p><p className="text-gray-500 text-xs">{loyaltyPoints} Points Available</p></div></div><ChevronLeft className="rotate-180 text-gray-600 w-4 h-4 group-hover:text-white group-hover:translate-x-1 transition-all" /></div>
            <div onClick={() => navigate('profile-notifications')} className="bg-gray-900 p-4 rounded-2xl flex items-center justify-between border border-gray-800 hover:border-gray-700 transition cursor-pointer group"><div className="flex items-center gap-3"><div className="bg-blue-900/20 p-2 rounded-full text-blue-500 group-hover:scale-110 transition-transform"><Bell className="w-5 h-5" /></div><div><p className="text-white font-bold">Notifications</p><p className="text-gray-500 text-xs">Manage preferences</p></div></div><ChevronLeft className="rotate-180 text-gray-600 w-4 h-4 group-hover:text-white group-hover:translate-x-1 transition-all" /></div>
            <div onClick={() => navigate('profile-vouchers')} className="bg-gray-900 p-4 rounded-2xl flex items-center justify-between border border-gray-800 hover:border-gray-700 transition cursor-pointer group"><div className="flex items-center gap-3"><div className="bg-purple-900/20 p-2 rounded-full text-purple-500 group-hover:scale-110 transition-transform"><Ticket className="w-5 h-5" /></div><div><p className="text-white font-bold">Passes & Vouchers</p><p className="text-gray-500 text-xs">2 Active</p></div></div><ChevronLeft className="rotate-180 text-gray-600 w-4 h-4 group-hover:text-white group-hover:translate-x-1 transition-all" /></div>
            <div onClick={() => navigate('profile-help')} className="bg-gray-900 p-4 rounded-2xl flex items-center justify-between border border-gray-800 hover:border-gray-700 transition cursor-pointer group"><div className="flex items-center gap-3"><div className="bg-green-900/20 p-2 rounded-full text-green-500 group-hover:scale-110 transition-transform"><HelpCircle className="w-5 h-5" /></div><div><p className="text-white font-bold">Help & Support</p><p className="text-gray-500 text-xs">FAQs, Chat with us</p></div></div><ChevronLeft className="rotate-180 text-gray-600 w-4 h-4 group-hover:text-white group-hover:translate-x-1 transition-all" /></div>
          </div>
          <button onClick={() => { setUser(null); navigate('login'); }} className="mt-auto flex items-center justify-center gap-2 text-red-500 font-bold py-4 hover:bg-red-900/10 rounded-xl transition-colors"><LogOut className="w-5 h-5" /> Logout</button>
      </div>
  );

  // --- LAYOUT WRAPPER ---
  
  return (
    <div className="font-sans max-w-md mx-auto h-[100dvh] bg-black shadow-2xl overflow-hidden relative border-x border-gray-900 text-gray-100">
      {notification && (<div className={`absolute top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300 border ${notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 'bg-green-900/90 border-green-500 text-white'}`}>{notification.type === 'error' ? <CheckCircle className="w-5 h-5 text-red-400 rotate-45" /> : <CheckCircle className="w-5 h-5 text-green-400" />}<span className="font-bold text-sm">{notification.msg}</span></div>)}
      <div ref={screenRef} className="h-[calc(100dvh-65px)] bg-gray-950 overflow-y-auto no-scrollbar scroll-smooth">
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'signup' && <SignupScreen />}
        {currentScreen === 'forgot-password' && <ForgotPasswordScreen />}
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'see-all-movies' && <SeeAllMoviesScreen filter="All" />}
        {currentScreen === 'movie-details' && <MovieDetailsScreen />}
        {currentScreen === 'theatre-selection' && <TheatreSelectionScreen />}
        {currentScreen === 'seat-selection' && <SeatSelectionScreen />}
        {currentScreen === 'payment' && <PaymentScreen />}
        {currentScreen === 'confirmation' && <ConfirmationScreen />}
        {currentScreen === 'wallet' && <WalletScreen />}
        {currentScreen === 'bookings' && <BookingsScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
        
        {currentScreen === 'profile-edit' && <EditProfileScreen />}
        {currentScreen === 'profile-royalty' && <RoyaltyScreen />}
        {currentScreen === 'profile-settings' && (
            <div className="min-h-full bg-gray-950 flex flex-col p-6">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('profile')} className="text-white bg-gray-900 p-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-5 h-5" /></button>
                    <h2 className="text-white font-bold text-xl">Settings</h2>
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-900 p-4 rounded-xl flex justify-between items-center border border-gray-800">
                        <span className="text-white font-medium">App Version</span>
                        <span className="text-gray-500 text-sm">v3.0.1</span>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl flex justify-between items-center border border-gray-800">
                        <span className="text-white font-medium">Terms of Service</span>
                        <ChevronRight className="text-gray-500 w-4 h-4" />
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl flex justify-between items-center border border-gray-800">
                        <span className="text-white font-medium">Privacy Policy</span>
                        <ChevronRight className="text-gray-500 w-4 h-4" />
                    </div>
                </div>
            </div>
        )}
        {currentScreen === 'profile-notifications' && (
            <div className="min-h-full bg-gray-950 flex flex-col p-6">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('profile')} className="text-white bg-gray-900 p-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-5 h-5" /></button>
                    <h2 className="text-white font-bold text-xl">Notifications</h2>
                </div>
                <div className="space-y-4">
                    {['Booking Confirmations', 'New Movie Releases', 'Exclusive Offers', 'Ticket Reminders'].map((item, i) => (
                        <div key={i} className="bg-gray-900 p-4 rounded-xl flex justify-between items-center border border-gray-800">
                            <span className="text-white font-medium">{item}</span>
                            <div className="w-12 h-6 bg-red-600 rounded-full relative cursor-pointer transition-colors hover:bg-red-500">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        {currentScreen === 'profile-vouchers' && <VouchersScreen />}
        {currentScreen === 'profile-help' && (
            <div className="min-h-full bg-gray-950 flex flex-col p-6">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('profile')} className="text-white bg-gray-900 p-2 rounded-full hover:bg-gray-800"><ChevronLeft className="w-5 h-5" /></button>
                    <h2 className="text-white font-bold text-xl">Help & Support</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { q: "How do I cancel my ticket?", a: "You can cancel your ticket up to 2 hours before the showtime from the 'Bookings' tab. A cancellation fee may apply." },
                        { q: "Where can I find my refund status?", a: "Refunds are processed within 5-7 business days. You can check the status in your bank statement or wallet transaction history." },
                        { q: "Can I change my seat after booking?", a: "Currently, seat changes are not supported after booking. You would need to cancel and re-book." },
                        { q: "What is Epiko Royalty?", a: "Epiko Royalty is our loyalty program where you earn points for every booking. Points can be redeemed for rewards like free popcorn or vouchers." }
                    ].map((item, i) => (
                        <details key={i} className="bg-gray-900 rounded-xl border border-gray-800 group">
                            <summary className="p-4 font-medium text-white cursor-pointer list-none flex justify-between items-center">
                                {item.q}
                                <ChevronRight className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-90" />
                            </summary>
                            <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50 pt-2">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>
                <button className="mt-auto w-full bg-gray-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition"><MessageCircle className="w-5 h-5" /> Chat with Support</button>
            </div>
        )}
      </div>
      {user && ['home', 'bookings', 'wallet', 'profile'].includes(currentScreen) && (
        <div className="absolute bottom-0 w-full h-[65px] bg-black/90 backdrop-blur-lg border-t border-gray-800 flex justify-around items-center px-2 z-30">
          {[{ id: 'home', icon: Home, label: 'Home' }, { id: 'bookings', icon: Ticket, label: 'Bookings' }, { id: 'wallet', icon: Wallet, label: 'Wallet' }, { id: 'profile', icon: User, label: 'Profile' }].map(tab => (
            <button key={tab.id} onClick={() => navigate(tab.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-16 ${currentScreen === tab.id ? 'text-red-500 translate-y-[-2px]' : 'text-gray-500 hover:text-gray-300'}`}><tab.icon className={`w-6 h-6 ${currentScreen === tab.id ? 'stroke-[2.5]' : ''}`} /><span className="text-[10px] font-bold tracking-wide">{tab.label}</span></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;



