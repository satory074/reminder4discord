function doGet(e) {
  const formatDate = (date)=>{
    let formatted_date = date.getFullYear()
                          + "/"
                          + (date.getMonth() + 1)
                          + "/" + date.getDate()
                          + " "
                          + date.getHours()
                          + ":"
                          + date.getMinutes()
                          + ":00"
                        ;
    return formatted_date;
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('list');
  for (let i=2; i <= sheet.getLastRow(); i++){
    // Get remind data
    var date_ = sheet.getRange(i, 1).getValue();
    var content = sheet.getRange(i, 2).getValue();
    var rep_n = sheet.getRange(i, 3).getValue();
    var rep_u = sheet.getRange(i, 4).getValue();
    var webhook = sheet.getRange(i, 6).getValue();

    var now = new Date();
    var new_date = date_;
    if (date_ <= now){
      // Calclaation new date
      if (rep_u == 'year'){
        new_date.setYear(date_.getFullYear() + rep_n);
      } else if (rep_u == 'month'){
        new_date.setMonth(date_.getMonth() + rep_n);
      } else if (rep_u == 'week'){
        new_date.setDate(date_.getDate() + rep_n * 7);
      } else if (rep_u == 'day'){
        new_date.setDate(date_.getDate() + rep_n);
      } else if (rep_u == 'hour'){
        new_date.setHours(date_.getHours() + rep_n);
      } else if (rep_u == 'minute'){
        new_date.setMinutes(date_.getMinutes() + rep_n);
      }

      // Post data
      const payload = {
        username: 'UnboBot',
        avatar_url: 'https://pbs.twimg.com/media/B8TEm4OCMAQqPlB?format=png',
        content: content,
      };

      // Post via webhook
      UrlFetchApp.fetch(webhook, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
      });

      // Update
      sheet.getRange(i, 1).setValue(formatDate(new_date));
    }
  }
}
