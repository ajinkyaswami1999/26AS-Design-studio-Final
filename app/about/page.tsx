// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import Navigation from '@/components/Navigation';
// import SocialMedia from '@/components/SocialMedia';
// import Footer from '@/components/Footer';
// import { Users, Award, Target, Heart } from 'lucide-react';
// import { teamMembersApi, type TeamMember } from '@/lib/supabase';

// const values = [
//   {
//     icon: Target,
//     title: 'Innovation',
//     description: 'We push the boundaries of architectural design with cutting-edge solutions.'
//   },
//   {
//     icon: Heart,
//     title: 'Sustainability',
//     description: 'Environmental responsibility is at the core of every project we undertake.'
//   },
//   {
//     icon: Users,
//     title: 'Collaboration',
//     description: 'We work closely with clients to bring their vision to life through partnership.'
//   },
//   {
//     icon: Award,
//     title: 'Excellence',
//     description: 'Quality and attention to detail define every aspect of our work.'
//   }
// ];

// export default function About() {
//   const sectionsRef = useRef<HTMLDivElement>(null);
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadTeamMembers();
//   }, []);

//   const loadTeamMembers = async () => {
//     try {
//       const teamData = await teamMembersApi.getAll();
//       setTeamMembers(teamData);
//     } catch (error) {
//       console.error('Error loading team members:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('visible');
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     const elements = sectionsRef.current?.querySelectorAll('.fade-in, .slide-up');
//     elements?.forEach((element) => observer.observe(element));

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <>
//       <Navigation />
//       <main className="pt-24" ref={sectionsRef}>
//         {/* Hero Section */}
//         <section className="py-20 bg-gradient-to-b from-black to-gray-900">
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-wide fade-in text-yellow-400">
//                 About 26AS
//               </h1>
//               <p className="text-xl text-gray-300 max-w-3xl mx-auto fade-in">
//                 We are a multi-disciplinary design practice dedicated to transforming ideas into impactful spaces. With expertise in architecture, interior design, landscape design, and 3D visualization, we deliver design solutions that are both visionary and practical.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Story Section */}
//         <section className="py-20 bg-black">
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//               <div className="fade-in">
//                 <h2 className="text-4xl font-light mb-6 tracking-wide text-yellow-400">
//                   Our Story
//                 </h2>
//                 <p className="text-gray-300 text-lg leading-relaxed mb-6">
//                   Founded in 2012, 26AS Design Studio emerged from a shared vision to revolutionize architectural design through innovative thinking and sustainable practices. Our journey began with a simple belief: that great architecture has the power to transform lives and communities.
//                 </p>
//                 <p className="text-gray-300 text-lg leading-relaxed">
//                   Over the years, we've grown from a small team of passionate architects to a comprehensive design studio, working on projects ranging from intimate residential spaces to large-scale commercial developments.
//                 </p>
//               </div>
//               <div className="fade-in">
//                 <img
//                   src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
//                   alt="Our team at work"
//                   className="w-full h-96 object-cover rounded-lg shadow-lg"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Values Section */}
//         <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-light mb-6 tracking-wide slide-up text-yellow-400">
//                 Our Values
//               </h2>
//               <p className="text-gray-300 text-lg max-w-2xl mx-auto slide-up">
//                 These core principles guide every decision we make and every project we undertake.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               {values.map((value, index) => (
//                 <div
//                   key={index}
//                   className="text-center fade-in"
//                   style={{ transitionDelay: `${index * 0.1}s` }}
//                 >
//                   <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <value.icon className="w-8 h-8 text-black" />
//                   </div>
//                   <h3 className="text-xl font-medium mb-3 text-white">{value.title}</h3>
//                   <p className="text-gray-300 text-sm leading-relaxed">
//                     {value.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Team Section */}
//         <section className="py-20 bg-black">
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-light mb-6 tracking-wide slide-up text-yellow-400">
//                 Meet Our Team
//               </h2>
//               <p className="text-gray-300 text-lg max-w-2xl mx-auto slide-up">
//                 Our diverse team of architects, designers, and engineers brings together decades of experience and fresh perspectives.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {loading ? (
//                 <div className="col-span-3 text-center text-yellow-400">Loading team members...</div>
//               ) : teamMembers.length === 0 ? (
//                 <div className="col-span-3 text-center text-gray-400">No team members available</div>
//               ) : (
//                 teamMembers.slice(0, 3).map((member, index) => (
//                 <div
//                   key={index}
//                   className="text-center fade-in"
//                   style={{ transitionDelay: `${index * 0.1}s` }}
//                 >
//                   <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
//                     <img
//                       src={member.image_url}
//                       alt={member.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <h3 className="text-xl font-medium mb-1 text-white">{member.name}</h3>
//                   <p className="text-gray-300">{member.position}</p>
//                 </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </section>
//       </main>
//       <SocialMedia />
//       <Footer />
//     </>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import SocialMedia from '@/components/SocialMedia';
import Footer from '@/components/Footer';
import { Users, Award, Target, Heart, Building, LayoutGrid, Trees, Boxes } from 'lucide-react';
import { teamMembersApi, type TeamMember } from '@/lib/supabase';

