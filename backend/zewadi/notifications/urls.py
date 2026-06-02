from django.urls import path
from .views import (
    NotificationDetailView,
    NotificationListCreateView,
    PushDeviceRegisterView,
    PushDeviceStatusView,
    PushDeviceUnregisterView,
    UserNotificationDeleteView,
    UserNotificationListView,
    UserNotificationMarkAllReadView,
    UserNotificationMarkReadView,
    UserNotificationUnreadCountView,
)

urlpatterns = [
    path("", NotificationListCreateView.as_view()),
    path("<int:pk>/", NotificationDetailView.as_view()),
    path("inbox/", UserNotificationListView.as_view()),
    path("inbox/unread-count/", UserNotificationUnreadCountView.as_view()),
    path("inbox/mark-all-read/", UserNotificationMarkAllReadView.as_view()),
    path("inbox/<int:pk>/read/", UserNotificationMarkReadView.as_view()),
    path("inbox/<int:pk>/", UserNotificationDeleteView.as_view()),
    path("push-devices/status/", PushDeviceStatusView.as_view()),
    path("push-devices/register/", PushDeviceRegisterView.as_view()),
    path("push-devices/unregister/", PushDeviceUnregisterView.as_view()),
]
