from django.contrib import admin
from .models import Task
# Register your models here.

class TaskAdmin(admin.ModelAdmin):
    readonly_fields = ("completed", )

admin.site.register(Task, TaskAdmin)