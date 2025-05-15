from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


# View for user registration
@csrf_exempt
def register_view(request):

    if request.method == 'POST':

        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')

            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Username already exists'})

            user = User.objects.create_user(username=username, password=password, email=email)
            user.save()

            return JsonResponse({'success': True, 'message': 'Registration successful'})

        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Error during registration'}, status=400)
        
    return JsonResponse({'success': False, 'message': 'Registration failed'}, status=400)


# View for user login
@csrf_exempt
def login_view(request):

    if request.method == 'POST':

        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(username=username, password=password)
            
            if user is not None:
                login(request, user)                
                
                return JsonResponse({'success': True, 'message': 'Login successful'})
            else:
                return JsonResponse({'success': False, 'message': 'Incorrect username or password'}, status=400)

        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Error during login'}, status=400)

    return JsonResponse({'success': False, 'message': 'Incorrect username or password'}, status=400)


@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logout successful'})

