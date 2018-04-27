
// Declare variables
alert("hey")

var searchItem = document.querySelector('#itemSearch');
var searchSubmit = document.querySelector('#itemSearchSubmit');
console.log("HEYYY")
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
// BASE URL
function getBaseURL(path){
    return window.location.origin + "/" + path;
}
function queryNDBNo(query) {
    console.log(query)
    var ori = getBaseURL('api/search/') + validateQuery(query);
    return fetch(ori).then(function(data){
        console.log(data)
    })
}