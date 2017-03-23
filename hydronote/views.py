from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.utils import timezone
from django.contrib.auth.models import User

from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Note
from .forms import NoteForm
from .serializers import NoteSerializer


# Home route
def index(request):
    return render(request, 'hydronote/base_angular.html')

# Note access API handler
class NoteViewSet(viewsets.ModelViewSet):
    """Primary API to access Notes."""
    model = Note
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    print(queryset)
    
    def get_queryset(self):
        """Returns serialized list of Notes authored by the current user."""
        queryset = super(NoteViewSet, self).get_queryset()
        return queryset.filter(author__username=self.request.user)
    
    def update(self, request):
        """Update note with ID passed in to the value in request."""
        print('~~~~~~~~~~~~updating NoteViewSet!')

