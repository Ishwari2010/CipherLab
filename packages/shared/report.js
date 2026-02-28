const fs = require('fs');
const data = JSON.parse(fs.readFileSync('test_results.json', 'utf8'));
let out = '';
data.testResults.forEach(suite => {
    suite.assertionResults.forEach(res => {
        if (res.status === 'failed') {
            out += `\n[FAIL] ${suite.name} > ${res.title}\n`;
            out += res.failureMessages.join('\n') + '\n';
        }
    });
});
fs.writeFileSync('report.txt', out);
