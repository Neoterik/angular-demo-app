(function(){
    var app = angular.module('demoApp', ['ngMaterial']);
    app.controller('mainController',['$scope', '$http', '$mdDialog','$filter', function($scope, $http, $mdDialog, $filter){
        var onSuccess = function(response){
            $scope.users = response.data;
        };
         var onError = function(error){
            $scope.error = error;
        };
        
        $http.get('http://localhost:3000/people').then(onSuccess, onError);
        //$http.get('http://localhost:3000/person/1').then(onSuccess, onError);
        
        $scope.delete = function(user){
            var confirm = $mdDialog.confirm()
                  .title('Would you like to delete ' + user.firstname +'?')
                  .content('This will permanently delete this user from our repository!')
                  .ariaLabel('Lucky day')
                  .ok('Please do it!')
                  .cancel('No, keep user!');
            $mdDialog.show(confirm).then(function() {
              $http.delete('http://localhost:3000/person/' + user.id)
                .then(function(response){
                $http.get('http://localhost:3000/people').then(onSuccess, onError);
            });
            });
        }
        
        $scope.addPerson = function(evt) {
            $mdDialog.show({
              controller: addUserController,
              template: '<md-dialog aria-label="Mango (Fruit)">'+ 
                        '    <md-content class="md-padding"> '+
                        '       <form name="userForm"> '+
                        '           <div layout layout-sm="column"> '+
                        '           <md-input-container flex> <label>First Name</label> <input ng-model="user.firstname"> </md-input-container>'+ 
                        '           <md-input-container flex> <label>Last Name</label> <input ng-model="user.lastname"> </md-input-container> '+
                        '           </div>'+ 
                        '<div class="datepicker"><md-datepicker ng-model="user.birthdate" md-placeholder="Date of birth"></md-datepicker></div>'+ 
                        '   <md-input-container flex>'+ 
                        '       <label>Description</label> <textarea ng-model="user.description" columns="1" md-maxlength="150"></textarea>'+
                        '   </md-input-container> </form> </md-content> '+
                        '   <div class="md-actions" layout="row"> <span flex></span> '+
                        '       <md-button ng-click="cancel()"> Cancel </md-button> '+
                        '       <md-button ng-click="save(user)" class="md-primary"> Save </md-button> '+
                        '   </div>'+
                        '</md-dialog>',
            }).then(function() {
              $http.get('http://localhost:3000/people').then(onSuccess, onError);
            });
            
  };
        function addUserController($scope, $mdDialog) {
              $scope.user = {};
              $scope.cancel = function() {
                $mdDialog.cancel();
              };
              $scope.save = function(user) {
                $scope.user.birthdate = $filter('date')($scope.user.birthdate, 'yyyy-MM-dd')
                $http.post('http://localhost:3000/person',$scope.user);
                $mdDialog.hide();
              };
            };
        
        $scope.edit = function(user) {
            $mdDialog.show({
              controller: DialogController,
              locals: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                birthdate: user.birthdate,
                description: user.description
              },
              template: '<md-dialog aria-label="Mango (Fruit)">'+ 
                        '    <md-content class="md-padding"> '+
                        '       <form name="userForm"> '+
                        '           <div layout layout-sm="column"> '+
                        '           <md-input-container flex> <label>First Name</label> <input ng-model="user.firstname"> </md-input-container>'+ 
                        '           <md-input-container flex> <label>Last Name</label> <input ng-model="user.lastname"> </md-input-container> '+
                        '           </div>'+ 
                        '<div class="datepicker"><md-datepicker ng-model="user.birthdate" md-placeholder="Date of birth"></md-datepicker></div>'+ 
                        '   <md-input-container flex>'+ 
                        '       <label>Description</label> <textarea ng-model="user.description" columns="1" md-maxlength="150"></textarea>'+
                        '   </md-input-container> </form> </md-content> '+
                        '   <div class="md-actions" layout="row"> <span flex></span> '+
                        '       <md-button ng-click="cancel()"> Cancel </md-button> '+
                        '       <md-button ng-click="save(user)" class="md-primary"> Save </md-button> '+
                        '   </div>'+
                        '</md-dialog>',
            })
            .then(function() {
              $http.get('http://localhost:3000/people').then(onSuccess, onError);
            });
  };
        function DialogController($scope, $mdDialog, id, firstname, lastname, birthdate, description){                                                                                               
            var newBday = new Date(birthdate);          
             $scope.user = {
                id: id,
                firstname: firstname,
                lastname: lastname,
                birthdate: newBday,
                description: description
              };
              $scope.cancel = function() {
                $mdDialog.cancel();
              };
              $scope.save = function(user) {
                $scope.user.birthdate = $filter('date')($scope.user.birthdate, 'yyyy-MM-dd')
                $http.put('http://localhost:3000/person',user);
                $mdDialog.hide();
              };
            };
    
    }]);
}());

