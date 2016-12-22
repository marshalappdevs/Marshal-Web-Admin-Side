angular.module('marshalApp')
.controller('faqsCtrl', ['$scope','$mdDialog','httpService', function($scope,$mdDialog, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "שאלות ותשובות");
    
    /* General methods */
    var getfaqs = function (){
        httpService.get("/api/faqItems/").then(function (response){
            $scope.faqs = response.data;
        });  
    };
    
    getfaqs();

    $scope.hide = function(answer) {
        $mdDialog.hide(answer);
    };

    /* edit Faq item */
    $scope.editFaq = function(event, Faq){
        $scope.FaqToUpdate = Faq;
       return $mdDialog.show({
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'javascripts/templates/editFaq.html',         
                  controller: 'malshabCtrl'
               });
    };

    // after changing the FAQ item save it
    $scope.saveUpdates = function(){                                       
    var newFaq = {_id:$scope.FaqToUpdate._id,
                      Question:document.getElementById("faqQuestion").value,
                      Answer:document.getElementById("faqAnswer").value,
                      PhoneNumber:document.getElementById("faqPhoneNumber").value,
                      Link:null,
                      Address:null };
    
    if(document.getElementById("faqLink") != null) {
        newFaq.Link = document.getElementById("faqLink").value;
    }
    
    if(document.getElementById("faqAddress") != null) {
        newFaq.Address = document.getElementById("faqAddress").value;
    }
    
    // send it to the httpservice to save the changes
    httpService.put("/api/faqItems/"+newFaq._id, {FaqToUpdate:newFaq}).then(function (response){
        swal("נשמר", "פרטי השאלה נשמרו!", "success");
        getfaqs();
        $mdDialog.hide();
    })};


    /* delete FAQ item */
    $scope.deleteFaq = function(event, Faq){
        httpService.delete("/api/faqItems/"+Faq._id, {}).then(function(res) {
            swal("נמחק", "השאלה נמחקה בהצלחה!", "success");
            getfaqs();
        },function(res){
            swal("בעיה", "הייתה בעיה במחיקה!", "error");
        });
    };

    /* Add new FAQ item */
    $scope.addFaq = function(){
    return $mdDialog.show({
                  clickOutsideToClose: true,
                  hasBackdrop: false,
                  targetEvent: event,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'javascripts/templates/addFaq.html',         
                  controller: 'faqsCtrl'
               });
    };

    $scope.saveNewMalshab = function(){
        // Checks if the user fill all the fileds
        if(($scope.question == undefined) || 
           ($scope.answer == undefined) ||
           ($scope.phoneNumber == undefined) ||
           ($scope.useful == undefined) ||
           ($scope.unuseful == undefined)) {
            swal("בעיה", "חובה למלא את כל השדות!", "error");
        } else {
            var newFaq = {Question:$scope.question,
                      Answer:$scope.answer,
                      PhoneNumber:$scope.phoneNumber,
                      Useful:0,
                      Unuseful:0,
                      PinToTop:$scope.pinToTop,
                      Link:null,
                      Address:null };

            if($scope.link != undefined){
                newFaq.Link = $scope.link;
            }
            if($scope.address != undefined){
                newFaq.Address = $scope.address;
            }

            httpService.post("/api/faqItems/", {newFaq:newFaq}).then(function(res) {
                swal("נוסף", "השאלה נוספה בהצלחה!", "success");
                getfaqs();
            },function(res){
                swal("בעיה", "הייתה בעיה בהוספה!", "error");
        });
            $mdDialog.hide();
        }
    };
}]);