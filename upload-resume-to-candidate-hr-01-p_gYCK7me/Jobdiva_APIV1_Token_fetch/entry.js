import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    const workflowErrors = $.flow.get('workflowErrors') || [];
    try {
      const clientId = process.env.JOBDIVA_CLIENT_ID;
      const username = process.env.JOBDIVA_USERNAME;
      const password = process.env.JOBDIVA_PASSWORD;

      if (!clientId || !username || !password) {
        throw new Error("Missing one or more required JobDiva environment variables.");
      }

      const authUrl = `https://api.jobdiva.com/api/authenticate?clientid=${encodeURIComponent(clientId)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

      console.log("Requesting JobDiva v1 token...");
      const response = await axios.get(authUrl, {
        headers: {
          Accept: "*/*"
        },
        timeout: 10000
      });

      console.log("Raw response data:", response.data);

      // Assuming the token is returned as a plain string (adjust if needed)
      return {
        accessToken_v1: response.data
      };
    } catch (error) {
      const errMsg = error.response?.data || error.message;
      console.error("Failed to fetch JobDiva v1 token:", errMsg);
      workflowErrors.push(`Jobdiva_APIV1_Token_fetch: ${error.message}`);
      $.flow.set('workflowErrors', workflowErrors);
      return { error: error.message };
    }
  }
});
