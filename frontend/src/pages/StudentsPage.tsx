import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminPath } from '../constants/adminPaths';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Select } from '../components/ui/FormControls';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { StudentClassOption, StudentDetail, StudentFormValues, StudentListItem } from '../types/student';
import { formatKes } from '../utils/format';
import {
  createStudent,
  fetchStudentById,
  fetchStudentClasses,
  fetchStudents,
  getStudentApiErrorMessage,
  updateStudent,
} from '../services/students.service';

export function StudentsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebouncedValue(query, 300);
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | ''>('');
  const [page, setPage] = useState(1);

  const [classes, setClasses] = useState<StudentClassOption[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [summary, setSummary] = useState({ total: 0, byClass: {} as Record<string, number> });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingStudent, setEditingStudent] = useState<StudentDetail | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const classOptions = await fetchStudentClasses();
        if (!cancelled) setClasses(classOptions);
      } catch {
        // Class options will retry when list reloads; keep page usable.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, classFilter, statusFilter]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setListLoading(true);
      setListError(null);
      try {
        const data = await fetchStudents({
          search: debouncedSearch || undefined,
          classId: classFilter || undefined,
          status: statusFilter || undefined,
          page,
          limit: 20,
        });
        if (!cancelled) {
          setStudents(data.items);
          setSummary(data.summary);
          setPagination(data.pagination);
        }
      } catch (error) {
        if (!cancelled) {
          setListError(getStudentApiErrorMessage(error, 'Unable to load students.'));
          setStudents([]);
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, classFilter, statusFilter, page, reloadToken]);

  const refreshList = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  function openCreateModal() {
    setFormMode('create');
    setEditingStudent(null);
    setFormError(null);
    setFormOpen(true);
  }

  async function openEditModal(studentId: string) {
    setFormMode('edit');
    setFormError(null);
    setFormOpen(true);
    try {
      const detail = await fetchStudentById(studentId);
      setEditingStudent(detail);
    } catch (error) {
      setFormError(getStudentApiErrorMessage(error, 'Unable to load student for editing.'));
      setEditingStudent(null);
    }
  }

  async function handleFormSubmit(values: StudentFormValues) {
    if (formSubmitting) return;
    setFormSubmitting(true);
    setFormError(null);
    try {
      if (formMode === 'create') {
        await createStudent(values);
        setSuccessMessage('Student registered successfully.');
      } else if (editingStudent) {
        await updateStudent(editingStudent.id, values);
        setSuccessMessage('Student updated successfully.');
      }
      setFormOpen(false);
      setEditingStudent(null);
      refreshList();
    } catch (error) {
      setFormError(getStudentApiErrorMessage(error, 'Unable to save student.'));
    } finally {
      setFormSubmitting(false);
    }
  }

  const tahfidhCount = summary.byClass.Tahfidh ?? 0;
  const farbarCount = summary.byClass.Farbar ?? 0;
  const womenCount = summary.byClass['Women Section'] ?? 0;

  return (
    <div>
      <PageHeader
        breadcrumbs={['Admin', 'Students', 'All Active Enrollees']}
        title="Students Directory"
        badge="Term 2 Ledger"
        actions={
          <>
            <Button variant="subtle" leftIcon={<MaterialIcon name="file_download" className="text-[18px] text-outline" />}>
              Export Register
            </Button>
            <Button variant="subtle" leftIcon={<MaterialIcon name="tune" className="text-[18px] text-outline" />}>
              Columns
            </Button>
            <Button leftIcon={<MaterialIcon name="person_add" className="text-[18px]" />} onClick={openCreateModal}>
              + Add New Student
            </Button>
          </>
        }
      />

      {successMessage ? (
        <div className="mb-space-md rounded-lg border border-primary-container/20 bg-surface-container-low px-space-md py-space-sm font-body-sm text-body-sm text-on-surface">
          {successMessage}
        </div>
      ) : null}

      <div className="mb-space-lg rounded-xl bg-surface-container-lowest p-space-md shadow-card">
        <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-x-space-lg gap-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-space-xs">
              <span className="h-2 w-2 rounded-full bg-primary-container" />
              <span className="font-semibold text-on-surface">Total Students:</span>
              <span className="font-title-sm font-bold text-on-surface">{summary.total}</span>
            </div>
            <span className="hidden text-outline-variant sm:inline">•</span>
            <span>
              Tahfidh: <strong className="text-on-surface">{tahfidhCount}</strong>
            </span>
            <span className="hidden text-outline-variant sm:inline">•</span>
            <span>
              Farbar: <strong className="text-on-surface">{farbarCount}</strong>
            </span>
            <span className="hidden text-outline-variant sm:inline">•</span>
            <span>
              Women Section: <strong className="text-on-surface">{womenCount}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="mb-space-md grid grid-cols-1 gap-space-sm md:grid-cols-12">
        <SearchInput
          containerClassName="md:col-span-6"
          placeholder="Search by name, student ID, or parent phone..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          className="md:col-span-3 h-10 shadow-sm"
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
        >
          <option value="">All Classes</option>
          {classes.map((classOption) => (
            <option key={classOption.id} value={classOption.id}>
              {classOption.name}
            </option>
          ))}
        </Select>
        <Select
          className="md:col-span-3 h-10 shadow-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {listError ? (
        <div className="mb-space-md rounded-lg border border-error/30 bg-error-container/40 px-space-md py-space-sm font-body-sm text-body-sm text-error">
          {listError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card">
        {listLoading ? (
          <div className="p-space-xl">
            <LoadingState label="Loading students…" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-space-xl">
            <EmptyState
              title={debouncedSearch ? 'No students match your search' : 'No students found'}
              description={
                debouncedSearch
                  ? 'Try a different name, phone number, or student ID.'
                  : 'Add a student to begin building the madrasa register.'
              }
              icon="search_off"
            />
          </div>
        ) : (
          <DataTable<StudentListItem>
            minWidthClassName="min-w-[1020px]"
            data={students}
            columns={[
              {
                key: 'name',
                header: 'Student Name & ID',
                cell: (row) => (
                  <button
                    type="button"
                    className="flex w-full items-center gap-space-sm text-left"
                    onClick={() => navigate(adminPath(`students/${row.id}`))}
                  >
                    <Avatar name={row.fullName} className="h-9 w-9 shrink-0 text-sm" />
                    <div className="min-w-0">
                      <p className="truncate font-title-sm text-title-sm font-semibold text-on-surface">{row.fullName}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{row.displayId}</p>
                    </div>
                  </button>
                ),
              },
              { key: 'gender', header: 'Gender', cell: (row) => (row.gender === 'male' ? 'Male' : 'Female') },
              { key: 'class', header: 'Class / Section', cell: (row) => row.className },
              {
                key: 'phone',
                header: 'Parent Contact & M-Pesa',
                cell: (row) => (
                  <div className="flex flex-col">
                    <span>{row.parentPhone}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">M-Pesa enabled</span>
                  </div>
                ),
              },
              {
                key: 'quran',
                header: "Qur'an Progress",
                cell: () => <span className="text-on-surface-variant">—</span>,
              },
              {
                key: 'fee',
                header: 'Monthly Fee',
                cell: (row) => formatKes(row.monthlyFee),
              },
              {
                key: 'status',
                header: 'Status',
                className: 'text-center',
                cell: (row) => <StatusBadge tone={row.status} />,
              },
              {
                key: 'actions',
                header: 'Actions',
                headerClassName: 'text-right',
                className: 'text-right',
                cell: (row) => (
                  <div className="inline-flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 font-label-sm text-label-sm text-primary-container hover:bg-surface-container-low"
                      onClick={() => navigate(adminPath(`students/${row.id}`))}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-lg px-2 py-1 font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low"
                      onClick={() => void openEditModal(row.id)}
                    >
                      Edit
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {!listLoading && pagination.totalPages > 1 ? (
        <div className="mt-space-md flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} students
          </span>
          <div className="flex gap-space-sm">
            <Button variant="subtle" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              Previous
            </Button>
            <Button
              variant="subtle"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <StudentFormModal
        open={formOpen}
        mode={formMode}
        classes={classes}
        initialStudent={editingStudent}
        submitting={formSubmitting}
        errorMessage={formError}
        onClose={() => {
          if (formSubmitting) return;
          setFormOpen(false);
          setEditingStudent(null);
          setFormError(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
