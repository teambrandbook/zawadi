from django.urls import path
from .views import (
    BlockedDateView,
    ConsultantListView,
    ConsultantDetailView,
    ConsultantSettingsView,
    ConsultationBookingCreateView,
    ConsultationBookingListView,
    AdminConsultationListView,
    AdminConsultationStatusUpdateView,
    DietPlanCreateView,
    SaveAvailabilityView,
    FindConsultantView,
    CreateConsultationBookingView,
    CommunityBookingCancelView,
)

urlpatterns = [
    path("consultants/", ConsultantListView.as_view()),
    path("consultants/<int:pk>/", ConsultantDetailView.as_view()),
    path("book/", ConsultationBookingCreateView.as_view()),
    path("bookings/", ConsultationBookingListView.as_view()),
    path("diet-plans/create/", DietPlanCreateView.as_view()),
    path("availability/", SaveAvailabilityView.as_view()),
    path("settings/", ConsultantSettingsView.as_view()),
    path("blocked-dates/", BlockedDateView.as_view()),
    path("admin/bookings/", AdminConsultationListView.as_view()), 
    path("admin/bookings/<int:pk>/status/", AdminConsultationStatusUpdateView.as_view()),
    path("find-consultant/", FindConsultantView.as_view()),
    path("community/create-booking/", CreateConsultationBookingView.as_view()),
    path("bookings/<int:pk>/cancel/", CommunityBookingCancelView.as_view()),
]
