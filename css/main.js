console.log('main linked');

$(document).ready(function(){
	$("#new").click(function () {
   $(".add-new").toggle();
      });
		});

// var insertStatement = function (table, item) {
//     // turn the key-pair values in the object into an array of tuples
//     var itemIterable = Object.keys(item).map(function (key) {
//         return [key, item[key]];
//     });
//     // zip together the column names and values
//     var itemZipped = _.zip(itemIterable);
//     // create the columns portion of the insert statement
//     var columns = zipped[0].reduce(function (previous, next) {
//         return previous + ", " + next;
//     });
//     // create the values portion of the insert statement
//     var values = zipped[1].reduce(function (previous, next) {
//         return previous + ", " + next;
//     });

//     return "INSERT INTO "+table+" ("+columns+") VALUES ("+values+")";  
// }