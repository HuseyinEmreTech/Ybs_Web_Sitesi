import { Metadata } from 'next'
import { getTeamMembers, TeamMember } from '@/lib/data'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import Button from '@/components/Button'
import ScrollReveal from '@/components/ScrollReveal'
import { getOrganizationChart } from '@/lib/organization'

export const metadata: Metadata = {
    title: 'Koordinatörlükler',
    description: 'YBS Kulübü çalışma grupları ve koordinatörlükler',
}

export const dynamic = 'force-dynamic'

export default async function CoordinatorsPage() {
    const [members, fullChart] = await Promise.all([
        getTeamMembers(),
        getOrganizationChart()
    ])

    // Filter for Coordinator Nodes only
    const coordinatorIds = ['project', 'social', 'organization'];
    // Sort them based on the desired visual order (left to right) if needed, 
    // but they rely on JSON order. We can force order here:
    const chart = coordinatorIds.map(id => fullChart.find(n => n.id === id)).filter(Boolean) as typeof fullChart;

    // Helper to find leaders for a node
    const getLeadersForNode = (keywords: string[]) => {
        return members.filter(m => {
            const roles = m.role.toLowerCase().split(',').map(r => r.trim());
            return roles.some(r => keywords.some(k => r.includes(k.toLowerCase())));
        });
    }

    // Helper to get members for a department (excluding leaders)
    const getDepartmentMembers = (deptName: string | undefined, leaders: TeamMember[]) => {
        if (!deptName) return [];
        return members.filter(m =>
            m.department === deptName &&
            !leaders.find(l => l.id === m.id)
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
                                <AnimatedGradientText>Koordinatörlükler</AnimatedGradientText>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                                Aktif projelerimizi ve etkinliklerimizi yürüten dinamik ekiplerimiz.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Coordinators Grid - 3 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {chart.map((node, index) => {
                            const leaders = getLeadersForNode(node.roleKeywords);
                            const deptMembers = getDepartmentMembers(node.department, leaders);
                            const children = fullChart.filter(n => n.parentId === node.id);

                            return (
                                <div key={node.id} className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="bg-slate-100 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800 text-center">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{node.title}</h2>

                                        {/* Leaders */}
                                        {leaders.length > 0 ? (
                                            <div className="flex flex-wrap justify-center gap-4">
                                                {leaders.map(leader => (
                                                    <CoordinatorCard key={leader.id} member={leader} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 italic">Lider atanmadı</div>
                                        )}
                                    </div>

                                    {/* Body: Subgroups or Direct Members */}
                                    <div className="p-6 flex-1 space-y-6">

                                        {/* If we have subgroups (like Project groups), render them */}
                                        {children.length > 0 ? (
                                            <div className="space-y-6">
                                                {children.map(child => {
                                                    const childLeaders = getLeadersForNode(child.roleKeywords);
                                                    const childMembers = getDepartmentMembers(child.department, childLeaders);

                                                    return (
                                                        <div key={child.id} className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                                            <h3 className="text-md font-bold text-slate-800 dark:text-white mb-3 text-center">{child.title}</h3>

                                                            {/* Subgroup Leader */}
                                                            {childLeaders.length > 0 && (
                                                                <div className="flex justify-center mb-4">
                                                                    {childLeaders.map(l => <CoordinatorCard key={l.id} member={l} small />)}
                                                                </div>
                                                            )}

                                                            {/* Member Count */}
                                                            <div className="text-center">
                                                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{childMembers.length}</span>
                                                                <span className="text-xs text-slate-500 block font-medium">Aktif Üye</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            // No subgroups -> Show direct members count
                                            <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{deptMembers.length}</span>
                                                <span className="text-sm text-slate-500 font-medium">Aktif Üye</span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </div>
            </section>

            {/* Join CTA */}
            <section className="relative py-16 lg:py-24 overflow-hidden border-t border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-white dark:hidden z-0" />
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 hidden dark:block z-0" />

                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Ekiplere Katılın</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                        İlgi alanınıza uygun bir koordinatörlükte görev alarak kendinizi geliştirin.
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

function CoordinatorCard({ member, small = false }: { member: TeamMember, small?: boolean }) {
    const sizeClasses = small ? 'w-12 h-12' : 'w-20 h-20';
    const nameClasses = small ? 'text-xs' : 'text-sm';
    const roleClasses = small ? 'text-[10px]' : 'text-xs';

    return (
        <div className="flex flex-col items-center">
            {member.imageUrl ? (
                <div className={`${sizeClasses} rounded-full overflow-hidden mb-2 border-2 border-slate-200 dark:border-slate-700`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className={`${sizeClasses} rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold ${small ? 'text-sm' : 'text-xl'} mb-2`}>
                    {member.name.charAt(0)}
                </div>
            )}
            <div className="text-center">
                <h4 className={`font-bold text-slate-900 dark:text-white ${nameClasses}`}>{member.name}</h4>
                <p className={`${roleClasses} text-indigo-600 dark:text-indigo-400`}>{member.role}</p>
            </div>
        </div>
    )
}
