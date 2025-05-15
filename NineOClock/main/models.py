from django.db import models
from django.contrib.auth.models import User

app_name = 'main'


# Modelo para los artículos
class Article(models.Model):
    title = models.CharField(max_length=255)
    link = models.URLField()

    def __str__(self):
        return self.title  # Representación en forma de cadena del título del artículo


# Modelo para la lista de lectura
class ReadingList(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    articles = models.ManyToManyField(Article)

    def __str__(self):
        return f'{self.user.username} - {self.article.title}'

