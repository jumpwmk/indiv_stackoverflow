from django.db import models

# Create your models here.
class predict(models.Model):
    tag = models.CharField(max_length=255)
    detail = models.CharField(max_length=255)
    range = models.CharField(max_length=255)
