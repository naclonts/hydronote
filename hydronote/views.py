from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import loader
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib import messages

from rest_framework import generics, permissions, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Note
from .forms import NoteForm, UserForm
from .serializers import NoteSerializer


# Home route
def index(request):
    # Hack to ensure sessions are being saved for anonymous users
    if not request.session.session_key:
        request.session.save()
        
    return render(request, 'hydronote/base_angular.html')


def add_user(request):
    """Account creation view. Routes to login page on success."""
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            new_user = User.objects.create_user(**form.cleaned_data)
            messages.success(request, 'Your account has been successfully created. Very nice!')
            return HttpResponseRedirect('/hydronote/accounts/login')

    else:
        form = UserForm()
        
    return render(request, 'add_user.html', {'form': form})
            

class NoteList(APIView):
    """
    List all notes, or create a new note.
    """
    def get(self, request, format=None):
        """Get list with all of user's notes."""
        # Filter based on username, or session key for anonymous users
        if request.user.is_authenticated():
            notes = Note.objects.all().filter(author__username=self.request.user)
        else:
            notes = Note.objects.all().filter(session_key=request.session.session_key)
        
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Create a new note.""" 
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            # Save under user, or session key for Anonymous
            if request.user.is_authenticated():
                serializer.save(author = request.user, session_key = request.session.session_key)
            else:
                serializer.save(session_key = request.session.session_key, author = None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NoteDetail(APIView):
    """
    Retrieve, update, or delete a note.
    """
    permission_classes = (permissions.AllowAny,)
    def get_object(self, pk):
        try:
            return Note.objects.get(pk=pk)
        except Note.DoesNotExist:
            raise Http404
            
    def get(self, request, pk, format=None):
        note = self.get_object(pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        note = self.get_object(pk)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        note = self.get_object(pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
        
        
        
        
