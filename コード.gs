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

  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let reminders_sheet = spreadsheet.getSheetByName('reminders');
  let config_sheet = spreadsheet.getSheetByName('config');
  
  let now = new Date();

  for (let i=2; i <= reminders_sheet.getLastRow(); i++){
    // Get remind data
    let date_ = reminders_sheet.getRange(i, 1).getValue();
    let content = reminders_sheet.getRange(i, 2).getValue();
    let interval_number = reminders_sheet.getRange(i, 3).getValue();
    let interval_unit = reminders_sheet.getRange(i, 4).getValue();
    let webhook = reminders_sheet.getRange(i, 6).getValue();

    let new_date = date_;
    if (date_ <= now){
      // Calclaation new date
      if (interval_unit == 'year'){
        new_date.setYear(date_.getFullYear() + interval_number);
      } else if (interval_unit == 'month'){
        new_date.setMonth(date_.getMonth() + interval_number);
      } else if (interval_unit == 'week'){
        new_date.setDate(date_.getDate() + interval_number * 7);
      } else if (interval_unit == 'day'){
        new_date.setDate(date_.getDate() + interval_number);
      } else if (interval_unit == 'hour'){
        new_date.setHours(date_.getHours() + interval_number);
      } else if (interval_unit == 'minute'){
        new_date.setMinutes(date_.getMinutes() + interval_number);
      }

      // Post data
      const data = {
        username: config_sheet.getRange(2, 1).getValue(),
        avatar_url: config_sheet.getRange(2, 2).getValue(),
        content: content,
      };

      // Post via webhook
      UrlFetchApp.fetch(webhook, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(data),
      });

      // Update
      reminders_sheet.getRange(i, 1).setValue(formatDate(new_date));
    }
  }
}
