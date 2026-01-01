import { Metadata } from 'next'
import { getTeamMembers, TeamMember } from '@/lib/data'
import AnimatedGradientText from '@/components/AnimatedGradientText'
import Button from '@/components/Button'
import ScrollReveal from '@/components/ScrollReveal'
import { getOrganizationChart } from '@/lib/organization'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Koordinatörlükler',
    description: 'İste YBS Topluluğu çalışma grupları ve koordinatörlükler - Teknoloji, eğitim ve organizasyon ekipleri',
}

export const revalidate = 60 // Cache for 60 seconds (ISR)

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
                                                                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                                                    {child.memberCount || childMembers.length}
                                                                </span>
                                                                <span className="text-xs text-slate-500 block font-medium">Aktif Üye</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            // No subgroups -> Show direct members count
                                            <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                                    {node.memberCount || deptMembers.length}
                                                </span>
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
                <div className={`${sizeClasses} rounded-full overflow-hidden mb-2 border-2 border-slate-200 dark:border-slate-700 relative`}>
                    <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes={small ? "48px" : "80px"}
                    />
                </div>
            ) : (
                <div className={`${sizeClasses} rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold ${small ? 'text-sm' : 'text-xl'} mb-2`}>
                    {member.name.charAt(0)}
                </div>
            )}
            <div className="text-center">
                <h4 className={`font-bold text-slate-900 dark:text-white ${nameClasses}`}>{member.name}</h4>
                <p className={`${roleClasses} text-indigo-600 dark:text-indigo-400`}>{member.role}</p>

                {/* Socials - Compact */}
                <div className="flex justify-center gap-1 mt-1">
                    {member.socialLinks?.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                    )}
                    {member.socialLinks?.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                        </a>
                    )}
                    {member.socialLinks?.instagram && (
                        <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                    )}
                    {member.socialLinks?.github && (
                        <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                    )}
                </div>

            </div>
        </div>
    )
}
