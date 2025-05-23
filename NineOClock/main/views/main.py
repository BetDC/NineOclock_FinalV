from django.core.cache import cache
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render
from .fetchArticles import getRSS, filter_articles_by_query
from ..models import ReadingList


def home(request):
    rss_articles = cache.get('cached_articles')  # Recuperar los artículos en caché

    if not rss_articles:

        rss_articles = getRSS()
        cache.set('cached_articles', rss_articles)

    # Filtrado de artículos, función de búsqueda
    query = request.GET.get('q', '')
    articles = filter_articles_by_query(rss_articles, query)
    
    # Paginación
    paginator = Paginator(articles, 10)
    page_num = request.GET.get('page')

    try:
        articles = paginator.page(page_num)
    except PageNotAnInteger:
        articles = paginator.page(1)
    except EmptyPage:
        articles = paginator.page(paginator.num_pages)

    context = {
        'articles': articles,
        'query': query,
        'user': request.user if request.user else None
    }

    return render(request, 'homepage.html', context)


def dashboard_view(request):
    if request.user.is_authenticated:
        reading_list, created = ReadingList.objects.get_or_create(user=request.user)
        articles = reading_list.articles.all()
        print("Articles in reading list:", articles)  # Agrega esta línea para verificar los artículos recuperados
    else:
        articles = []

    return render(request, 'dashboard.html', {'articles': articles})
