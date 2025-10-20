export const PERMISSIONS = {
  CREATE_USER: 2 ** 0,
  LIST_USER: 2 ** 1,
} as const;

// export const PREDEFINED_PERMISSIONS: Record<UserTypes, number> = {
//   [UserTypes.ADMIN]: 3,
//   [UserTypes.DOCTOR]: 0,
//   [UserTypes.NURSE]: 0,
// };
