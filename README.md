# Jotform Automations

This repository contains a single [Pipedream](https://pipedream.com/) workflow that downloads a JotForm submission as a PDF and uploads it to a JobDiva candidate profile. The workflow is called **"Upload Resume to candidate (HR-01)"** and lives inside the `upload-resume-to-candidate-hr-01-p_gYCK7me/` directory.

## Repository Layout

```
.
├── README.md                # This file
└── upload-resume-to-candidate-hr-01-p_gYCK7me/
    ├── Email_searchCandidateProfile/
    │   └── entry.js         # Step 3 – find candidate by email in JobDiva
    ├── Jobdiva_APIV1_Token_fetch/
    │   └── entry.js         # Step 4 – obtain JobDiva v1 token
    ├── Jobdiva_APIV2_Token_fetch/
    │   └── entry.js         # Step 2 – obtain JobDiva v2 token
    ├── Jotform_pdf_fetch/
    │   └── entry.js         # Step 1 – fetch JotForm submission PDF
    ├── Upload_PDF/
    │   └── entry.js         # Step 5 – upload PDF to JobDiva
    ├── workflow.yaml        # Pipedream workflow definition
    └── .workflow.state      # Workflow metadata (do not edit)
```

Each subdirectory holds a Node.js script exported using `defineComponent` – the format required by Pipedream. The `workflow.yaml` file defines the trigger and the order of the steps.

## Workflow Overview

1. **Jotform_pdf_fetch** – Fetches the submission PDF from JotForm using `formID` and `submissionID` from the incoming webhook payload. Returns the PDF as both a binary buffer and a base64 string.
2. **Jobdiva_APIV2_Token_fetch** – Authenticates against JobDiva's v2 API to retrieve an access token and refresh token.
3. **Email_searchCandidateProfile** – Parses the raw form submission to find the candidate's email, then searches JobDiva for that candidate's profile.
4. **Jobdiva_APIV1_Token_fetch** – Obtains a JobDiva v1 access token required for the upload endpoint.
5. **Upload_PDF** – Uploads the PDF from step 1 to the candidate profile found in step 3 using the v1 token from step 4.

The workflow is triggered by a webhook (`triggers: - id: hi_q7Hjnkl`) configured within Pipedream.

## Environment Variables

The scripts expect the following environment variables to be defined in your Pipedream account (or wherever you run the workflow):

- `JOTFORM_API_KEY` – API key for fetching PDFs from JotForm.
- `JOBDIVA_CLIENT_ID` – JobDiva client ID used for authentication.
- `JOBDIVA_USERNAME` – Username for JobDiva API access.
- `JOBDIVA_PASSWORD` – Password for JobDiva API access.

Make sure these are set before executing the workflow.

## Running or Modifying the Workflow

1. Import the workflow directory into your Pipedream account or recreate the steps manually using the provided source files.
2. Configure the environment variables listed above in the workflow's settings.
3. Set up the trigger (typically a webhook) to receive JotForm submission data containing `formID`, `submissionID`, and `rawRequest`.
4. Test the workflow by sending a sample webhook payload.

The console logs in each step can help diagnose issues with API calls or payload data.

## Further Learning

- [Pipedream documentation](https://pipedream.com/docs/) – learn how workflows, triggers, and steps are structured.
- [JotForm API docs](https://api.jotform.com/docs/) – details on fetching submission PDFs.
- [JobDiva API documentation](https://www.jobdiva.com/) – endpoints for authentication, candidate search, and attachments.

This repository provides a concise example of automating data transfer between JotForm and JobDiva using Pipedream. You can extend it by adding error handling, notifications, or integrating other systems as needed.
