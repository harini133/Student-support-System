from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

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