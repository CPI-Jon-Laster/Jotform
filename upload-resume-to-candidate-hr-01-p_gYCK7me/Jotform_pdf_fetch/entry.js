import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    const workflowErrors = $.flow.get('workflowErrors') || [];
    try {
      // Step 1: Extract dynamic IDs from webhook event
      const formID = steps.trigger.event.body.formID || steps.trigger.event.form_id;
      const submissionID = steps.trigger.event.body.submissionID || steps.trigger.event.submission_id;

      if (!formID || !submissionID) {
        throw new Error("Missing formID or submissionID in the webhook payload.");
      }

      // Step 2: Construct the JotForm PDF URL
      const pdfUrl = `https://www.jotform.com/server.php?action=getSubmissionPDF&sid=${submissionID}&formID=${formID}`;

      // Step 3: Retrieve and sanitize API key
      const apiKey = process.env.JOTFORM_API_KEY?.trim();
      if (!apiKey) {
        throw new Error("Missing JotForm API key");
      }

      // Step 4: Request the PDF from JotForm API
      const response = await axios.get(pdfUrl, {
        headers: {
          APIKEY: apiKey
        },
        responseType: 'arraybuffer'
      });

      // Step 5: Convert binary buffer to base64
      const base64 = Buffer.from(response.data).toString("base64");

      // Step 6: Return the buffer, base64, and metadata
      return {
        filename: `submission-${submissionID}.pdf`,
        pdfBuffer: response.data, // raw binary
        base64,                   // encoded string for JobDiva
        formID,
        submissionID
      };
    } catch (error) {
      workflowErrors.push(`Jotform_pdf_fetch: ${error.message}`);
      $.flow.set('workflowErrors', workflowErrors);
      console.error('Jotform_pdf_fetch error:', error.message);
      return { error: error.message };
    }
  }
});
