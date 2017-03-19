from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.utils import timezone

from .models import Note
from .forms import NoteForm

def index(request):
    """Main Hydronote app screen."""
    # list of notes this user has created
    if request.user.is_authenticated():
        note_list = Note.objects.filter(author=request.user)
    else:
        note_list = None
    
    # if a note is currently selected, mark which one it is to be displayed on page
    if 'selected_note_id' in request.session:
        selected_note = Note.objects.get(pk=request.session['selected_note_id'])
    else:
        selected_note = None

    print('selected %s' % selected_note)
    context = {
        'note_list': note_list,
        'selected_note': selected_note,
    }
    
    #return HttpResponse(template.render(context, request))
    return render(
        request,
        'hydronote/index.html',
        context=context,
    )


def save_note(request):
    if request.method == "POST":
        form = NoteForm(request.POST)
        if form.is_valid():
            if 'selected_note_id' in request.session:
                note_id = request.session['selected_note_id']
            else:
                note_id = None
    
            # if a note is selected, update it. otherwise, create a new one.
            if note_id != None:
                note = Note.objects.get(pk=request.session['selected_note_id'])
                print('note saved: %s' % note)
                note.note_text = form.cleaned_data['text']
                note.note_title = form.cleaned_data['note_title']
                note.modified_date = timezone.now()
            else: # No note selected
                note = Note(note_text=form.cleaned_data['text'], note_title=form.cleaned_data['note_title'],
                            modified_date=timezone.now(), author=request.user)
                print('new note saved: %s' % note)
                
            note.save()
            return HttpResponseRedirect('/hydronote/')
        
        else:
            print("form is not valid! :(")

    else:
        print("~~~~~~~save_note request.method != 'POST'")
        form = NoteForm()
    
    return render(request, 'hydronote/index.html', {'note_list': Note.objects.all()})


def select_note(request, note_id):
    request.session['selected_note_id'] = note_id
    return HttpResponseRedirect('/hydronote/')



