from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Category, Ticket, TicketHistory
from .serializers import (
    CategorySerializer,
    TicketSerializer,
    LoginSerializer,
    TicketHistorySerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by("-created_at")
    serializer_class = TicketSerializer

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

class TicketHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketHistory.objects.all().order_by("-created_at")
    serializer_class = TicketHistorySerializer


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