import Link from "next/link";
import {
  Activity,
  Apple,
  CalendarDays,
  Clock3,
  Eye,
  FilePlus,
  Pencil,
  Stethoscope,
  UserPlus,
} from "lucide-react";

function ConsultationTopSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-semibold text-[#0A4833]">Consultations</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-md border border-[#DADADA] bg-[#F1F3F5] px-4 py-2 text-sm font-medium text-[#4B5563]">
            Filter
          </button>
          <button className="rounded-md border border-[#A68966] bg-[#A68966] px-4 py-2 text-sm font-medium text-white">
            Export
          </button>
          <Link
            href="/admindashboard/consultation/assign-nutritionist"
            className="rounded-md border border-[#0A4833] bg-[#0A4833] px-4 py-2 text-sm font-medium text-white"
          >
            + Assign Nutritionist
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Total Consultations</p>
              <p className="mt-2 text-3xl font-semibold text-[#0A4833]">1,247</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E9EFED] text-[#0A4833]">
              <Stethoscope size={16} />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Pending Requests</p>
              <p className="mt-2 text-3xl font-semibold text-[#A16207]">23</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F3EEE6] text-[#A16207]">
              <Clock3 size={16} />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Today&apos;s Sessions</p>
              <p className="mt-2 text-3xl font-semibold text-[#0A4833]">12</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E9EFED] text-[#0A4833]">
              <CalendarDays size={16} />
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6B7280]">Active Diet Plans</p>
              <p className="mt-2 text-3xl font-semibold text-[#0A4833]">89</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E9EFED] text-[#0A4833]">
              <Apple size={16} />
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">All Status</div>
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">Session Type</div>
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">All Nutritionists</div>
        <div className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#4B5563]">mm/dd/yyyy</div>
      </div>
    </div>
  );
}

function RecentConsultationsSection() {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
        <h2 className="text-lg font-semibold text-[#0A4833]">Recent Consultations</h2>
        <button className="rounded-md border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-1.5 text-xs font-medium text-[#4B5563]">
          Bulk Assign
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs text-[#6B7280]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Nutritionist</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Health Goal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            <tr>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111827]">Emily Johnson</p>
                <p className="text-xs text-[#6B7280]">emily@example.com</p>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111827]">Dr. Sarah Wilson</p>
              </td>
              <td className="px-4 py-4 text-[#374151]">Mar 15, 2024 2:00 PM</td>
              <td className="px-4 py-4 text-[#374151]">Weight Management</td>
              <td className="px-4 py-4 text-[#0A7A44]">Confirmed</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-[#0A4833]">
                  <Eye size={15} />
                  <Pencil size={15} />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111827]">David Chen</p>
                <p className="text-xs text-[#6B7280]">david@example.com</p>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111827]">-</p>
              </td>
              <td className="px-4 py-4 text-[#374151]">Mar 16, 2024 10:00 AM</td>
              <td className="px-4 py-4 text-[#374151]">Diabetes Management</td>
              <td className="px-4 py-4 text-[#B45309]">Pending</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-[#A16207]">
                  <UserPlus size={15} />
                  <Pencil size={15} />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111827]">Maria Rodriguez</p>
                <p className="text-xs text-[#6B7280]">maria@example.com</p>
              </td>
              <td className="px-4 py-4">
                <p className="font-medium text-[#111827]">Dr. Michael Chen</p>
              </td>
              <td className="px-4 py-4 text-[#374151]">Mar 14, 2024 3:30 PM</td>
              <td className="px-4 py-4 text-[#374151]">Heart Health</td>
              <td className="px-4 py-4 text-[#1D4ED8]">Completed</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-[#1D4ED8]">
                  <FilePlus size={15} />
                  <Activity size={15} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConsultationRightPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">Today&apos;s Schedule</h3>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg bg-[#F8F5ED] px-3 py-2">
            <p className="text-sm font-medium text-[#111827]">Emily Johnson</p>
            <p className="text-xs text-[#6B7280]">2:00 PM - Video Call</p>
            <p className="mt-1 text-xs text-[#0A7A44]">Confirmed</p>
          </div>
          <div className="rounded-lg bg-[#FFF7ED] px-3 py-2">
            <p className="text-sm font-medium text-[#111827]">John Smith</p>
            <p className="text-xs text-[#6B7280]">4:30 PM - Audio Call</p>
            <p className="mt-1 text-xs text-[#B45309]">Pending</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">Available Nutritionists</h3>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-[#E5E7EB] px-3 py-2">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/80?img=47"
                alt="Dr. Sarah Wilson"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-[#111827]">Dr. Sarah Wilson</p>
                <p className="text-xs text-[#6B7280]">Weight Management</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-[#E5E7EB] px-3 py-2">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/80?img=12"
                alt="Dr. Michael Chen"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-[#111827]">Dr. Michael Chen</p>
                <p className="text-xs text-[#6B7280]">Diabetes Care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <h3 className="text-base font-semibold text-[#0A4833]">Quick Stats</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Completion Rate</span>
            <span className="font-medium text-[#0A4833]">94%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Avg Session Duration</span>
            <span className="font-medium text-[#0A4833]">45 min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Most Booked Expert</span>
            <span className="font-medium text-[#A68966]">Dr. Sarah Wilson</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminConsultationPage() {
  return (
    <section className="w-full bg-[#F7F8FA] p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <ConsultationTopSection />

        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <RecentConsultationsSection />
          <ConsultationRightPanel />
        </div>
      </div>
    </section>
  );
}
