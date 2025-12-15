import { Metadata } from 'next'
import { getTeamMembers, TeamMember } from '@/lib/data'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import Button from '@/components/Button'
import ScrollReveal from '@/components/ScrollReveal'
import { getOrganizationChart } from '@/lib/organization'

export const metadata: Metadata = {
  title: 'Yönetim Kurulu',
  description: 'YBS Kulübü yönetim kurulu',
}

export const revalidate = 60 // Cache for 60 seconds (ISR)

export default async function EkipPage() {
  const [members, fullChart] = await Promise.all([
    getTeamMembers(),
    getOrganizationChart()
  ])

  // 1. Define Groups
  const executiveIds = ['vp', '1765394515619', 'gensec']; // VP, Sayman, GenSec
  const boardNodeId = 'board';

  const executiveChart = executiveIds.map(id => fullChart.find(node => node.id === id)).filter(Boolean) as typeof fullChart;
  const boardNode = fullChart.find(node => node.id === boardNodeId);

  // 1. Find President (Strict check)
  const president = members.find(m => {
    const r = m.role.toLocaleLowerCase('tr');
    return r.includes('başkan') && !r.includes('yardımcı') && !r.includes('vekili');
  });

  // Helper: Normalize string for Turkish fuzzy matching (ignores case and special chars)
  const normalize = (s: string) => {
    return s.toLocaleLowerCase('tr')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .trim();
  }

  // Helper to find leaders for a node
  const getLeadersForNode = (keywords: string[]) => {
    return members.filter(m => {
      if (m.id === president?.id) return false;

      // Normalize member roles
      const memberRoles = m.role.split(',').map(r => normalize(r));

      // Check if any member role matches any keyword (normalized)
      return memberRoles.some(mRole =>
        keywords.some(keyword => mRole.includes(normalize(keyword)))
      );
    });
  }

  // Pre-calculate ALL leaders to prevent them from appearing as normal members
  const allLeaders = new Set<string>();
  if (president) allLeaders.add(president.id);

  const nodesToCheck = [...executiveChart];
  if (boardNode) nodesToCheck.push(boardNode);

  nodesToCheck.forEach(node => {
    const leaders = getLeadersForNode(node.roleKeywords);
    leaders.forEach(l => allLeaders.add(l.id));
  });

  // Helper to get members for a department (excluding ANY leader)
  const getDepartmentMembers = (deptName: string | undefined) => {
    if (!deptName) return [];
    return members.filter(m =>
      m.department === deptName &&
      !allLeaders.has(m.id)
    );
  }

  // Track displayed members to prevent duplicates
  const displayedMembers = new Set<string>();
  if (president) displayedMembers.add(president.id);

  return (
    <>
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 min-h-screen bg-grid-pattern overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <ScrollReveal direction="down">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                <AnimatedGradientText>Yönetim Kurulu</AnimatedGradientText>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Kulübümüzü yöneten ve yönlendiren lider kadromuz.
              </p>
            </ScrollReveal>
          </div>

          <div className="relative flex flex-col items-center">

            {/* Level 1: President */}
            {president && (
              <div className="relative z-10 mb-16 flex flex-col items-center">
                <ScrollReveal direction="down">
                  <MemberCard member={president} isPresident />
                </ScrollReveal>
                {/* Vertical Line from President */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 h-16 w-0.5 bg-indigo-300 dark:bg-indigo-800 hidden lg:block"></div>
              </div>
            )}

            {/* Level 2: Executives (Tree Structure) */}
            <div className="relative w-full max-w-5xl mb-20">
              {/* Horizontal Connector Line (Desktop) */}
              <div className="absolute -top-8 left-[16%] right-[16%] h-8 border-x-0 border-t-2 border-indigo-300 dark:border-indigo-800 hidden lg:block rounded-t-3xl"></div>
              {/* Center vertical line connecting to President's line */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-indigo-300 dark:bg-indigo-800 hidden lg:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {executiveChart.map((node, index) => {
                  // Get leaders
                  const rawLeaders = getLeadersForNode(node.roleKeywords);
                  const uniqueLeaders = rawLeaders.filter(l => !displayedMembers.has(l.id));
                  uniqueLeaders.forEach(l => displayedMembers.add(l.id));

                  if (uniqueLeaders.length === 0) return null;

                  return (
                    <div key={node.id} className="flex flex-col items-center relative w-full">
                      {/* Vertical connector to node (Desktop) */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-indigo-300 dark:bg-indigo-800 hidden lg:block"></div>

                      <ScrollReveal direction="up" delay={index * 0.1} className="w-full flex flex-col items-center">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 text-center min-h-[3rem] flex items-center justify-center bg-white dark:bg-slate-900 px-6 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 relative z-10 w-full max-w-[200px]">
                          {node.title}
                        </h3>

                        <div className="flex justify-center w-full">
                          {uniqueLeaders.map(leader => (
                            <MemberCard key={leader.id} member={leader} />
                          ))}
                        </div>
                      </ScrollReveal>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Level 3: Board Members (Grid Structure) */}
            {boardNode && (
              <div className="relative w-full border-t border-slate-200 dark:border-slate-800 pt-16">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm font-medium tracking-widest uppercase">
                  Yönetim Kurulu Üyeleri
                </div>

                <ScrollReveal direction="up" className="w-full">
                  {(() => {
                    // Logic for Board Members
                    const rawLeaders = getLeadersForNode(boardNode.roleKeywords);
                    const uniqueLeaders = rawLeaders.filter(l => !displayedMembers.has(l.id));
                    uniqueLeaders.forEach(l => displayedMembers.add(l.id));

                    // Also include any 'Board' department members if they exist and aren't leaders
                    // (Though usually Board Members are defined by role)

                    if (uniqueLeaders.length === 0) return null;

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {uniqueLeaders.map(member => (
                          <MemberCard key={member.id} member={member} />
                        ))}
                      </div>
                    )
                  })()}
                </ScrollReveal>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-t border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-white dark:hidden z-0" />
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 hidden dark:block z-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Yönetime Katılın</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            YBS Kulübü'nde aktif rol almak ve yönetim tecrübesi kazanmak ister misiniz?
          </p>
          <div className="mt-8">
            <Button
              href="/iletisim"
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-50 border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              Başvuru Yap
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function MemberCard({ member, isPresident = false }: { member: TeamMember, isPresident?: boolean }) {
  // Use slightly smaller layout for normal members in this crowded tree
  const isCompact = !isPresident;

  return (
    <div className={`
      relative bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-md border border-slate-100 dark:border-slate-700
      hover-glow transition-all
      ${isPresident ? 'w-full max-w-sm ring-4 ring-indigo-500/10' : 'w-full max-w-[18rem]'}
    `}>
      {member.imageUrl ? (
        <div className={`${isPresident ? 'w-40 h-40' : 'w-28 h-28'} mx-auto rounded-full overflow-hidden mb-3 border-4 border-indigo-100 dark:border-slate-700 shadow-inner`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`${isPresident ? 'w-40 h-40 text-5xl' : 'w-28 h-28 text-2xl'} mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mb-3 shadow-inner`}>
          {member.name.charAt(0)}
        </div>
      )}
      <h3 className={`font-bold text-slate-900 dark:text-white leading-tight ${isPresident ? 'text-xl' : 'text-base'}`}>
        {member.name}
      </h3>
      <p className={`text-indigo-600 dark:text-indigo-400 font-medium whitespace-pre-wrap ${isCompact ? 'text-xs mt-1' : 'text-sm mt-1'}`}>{member.role}</p>

      {/* Socials - Compact for list */}
      <div className="flex justify-center gap-2 mt-3">
        {member.socialLinks?.linkedin && (
          <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
        )}
        {member.socialLinks?.twitter && (
          <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
          </a>
        )}
        {member.socialLinks?.instagram && (
          <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
          </a>
        )}
        {member.socialLinks?.github && (
          <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          </a>
        )}
      </div>
    </div>
  )
}

function SmallMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white hover:shadow-sm dark:hover:bg-slate-800 transition-colors cursor-default group w-20">
      {member.imageUrl ? (
        <div className="w-10 h-10 rounded-full overflow-hidden mb-1 border border-slate-200 dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold mb-1">
          {member.name.charAt(0)}
        </div>
      )}
      <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight group-hover:text-indigo-600 transition-colors">
        {member.name}
      </p>
    </div>
  )
}
