from django.conf.urls import url, include
from rest_framework import routers
from . import views


note_router = routers.DefaultRouter()
note_router.register(r'notes', views.NoteViewSet, base_name="notesviewset")

app_name = 'hydronote'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    
#    url(r'^(?P<username>[0-9a-zA-Z_-]+)/notes/$', views.NoteList.as_view(), name="note-list"),
    url('^api/', include(note_router.urls)),
    
    # ex. /hydronote/save_note/
#    url(r'^save_note/$', views.save_note, name="save_vote"),
    
    # ex. /hydronote/42/select_note/
#    url(r'^(?P<note_id>[0-9a-f-]+)/select_note/$', views.select_note, name="select_note"),

]

