import React from "react";
import { Outlet } from "react-router-dom";
import { SOSButton } from "./SOSButton";
import { Navigation } from "./Navigation";

interface YatriGuardLayoutProps {
  children?: React.ReactNode;
}

export const YatriGuardLayout: React.FC<YatriGuardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Main Content */}
      <main className="pb-20">
        {children || <Outlet />}
      </main>
      
      {/* Bottom Navigation */}
      <Navigation />
      
      {/* Always Visible SOS Button */}
      <SOSButton />
    </div>
  );
};