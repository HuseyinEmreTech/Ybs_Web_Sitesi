'use client'

import { useState, useEffect } from 'react'

type OrganizationNode = {
    id: string;
    title: string;
    roleKeywords: string[];
    department?: string;
    parentId?: string;
    memberCount?: number;
};

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
}

export default function StructurePage() {
    const [nodes, setNodes] = useState<OrganizationNode[]>([])
    const [members, setMembers] = useState<TeamMember[]>([])
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditMode, setIsEditMode] = useState(false) // Toggle Mode

    const [error, setError] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        setError('')
        try {
            const [nodesRes, membersRes] = await Promise.all([
                fetch('/api/organization'),
                fetch('/api/team')
            ])

            if (!nodesRes.ok || !membersRes.ok) {
                throw new Error('Veriler alınamadı')
            }

            setNodes(await nodesRes.json())
            setMembers(await membersRes.json())
        } catch (error) {
            console.error(error)
            setError('Yapılandırma verileri yüklenemedi.')
        } finally {
            setLoading(false)
        }
    }

    const selectedNode = nodes.find(n => n.id === selectedNodeId)

    // Helper: Tree View
    const renderNode = (node: OrganizationNode, level = 0) => {
        const children = nodes.filter(n => n.parentId === node.id);
        const isSelected = node.id === selectedNodeId;

        return (
            <div key={node.id} className="mb-2">
                <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`
                        flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors border
                        ${isSelected ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/30' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}
                    `}
                    style={{ marginLeft: `${level * 24}px` }}
                >
                    <span className="text-xl">{level === 0 ? '🏢' : '📂'}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{node.title}</span>
                </div>
                {children.map(child => renderNode(child, level + 1))}
            </div>
        )
    }

    // -- Actions (Member Assignment) --

    async function updateNodeTitle(title: string) {
        if (!selectedNode) return;
        const newNodes = nodes.map(n => n.id === selectedNode.id ? { ...n, title } : n);
        setNodes(newNodes);
        // Save to API
        await saveNodes(newNodes);
    }

    async function saveNodes(newNodes = nodes) {
        await fetch('/api/organization', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNodes),
        });
    }

    async function addLeader(memberId: string) {
        if (!selectedNode) return;
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        // Check availability of role keyword
        const keyword = selectedNode.roleKeywords[0] || selectedNode.title;
        if (!keyword) {
            alert('Bu pozisyon için anahtar kelime tanımlanmamış. Lütfen Şema Düzenleme modunda tanımlayın.');
            return;
        }

        if (!member.role.toLowerCase().includes(keyword.toLowerCase())) {
            const newRole = member.role ? `${member.role}, ${keyword}` : keyword;
            await updateMember(member.id, { role: newRole });
        }
    }

    async function removeLeader(memberId: string) {
        if (!selectedNode) return;
        const member = members.find(m => m.id === memberId);
        if (!member) return;

        const newRole = member.role.split(',').filter(r => !selectedNode.roleKeywords.some(k => r.trim().toLowerCase().includes(k.toLowerCase()))).join(', ');

        await updateMember(member.id, { role: newRole });
    }

    async function updateMemberCount(count: number) {
        if (!selectedNode) return;
        const newNodes = nodes.map(n => n.id === selectedNode.id ? { ...n, memberCount: count } : n);
        setNodes(newNodes);
        await saveNodes(newNodes);
    }

    async function updateMember(id: string, updates: Partial<TeamMember>) {
        const member = members.find(m => m.id === id);
        if (!member) return;

        const body = { ...member, ...updates };

        const res = await fetch('/api/team', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setMembers(members.map(m => m.id === id ? { ...m, ...updates } : m));
        } else {
            alert('Güncelleme başarısız.');
        }
    }

    // -- Actions (Schema Edit) --
    function addNode() {
        const newNode: OrganizationNode = {
            id: Date.now().toString(),
            title: 'Yeni Pozisyon',
            roleKeywords: [],
            // default to select Node if any
            parentId: selectedNodeId || undefined
        };
        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        saveNodes(newNodes);
    }

    function removeNode(index: number) {
        if (!confirm('Silmek istediğinize emin misiniz?')) return
        const newNodes = [...nodes]
        newNodes.splice(index, 1)
        setNodes(newNodes)
        saveNodes(newNodes);
    }

    function updateSchemaNode(index: number, field: keyof OrganizationNode, value: string | string[] | number | undefined) {
        const newNodes = [...nodes]
        newNodes[index] = { ...newNodes[index], [field]: value }
        setNodes(newNodes)
        // Auto save or manual save? Use auto for consistency with other parts? 
        // Or wait for save button? The previous logic used auto-save or explicit save? 
        // Let's rely on explicit save on "Save" button OR implicit save. 
        // Actually OrganizationEditor had a Save button. 
        // But here I prefer live-ish updates but maybe debounce. 
        // Let's hold local state updates and rely on a "Kaydet" button if heavily editing.
        // But user experience is better if we just save on blur or periodically.
        // For now, I'll stick to updating local state and having a "Kaydet" button in the header of Edit Mode.
    }

    // -- Computeds --

    const leaders = selectedNode ? members.filter(m => {
        const roles = m.role.toLowerCase().split(',').map(r => r.trim());
        return roles.some(r => selectedNode.roleKeywords.some(k => r.includes(k.toLowerCase())));
    }) : [];

    // const nodeMembers = selectedNode && selectedNode.department ? members.filter(m =>
    //     m.department === selectedNode.department &&
    //     !leaders.find(l => l.id === m.id)
    // ) : [];

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={loadData}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Tekrar Dene
                </button>
            </div>
        )
    }

    // A small helper component to handle individual input state for array joining/splitting
    const RoleKeywordInput = ({ initialValue, onSave }: { initialValue: string[], onSave: (val: string[]) => void }) => {
        const [value, setValue] = useState(initialValue.join(', '))

        useEffect(() => {
            setValue(initialValue.join(', '))
        }, [initialValue])

        const handleBlur = () => {
            const split = value.split(',').map(s => s.trim()).filter(Boolean)
            onSave(split)
        }

        return (
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                placeholder="Örn: Başkan, Koordinatör"
            />
        )
    }

    return (
        <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
            <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse delay-700" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm z-10 relative">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Yapılandırma &amp; Atamalar</h1>
                    <p className="text-slate-500 dark:text-slate-400">Organizasyon şemasını ve ekip atamalarını yönetin.</p>
                </div>
                <div className="flex gap-4">
                    {isEditMode && (
                        <button
                            onClick={() => saveNodes()}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-sm transition-colors"
                        >
                            💾 Değişiklikleri Kaydet
                        </button>
                    )}
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`
                            px-4 py-2 rounded-lg font-bold border transition-colors
                            ${isEditMode
                                ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-white dark:border-slate-600'
                            }
                        `}
                    >
                        {isEditMode ? 'Düzenlemeyi Bitir' : '⚠️ Şemayı Düzenle'}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* View Mode: Tree Sidebar + Details */}
                {!isEditMode && (
                    <>
                        <div className="w-1/3 p-6 border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Şema Görünümü</h2>
                            <div>
                                {nodes.filter(n => !n.parentId).map(node => renderNode(node))}
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto">
                            {selectedNode ? (
                                <div className="max-w-3xl mx-auto space-y-8">
                                    {/* ... Existing Member Assignment UI ... */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Başlık</label>
                                        <input
                                            type="text"
                                            value={selectedNode.title}
                                            onChange={(e) => updateNodeTitle(e.target.value)}
                                            className="w-full text-3xl font-bold text-slate-800 dark:text-white bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none px-2 py-1 transition-colors"
                                        />
                                    </div>

                                    {/* Leaders Section */}
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                            <span>👑</span> Liderler ({leaders.length})
                                        </h3>
                                        <div className="space-y-3 mb-6">
                                            {leaders.map(leader => (
                                                <div key={leader.id} className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">{leader.name[0]}</div>
                                                        <div>
                                                            <div className="font-bold text-slate-800 dark:text-white">{leader.name}</div>
                                                            <div className="text-xs text-indigo-600 dark:text-indigo-400">{leader.role}</div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeLeader(leader.id)} className="text-red-500 text-sm hover:underline">Çıkar</button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative group">
                                            <button className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition-colors font-medium">
                                                + Lider Ekle
                                            </button>
                                            <select
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-slate-900 dark:text-white"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        addLeader(e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Seçiniz...</option>
                                                {members.map(m => (
                                                    <option key={m.id} value={m.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{m.name} ({m.role || 'Rol yok'})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Team Members Count Section */}
                                    {selectedNode.department && (
                                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                                <span>👥</span> Aktif Üye Sayısı
                                            </h3>

                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={selectedNode.memberCount || 0}
                                                    onChange={(e) => updateMemberCount(parseInt(e.target.value) || 0)}
                                                    className="w-32 px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-xl font-bold text-center"
                                                />
                                                <span className="text-slate-500 dark:text-slate-400">kişi bu ekipte görev alıyor.</span>
                                            </div>
                                        </div>
                                    )}

                                    {!selectedNode.department && (
                                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
                                            ⚠️ Bu pozisyona doğrudan üye eklenemez çünkü bir departman tanımlı değil.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <span className="text-4xl mb-4">👈</span>
                                    <p>Soldaki şemadan bir pozisyon seçin.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Edit Mode: List Editor */}
                {isEditMode && (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-5xl mx-auto">
                            <div className="space-y-4">
                                {nodes.map((node, index) => (
                                    <div key={node.id} className="flex flex-col xl:flex-row gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm">

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Title */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Pozisyon Adı</label>
                                                <input
                                                    type="text"
                                                    value={node.title}
                                                    onChange={(e) => updateSchemaNode(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                                                />
                                            </div>

                                            {/* Role Keywords */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rol Tanımı (Virgülle)</label>
                                                <RoleKeywordInput
                                                    initialValue={node.roleKeywords}
                                                    onSave={(val) => updateSchemaNode(index, 'roleKeywords', val)}
                                                />
                                            </div>

                                            {/* Department */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Departman</label>
                                                <input
                                                    type="text"
                                                    value={node.department || ''}
                                                    onChange={(e) => updateSchemaNode(index, 'department', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                                                    placeholder="Takım Adı"
                                                />
                                            </div>

                                            {/* Parent (Tree Structure) */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Üst Birim</label>
                                                <select
                                                    value={node.parentId || ''}
                                                    onChange={(e) => updateSchemaNode(index, 'parentId', e.target.value || undefined)}
                                                    className="w-full px-3 py-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                                                >
                                                    <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">(En Üst Seviye)</option>
                                                    {nodes.filter(n => n.id !== node.id).map(n => (
                                                        <option key={n.id} value={n.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{n.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Member Count (Edit mode) */}
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Üye Sayısı</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={node.memberCount || 0}
                                                    onChange={(e) => updateSchemaNode(index, 'memberCount', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <button onClick={() => removeNode(index)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addNode} className="mt-6 w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-indigo-500 hover:text-indigo-500 rounded-xl font-bold transition-colors">
                                + Yeni Pozisyon Ekle
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
