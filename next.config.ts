import type { NextConfig } from "next";

const configuredBackendOrigin = process.env.CARETWIN_BACKEND_ORIGIN?.trim();

function getBackendOrigin() {
  if (!configuredBackendOrigin) return null;

  const backendUrl = new URL(configuredBackendOrigin);
  if (
    !["http:", "https:"].includes(backendUrl.protocol) ||
    backendUrl.username ||
    backendUrl.password ||
    (backendUrl.pathname !== "/" && backendUrl.pathname !== "") ||
    backendUrl.search ||
    backendUrl.hash
  ) {
    throw new Error(
      "CARETWIN_BACKEND_ORIGIN must be an HTTP(S) origin without a path, credentials, query, or fragment.",
    );
  }

  return backendUrl.origin;
}

const backendOrigin = getBackendOrigin();

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendOrigin) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
