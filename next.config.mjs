/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next's dev server blocks cross-origin requests to its own dev assets
  // (JS chunks, HMR) by default, trusting only `localhost` — everything
  // else looks fine (the page HTML still renders) but nothing is
  // interactive, since the client bundle can't finish loading. This app
  // is reached via the LAN IP and the public domain too, not just
  // localhost, so both need to be explicitly trusted here.
  allowedDevOrigins: ["192.168.68.255", "hast.luxtronic.com.au"],
};

export default nextConfig;
