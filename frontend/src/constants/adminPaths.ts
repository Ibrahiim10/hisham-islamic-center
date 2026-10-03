/** Admin panel base path — keeps public website separate from madrasa management UI. */
export const ADMIN_BASE = '/admin';

export const adminPath = (segment = '') => {
  if (!segment) return ADMIN_BASE;
  const normalized = segment.startsWith('/') ? segment.slice(1) : segment;
  return `${ADMIN_BASE}/${normalized}`;
};
