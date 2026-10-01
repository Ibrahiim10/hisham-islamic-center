import { Button } from '../components/ui/Button';
import { FormField, Input, Select } from '../components/ui/FormControls';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { BRAND } from '../constants/brand';

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-space-lg">
      <PageHeader
        breadcrumbs={['Admin', 'Settings']}
        title="Institution Settings"
        subtitle="Academic session, fee configuration, and integration preferences"
      />

      <SectionCard eyebrow="Institution Profile" title={BRAND.name}>
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <FormField label="Institution Name">
            <Input defaultValue={BRAND.name} />
          </FormField>
          <FormField label="Academic Session">
            <Input defaultValue={BRAND.academicSession} />
          </FormField>
          <FormField label="Default Currency">
            <Select defaultValue="KES">
              <option value="KES">KES — Kenyan Shilling</option>
            </Select>
          </FormField>
          <FormField label="Timezone">
            <Select defaultValue="Africa/Nairobi">
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
            </Select>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Fee Structures" title="Monthly Class Fees">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          <FormField label="Tahfidh">
            <Input defaultValue="8000" />
          </FormField>
          <FormField label="Farbar">
            <Input defaultValue="6000" />
          </FormField>
          <FormField label="Women Section">
            <Input defaultValue="3000" />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Integrations" title="Notifications & Payments">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <FormField label="SMS Provider" hint="Mock provider enabled in development">
            <Input defaultValue="MockSMSProvider" readOnly />
          </FormField>
          <FormField label="WhatsApp Provider" hint="Mock provider enabled in development">
            <Input defaultValue="MockWhatsAppProvider" readOnly />
          </FormField>
          <FormField label="M-Pesa Integration" hint="Manual recording enabled; API credentials not configured">
            <Input defaultValue="Manual M-Pesa recording mode" readOnly />
          </FormField>
        </div>
        <div className="mt-space-lg flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </SectionCard>
    </div>
  );
}
