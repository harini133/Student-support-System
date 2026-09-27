from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    TicketViewSet,
    TicketHistoryViewSet,
    LoginView,
    StaffViewSet,
    DashboardSummaryView,
)


router = DefaultRouter()

router.register("categories", CategoryViewSet)
router.register("tickets", TicketViewSet)
router.register("ticket-history", TicketHistoryViewSet)
router.register("staff", StaffViewSet)


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
]

urlpatterns += router.urls
