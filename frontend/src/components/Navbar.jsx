import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
            <div className="hidden sm:flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-96 group focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                <input
                    type="text"
                    placeholder="Search for courses, students, reports..."
                    className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full outline-none text-slate-600"
                />
            </div>

            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">John Doe</p>
                        <p className="text-xs text-slate-500">Instructor</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-4 hover:ring-indigo-50 transition-all cursor-pointer">
                        <User size={24} className="text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