const values = [
  {
    icon: Target,
    title: 'Innovation',
    description: 'We push the boundaries of architectural design with cutting-edge solutions.'
  },
  {
    icon: Heart,
    title: 'Sustainability',
    description: 'Environmental responsibility is at the core of every project we undertake.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with clients to bring their vision to life through partnership.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Quality and attention to detail define every aspect of our work.'
  }
];

const expertise = [
  {
    icon: Building,
    title: 'Architecture & Planning',
    description: 'Contextual and sustainable design solutions that shape enduring spaces.'
  },
  {
    icon: LayoutGrid,
    title: 'Interiors',
    description: 'Spaces that balance elegance and function, tailored to client lifestyles.'
  },
  {
    icon: Trees,
    title: 'Landscape Design',
    description: 'Connecting people with nature through thoughtful outdoor environments.'
  },
  {
    icon: Boxes,
    title: '3D Visualization',
    description: 'Realistic renders that bring concepts to life before construction begins.'
  }
];

export default function About() {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const teamData = await teamMembersApi.getAll();
      setTeamMembers(teamData);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionsRef.current?.querySelectorAll('.fade-in, .slide-up');
    elements?.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navigation />
      <main className="pt-24" ref={sectionsRef}>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-wide fade-in text-yellow-400">
                About 26AS
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto fade-in">
                We are a multi-disciplinary design practice dedicated to transforming ideas into impactful spaces. With expertise in architecture, interior design, landscape design, and 3D visualization, we deliver design solutions that are both visionary and practical.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="fade-in">
                <h2 className="text-4xl font-light mb-6 tracking-wide text-yellow-400">
                  Our Story
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Founded in 2012, 26AS Design Studio emerged from a shared vision to revolutionize architectural design through innovative thinking and sustainable practices. Our journey began with a simple belief: that great architecture has the power to transform lives and communities.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Over the years, we've grown from a small team of passionate architects to a comprehensive design studio, working on projects ranging from intimate residential spaces to large-scale commercial developments.
                </p>
              </div>
              <div className="fade-in">
                <img
                  src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                  alt="Our team at work"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-6 tracking-wide slide-up text-yellow-400">
                Our Values
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto slide-up">
                These core principles guide every decision we make and every project we undertake.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center fade-in"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Expertise Section */}
        <section className="py-20 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-6 tracking-wide slide-up text-yellow-400">
                Our Core Expertise
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto slide-up">
                We bring creativity, functionality, and sustainability together across every discipline.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="fade-in text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 p-6 rounded-2xl bg-neutral-900"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-6 tracking-wide slide-up text-yellow-400">
                Meet Our Team
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto slide-up">
                Our diverse team of architects, designers, and engineers brings together decades of experience and fresh perspectives.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-3 text-center text-yellow-400">Loading team members...</div>
              ) : teamMembers.length === 0 ? (
                <div className="col-span-3 text-center text-gray-400">No team members available</div>
              ) : (
                teamMembers.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="text-center fade-in"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium mb-1 text-white">{member.name}</h3>
                    <p className="text-gray-300">{member.position}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <SocialMedia />
      <Footer />
    </>
  );
}