var app = angular.module('NoteApp', [
    'ui.router',
    'ui.tinymce'
]);

app.constant('BASE_URL', 'http://127.0.0.1:8000/hydronote/api/notes/');


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
    
    // Refresh list of notes 
    updateList = function() {
        return Notes.all().then(function(res) {
            $scope.notes = res.data;
        });
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
    };

    // Save note on submission of tinyMCE form
    $scope.saveNote = function() {
        console.log('-----------saving note:');
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
        
        id = $scope.currentNote.id;
        Notes.delete(id);

        // filter the note list to exclude the deleted item
        $scope.notes = $scope.notes.filter(function(note) {
            return note.id !== id;
        });
        
        // create a fresh new note
        $scope.addNote();
    };
    
    // On initial run, load the list of user's notes
    // TODO: select the last modified
    updateList().then($scope.addNote);
    
    // Set up editor controls
    $scope.tinymceModel = "Write your note here!";
    
    $scope.tinymceOptions = {
        theme: 'modern',
        resize: 'both',
        height: '400px',
        
        plugins: [
          'advlist autolink link lists charmap preview hr anchor pagebreak',
          'searchreplace wordcount visualchars code fullscreen insertdatetime nonbreaking emoticons template paste textcolor save'
        ],
        
        toolbar: 'save undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons',
        
        // Call save function when editor's Save button is clicked 
        save_onsavecallback: function() { $scope.saveNote(); },

        // allow users to save even when no changes have been made in tinyMCE editor (since title might've been changed)
        save_enablewhendirty: false,

        // Match up font/styling with the rest of page
        content_css: stylesheetPath  
    };
});
