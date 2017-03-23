var app = angular.module('NoteApp', [
    'ui.router',
    'ui.tinymce'
]);

app.constant('BASE_URL', 'http://127.0.0.1:8000/hydronote/api/notes/');


app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    // Set CSRF token cookies to match Django's defaults
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    
    
    // Set up templating URLs
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/static/templates/home.html',
            controller: 'mainController'
        })
        .state('add-note', {
            url: '/add',
            templateUrl: '/static/templates/add_note.html',
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

    Notes.update = function(updatedNote) {
        console.log('PUT to ' + BASE_URL + updatedNote.id + '/');
        return $http.put(BASE_URL + updatedNote.id + '/', updatedNote);
    };

    Notes.delete = function(id) {
        return $http.delete(BASE_URL + id + '/');
    };

    Notes.addOne = function(newNote) {
        return $http.post(BASE_URL, newNote);
    };

    return Notes;
});


app.controller('mainController', function($scope, Notes, $state) {
    // Set up Note controls
    $scope.newNote = {};
    $scope.currentNote = "";
    
    $scope.addNote = function() {
        Notes.addOne($scope.newNote)
            .then(function(res) {
                // redirect to home page once added
                $state.go('home');
            });
    };
    
    $scope.selectNote = function(id) {
        Notes.get(id).then(function(res) {
            $scope.currentNote = res.data;
        });
    };
    
    // Save note on submission of tinyMCE form
    $scope.saveNote = function() {
        console.log('-----------saving note:');
        console.log($scope.currentNote);
        Notes.update($scope.currentNote);   
    };
    
    $scope.deleteNote = function(id) {
        Notes.delete(id);
        // update the list in UI
        $scope.notes = $scope.notes.filter(function(note) {
            return note.id !== id;
        });
    };
    
    Notes.all().then(function(res) {
        $scope.notes = res.data;
    });
    
    
    // Set up editor controls
    $scope.tinymceModel = "Write your note here!";
    
    $scope.tinymceOptions = {
        theme: 'modern',
        resize: 'both',
        width: "70%",
        height: 200,
        plugins: [
          'advlist autolink link lists charmap preview hr anchor pagebreak',
          'searchreplace wordcount visualchars code fullscreen insertdatetime nonbreaking emoticons template paste textcolor save'
        ],
        //    content_css: 'css/content.css',
        toolbar: 'save undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor emoticons',

        // allow users to save even when no changes have been made in tinyMCE editor (since title might've been changed)
        save_enablewhendirty: false,

        // Match up font/styling with the rest of page
        content_css: stylesheetPath,
        
        save_onsavecallback: function() { $scope.saveNote(); }
    };
    
});
