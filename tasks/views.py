from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.http import JsonResponse, QueryDict
from django.db.utils import IntegrityError
from .forms import TaskForm
from .models import Task
from django.utils import timezone
from django.conf import settings

def Index(request):
    return render(request, 'index.html');

@require_http_methods(["GET", "POST"])
def SignUp(request):
    if request.user.is_authenticated:
        return redirect(settings.LOGIN_REDIRECT_URL)
    if request.method == 'GET':
        return render(request, 'signup.html', {
            'form': UserCreationForm(),
        })
    else:
        if(request.POST["username"] and (request.POST["password"] == request.POST["confirm_password"])):
            try:
                user = User.objects.create_user(
                    username=request.POST["username"],
                    password=request.POST["password"]
                )
                user.save()
                login(request, user)
                return JsonResponse({"message":"User created successfully"})
            except IntegrityError as e:
                return JsonResponse({"message":"User already exists: %s" %(e)}, status=401)
            except:
                return JsonResponse({"message":"Unknown error"}, status=400)
        return JsonResponse({"message":"Password and Confirm Password do not match"}, status=400)
    
@require_http_methods(["GET"])
@login_required
def Tasks(request):
    tasks = Task.objects.filter(user=request.user, date_completed__isnull = True)
    return render(request, 'tasks.html', {
        'tasks': tasks
    })

@require_http_methods(["GET"])
@login_required
def ListTasksCompleted(request):
    tasks = Task.objects.filter(user=request.user, date_completed__isnull = False)
    return render(request, 'tasks_completed.html', {
        'tasks': tasks
    })

@require_http_methods(["GET", "POST"])
@login_required
def CreateTask(request):
    if request.method == "GET":
        return render(request, 'create_task.html',{
            'form': TaskForm(),
        })
    title = request.POST.get("title", None)
    description = request.POST.get("description", None)
    important = request.POST.get("important", None)
    if not title or not description or not important:
        return JsonResponse({"message":"Favor de rellenar todos los campos."}, status=400)
    form = TaskForm(request.POST)
    if form.is_valid():
        newTask = form.save(commit=False)
        newTask.user = request.user
        newTask.save()
        return JsonResponse({"message":"Task created successfully"})
    else:
        return JsonResponse({"message":"Invalid data received."}, status=400)

@require_http_methods(["GET", "PUT"])
@login_required
def EditTask(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"message":"Task not found"}, status=404)
    if request.method == "GET":
        return render(request, 'edit_task.html',{
            'form': TaskForm(instance=task),
            "task_id":task_id
        })
    try:
        data = QueryDict(request.body)
        form = TaskForm(data, instance=task)
        if form.is_valid():
            form.save()
            return JsonResponse({"message":"La tarea ha sido guardada."}, status=200)
        else:
            return JsonResponse({"message":"Invalid data received."}, status=400)
    except:
        return JsonResponse({"message":"Unknown error"}, status=400)

@require_http_methods(["GET", "PUT"])
@login_required
def CompleteTask(request, task_id):
    try:
        task = get_object_or_404(Task, pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"message":"Task not found"}, status=404)
    task.date_completed = timezone.now()
    task.save()
    if request.method == "GET":
        return render(request, 'tasks.html',{
            "task":task
        })
    return JsonResponse({"message":"Task completada exitosamente."})

@require_http_methods(["GET", "DELETE"])
@login_required
def DeleteTask(request, task_id):
    try:
        task = get_object_or_404(Task, pk=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"message":"Task not found"}, status=404)
    if request.method == "GET":
        return render(request, 'delete_task.html',{
            "task":task
        })
    task.delete()
    return JsonResponse({"message":"Task eliminada exitosamente."})

@require_http_methods(["GET", "POST"])
@login_required
def Logout(request):
    logout(request)
    return JsonResponse({"message":"Logged out successfully"})

@require_http_methods(["GET", "POST"])
def Login(request):
    if request.user.is_authenticated:
        return redirect(settings.LOGIN_REDIRECT_URL)
    if request.method == 'GET':
        return render(request, 'login.html', {
            'form': AuthenticationForm,
        })
    else:
        user = authenticate(request, username=request.POST["username"], password=request.POST["password"])
        if user is None:
            return JsonResponse({"message":"Invalid username or password"}, status=400)
        login(request, user)
        return JsonResponse({"message":"Login is successful"}, status=200)