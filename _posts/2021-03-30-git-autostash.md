---
layout: post
title: Git Autostash
category:
- ruby
- TIL
date: 2021-03-30 22:47 -0400
---
# Today I Learned: git rebase --autostash

Rebasing is something I do often in Git. The most common time is when I'm updating my branch with the latest "main" branch; I'll typically use a rebase strategy on pull to avoid creating extra merge commits and to help keep a clean history. Often I'll have uncommitted changes in my worktree that need to be stashed before I can do a rebase so I do something like:

```
$ git stash
$ git pull --rebase . origin/main
$ git stash pop
```

Well today, I was looking in the help documentation for rebase (`git rebase -h`) and stumbled on the `--autostash` flag. According to [the docs](https://git-scm.com/docs/git-pull#Documentation/git-pull.txt---autostash) it will:

> Automatically create a temporary stash entry before the operation begins, and apply it after the operation ends.

Nice! This is a nice shortcut for exactly what I was doing above! I can now do the same thing using:

```
$ git pull -r --autostash . origin/main
```

It's also possible to set this up as a default mode for every rebase if you should desire in your git config using the [`merge.autoStash` variable](https://git-scm.com/docs/git-config#Documentation/git-config.txt-mergeautoStash):

```
$ git config merge.autoStash true
```
