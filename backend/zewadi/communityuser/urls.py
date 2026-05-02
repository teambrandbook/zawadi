from django.urls import path

from .views import CommunityDashboardSummaryAPIView, CommunityProfileAPIView


urlpatterns = [
    path("profile/", CommunityProfileAPIView.as_view(), name="community-profile"),
    path("dashboard/summary/", CommunityDashboardSummaryAPIView.as_view(), name="community-dashboard-summary"),
]
