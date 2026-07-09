import os from "os";

const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4") {
        ips.push(net.address);
        ips.push(`${net.address}:3000`);
      }
    }
  }
  return ips;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: getLocalIPs(),
};

export default nextConfig;
