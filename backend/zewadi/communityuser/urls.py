from django.urls import path

from .views import (
    CommunityDashboardSummaryAPIView,
    CommunityProfileAPIView,
    AddressListCreateView,
    AddressDeleteView,
)

urlpatterns = [
    path("profile/", CommunityProfileAPIView.as_view(), name="community-profile"),
    path(
        "dashboard/summary/",
        CommunityDashboardSummaryAPIView.as_view(),
        name="community-dashboard-summary",
    ),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<int:pk>/", AddressDeleteView.as_view(), name="address-delete"),
]
