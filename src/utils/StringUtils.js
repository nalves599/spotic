module.exports = {
    generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    cleanString(str){
        str = str.replace(/[\/\?\.\*\"\<\>\:\|]/g, " ");
        str = str.replace(/ *\([^)]*\)? */g, ""); 
        str = str.trim();
        return str;
    }
}