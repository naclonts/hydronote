from django.conf.urls import url, include
from rest_framework import routers
from . import views


app_name = 'hydronote'
urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'^api/notes/$', views.NoteList.as_view()),
    
    url(r'^api/notes/(?P<pk>[0-9a-f-]+)/$', views.NoteDetail.as_view()),

]

