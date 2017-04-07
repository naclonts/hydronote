from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from rest_framework import routers
from . import views


app_name = 'hydronote'
urlpatterns = [
    # root
    url(r'^$', views.index, name='index'),

    # admin jazz
    url(r'admin/', admin.site.urls),

    # account management
    url(r'^accounts/login/$', auth_views.login, name='login'),
    url(r'^accounts/logout/$', auth_views.logout, name='logout'),
    url('add_user/', views.add_user, name="add_user"),

    # REST API links to retrieve note data
    url(r'^api/notes/$', views.NoteList.as_view()),
    url(r'^api/notes/(?P<pk>[0-9a-f-]+)/$', views.NoteDetail.as_view()),

]

