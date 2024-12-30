import Header from "@/components/shared/Header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative z-50 min-h-screen">
      <Header />
      {children}
    </main>
  );
};

export default Layout;
