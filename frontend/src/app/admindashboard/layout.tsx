import AdminDashboardSidebar from "@/components/admindashboard/shared/AdminDashboardSidebar";
import Navbar from "@/components/communityUsers/commen/Navbar";
import { ReactNode } from "react";

type Props={
    children: ReactNode;
};

export default function AdminLayout({ children }:Props){
    return(
       <div className="min-h-screen flex flex-col">

      {/* Navbar (Top) */}
      <Navbar/>

      {/* Main Section */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 bg-white border-r ">
          <AdminDashboardSidebar/>
        </div>

        {/* Page Content */}
        <div className="flex-1  bg-gray-50">
          {children}
        </div>

      </div>
    </div> 
    )
}