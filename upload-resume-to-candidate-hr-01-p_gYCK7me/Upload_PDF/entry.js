import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    const workflowErrors = $.flow.get('workflowErrors') || [];
        // Extract required inputs from previous steps
    const accessToken = steps.Jobdiva_APIV1_Token_fetch.$return_value.accessToken_v1;


    const filecontent = steps.Jotform_pdf_fetch.$return_value.base64;
    const filename = steps.Jotform_pdf_fetch.$return_value.filename;
    const candidateid = steps.Email_searchCandidateProfile.$return_value.candidate.id;

    // Safety checks
    if (!accessToken) throw new Error("Missing access token.");
    if (!filecontent || !filename) throw new Error("Missing file content or filename.");
    if (!candidateid) throw new Error("Missing candidate ID.");

    const payload = {
      candidateid: candidateid,
      name: "Resume Upload",               // Display name (can be customized)
      filename: filename,                  // e.g., "resume.pdf"
      filecontent: filecontent,            // Base64 string
      attachmenttype: 0,                   // 0 = default
      description: "Uploaded via API"
    };

    const url = "https://api.jobdiva.com/api/jobdiva/uploadCandidateAttachment";
console.log("Auth v1 Step:", steps.auth_v1);
console.log("Jotform PDF Step:", steps.Jotform_pdf_fetch);
console.log("Email Search Step:", steps.Email_searchCandidateProfile);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Only if JobDiva expects Bearer tokens
          "Content-Type": "application/json"
        },
        timeout: 15000
      });

      console.log("Upload successful:", response.data);
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data || error.message;
      console.error("Upload failed:", errMsg);
      workflowErrors.push(`Upload_PDF: ${error.message}`);
      $.flow.set('workflowErrors', workflowErrors);
      return { error: error.message };
    }
  }
});
