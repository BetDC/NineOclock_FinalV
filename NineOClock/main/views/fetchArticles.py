from dateutil import parser as date_parser
from dateutil.tz import tzutc
from ..models import Article
import feedparser


# Vista para recuperar y mostrar los artículos RSS
def getRSS():
    urls = [
        'https://www.gq.com/feed/rss',
        'https://menstylefashion.com/feed/',
        'https://www.dmarge.com/feed',
        'https://www.thefashionisto.com/feed/',
        'https://www.gentlemansgazette.com/feed/',
        'https://www.valetmag.com/distribution/rss_all.xml',
    ]

    formatted_articles = []

    # Recorrer los flujos RSS
    for url in urls:

        feed = feedparser.parse(url)
        articles = feed.entries

        for article in articles:

            if is_podcast(article):
                continue

            formatted_article = parse_article(article)
            article_title = formatted_article['title']
            article_link = formatted_article['link']

            if not Article.objects.filter(title=article_title, link=article_link).exists():
                saved_article = Article(
                    title=article_title,
                    link=article_link,
                )
                saved_article.save()

            filtered_article = filter_image_from_article(formatted_article)
            formatted_articles.append(filtered_article)

            default_date = date_parser.parse('1970-01-01T00:00:00Z').replace(tzinfo=tzutc())
            formatted_articles.sort(key=lambda x: x['published'] if x['published'] else default_date, reverse=True)

    return formatted_articles


# Función para analizar un artículo y extraer la información necesaria
def parse_article(article):

    formatted_article = {
        'title': getattr(article, 'title', ''),
        'link': getattr(article, 'link', ''),
        'summary': getattr(article, 'summary', ''),
        'content': getattr(article, 'content', ''),
        'source': getattr(article, 'source', {}).get('title', ''),
        'published': parse_published_date(getattr(article, 'published', None)),
    }

    return formatted_article


# Función para verificar si un artículo es un podcast
def is_podcast(article):
    return any(link.get('type', '').startswith('audio') for link in article.get('links', []))


# Función para filtrar la imagen del artículo
def filter_image_from_article(article):

    filtered_article = article.copy()
    filtered_article.pop('image_url', None)

    return filtered_article


# Función para analizar la fecha de publicación
def parse_published_date(published):

    if not published:
        return None
    
    try:
        published_date = date_parser.parse(published)
        
        if published_date.tzinfo is None:
            published_date = published_date.replace(tzinfo=tzutc())
            
        return published_date
    
    except (ValueError, TypeError):
        
        return None


# Función para filtrar los artículos por consulta de búsqueda
def filter_articles_by_query(articles, query):

    if not query:
        return articles

    filtered_articles = []

    for article in articles:
        if query.lower() in article['title'].lower() or query.lower() in article['summary'].lower():
            filtered_articles.append(article)

    return filtered_articles

