import uuid
from django.db import models

note_number = 1

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, help_text="Unique ID")
#    id = models.IntegerField(primary_key=True, default=note_number)
    note_number += 1
    note_text = models.CharField(max_length=10000)
    modified_date = models.DateTimeField('date modified')
    
    def __str__(self):
        return self.note_text[0:30]

class Tag(models.Model):
    tag_title = models.CharField(max_length=50)
