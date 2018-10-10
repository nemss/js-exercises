export class Http {
   static getData(url) {
       return new Promise((resolve, rejects) => {
           const HTTP = new XMLHttpRequest();
           HTTP.open('GET', url);
           HTTP.onreadystatechange = () => {
               if(HTTP.readyState == XMLHttpRequest.DONE && HTTP.status == 200) {
                const DATA = JSON.parse(HTTP.responseText);
                resolve(DATA);
            } else if (HTTP.readyState == XMLHttpRequest.DONE) {
                rejects('Error');
            }
           };
           HTTP.send();
       });
   }
}