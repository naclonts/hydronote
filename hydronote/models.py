import uuid
from django.db import models
from django.utils.html import strip_tags
from django.utils import timezone
from django.contrib.auth.models import User

note_number = 1

class Note(models.Model):
    """Primary note model."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Unique ID")
    note_text = models.CharField(max_length=10000)
    note_title = models.CharField(max_length=40, null=True, blank=True)
    modified_date = models.DateTimeField('date modified')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.raw_text()[0:30]
    
    # return text without HTML formatting
    def raw_text(self):
        return strip_tags(self.note_text)
    
    # title to display in list (either self.title or beginning of text if no title)
    def list_title(self):
        if self.note_title == None:
            return self.__str__()
        else:
            return self.note_title
        
    # return "last modified" datetime in local time
    # TODO: implement. Currently always MT per index.html.
    def get_modified_local_time(self):
        return self.modified_date
        

class Tag(models.Model):
    tag_title = models.CharField(max_length=50)
