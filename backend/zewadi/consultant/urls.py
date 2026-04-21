from django.urls import path
from .views import (
    ConsultantListView,
    ConsultantDetailView,
    ConsultationBookingCreateView,
    ConsultationBookingListView,
    AdminConsultationListView,
    AdminConsultationStatusUpdateView,
)

urlpatterns = [
    path("consultants/", ConsultantListView.as_view()),
    path("consultants/<int:pk>/", ConsultantDetailView.as_view()),
    path("book/", ConsultationBookingCreateView.as_view()),
    path("bookings/", ConsultationBookingListView.as_view()),
    path("admin/bookings/", AdminConsultationListView.as_view()),
    path("admin/bookings/<int:pk>/status/", AdminConsultationStatusUpdateView.as_view()),
]
