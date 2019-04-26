var yourSpreadsheetId = '1sAIW06hhSkedsdg32w55JRtLIi7McnEEzQ4Px4-s7u4l-rY';
var yourSheetName = 'Sheet1';

var ss = SpreadsheetApp.openById(yourSpreadsheetId);
var s1 = ss.getSheetByName(yourSheetName);

function getLastRowInCol(n){ //this function lets the script know where it last stopped. 
  var table = s1.getRange(1,1,s1.getLastRow(),s1.getLastColumn()).getValues();
  for(var i=(table.length-1); i>=0; i--){
    if(table[i][n] != ''){
      return (i+2);
      break;
    }
  }
}

function getNamesFromTable(){
  var lastRow = s1.getLastRow()
  var startRow = getLastRowInCol(4);

  var difOfStart2Last =  lastRow - startRow;
  var rowsToRun = (difOfStart2Last > 50) ? 50 : (difOfStart2Last + 1);

  var next25 = s1.getRange(startRow,1,rowsToRun,1).getValues();

  var urls = [];
  for(var i=0; i<next25.length; i++){
    urls.push("https://api.genderize.io/?name="+next25[i][0])
  }
  var res = UrlFetchApp.fetchAll(urls);
  var resArr = res.map(function(m){ return JSON.parse(m)});
  var arr2sheet = resArr.map(function(d){ 
    var name = d.name ? d.name : 'not found';
    var gender = d.gender ? d.gender : 'not found';
    var probability = d.probability ? d.probability : 0;
    var count = d.count ? d.count : 0;
    return [name, gender, probability, count];
  });

  s1.getRange(startRow,3,arr2sheet.length, arr2sheet[0].length).setValues(arr2sheet);

}

