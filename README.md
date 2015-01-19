# ED - Keep track of Github Milestones

A while ago [Github heavily improved their issue interface](https://github.com/blog/1866-the-new-github-issues). Milestones also got some love, but they still feel clunky. For instance, you can only see the number of open and closed issues, but not the issues people currently work on. If you want that information you have to switch back and forth between the milestone page and the filtered issue list.

Also, we use a milestone's description to reference user stories and write down acceptance criterias for the feature. To get those informations is rather inconvenient. Plus, milestone descriptions aren't paresed with markdown. 

The goal we had with *ED* was to centralize all information about the current sprint. So that management and devs can quickly get an overview of what's to do and what's the current progress. We did *not* want to replace Github by any means. We love what was done with the issue management! But we felt like milestones got the short end of the stick.

// TODO: Finish introduction

At MPS we use Github's Milestone to group and organize our 


- Prefix Everthing! 
 - Milestone/Branches + Issues with numbers
 - Milestone/Branches with type (fix/milestone/hotfix/refactor)

# Build

Make sure you have installed [node](http://nodejs.org/) and [bower](http://bower.io/). Then run `npm install` and `bower install`.

When all packages have been installed run `grunt config` and answer the prompts. You will be asked for a OAuth-Token. If you do not have a token and want one [go here for instructions how to get one](https://help.github.com/articles/creating-an-access-token-for-command-line-use/).

**NOTE**: *ED* pings the GithubAPI a lot (for updates, ...), so even if the OAuth-Token is not required for a public repository you should consider creating one. Github sometimes blocks requests if the API is pinged without a token too often.

After you're finished with the prompt, start *ED* with `grunt`.

# Grunt Tasks

- `grunt`: Build project, start local server and open browser.
- `grunt config`: Start configuration prompts.
- `grunt test`: Run test suite (once) and print out result + coverage report.
- `grunt tdd`: Start test suite and listen for file changes (use when developing).
- `grunt coverage`: Create coverage report in `/coverage`.
- `grunt lint`: Lint everything.

# Dependencies

*ED* is intentionally written without any backend. It should be as lean as possible. But of course we make use of some libraries/frameworks:

- [angular](https://angularjs.org/)
- [angular-progress-arc](https://github.com/mathewbyrne/angular-progress-arc)
- [angular-markdown-directive](https://github.com/btford/angular-markdown-directive) (uses [Showdown for processing Markdown](https://github.com/showdownjs/showdown))
- [momentjs](http://momentjs.com/)
- [layout.scss](https://material.angularjs.org/#/layout/container)
- [Material Design Icons](https://github.com/google/material-design-icons)
- [Font: Raleway](http://www.google.com/fonts/specimen/Raleway)
