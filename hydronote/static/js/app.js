var app = angular.module('NoteApp', [
    'ui.router'
]);

app.constant('BASE_URL', 'http://127.0.0.1:8000/hydronote/api/notes/');


app.config(function($stateProvider, $urlRouterProvider) {
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
        console.log('----------app.service.Notes.all(): ' + $http.get(BASE_URL));
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
        console.log('Notes.all() completed, results:');
        console.log(res.data);
        $scope.notes = res.data;
    });
    
    $scope.message = "hello world!";
    
    console.log('mainController finished; $scope.notes == ' + $scope.notes);
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
