var app = angular.module('NoteApp', [
    'ui.router',
    'ui.tinymce'
]);

app.constant('BASE_URL', 'api/notes/');


app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    // Set CSRF token cookies to match Django's defaults
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // Set head so Django understands POST format
    $httpProvider.defaults.headers.post['CONTENT-TYPE'] =
        'application/x-www-form-urlencoded';
    
    // Set up templating URLs
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/static/templates/home.html',
            controller: 'mainController'
        });
    
    $urlRouterProvider.otherwise('/');
});


app.service('Notes', function($http, BASE_URL) {
    var Notes = {};
            
    Notes.all = function() {
        return $http.get(BASE_URL);
    };
    
    Notes.get = function(id) {
        return $http.get(BASE_URL + id + '/');
    };

    Notes.save = function(updatedNote) {
        return $http.put(BASE_URL + updatedNote.id + '/', updatedNote);
    };

    Notes.delete = function(id) {
        return $http.delete(BASE_URL + id + '/');
    };

    Notes.add = function(newNote) {
        return $http.post(BASE_URL, newNote);
    };

    return Notes;
});


app.controller('mainController', function($scope, Notes, $state) {
    $scope.currentNote = {};
    $scope.expandedTagList = [];
    $scope.noteTitleList = [];
    
    // Refresh list of notes 
    updateList = function() {
        return Notes.all().then(function(res) {
            // Sort by tag
            res.data.sort(function(a, b) {
                if (a.tags == 'Trash') return 1;    // Put Trash tag at bottom
                if (b.tags == 'Trash') return -1;
                if (a.tags == null) return 1;
                if (b.tags == null) return -1;
                if (a.tags.toUpperCase() < b.tags.toUpperCase()) {
                    return -1;
                }
                return 1;
            });

            // Display titles of notes with expanded tags or no tags, as well as any tag names
            $scope.noteTitleList = [];
            for (var i=0; i < res.data.length; i++) {
                if (!res.data[i].tags) { // doesn't have tag: always display
                    $scope.noteTitleList.push({ title: res.data[i].note_title,
                                                id: res.data[i].id,
                                                type: 'untagged-note' });
                } else { // does have tag: display if expanded
                    var expanded = $scope.expandedTagList.indexOf(res.data[i].tags) > -1;
                    // add tag name if not already in list
                    if (i == 0 || res.data[i].tags != res.data[i-1].tags) {
                        $scope.noteTitleList.push({ title: res.data[i].tags,
                                                    id: 'tag-click:' + res.data[i].tags,
                                                    type: 'tag',
                                                    isExpanded: expanded });
                    }
                    // add note title if it's in an expanded tag
                    if (expanded) {
                        $scope.noteTitleList.push({ title: res.data[i].note_title,
                                                    id: res.data[i].id,
                                                    type: 'tagged-note' });
                    }
                }
            }
        });
    };
    
    // Handle click on an item (tag or note title) in the list
    $scope.listSelect = function(listID, $event) {
        var s = listID.split(':');
        // A tag has been clicked: toggle category's expansion
        if (s[0] == 'tag-click') {
            var tag = s.slice(1).join(':'); // Rejoin tags that had a colon in them
            tagIndex = $scope.expandedTagList.indexOf(tag);
            if (tagIndex > -1) { // Remove from expandedTagList if already expanded
                $scope.expandedTagList.splice(tagIndex, 1);
            } else {
                $scope.expandedTagList.push(tag);
            }
            // Stop event propogation to prevent menu from being exited
            $event.stopPropagation();
        // A Note has been clicked: select in editor
        } else {
            $scope.selectNote(listID);
        }
        updateList();
    };

    // Select a note to begin editing 
    $scope.selectNote = function(id) {
        Notes.get(id).then(function(res) {
            $scope.currentNote = res.data;
        });
    };
    
    // Create a blank note object (with no ID) and assign to $scope.currentNote
    $scope.addNote = function() {
        newNote = { note_title: 'A New Note',
                    note_text: '<i>Inspired thoughts go here!<i>' };
        $scope.currentNote = newNote;        
        $scope.message = '';
    };

    // Save currently selected note on submission of tinyMCE form
    $scope.saveNote = function() {
        $scope.message = 'Note saved';

        // If selected note already exists, update in database
        if ($scope.currentNote.hasOwnProperty('id')) {
            Notes.save($scope.currentNote).then(updateList);
        // If it's a brand new note (not yet in DB), add to database
        } else {
            Notes.add($scope.currentNote).then(function(res) {
                $scope.currentNote = res.data;
                updateList();
            });
        }
    };

    // Delete selected note
    $scope.deleteNote = function() {
        // If default new note is loaded (not in DB), skip
        if (!$scope.currentNote.id) return;
        
        // Move note to Trash (if not already)
        var originalTag = $scope.currentNote.tags;
        $scope.currentNote.tags = 'Trash';
        $scope.saveNote();
        
        // If already in Trash, ask if user would like to delete from database
        if (originalTag == 'Trash') {
            var id = $scope.currentNote.id;
            deleteDialog('delete-popup', function() {
                Notes.delete(id).then(updateList);
                // create a fresh new note
                $scope.addNote();
            });
        } else { // If just moved to trash, create a fresh note
            $scope.addNote();
        }
        
        $scope.message = 'Note deleted';
    };

    // On initial run, load the list of user's notes and set up event listeners (for modal and menu handing)
    updateList().then($scope.addNote);
    eventListenerSetup();
    
    // Set up tinyMCE editor controls
    $scope.tinymceModel = '';
    $scope.tinymceOptions = {
        theme: 'modern',
        resize: true,
        height: '350px',
        background: 'white',
        
        plugins: [
          'advlist autolink link lists charmap preview hr anchor pagebreak',
          'searchreplace wordcount visualchars code fullscreen insertdatetime nonbreaking emoticons template paste textcolor save'
        ],
        
        toolbar: 'save undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons',
        
        // Call save function when editor's Save button is clicked 
        save_onsavecallback: function() { $scope.saveNote(); },

        // allow users to save even when no changes have been made in tinyMCE editor (since title might've been changed)
        save_enablewhendirty: false,

        // Match up styling with the rest of page
        content_css: stylesheetPath, 
        
        setup: function (ed) {
            ed.on('init', function(e) {
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#fff';
            });
        }
    };
});
