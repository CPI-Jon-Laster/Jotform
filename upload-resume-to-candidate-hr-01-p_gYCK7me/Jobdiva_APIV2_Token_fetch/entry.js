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

      const authUrl = `https://api.jobdiva.com/apiv2/v2/authenticate?clientid=${encodeURIComponent(clientId)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

      console.log("Requesting JobDiva token...");
      const response = await axios.get(authUrl, {
        headers: {
          Accept: "*/*"
        },
        timeout: 10000
      });

      const { token, refreshtoken } = response.data;

      if (!token) {
        throw new Error("No token received from JobDiva.");
      }

      console.log("JobDiva token fetched successfully.");
      return {
        accessToken_v2: token,
        refreshToken: refreshtoken
      };
    } catch (error) {
      const errMsg = error.response?.data || error.message;
      console.error("Failed to fetch JobDiva token:", errMsg);
      workflowErrors.push(`Jobdiva_APIV2_Token_fetch: ${error.message}`);
      $.flow.set('workflowErrors', workflowErrors);
      return { error: error.message };
    }
  }
});
