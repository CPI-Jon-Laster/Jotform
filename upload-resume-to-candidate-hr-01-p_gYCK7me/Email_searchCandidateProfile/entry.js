import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    const workflowErrors = $.flow.get('workflowErrors') || [];
    try {
      console.log("Step started: Fetch Candidate ID");

      // Extract and parse raw form input from trigger
      const rawString = steps.trigger.event.body?.rawRequest;
      let raw;
      try {
        raw = JSON.parse(rawString);
        console.log("Parsed raw input:", raw);
      } catch (e) {
        throw new Error("Failed to parse rawRequest JSON: " + e.message);
      }

      const email = raw.q55_employeesEmail;
      console.log("Parsed email:", email);

      const accessToken = steps.Jobdiva_APIV2_Token_fetch.$return_value.accessToken_v2;
      console.log("Access token:", accessToken ? "✅ Present" : "❌ Missing");

      if (!accessToken) throw new Error("Missing JobDiva access token.");

      const url = "https://api.jobdiva.com/apiv2/jobdiva/searchCandidateProfile";

      const requestBody = {
        email
      };

      console.log("Prepared request payload (email-only):", JSON.stringify(requestBody, null, 2));

      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

     console.log("Response status:", response.status);
      console.log("Response body:", JSON.stringify(response.data, null, 2));

      const candidates = response.data;

      if (!Array.isArray(candidates) || candidates.length === 0) {
        console.log("No candidates returned");
        return { candidate: null };
      }

      const candidate = candidates[0];
      console.log("Candidate found:", candidate);

      return { candidate };
    } catch (error) {
      const errData = error?.response?.data;
      console.error("JobDiva API error:", errData || error.message);
      workflowErrors.push(`Email_searchCandidateProfile: ${error.message}`);
      $.flow.set('workflowErrors', workflowErrors);
      return { error: error.message };
    }
  },
});