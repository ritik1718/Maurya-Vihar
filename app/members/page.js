// app/team/page.jsx

'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, Users, Search, Mail, Phone, Building, Star, Loader2, AlertCircle, Linkedin } from 'lucide-react';

// --- Card Component for POR Holders (with LinkedIn) ---
const PORCard = ({ por, index }) => (
  <div 
    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-yellow-400 group animate-fade-in-up"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Image
            src={por.profilePicture || '/profile-placeholder.jpg'}
            alt={por.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-4 border-yellow-300 group-hover:border-orange-400 transition-colors"
          />
          <Star className="absolute -top-1 -right-1 text-yellow-400 bg-white rounded-full p-0.5" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">{por.name}</h3>
          <p className="text-sm font-semibold text-orange-600">{por.position}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-4 leading-relaxed flex-grow">
        {por.description}
      </p>
      {/* Updated links section */}
      <div className="mt-4 pt-4 border-t border-yellow-100 flex items-center justify-start gap-4 text-xs text-gray-500 flex-wrap">
        <a href={`mailto:${por.email}`} className="flex items-center space-x-1 hover:text-yellow-600 transition-colors">
          <Mail size={14} />
          <span>Email</span>
        </a>
        <a href={`tel:${por.mobile}`} className="flex items-center space-x-1 hover:text-yellow-600 transition-colors">
          <Phone size={14} />
          <span>Call</span>
        </a>
        {/* Conditionally render LinkedIn link */}
        {por.linkedin && (
          <a 
            href={por.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center space-x-1 hover:text-yellow-600 transition-colors"
          >
            <Linkedin size={14} />
            <span>LinkedIn</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

// --- Card Component for Members (no change needed) ---
const MemberCard = ({ member, index }) => (
  <div 
    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-4 animate-fade-in-up"
    style={{ animationDelay: `${index * 30}ms` }}
  >
    <Image
      src={member.profilePicture || '/profile-placeholder.jpg'}
      alt={member.name}
      width={48}
      height={48}
      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-200"
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-800 truncate">{member.name}</h4>
      <p className="text-xs text-gray-500">{member.bitsId}</p>
      <div className="text-xs text-gray-500 flex items-center mt-1">
        <Building size={12} className="mr-1" />
        <span>{member.hostel}, {member.roomNo}</span>
      </div>
    </div>
  </div>
);

// --- Main Page Component (no change needed in logic) ---
export default function OurTeamPage() {
  const [pors, setPors] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const positionOrder = [
        'President', 'Vice President', 'Treasurer', 'General Secretary', 
        'Secretary', 'Joint Secretary', 'Cultural Secretary', 'Event Coordinator'
      ];

      try {
        const [porResponse, memberResponse] = await Promise.all([
          fetch('http://localhost:3000/api/post-por'),
          fetch('http://localhost:3000/api/post-member')
        ]);

        if (!porResponse.ok) throw new Error('Failed to fetch POR data');
        if (!memberResponse.ok) throw new Error('Failed to fetch member data');

        const porData = await porResponse.json();
        const memberData = await memberResponse.json();
        
        const sortedPors = porData.data.sort((a, b) => {
          const indexA = positionOrder.indexOf(a.position);
          const indexB = positionOrder.indexOf(b.position);
          if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        setPors(sortedPors);
        setMembers(memberData.data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPors = pors.filter(por => 
    por.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    por.bitsId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.bitsId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-900 mb-2 animate-fade-in-down">
            Meet Our Team
          </h1>
          <p className="text-lg text-amber-700 animate-fade-in-down animation-delay-200">
            The dedicated students leading and shaping the Maurya Vihar community.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or BITS ID..."
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm rounded-full border-2 border-yellow-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-yellow-500 animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-semibold">Failed to load data: {error}</p>
          </div>
        )}

        {/* Content Sections */}
        {!loading && !error && (
          <>
            <section className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                  <Award className="text-yellow-500" /> Positions of Responsibility
                </h2>
              </div>
              {filteredPors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPors.map((por, index) => <PORCard key={por._id} por={por} index={index} />)}
                </div>
              ) : (
                <p className="text-center text-gray-500">No POR holders found matching your search.</p>
              )}
            </section>
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                  <Users className="text-yellow-500" /> Our Valued Members
                </h2>
              </div>
              {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredMembers.map((member, index) => <MemberCard key={member._id} member={member} index={index} />)}
                </div>
              ) : (
                <p className="text-center text-gray-500">No members found matching your search.</p>
              )}
            </section>
          </>
        )}
      </div>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}
