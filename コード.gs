function main() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const remindersSheet = spreadsheet.getSheetByName('reminders');
  const configSheet = spreadsheet.getSheetByName('config');

  const now = new Date();

  // 設定値をキャッシュ
  const username = configSheet.getRange("A2").getValue();
  const avatarUrl = configSheet.getRange("B2").getValue();

  const lastRow = remindersSheet.getLastRow();
  const dataRange = remindersSheet.getRange(2, 1, lastRow - 1, 6);
  const data = dataRange.getValues();

  data.forEach((row, index) => {
    let [date_, content, intervalNumber, intervalUnit, , webhook] = row;

    if (!(date_ instanceof Date)) {
      date_ = new Date(date_);
    }

    if (date_ <= now) {
      // データを送信
      const payload = {
        username: username,
        avatar_url: avatarUrl,
        content: content,
      };

      // Webhook経由でポスト
      try {
        UrlFetchApp.fetch(webhook, {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify(payload),
        });
      } catch (error) {
        Logger.log(`Webhook送信エラー (行 ${index + 2}): ${error}`);
      }

      // NextTimeを更新
      let newDate = date_;
      switch (intervalUnit) {
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + intervalNumber);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() + intervalNumber);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() + intervalNumber * 7);
          break;
        case 'day':
          newDate.setDate(newDate.getDate() + intervalNumber);
          break;
        case 'hour':
          newDate.setHours(newDate.getHours() + intervalNumber);
          break;
        case 'minute':
          newDate.setMinutes(newDate.getMinutes() + intervalNumber);
          break;
      }
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      // シートの該当セルを更新
      remindersSheet.getRange(index + 2, 1).setValue(newDate);
      remindersSheet.getRange(index + 2, 1).setNumberFormat("yyyy/MM/dd HH:mm:ss");
    }
  });
}
