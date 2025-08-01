export default defineComponent({
  async run({ steps, $ }) {
    $.flow.set('workflowErrors', []);
    return { initialized: true };
  }
});
