/**
 * Google Apps Script for logging D2D orders to Google Sheets
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Add headers to the first row:
 *    Timestamp | Order ID | User ID | Pickup Route | Pickup Stop | 
 *    Dropoff Route | Dropoff Stop | Price | Payment Type | Status | Breakdown
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code
 * 5. Deploy > New deployment > Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Copy the deployment URL
 * 9. Update src/services/appsScript.ts with the URL
 */

function doPost(e) {
  try {
    // Parse the incoming request
    var data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if headers exist, if not, add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Order ID',
        'User ID',
        'Pickup Route',
        'Pickup Stop',
        'Dropoff Route',
        'Dropoff Stop',
        'Price (KES)',
        'Payment Type',
        'Status',
        'Breakdown'
      ]);
      
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#099d15');
      headerRange.setFontColor('#ffffff');
    }
    
    // Append the new order data
    sheet.appendRow([
      data.timestamp,
      data.orderId,
      data.userId,
      data.pickupRoute,
      data.pickupStop,
      data.dropRoute,
      data.dropStop,
      data.price,
      data.paymentType,
      data.status,
      data.fullBreakdown
    ]);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 11);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Order logged successfully',
        orderId: data.orderId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'D2D Order Logging API',
      status: 'active',
      method: 'POST',
      contentType: 'application/json'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}