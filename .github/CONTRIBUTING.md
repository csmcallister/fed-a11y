# Contributing

We'd love your help! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing/add new features

## What to Contribute?!

Although our backlog can be found on our [Issues Page](https://github.com/csmcallister/fed-a11y/issues), we're happy to review/discuss your proposed contributions if you open an issue.

## How to Contribute

We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), so all code changes happen through pull requests. If you're not a core contributor, you'll use a **Fork and Pull Model**.

### The Fork and Pull Model

#### Short Version

Before you start to work on something, fork this repo, clone the repository, and then make a new branch for your feature.

As you implement changes, commit them to your local branch. When you're ready, push that branch to GitHub and then make a pull request. Then await review and, if necessary, push some more changes.

#### Long Version

##### Writing your Code

1. Fork the repository

Go to the project's [homepage](https://github.com/csmcallister/fed-a11y) and hit the `Fork` button. This creates a copy of the repository in your GitHub account.

2. `git clone` your forked repository

Now you want to clone the forked repo to your machine.

```bash
git clone https://github.com/csmcallister/fed-a11y.git fed-a11y-yourname
cd fed-a11y-yourname
git remote add upstream https://github.com/csmcallister/fed-a11y
```

This creates the directory *fed-a11y-yourname* and connects your repository to the upstream (i.e. this) repository.

3. `git checkout` a branch for your feature before writing any code

You want your master branch to reflect only production-ready code, so create a feature branch for making your changes. To make the branch:

```bash
git checkout -b shiny-new-feature
```

This changes your working directory to the shiny-new-feature branch. Keep any changes in this branch specific to one bug/feature so it is clear what the branch brings to the project.

Before creating this branch, make sure your master branch is up to date with the latest upstream master version. To update your local master branch, you can do:

```bash
git checkout master
git pull upstream master --ff-only
```

4. Do some work, see the changes, and stage files you've edited

Once you’ve made changes, you can see them by typing:

```bash
git status
```

If you have created a new file, it is not being tracked by git. Add it by typing:

```bash
git add path/to/file-to-be-added.py
```

Doing ‘git status’ again should give something like:

```bash
# On branch shiny-new-feature
#
#       modified:   /relative/path/to/file-you-added.py
#
```

5. `git commit` your changes to your local branch

Once you've added files, you're ready to commit your changes to your local repository with an explanatory message. Use the `-m` flag if you don't want to include a full commit body.

```bash
git commit -m "ENH: add foo to bar for fizz (#123)"
```

>Note how the commit message includes an informative prefix as well as the relevant issue number.

6. When you want your changes to appear publicly on your GitHub page, push your forked feature-branch’s commits

```bash
git push origin shiny-new-feature
```

Above, *origin* is the default name given to your remote repository on GitHub. This will create a shiny-new-feature branch in your origin repository, ie. your repository on GitHub.

You can see the remote repositories:

```bash
git remote -v
```

If you added the upstream repository as described above you will see something like:

```bash
origin  git@github.com:yourname/fed-a11y-yourname.git (fetch)
origin  git@github.com:yourname/fed-a11y-yourname.git (push)
upstream        git://github.com/fed-a11y-yourname.git (fetch)
upstream        git://github.com/fed-a11y-yourname.git (push)
```

Once you've pushed your code, your code is on your GitHub repo and is not yet a part of the main project. For that to happen, a **Pull Request (PR)** needs to be submitted on GitHub. But first, you should test your code!

#### Testing your Code

Before you initiate a pull request, you should run the tests locally and, if applicable, add tests to cover your new code.

Right now, we don't have any tests, so you're good to go!

#### Lint your Code

We try to follow subset of the [PEP8](https://www.python.org/dev/peps/pep-0008/) standard by using [Flake8](http://flake8.pycqa.org/en/latest/) to ensure a consistent code format throughout the project.

Although Continuous Integration will run Flake8 and report any stylistic errors in your code, it is helpful before submitting code to run the check yourself:

```bash
flake8 <your-file>.py
```

The output will tell you the line and column numbers where there are stylistic errors. It'll also tell you the related PEP8 standard.

>Optionally, you may wish to setup [pre-commit](https://pre-commit.com/) hooks to automatically run flake8 when you make a git commit.

#### Reviewing your Code and Submitting a Pull Request

So you've written some code, added your tests, and passed your tests locally. Now you'r ready to ask for a code review! Let's initiate a Pull Request.

A pull request is how code from a local repository becomes available to the GitHub community and can be looked at and eventually merged into the master version. 

To submit a pull request:

1. Navigate to your repository on GitHub
2. Click on the Pull Request button
3. You can then click on Commits and Files Changed to make sure everything looks okay one last time
4. Write a description of your changes in the Preview Discussion tab
5. Click Send Pull Request

This request then goes to the repository maintainers - that's us - and then we'll review the code.

#### Updating a Pull Request

Sometimes, you'll need to update your pull request.

If there's a gray bar saying "This pull request cannot be automatically merged.", then you've definitely got some updates to make. That's because the file(s) that your pull request modifies was/were updated in the meantime. To avoid a conflict on the remote, GitHub won't let you automatically merge into master. This means you need to update your Pull Request by merging the upstream's master branch into your feature branch. In short, you need to “merge upstream master” in your branch:

```bash
git checkout shiny-new-feature
git fetch origin
git merge origin/master
```

If there are no conflicts (or if they could be fixed automatically), a file with a default commit message will open, and you can simply save and quit this file.

If there are merge conflicts, you'll need to solve those conflicts. See [this](https://help.github.com/articles/resolving-a-merge-conflict-using-the-command-line/) for an explanation on how to do this. Once the conflicts are fixed and merged and the files where the conflicts were solved are added, you can run `git commit` to save those fixes.

>If you have uncommitted changes at the moment you want to update the branch with master, you will need to stash them prior to updating (see the [stash docs](https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning)). This will store your local changes in case you want to reapply them later.

After your feature branch has been updated locally, you can now update your pull request by pushing to the branch on GitHub:

```bash
git push origin shiny-new-feature
```

#### Deleting your Branch (optional)

Once your pull request is accepted, you’ll probably want to get rid of the feature branch. You can do that to the remote master right within the pull request page. To delete the branch locally, you need to first pull the remote master down into your local master. Then git will know it's safe to delete your branch.

```bash
git checkout master
git fetch origin
git merge origin
```

Now that your local master is even with the remote, you can do:

```bash
git branch -d shiny-new-feature
```

> Make sure you use a lower-case -d, or else git won’t warn you if your feature branch has not actually been merged.

## Reporting bugs or making feature requests

We use GitHub issues to track bugs and make feature requests. [Open a new issue](https://github.com/csmcallister/fed-a11y/issues) if you've got an idea. An issue template will autopopulate. Feel free to use only those sections of the issue template that you think are relevant. Or start from scratch.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## License

[here](https://github.com/csmcallister/fed-a11y/blob/master/.github/LICENSE)
