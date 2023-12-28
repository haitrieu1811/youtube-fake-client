import { ReactNode } from "react";

import MainHeader from "@/components/main-header";
import MainSidebar from "@/components/main-sidebar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <MainHeader />
      <main className="flex">
        <MainSidebar />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
