'use client';

import { useEffect, useState, useRef } from 'react';
import { siteSettingsApi } from '@/lib/supabase';

interface Stat {
  number: number;
  label: string;
  suffix: string;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>([
    { number: 15, label: 'Projects Completed', suffix: '+' },
    { number: 2, label: 'Years Experience', suffix: '' },
    { number: 20, label: 'Happy Clients', suffix: '+' },
    { number: 92, label: 'Success Rate', suffix: '%' }
  ]);

  const [animatedStats, setAnimatedStats] = useState<number[]>(stats.map(() => 0));
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Fetch data from Supabase
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await siteSettingsApi.get('stats');
        console.log('Supabase stats:', statsData); // Debug log

        if (
          statsData?.projectsCompleted != null &&
          statsData?.yearsExperience != null &&
          statsData?.happyClients != null &&
          statsData?.successRate != null
        ) {
          const updatedStats: Stat[] = [
            { number: statsData.projectsCompleted, label: 'Projects Completed', suffix: '+' },
            { number: statsData.yearsExperience, label: 'Years Experience', suffix: '' },
            { number: statsData.happyClients, label: 'Happy Clients', suffix: '+' },
            { number: statsData.successRate, label: 'Success Rate', suffix: '%' }
          ];

          setStats(updatedStats);
          setAnimatedStats(updatedStats.map(() => 0));
          animateStats(updatedStats);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();

    return () => {
      timersRef.current.forEach(clearInterval);
      timersRef.current = [];
    };
  }, []);

  const animateStats = (updatedStats: Stat[]) => {
    timersRef.current.forEach(clearInterval);
    timersRef.current = [];

    updatedStats.forEach((stat, index) => {
      let start = 0;
      const end = stat.number;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }

        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = Math.round(start);
          return newStats;
        });
      }, 16);

      timersRef.current.push(timer);
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-light mb-2 text-yellow-400">
                {animatedStats[index]}{stat.suffix}
              </div>
              <div className="text-gray-300 font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
