function makeString(stringLength) {
	var text = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz                      ";
	for( var i=0; i < stringLength; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)) );
	return text.join('');
}