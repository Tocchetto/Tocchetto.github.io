var app = angular.module('myApp', []);

app.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.accessToken = "";
    $scope.apiUrl = "";
    $scope.infoPath = "";
    $scope.data = {};

    $scope.fetchInfo = function () {
        getUserInfo($scope.accessToken, $scope.apiUrl, $scope.infoPath)
            .then(result => {
                $scope.data = result;
                $scope.$apply();  // Como estamos fora do ciclo do AngularJS, é necessário chamar $apply.
            })
            .catch(error => {
                $scope.data = { error: error.message };
                $scope.$apply();
            });
    };
}]);

function getUserInfo(access_token, url, info = null) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + access_token);

    return fetch(url, { headers: headers })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(data => {
            if (!info) {
                return data;
            } else {
                let keys = info.split('.');
                for (let key of keys) {
                    if (Array.isArray(data)) {
                        key = parseInt(key);
                    }
                    data = data[key];
                }
                return data;
            }
        });
}

