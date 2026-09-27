from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from .models import Category, Ticket, TicketHistory ,Staff
from .serializers import (
    CategorySerializer,
    TicketSerializer,
    LoginSerializer,
    TicketHistorySerializer,
    StaffSerializer,
)

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by("name")
    serializer_class = StaffSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = Ticket.objects.all().order_by("-created_at")

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")
        status_filter = self.request.query_params.get("status")
        priority = self.request.query_params.get("priority")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        if category:
            queryset = queryset.filter(
                category_id=category
            )

        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )

        if priority:
            queryset = queryset.filter(
                priority=priority
            )

        return queryset

    def perform_create(self, serializer):
        ticket = serializer.save()

        TicketHistory.objects.create(
            ticket=ticket,
            action="Ticket Created",
            new_value=ticket.status
        )

    def perform_update(self, serializer):
        ticket_obj = self.get_object()

        old_status = ticket_obj.status
        old_priority = ticket_obj.priority
        old_staff = ticket_obj.assigned_staff_id
        old_pending_reason = ticket_obj.pending_reason

        updated_ticket = serializer.save()

        if old_status != updated_ticket.status:
            TicketHistory.objects.create(
                ticket=updated_ticket,
                action="Status Changed",
                old_value=old_status,
                new_value=updated_ticket.status
            )

        if old_priority != updated_ticket.priority:
            TicketHistory.objects.create(
                ticket=updated_ticket,
                action="Priority Changed",
                old_value=old_priority,
                new_value=updated_ticket.priority
            )

        if old_staff != updated_ticket.assigned_staff_id:
            TicketHistory.objects.create(
                ticket=updated_ticket,
                action="Staff Assigned",
                old_value=str(old_staff) if old_staff else None,
                new_value=(
                    str(updated_ticket.assigned_staff_id)
                    if updated_ticket.assigned_staff_id
                    else None
                )
            )

        if old_pending_reason != updated_ticket.pending_reason:
            TicketHistory.objects.create(
                ticket=updated_ticket,
                action="Pending Reason Updated",
                old_value=old_pending_reason,
                new_value=updated_ticket.pending_reason
            )

class TicketHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketHistory.objects.all().order_by("-created_at")
    serializer_class = TicketHistorySerializer

    def get_queryset(self):
        queryset = TicketHistory.objects.all().order_by("-created_at")

        ticket_id = self.request.query_params.get("ticket")

        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)

        return queryset


class DashboardSummaryView(APIView):
    """Return ticket metrics and grouped data used by the dashboard."""

    def get(self, request):
        tickets = Ticket.objects.all()
        status_counts = {
            item["status"]: item["count"]
            for item in tickets.values("status").annotate(count=Count("id"))
        }
        priority_counts = {
            item["priority"]: item["count"]
            for item in tickets.values("priority").annotate(count=Count("id"))
        }

        today = timezone.localdate()
        month_start = today.replace(day=1)
        month_starts = []
        for months_ago in range(5, -1, -1):
            month_index = month_start.year * 12 + month_start.month - 1 - months_ago
            year, month_index = divmod(month_index, 12)
            month_starts.append(today.replace(year=year, month=month_index + 1, day=1))

        monthly_counts = {month: 0 for month in month_starts}
        for item in tickets.annotate(month=TruncMonth("created_at")).values("month").annotate(count=Count("id")):
            month = timezone.localtime(item["month"]).date()
            if month in monthly_counts:
                monthly_counts[month] += item["count"]

        now = timezone.now()
        overdue_count = tickets.filter(
            Q(priority="Low", created_at__lt=now - timedelta(hours=72))
            | Q(priority="Medium", created_at__lt=now - timedelta(hours=48))
            | Q(priority="High", created_at__lt=now - timedelta(hours=24))
            | Q(priority="Urgent", created_at__lt=now - timedelta(hours=12))
            | Q(priority__in=["", None], created_at__lt=now - timedelta(hours=48))
        )
        overdue_count = overdue_count.count()

        return Response({
            "cards": {
                "total": tickets.count(),
                "open": status_counts.get("Open", 0),
                "in_progress": status_counts.get("In Progress", 0),
                "resolved": status_counts.get("Resolved", 0),
                "pending": status_counts.get("Pending", 0),
                "overdue": overdue_count,
            },
            "charts": {
                "by_status": [
                    {"label": label, "value": status_counts.get(label, 0)}
                    for label, _ in Ticket.STATUS_CHOICES
                ],
                "by_priority": [
                    {"label": label, "value": priority_counts.get(label, 0)}
                    for label, _ in Ticket.PRIORITY_CHOICES
                ],
                "monthly_created": [
                    {"label": month.strftime("%b %Y"), "value": monthly_counts[month]}
                    for month in month_starts
                ],
            },
        })


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                }
            })

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
