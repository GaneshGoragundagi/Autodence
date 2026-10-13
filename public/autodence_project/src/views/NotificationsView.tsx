import React from 'react';

interface NotificationsViewProps {
  onClearAll: () => void;
  onNavigateAiVision: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onClearAll,
  onNavigateAiVision
}) => {
  const notifications = [
    {
      id: 'n-1',
      title: 'Low Attendance Alert: Marcus Brody (68.0%)',
      description: 'Marcus has missed 4 consecutive lectures in CS-301. Automated regulatory warning SMS prepared.',
      time: '10 minutes ago',
      type: 'warning',
      unread: true
    },
    {
      id: 'n-2',
      title: 'AI Vision Telemetry Sync Complete',
      description: '58 of 64 faces successfully matched with 98.2% average confidence for Lecture #42.',
      time: '1 hour ago',
      type: 'success',
      unread: true
    },
    {
      id: 'n-3',
      title: 'Optical Sensor Node L-302 Calibrated',
      description: 'Wide-angle camera in Room 304B recalibrated with 99.82% precision matrix.',
      time: '3 hours ago',
      type: 'info',
      unread: true
    },
    {
      id: 'n-4',
      title: 'Debarment Warning Notice Escalated',
      description: 'Leo Vance (64.0%) flagged for Dean review following department guidelines.',
      time: 'Yesterday',
      type: 'warning',
      unread: true
    }
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
            System Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Live AI vision feeds, student threshold flags, and department messages
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl flex items-start justify-between gap-3 border transition-all ${
              n.unread ? 'bg-surface-container-low border-primary/20' : 'bg-surface border-outline-variant/20'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                n.type === 'warning' ? 'bg-status-absent/15 text-status-absent' :
                n.type === 'success' ? 'bg-status-present/15 text-status-present' :
                'bg-primary-fixed text-primary'
              }`}>
                <span className="material-symbols-outlined text-[20px]">
                  {n.type === 'warning' ? 'warning' : n.type === 'success' ? 'verified' : 'info'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">{n.title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{n.description}</p>
                <span className="text-[11px] text-outline mt-1 inline-block">{n.time}</span>
              </div>
            </div>

            {n.unread && (
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
