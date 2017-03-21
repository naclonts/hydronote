var app = angular.module('NoteApp', [
    'ngRoute',
    'ui.router'
]);

app.constant('BASE_URL', 'http://127.0.0.1:8000/hydronote/');


app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../../template/hydronote/base.html',
            controller: 'mainController'
        })
        .state('add-note', {
            url: '/add',
            templateUrl: 'static/templates/add_note.html',
            controller: 'mainController'
        });
    
    $urlRouterProvider.otherwise('/');
});

//app.config(function($routeProvider) {
//    $routeProvider
//    
//        // route for the home page
//        .when('/', {
//            templateUrl: 'pages/index.htm',
//            controller: 'mainController'
//        });
//});
// Create controller & inject $scope
//app.controller('mainController', function($scope) {
//    $scope.message = 'Ho there';
//});

app.service('Notes', function($http, BASE_URL) {
    var Notes = {};
            
    Notes.all = function() {
        return $http.get(BASE_URL);
    };

    Notes.update = function(updatedNote) {
        return $http.put(BASE_URL + updatedNote.id, updatedNote);
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
    $scope.newNote = {};
    $scope.addNote = function() {
        Notes.addOne($scope.newNote)
            .then(function(res) {
                // redirect to home page once added
                $state.go('home');
            });
    };
    
    $scope.saveNote = function(note) {
        Notes.update(note);
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
    console.log("Notes == " + Notes);
});


//app.controller('mainController', [
//    '$scope', '$http', function($scope, $http) {
//        $scope.notes = [];
//        return $http.get('/hydronote/nathan/notes/').then(function(result) {
//            return angular.forEach(result.data, function (item) {
//                return $scope.notes.push(item);
//            });
//        });
//    }
//]);
