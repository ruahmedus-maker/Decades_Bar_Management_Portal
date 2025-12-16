import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/contexts/AppContext';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    created_at: string;
}

export default function NotificationCenter() {
    const { currentUser, showToast } = useApp();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Only show for Admins
    const isAdmin = currentUser?.position === 'Admin';

    const fetchNotifications = async () => {
        if (!currentUser) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_role', 'Admin')
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        }
    };

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);
    };

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);

        const ids = notifications.filter(n => !n.read).map(n => n.id);
        if (ids.length > 0) {
            await supabase
                .from('notifications')
                .update({ read: true })
                .in('id', ids);
        }
    };

    useEffect(() => {
        if (!isAdmin) return;

        fetchNotifications();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_role=eq.Admin`
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // SHOW VISUAL ALERT (Toast)
                    showToast(`🔔 ${newNotification.title}: ${newNotification.message}`);

                    // Play sound
                    // Assuming we have a sound effect in public/notification.mp3 or similar
                    // This uses the AppContext helper if available, or basic Audio
                    const audio = new Audio('/sounds/notification.mp3');
                    audio.play().catch(e => console.log('Audio play failed', e));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUser, isAdmin, showToast]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    if (!isAdmin) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 relative rounded-full hover:bg-white/10 transition-colors"
                title="Notifications"
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                    <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-semibold text-white text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-300 hover:text-blue-100"
                            >
                                Result All
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!notification.read ? 'bg-blue-500/10' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-white text-sm">{notification.title}</span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 line-clamp-2">{notification.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
