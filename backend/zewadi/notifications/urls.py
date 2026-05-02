from django.urls import path
from .views import (
    NotificationListCreateView,
    NotificationDetailView,
    UserNotificationListView,
    UserNotificationMarkAllReadView,
    UserNotificationMarkReadView,
)

urlpatterns = [
    # Admin endpoints
    path("", NotificationListCreateView.as_view(), name="notifications-list-create"),
    path("<int:pk>/", NotificationDetailView.as_view(), name="notifications-detail"),

    # Community-user inbox endpoints
    path("inbox/", UserNotificationListView.as_view(), name="notifications-inbox"),
    path("inbox/mark-all-read/", UserNotificationMarkAllReadView.as_view(), name="notifications-mark-all-read"),
    path("inbox/<int:pk>/read/", UserNotificationMarkReadView.as_view(), name="notifications-mark-read"),
]
