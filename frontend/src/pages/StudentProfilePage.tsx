import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminPath } from '../constants/adminPaths';
import { StudentProfileQuranSection } from '../components/quran/StudentProfileQuranSection';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionCard } from '../components/ui/SectionCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { StudentClassOption, StudentDetail, StudentFormValues } from '../types/student';
import { formatKes } from '../utils/format';
import {
  fetchStudentById,
  fetchStudentClasses,
  getStudentApiErrorMessage,
  updateStudent,
} from '../services/students.service';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [classes, setClasses] = useState<StudentClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [studentData, classOptions] = await Promise.all([fetchStudentById(id), fetchStudentClasses()]);
        if (!cancelled) {
          setStudent(studentData);
          setClasses(classOptions);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getStudentApiErrorMessage(loadError, 'Unable to load student profile.'));
          setStudent(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(values: StudentFormValues) {
    if (!id) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateStudent(id, values);
      setStudent(updated);
      setEditOpen(false);
      setSuccessMessage('Student updated successfully.');
    } catch (submitError) {
      setFormError(getStudentApiErrorMessage(submitError, 'Unable to update student.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-space-xl">
        <LoadingState label="Loading student profile…" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-space-md">
        <PageHeader breadcrumbs={['Admin', 'Students', 'Profile']} title="Student Profile" />
        <EmptyState title="Student not found" description={error ?? 'This student record could not be loaded.'} icon="person_off" />
        <Button variant="subtle" onClick={() => navigate(adminPath('students'))}>
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={['Admin', 'Students', student.fullName]}
        title={student.fullName}
        badge={student.displayId}
        actions={
          <>
            <Button variant="subtle" onClick={() => navigate(adminPath('students'))}>
              Back to Students
            </Button>
            <Button onClick={() => setEditOpen(true)}>Edit Student</Button>
          </>
        }
      />

      {successMessage ? (
        <div className="mb-space-md rounded-lg border border-primary-container/20 bg-surface-container-low px-space-md py-space-sm font-body-sm text-body-sm text-on-surface">
          {successMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
        <SectionCard title="Personal Information">
          <dl className="space-y-space-sm font-body-sm text-body-sm">
            <div className="flex justify-between gap-space-md">
              <dt className="text-on-surface-variant">Full Name</dt>
              <dd className="text-right font-medium text-on-surface">{student.fullName}</dd>
            </div>
            <div className="flex justify-between gap-space-md">
              <dt className="text-on-surface-variant">Date of Birth</dt>
              <dd className="text-right text-on-surface">{formatDate(student.dateOfBirth)}</dd>
            </div>
            <div className="flex justify-between gap-space-md">
              <dt className="text-on-surface-variant">Gender</dt>
              <dd className="text-right capitalize text-on-surface">{student.gender}</dd>
            </div>
            <div className="flex justify-between gap-space-md">
              <dt className="text-on-surface-variant">Address</dt>
              <dd className="max-w-[60%] text-right text-on-surface">{student.address}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Parent / Guardian">
          <dl className="space-y-space-sm font-body-sm text-body-sm">
            <div className="flex justify-between gap-space-md">
              <dt className="text-on-surface-variant">Phone Number</dt>
              <dd className="text-right text-on-surface">{student.parentPhone}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Academic / Madrasa Information" className="lg:col-span-2">
          <dl className="grid grid-cols-1 gap-space-sm font-body-sm text-body-sm sm:grid-cols-2">
            <div className="flex justify-between gap-space-md sm:flex-col sm:justify-start">
              <dt className="text-on-surface-variant">Student ID</dt>
              <dd className="font-medium text-on-surface">{student.displayId}</dd>
            </div>
            <div className="flex justify-between gap-space-md sm:flex-col sm:justify-start">
              <dt className="text-on-surface-variant">Program / Class</dt>
              <dd className="text-on-surface">{student.className}</dd>
            </div>
            <div className="flex justify-between gap-space-md sm:flex-col sm:justify-start">
              <dt className="text-on-surface-variant">Current Monthly Fee</dt>
              <dd className="text-on-surface">{formatKes(student.monthlyFee)}</dd>
            </div>
            <div className="flex justify-between gap-space-md sm:flex-col sm:justify-start">
              <dt className="text-on-surface-variant">Status</dt>
              <dd>
                <StatusBadge tone={student.status} />
              </dd>
            </div>
            <div className="flex justify-between gap-space-md sm:flex-col sm:justify-start">
              <dt className="text-on-surface-variant">Admission Date</dt>
              <dd className="text-on-surface">{formatDate(student.admissionDate)}</dd>
            </div>
          </dl>
        </SectionCard>

        <StudentProfileQuranSection studentId={student.id} />

        <SectionCard title="Attendance History" className="lg:col-span-2">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Attendance records will appear here when the attendance module is connected.
          </p>
        </SectionCard>

        <SectionCard title="Fee & Payment History" className="lg:col-span-2">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Payment history will appear here when the fees module is connected. Changing class updates the expected monthly fee only.
          </p>
        </SectionCard>
      </div>

      <StudentFormModal
        open={editOpen}
        mode="edit"
        classes={classes}
        initialStudent={student}
        submitting={submitting}
        errorMessage={formError}
        onClose={() => {
          setEditOpen(false);
          setFormError(null);
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
