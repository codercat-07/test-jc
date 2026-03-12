import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { UnauthorizedError, NotFoundError, ForbiddenError } from './errors';

export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';

export async function getAuthUser() {
  const session = await auth();
  if (!session.userId) {
    throw new UnauthorizedError('You must be signed in to perform this action.');
  }

  return { clerkId: session.userId, sessionClaims: session.sessionClaims };
}

export async function getCurrentDbUser() {
  const { clerkId } = await getAuthUser();

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    throw new NotFoundError('User record not found in database.');
  }

  if (!user.isActive) {
    throw new ForbiddenError('Your account has been deactivated.');
  }

  return user;
}

export async function requireRole(allowedRoles: Role[]) {
  const user = await getCurrentDbUser();

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`This action requires one of the following roles: ${allowedRoles.join(', ')}`);
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(['ADMIN', 'SUPER_ADMIN']);
}

export const requireUser = getCurrentDbUser;

export function isAdmin(user: { role: Role }): boolean {
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
}
