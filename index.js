const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

(async() => {
    try {
	const url = github.context.payload['pull_request']['_links']['self']['href'];
	//const url = 'https://api.github.com/repos/liewegas/doorpi/pulls/1';
	
	const r = await axios.get(url);
	const lines = r.data.body.split('\n');
	for (var i = 0; i < lines.length; ++i) {
	    lines[i] = lines[i].replace(/(\r\n|\n|\r)/gm, "");
	}
	
	let errors = [];
	for (var i = 0; i < lines.length; ++i) {
	    //console.log(`line ${i} is "${lines[i]}"`);
	    if (lines[i] == 'Checklist'
		&& i < lines.length - 2
		&& lines[i+1][0] == '=') {
		i += 2;
		while (lines[i][0] == '-') {
		    const section = lines[i].substring(2).split(' (')[0];
		    ++i;
		    if (i >= lines.length) break;
		    let checked = false;
		    while (lines[i].substring(0, 5) == '  - [' &&
			   lines[i][6] == ']') {
			if (lines[i][5] == 'x') {
			    checked = true;
			}
			++i;
			if (i >= lines.length) break;
		    }
		    console.log(`section ${section} ... checked = ${checked}`);
		    if (!checked) {
			errors.push(`Must check an item from ${section}`);
		    }
		}
	    }
	}

	if (errors.length) {
	    for (const err of errors) {
		core.error(err);
	    }
	    core.setFailed(`${errors.length} sections incomplete`);
	}
    } catch (error) {
	console.log(`Error: ${error.message}`);
	core.setFailed(error.message);
    }
})();
