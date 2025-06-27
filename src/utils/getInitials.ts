
export const getInitials = (name: string | null): string => {
  if (!name) return 'U';
  const names = name.trim().split(' ');
  if (names.length > 1 && names[0] && names[1]) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
