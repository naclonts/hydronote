import uuid
from django.db import models
from django.utils.html import strip_tags
from django.contrib.auth.models import User

note_number = 1

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Unique ID")
    note_text = models.CharField(max_length=10000)
    modified_date = models.DateTimeField('date modified')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.raw_text()[0:30]
    
    # return text without HTML formatting
    def raw_text(self):
        return strip_tags(self.note_text)
        

class Tag(models.Model):
    tag_title = models.CharField(max_length=50)
