from django.conf.urls import url

from . import views

app_name = 'hydronote'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    
    # ex. /hydronote/save_note/
    url(r'^save_note/$', views.save_note, name="save_vote"),
    
    # ex. /hydronote/42/select_note/
    url(r'^(?P<note_id>[0-9a-f-]+)/select_note/$', views.select_note, name="select_note"),
    
    
]
