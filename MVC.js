//  Recieves input data and passes to Model.
function Controller(){

     // Gets data from user
     this.target_pair = document.getElementById('currency.pair').value || 'none';
     this.target_price = document.getElementById('target.price').value || 0;
     this.user_frequency = document.getElementById('user.frequency').value;

     // For debugging
     console.log(`Controller pair: ${this.target_pair}`);
     console.log(`Controller price: ${this.target_price}`);
     console.log(`Controller time: ${this.user_frequency}`);

     // last thing here got error 429 again.
     while (this.target_price < 0 || isNaN(this.target_price)) {
          this.target_price = prompt('please enter a number greater than 0');
     }

     Model(this.target_price, this.target_pair, this.user_frequency);

}//Controller()



function View(){
     console.log('in the View');
     alert('Matched');
}



//  Model, handles: Scheduling, API, Comparison, Notify.
function Model(target_price, target_pair, user_frequency){

     (function API_REST(){
          // Change to class and add API functions..
          //  MODEL - API - Scheduler
          console.log('In the Model, calling API');
          // This function will parse xml string to object
          function parseXmlData(data) {
               parser = new DOMParser();
               xmlDoc = parser.parseFromString(data,"text/xml");
               return xmlDoc;
          }
          // getRates function will make HTTP request to external url.
          function getRates(url) {
               var xmlHttp = new XMLHttpRequest();
               xmlHttp.open( "GET", "https://cors-anywhere.herokuapp.com/" + url, false );
               xmlHttp.send( null );
               return xmlHttp.responseText;
          }
          // Execute request to get rates.
          var request = getRates("https://rates.fxcm.com/RatesXML");
          //console.log(parseXmlData(request));
          parseXmlData(request);
     })();

     // Getting data from API
     var totalNodes = xmlDoc.getElementsByTagName('Rates')[0].childElementCount;
     var all_pair_names = xmlDoc.getElementsByTagName('Rates')[0].children;
     var pair_by_index = all_pair_names;

     //  Comparison function
     console.log('comparing..');
     (function Scheduler(totalNodes, target_price, target_pair, user_frequency){

          for (let index = 0; index < totalNodes; index++) {
               
               var ask = pair_by_index[index].children[1].innerHTML;
               var symbol = pair_by_index[index].getAttribute('Symbol');

               if (symbol === target_pair) {
                    
                    console.log(`symbol fetched: ${symbol}`);
                    console.log(`ask fetched: ${ask}`);             
                    //console.log('Matched Pair');
                    if (ask === target_price) {
                         //console.log('price also matched!');
                         callView();
                         View();
                         user_frequency = 800;
                    }
               }
          }
          //  MODEL - Timing Frequency
          const time = new Date();
          console.log(time);
          console.log(`re-sending target price: ${target_price}`);
          console.log(`re-sending target pair: ${target_pair}`);
          setTimeout(Model, user_frequency*1000, target_price, target_pair);
     })(totalNodes, this.target_price, this.target_pair, this.user_frequency);

}// Model()



// function initValidation() {
//         // irrelevant code here
//         function validate(_block){
//             console.log( "test", _block );
//         }
    
//         initValidation.validate = validate;
// }

// initValidation();
// initValidation.validate( "hello" );
