# pyrefly: ignore [missing-import]
from django.urls import path
from .views import (
    EventListCreateAPIView,
    EventDetailAPIView,
    EventRegistrationAPIView,
    MyEventRegistrationsAPIView,
)

urlpatterns = [
    path("", EventListCreateAPIView.as_view()),
    path("my-registrations/", MyEventRegistrationsAPIView.as_view()),
    path("<int:pk>/", EventDetailAPIView.as_view()),
    path("<int:pk>/register/", EventRegistrationAPIView.as_view()),
]
