from django.contrib import admin
from .models import Category, Ticket


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_active")


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "priority", "status", "created_at")
    list_filter = ("status", "priority", "category")
    search_fields = ("title", "description")