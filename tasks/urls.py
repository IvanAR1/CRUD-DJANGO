from django.urls import path
from . import views


app_name = 'tasks'
urlpatterns = [
    path('', views.Index, name='Index'),
    path('signup/', views.SignUp, name='SignUp'),
    path('tasks/', views.Tasks, name='Tasks'),
    path('tasks/complete', views.ListTasksCompleted, name='ListTasksCompleted'),
    path('logout/', views.Logout, name='Logout'),
    path('login/', views.Login, name='Login'),
    path('tasks/create/', views.CreateTask, name='CreateTask'),
    path('tasks/<int:task_id>/', views.EditTask, name='EditTask'),
    path('tasks/<int:task_id>/completed', views.CompleteTask, name='CompletedTask'),
    path('tasks/<int:task_id>/delete', views.DeleteTask, name='DeleteTask'),
]