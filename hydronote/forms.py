from django import forms
from django.contrib.auth.models import User


class NoteForm(forms.Form):
    text = forms.CharField(max_length=10000)
    note_title = forms.CharField(max_length=40)    
    
    
class UserForm(forms.ModelForm):
    """Form to create a new account."""
    class Meta:
        model = User
#        password = forms.CharField(widget=forms.PasswordInput)
        fields = ('username', 'email', 'password')