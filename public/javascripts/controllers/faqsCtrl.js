angular.module('marshalApp')
.controller('faqsCtrl', ['$scope','$mdDialog','httpService', function($scope,$mdDialog, httpService){
    // Emitting current feature to parent scope
    $scope.$emit('currFeatureChange', "שאלות ותשובות");
    
    /* General methods */
    var getfaqs = function (){
        httpService.get("/api/faq/").then(function (response){
            $scope.faqs = response.data;
        });  
    };
    
    getfaqs();

    $scope.Faq = {
        Question:{},
        Answer:{},
        PhoneNumber:{},
        Useful:{},
        Unuseful:{},
        PinToTop:{},
        Link:{},
        Address:{}
    };

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
    httpService.put("/api/faq/"+newFaq._id, {FaqToUpdate:newFaq}).then(function (response){
        swal("נשמר", "פרטי השאלה נשמרו!", "success");
        getfaqs();
        $mdDialog.hide();
    })};


    /* delete FAQ item */
    $scope.deleteFaq = function(event, Faq){
        httpService.delete("/api/faq/"+Faq._id, {}).then(function(res) {
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

    $scope.saveNewFaq = function(){
        // Checks if the user fill all the fileds
        if(($scope.Faq == undefined) || 
           ($scope.Faq.question == undefined) || 
           ($scope.Faq.answer == undefined) ||
           ($scope.Faq.phoneNumber == undefined) ||
           ($scope.Faq.pinToTop  == undefined)) {
            swal("בעיה", "חובה למלא את כל השדות!", "error");
        } else {
            var newFaq = {Question:$scope.Faq.question,
                      Answer:$scope.Faq.answer,
                      PhoneNumber:$scope.Faq.phoneNumber,
                      Useful:0,
                      Unuseful:0,
                      PinToTop:$scope.Faq.pinToTop,
                      Link:null,
                      Address:null };

            if($scope.Faq.link != undefined){
                newFaq.Link = $scope.Faq.link;
            }
            if($scope.Faq.address != undefined){
                newFaq.Address = $scope.Faq.address;
            }

            httpService.post("/api/faq/", {newFaq:newFaq}).then(function(res) {
                swal("נוסף", "השאלה נוספה בהצלחה!", "success");
                getfaqs();
            },function(res){
                swal("בעיה", "הייתה בעיה בהוספה!", "error");
        });
            $mdDialog.hide();
        }
    };

    $scope.refreshForm = function(){
        $scope.Faq = null;
    };
}]);
