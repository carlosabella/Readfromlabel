function read() {
  const label = GmailApp.getUserLabelByName("Blog Drafts");
  const threads = label.getThreads();

  threads.map(thread => {
    const message = thread.getMessages()[0];
    const subject = message.getSubject();
    const body = message.getPlainBody();

    const response = _launchAction(subject, body);

    if (response === 200 || response === 204) {
      thread.removeLabel(label);
    }
  });
}

function _launchAction(subject, body) {
  const secrets = _getSecrets();

  const options = {
    headers: {
      Method: 'POST',
      ContentType: 'application/vnd.github.v3+json',
      Authorization: 'token ' + secrets.key,
    },
    muteHttpExceptions: true,
    payload: JSON.stringify({ "ref": "main", "inputs": { "title": subject, "body": body } })
  };

  return UrlFetchApp.fetch(secrets.url, options);
}

function _getSecrets() {
  const files = DriveApp.getFilesByName('Secrets.json');
  const content = files.next().getBlob().getDataAsString();

  return JSON.parse(content);
}
