function _makeTemplateName(nodeName: string, nodePrefix?: string): string {
  if (!nodePrefix) {
    return nodeName;
  }

  return `${nodePrefix}-${nodeName}`;
}

export function jsTemplate(content: string): string {
  return `
    <script type="text/javascript">
      ${content}
    </script>
  `;
}

export function htmlTemplate(
  nodeName: string,
  nodePrefix: string,
  content: string,
): string {
  let templateName = _makeTemplateName(nodeName, nodePrefix);

  return `
    <script type="text/x-red" data-template-name="${templateName}">
      ${content}
    </script>
  `;
}
