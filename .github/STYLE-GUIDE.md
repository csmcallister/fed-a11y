# Table of contents

1. [Branches](#branches)
2. [Commits](#commits)
3. [Merging](#merging)
4. [Rebasing](#rebasing)
5. [Code](#code)

## Branches

* Choose *short* and *descriptive* names:

  ```shell
  # good
  $ git checkout -b new-event-source

  # bad - too vague
  $ git checkout -b update-event
  ```

* Use *hyphens* to separate words.

* Delete your branch from the upstream repository after it's merged, unless
  there is a specific reason not to.

  Tip: Use the following command while being on "master", to list merged
  branches:

  ```shell
  $ git branch --merged | grep -v "\*"
  ```

### Commits

In projects with lots of collaborators, it's helpful if commit messages are structured similarly.

We suggest:

 - an appropriately prefixed (see below) subject line with < 80 chars and the relevant issues(s) referenced
   - you can reference an issue using `GH1234` or `#1234`. Either style is fine.
 - one blank line.
 - optionally, a commit message body.

For the subject line, we'd prefer it if you prefixed the line with one of these acronyms:

 - ENH: Enhancement, new functionality
 - BUG: Bug fix
 - DOC: Additions/updates to documentation
 - TST: Additions/updates to tests
 - BLD: Updates to the build process/scripts
 - PERF: Performance improvement
 - CLN: Code cleanup
 - FIX: Fixng small things like typos (similar to CLN)
 - CON: Changing content within HTML

Here's an example with just a subject line:

```bash
git commit -m "TST: add schema test for foo (#1)"
```

## Merging

You rebase and merge when you want to integrate changes from one branch into another branch. The difference
between these two operations is that `git rebase` is destructive whereas `git merge` is not. There's
a great tutorial on these two operations [here](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).

A common `git merge` use-case is when you want to integrate into your branch changes that have happened to master.

To do this, you need to “merge upstream master” in your branch:

```bash
git checkout shiny-new-feature
git fetch upstream
git merge upstream/master
```

## Rebasing

You might need to `git rebase` when you've made a pull request, received a review sometime later, and then had the PR approved. In this case, you might have a "stale" PR - changes could have happened to `master` that aren't reflected in your approved branch. This [tutorial](https://github.com/edx/edx-platform/wiki/How-to-Rebase-a-Pull-Request) walks you through rebasing.

## Code

We try to follow subset of the [PEP8](https://www.python.org/dev/peps/pep-0008/) Python standards by using [Flake8](http://flake8.pycqa.org/en/latest/) to ensure a consistent code format throughout the project.

Although Continuous Integration will run Flake8 and report any stylistic errors in your code, it is helpful before submitting code to run the check yourself:

```bash
flake8 <your-file>.py
```

The output will tell you the line and column numbers where there are stylistic errors. It'll also tell you the related PEP8 standard.

Optionally, you may wish to setup [pre-commit hooks](https://pre-commit.com/) to automatically run `flake8` when you make a git commit.
