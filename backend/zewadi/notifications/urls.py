from django.urls import path
from .views import (
    NotificationDetailView,
    NotificationListCreateView,
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
]
