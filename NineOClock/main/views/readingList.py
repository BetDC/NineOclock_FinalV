import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from ..models import Article, ReadingList

logger = logging.getLogger(__name__)


@login_required
def add_to_reading_list(request):
    if request.method == 'POST':
        article_title = request.POST.get('article_title')
        
        try:
            article = Article.objects.get(title=article_title)
        except Article.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': "El artículo no existe."})

        reading_list, created = ReadingList.objects.get_or_create(user=request.user)
        
        # Verificar si el artículo ya está en la lista de lectura
        if article not in reading_list.articles.all():
            reading_list.articles.add(article)
            message = "El artículo ha sido agregado a tu lista de lectura."
        else:
            message = "El artículo ya está en tu lista de lectura."

        return JsonResponse({'status': 'success', 'message': message})
    return JsonResponse({'status': 'error', 'message': 'Solicitud inválida.'})


@login_required
def remove_from_reading_list(request):
    if request.method == 'POST':
        article_title = request.POST.get('article_title')
        
        try:
            article = Article.objects.get(title=article_title)
        except Article.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': "El artículo no existe."})

        try:
            reading_list = ReadingList.objects.get(user=request.user)
        except ReadingList.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Lista de lectura no encontrada.'})

        if article in reading_list.articles.all():
            reading_list.articles.remove(article)
            return JsonResponse({'status': 'success', 'message': "El artículo ha sido eliminado de tu lista de lectura."})
        else:
            return JsonResponse({'status': 'error', 'message': "El artículo no está en tu lista de lectura."})
    return JsonResponse({'status': 'error', 'message': 'Solicitud inválida.'})


@login_required
def reading_list(request):
    try:
        reading_list = ReadingList.objects.get(user=request.user)
        articles = reading_list.articles.all()
        context = {
            'reading_list': articles,
        }
        return render(request, 'reading_list.html', context)

    except ReadingList.DoesNotExist:
        # Si la lista de lectura aún no existe para este usuario, devolver una lista vacía
        context = {
            'reading_list': [],
        }
        return render(request, 'reading_list.html', context)
