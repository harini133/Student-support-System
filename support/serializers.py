from rest_framework import serializers
from .models import Category, Ticket, TicketHistory, Staff
from django.contrib.auth import authenticate
from django.utils import timezone


class TicketSerializer(serializers.ModelSerializer):
    ageing_hours = serializers.SerializerMethodField()
    sla_hours = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    category_name = serializers.CharField(
    source="category.name",
    read_only=True
)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "category",
            'category_name',
            "priority",
            "status",
            "assigned_staff",
            'pending_reason',
            'resolution_remarks',
            "created_at",
            "updated_at",
            "ageing_hours",
            "sla_hours",
            "is_overdue",
        ]

    def get_ageing_hours(self, obj):
        difference = timezone.now() - obj.created_at
        return round(difference.total_seconds() / 3600, 2)

    def get_sla_hours(self, obj):
        sla_limits = {
            "Low": 72,
            "Medium": 48,
            "High": 24,
            "Urgent": 12,
        }

        return sla_limits.get(obj.priority, 48)

    def get_is_overdue(self, obj):
        ageing_hours = self.get_ageing_hours(obj)
        sla_hours = self.get_sla_hours(obj)

        return ageing_hours > sla_hours
    
    


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class TicketHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketHistory
        fields = "__all__"


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is inactive."
            )

        data["user"] = user
        return data