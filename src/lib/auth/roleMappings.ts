const CANONICAL_TO_BACKEND_ROLE: Record<string, string> = {
  serviceprovider: "talent",
  serviceseeker: "trainee",
};

const BACKEND_TO_CANONICAL_ROLE: Record<string, string> = {
  talent: "serviceprovider",
  trainee: "serviceseeker",
};

const CANONICAL_ROLES = new Set(Object.keys(CANONICAL_TO_BACKEND_ROLE));

export function normalizeToCanonicalRole(role?: string | null): string | null {
  if (!role) {
    return null;
  }
  const lowered = role.toLowerCase();
  if (CANONICAL_ROLES.has(lowered)) {
    return lowered;
  }
  const mapped = BACKEND_TO_CANONICAL_ROLE[lowered];
  if (mapped) {
    return mapped;
  }
  return lowered;
}

export function mapCanonicalToBackendRole(role?: string | null): string | null {
  if (!role) {
    return null;
  }
  const lowered = role.toLowerCase();
  return CANONICAL_TO_BACKEND_ROLE[lowered] ?? lowered;
}

export function isCanonicalProviderRole(role?: string | null): boolean {
  return normalizeToCanonicalRole(role) === "serviceprovider";
}

export function isCanonicalSeekerRole(role?: string | null): boolean {
  return normalizeToCanonicalRole(role) === "serviceseeker";
}
