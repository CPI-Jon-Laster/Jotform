export default defineComponent({
  async run({ steps, $ }) {
    const workflowErrors = $.flow.get('workflowErrors') || [];
    let message;
    if (workflowErrors.length === 0) {
      message = 'HR\u201101 document uploaded successfully with no errors.';
    } else {
      message = 'Errors occurred:\n- ' + workflowErrors.join('\n- ');
    }
    return { message };
  }
});
