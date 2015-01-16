# ED - Keep track of Github Milestones

A while ago [Github heavily improved their issue interface](https://github.com/blog/1866-the-new-github-issues). Milestones also got some love, but they still feel clunky. For instance, you can only see the number of open and closed issues, but not the issues people currently work on. If you want to be informed about the daily progress it's important to know this. 

// TODO: Finish introduction

At MPS we use Github's Milestone to group and organize our 


- Prefix Everthing! 
 - Milestone/Branches + Issues with numbers
 - Milestone/Branches with type (fix/milestone/hotfix/refactor)

# Build

Make sure you have installed [node](http://nodejs.org/) and [bower](http://bower.io/). Then run `npm install` and `bower install`.

When all packages have been installed run `grunt config` and answer the prompts. You will be asked for a OAuth-Token. If you do not have a token and want one [go here for instructions how to get one](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).

**NOTE**: *ED* pings the GithubAPI a lot (for updates, ...), so even if the OAuth-Token is not required for a public repository you should consider creating one. Github sometimes blocks requests if the API is pinged without a token to often.

After you're finished with the prompt, start *ED* with `grunt`.

# Grunt Tasks

- `grunt`: Build project, start local server and open browser.
- `grunt config`: Start configuration prompts.
- `grunt test`: Run test suite (once) and print out result + coverage report.
- `grunt tdd`: Start test suite and listen for file changes (use when developing).
- `grunt coverage`: Create coverage report in `/coverage`.
- `grunt lint`: Lint everything.
