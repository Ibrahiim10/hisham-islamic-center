import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { StatusBadge } from '../components/ui/StatusBadge';

const notifications = [
  {
    id: '1',
    student: 'Ahmed Hassan (Demo)',
    phone: '+254700000001',
    channel: 'SMS',
    message: 'Your October fee is unpaid.',
    status: 'sent' as const,
    date: 'Today, 08:10 AM',
  },
  {
    id: '2',
    student: 'Maryam Yusuf (Demo)',
    phone: '+254700000003',
    channel: 'WhatsApp',
    message: 'Your child was absent today.',
    status: 'pending' as const,
    date: 'Today, 07:45 AM',
  },
  {
    id: '3',
    student: 'Bilal Mohamed',
    phone: '+254712345678',
    channel: 'SMS',
    message: 'Fee payment received — thank you.',
    status: 'sent' as const,
    date: 'Yesterday, 05:20 PM',
  },
];

export function NotificationsPage() {
  return (
    <div className="flex flex-col gap-space-lg">
      <PageHeader
        breadcrumbs={['Admin', 'Notifications']}
        title="Parent Notifications"
        subtitle="SMS and WhatsApp communication log"
        actions={
          <Button leftIcon={<MaterialIcon name="send" className="text-[18px]" />}>Send Notification</Button>
        }
      />

      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        {[
          ['Sent Today', '24'],
          ['Pending Queue', '8'],
          ['Failed Delivery', '1'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-surface-container-lowest p-space-md shadow-card">
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</p>
            <p className="mt-1 font-headline-lg text-headline-lg font-bold text-on-surface">{value}</p>
          </div>
        ))}
      </div>

      <SectionCard eyebrow="Communication Ledger" title="Recent Parent Messages">
        <DataTable
          data={notifications}
          columns={[
            { key: 'student', header: 'Student', cell: (row) => row.student },
            { key: 'phone', header: 'Parent Phone', cell: (row) => row.phone },
            { key: 'channel', header: 'Channel', cell: (row) => row.channel },
            { key: 'message', header: 'Message', cell: (row) => row.message },
            { key: 'date', header: 'Date/Time', cell: (row) => row.date },
            {
              key: 'status',
              header: 'Status',
              cell: (row) => <StatusBadge tone={row.status === 'sent' ? 'paid' : 'pending'} label={row.status === 'sent' ? 'Sent' : 'Pending'} />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
