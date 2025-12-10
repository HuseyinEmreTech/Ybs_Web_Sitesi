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

export const dynamic = 'force-dynamic'

export default async function EkipPage() {
  const [members, fullChart] = await Promise.all([
    getTeamMembers(),
    getOrganizationChart()
  ])

  // Filter for Board Members only
  const boardIds = ['president', 'vp', 'gensec', 'board'];
  const organizationChart = fullChart.filter(node => boardIds.includes(node.id));

  // 1. Find President (Strict check)
  const president = members.find(m => {
    const r = m.role.toLocaleLowerCase('tr');
    return r.includes('başkan') && !r.includes('yardımcı') && !r.includes('vekili');
  });

  // Helper to find leaders for a node
  const getLeadersForNode = (keywords: string[]) => {
    return members.filter(m => {
      if (m.id === president?.id) return false;
      const roles = m.role.toLowerCase().split(',').map(r => r.trim());
      return roles.some(r => keywords.some(k => r.includes(k.toLowerCase())));
    });
  }

  // Pre-calculate ALL leaders to prevent them from appearing as normal members
  const allLeaders = new Set<string>();
  if (president) allLeaders.add(president.id);

  organizationChart.forEach(node => {
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


  return (
    <>
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 min-h-screen">
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 h-16 w-0.5 bg-indigo-200 dark:bg-indigo-800 hidden lg:block"></div>
              </div>
            )}

            {/* Level 2: Board Members */}
            <div className="relative w-full">
              {/* Horizontal Connector Line (Only for desktop) */}
              <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-indigo-200 dark:bg-indigo-800 -translate-y-px hidden lg:block"></div>

              <div className="flex flex-wrap justify-center gap-8 lg:gap-6 relative pt-10 lg:pt-0">
                {organizationChart.map((node, index) => {
                  // Skip President in this loop
                  if (node.id === 'president') return null;

                  const leaders = getLeadersForNode(node.roleKeywords);
                  const deptMembers = getDepartmentMembers(node.department);


                  // Specific fix: For "Board Member" node, we might have many. Join them with leaders if any?
                  // Usually "Yönetim Kurulu Üyesi" are just leaders of that node?
                  // Let's treat them all as displayed in the node.

                  if (leaders.length === 0 && deptMembers.length === 0) return null;

                  return (
                    <div key={node.id} className="flex flex-col items-center relative min-w-[200px] max-w-sm flex-1">

                      {/* Vertical connector to node (Desktop) */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-indigo-200 dark:bg-indigo-800 hidden lg:block"></div>

                      {/* Node Title */}
                      <ScrollReveal direction="up" delay={index * 0.1} className="w-full flex flex-col items-center">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 text-center min-h-[3rem] flex items-center justify-center bg-white dark:bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 relative z-10">
                          {node.title}
                        </h3>

                        {/* Leaders */}
                        <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
                          {leaders.map(leader => (
                            <MemberCard key={leader.id} member={leader} />
                          ))}
                        </div>
                      </ScrollReveal>

                      {/* Dept Members (if any fall into this bucket but aren't leaders) */}
                      {deptMembers.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {deptMembers.map(member => (
                            <SmallMemberCard key={member.id} member={member} />
                          ))}
                        </div>
                      )}

                    </div>
                  )
                })}
              </div>
            </div>

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
      relative bg-white dark:bg-slate-800 rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all
      border border-slate-100 dark:border-slate-700
      ${isPresident ? 'w-72 ring-4 ring-indigo-500/10' : 'w-48'}
    `}>
      {member.imageUrl ? (
        <div className={`${isPresident ? 'w-32 h-32' : 'w-20 h-20'} mx-auto rounded-full overflow-hidden mb-3 border-4 border-indigo-50 dark:border-slate-700 shadow-inner`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`${isPresident ? 'w-32 h-32 text-4xl' : 'w-20 h-20 text-xl'} mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mb-3 shadow-inner`}>
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
      </div>
    </div>
  )
}

function SmallMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-default group w-20">
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
