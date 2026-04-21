import NotificationHeader from "./NotificationHeader";
import NotificationStatsGrid from "./NotificationStatsGrid";
import NotificationTabs from "./NotificationTabs";
import NotificationsList from "./NotificationsList";
import NotificationsSidebar from "./NotificationsSidebar";
import { NotificationsPageData } from "./types";

type Props = {
  data: NotificationsPageData;
};

export default function NotificationsPage({ data }: Props) {
  return (
    <section className="w-full bg-white px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-[1120px] space-y-6">
        <NotificationHeader title={data.title} subtitle={data.subtitle} />
        <NotificationStatsGrid stats={data.stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <NotificationTabs tabs={data.tabs} />
            <NotificationsList notifications={data.notifications} />
          </div>

          <NotificationsSidebar
            priorityAlerts={data.priorityAlerts}
            quickActions={data.quickActions}
            preferences={data.preferences}
            activitySummary={data.activitySummary}
          />
        </div>
      </div>
    </section>
  );
}
