/**
 * Google Apps Script web-app backend for application submissions.
 *
 * This script is bound to the founder-owned application spreadsheet. Update the
 * existing versioned web-app deployment after changing this file so the /exec
 * URL remains stable.
 */
function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Silently discard honeypot submissions.
    if (data.website_url_confirm && data.website_url_confirm !== "") {
      return jsonResponse({
        result: "spam_blocked"
      });
    }

    sheet.appendRow([
      new Date(),
      data.full_name || "",
      data.email || "",
      data.city || "",
      data.role_linkedin || "",
      data.prompt_reason || "",
      data.timeline || ""
    ]);

    // Ensure the application is committed before reporting success.
    SpreadsheetApp.flush();

    var safeName = String(data.full_name || "New applicant")
      .replace(/[\r\n]+/g, " ")
      .substring(0, 80);

    var notificationSent = true;

    try {
      var message = {
        to: "apply@gentlemansprotocol.com",
        subject: "New application: " + safeName,
        name: "The Gentleman's Protocol",
        body: [
          "A new coaching application was received.",
          "",
          "Name: " + (data.full_name || ""),
          "Email: " + (data.email || ""),
          "City: " + (data.city || ""),
          "Timeline: " + (data.timeline || ""),
          "",
          "Review the complete application in the shared Google Sheet:",
          spreadsheet.getUrl()
        ].join("\n")
      };

      // Make replying to the notification address the applicant when valid.
      if (
        typeof data.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
      ) {
        message.replyTo = data.email;
      }

      MailApp.sendEmail(message);
    } catch (mailError) {
      // The application is already stored, so don't tell the applicant it failed.
      notificationSent = false;
      console.error("Notification email failed: " + mailError.toString());
    }

    return jsonResponse({
      result: "success",
      notification: notificationSent ? "sent" : "failed"
    });
  } catch (error) {
    console.error("Application processing failed: " + error.toString());

    return jsonResponse({
      result: "error",
      error: error.toString()
    });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor to authorize MailApp and test delivery.
function testNotificationEmail() {
  MailApp.sendEmail({
    to: "apply@gentlemansprotocol.com",
    subject: "Application notification test",
    name: "The Gentleman's Protocol",
    body: "Google Apps Script email notifications are configured correctly."
  });
}
