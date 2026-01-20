import { RoleMode } from '../types';

/**
 * Determines the primary account/profile route based on the user's role.
 * @param role The current RoleMode of the user.
 * @returns The string ID of the target tab/view.
 */
export function getAccountEntryRoute(role: RoleMode): string {
  switch (role) {
    case 'Lojista':
      return 'store_area';
    case 'ADM':
      return 'admin_panel';
    case 'Usuário':
    case 'Visitante':
    default:
      return 'profile';
  }
}
