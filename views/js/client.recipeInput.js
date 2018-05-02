
// Declare variables

var searchItem = document.querySelector('#itemSearch');
var searchSubmit = document.querySelector('#itemSearchSubmit');

// clean query
function validateQuery(input) {
    // convert to string
    var str = input + "";
    if(str.length < 1) {
        return {empty: true}
    }
    return str.split(' ').join('%20').toLowerCase();
} 
// send search request to server

function onEnter(val) {
    console.log(val)
}
// BASE URL
function getBaseURL(path){
    return window.location.origin + "/" + path;
}
function queryNDBNo() {

    var ori = getBaseURL('api/search/') + validateQuery(searchItem.value);
    var str = "";
    fetch(ori).then(function(response){
        if(response.ok && response.status === 200) {
            var obj = response.body;
            
            
            console.log(obj)
        }
    })
}
