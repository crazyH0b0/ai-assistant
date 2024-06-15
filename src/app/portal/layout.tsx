import { PortalBanner } from '@/components/portal/banner';
import React from 'react';

const Portallayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:h-screen ">
      {/* <PortalBanner /> */}
      <div className="container flex justify-center flex-1 h-0 mt-12">{children}</div>
    </div>
  );
};

export default Portallayout;
