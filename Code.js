// Configure your Sheet details
const SHEET_ID = "15JcrFgQjIZdC7yR89KHAu8RBn8t9IadvwsSWa66vAhw";
const SHEET_NAME = "Sheet1";

// Get the Sheet ID automatically
function getSheetId() {
  return SpreadsheetApp.getActiveSpreadsheet().getId();
}

// Main function to serve the web app
function doGet(e) {
  const htmlOutput = HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return htmlOutput;
}

// Fetch all events from the Sheet
function getEvents() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const timezone = Session.getScriptTimeZone();

  console.log("Event->", data);

  // Skip header row
  const events = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Convert Date to string using Utilities.formatDate (preserves timezone)
    let dateString = "";
    if (row[2] instanceof Date) {
      dateString = Utilities.formatDate(row[2], timezone, "yyyy-MM-dd");
    }

    // Convert time to 12-hour format with AM/PM
    let timeString = "";
    if (row[3] instanceof Date) {
      timeString = Utilities.formatDate(row[3], timezone, "hh:mm a"); // Changed from "HH:mm" to "hh:mm a"
    } else if (row[3]) {
      timeString = row[3].toString();
    }

    events.push({
      id: row[0] || i,
      name: row[1] || "",
      date: dateString,
      time: timeString,
      location: row[4] || "",
      description: row[5] || "",
      imageUrl: row[6] || "",
      order: row[7] || i,
      // dressCode: row[8] || 'Festive Attire',
      // eventColor: row[9] || '#d4a574',
      hashtag: row[8] || "#RajatKiShaadi",
    });
  }

  events.sort((a, b) => a.order - b.order);
  console.log("reformed event array->", events);

  return events;
}
