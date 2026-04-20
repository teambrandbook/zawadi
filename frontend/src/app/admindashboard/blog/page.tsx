import BlogManagementFilters from "@/components/admindashboard/components/blog-management/components/BlogManagementFilters";
import BlogManagementHeaderStats from "@/components/admindashboard/components/blog-management/components/BlogManagementHeaderStats";
import BlogManagementTable from "@/components/admindashboard/components/blog-management/components/BlogManagementTable";

export default function BlogManagementPage() {
  return (
    <section className="w-full bg-[#F7F8FA] p-3 lg:p-5">
      <div className="mx-auto max-w-[1180px] space-y-3">
        <BlogManagementHeaderStats />
        <BlogManagementFilters />
        <BlogManagementTable />
      </div>
    </section>
  );
}
