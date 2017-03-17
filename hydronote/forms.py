from django import forms

class NoteForm(forms.Form):
    text = forms.CharField(max_length=10000)