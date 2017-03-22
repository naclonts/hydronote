from django.conf.urls import url, include
from rest_framework import routers
from . import views


note_router = routers.DefaultRouter()
note_router.register(r'notes', views.NoteViewSet, base_name="note_router")

app_name = 'hydronote'
urlpatterns = [
    url(r'^$', views.index, name='index'),

    url('^api/', include(note_router.urls)),

]

