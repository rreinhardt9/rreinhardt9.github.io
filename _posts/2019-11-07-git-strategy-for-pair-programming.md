---
layout: post
title: Git Strategy For Pair Programming
---

I've recently been doing a lot more pair programming than I have ever done. Most times we will be sharing a branch and will switch drivers by committing some code so the new driver can pull it down and take over. This works great, but it can start to lead to a messy commit history. After much experimentation I really like our current workflow and thought I'd share it! There are things here that apply even if you don't pair program but will still help you tell a clear story for future developers with your git history.

## First, What Does This Look Like With One Person?

A good place to start is with what my git workflow looks like when I'm working by myself. It's important to me that when I'm done working on some code my git history tells future developers a clear and comprehensive story of why I did what I did so that when they `git blame` those lines of code what they find helps them understand why that code is the way it is. Because of that, when I'm done working on something I make sure that work is grouped logically into commits (or just a single commit in most cases) using an interactive rebase.

Let's say I have 3 commits on the branch I'm working on:

```
$ git log --oneline -n3
2b010a4a1f (HEAD -> hard-work) One last tweak
e7bf81daa9 Woops, fix spec
3a26300ae4 Fix the bug that caused X
```

I have an initial bug fix commit that will have a descriptive commit message, but then I have two follow up commits with less than ideal temporary messages. When I am done with work I can do an interactive rebase using the `git rebase -i origin/master`. This will drop me into the default editor I have configured in my shell with something that looks like:

```
pick 3a26300ae4 Fix the bug that caused X
pick e7bf81daa9 Woops, fix spec
pick 2b010a4a1f One last tweak

# Rebase dd071b1302..2b010a4a1f onto dd071b1302 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

There are some helpful instructions in the comment. What I'll choose to do here is "fixup" the two commits I don't want to keep separate which will make them a part of the one that I want to keep. I'll designate the one I'm keeping by leaving it with "pick". Additionally I have the option to reword that main commit if I change that "pick" to a "reword". So now I'll have:

```
pick 3a26300ae4 Fix the bug that caused X
f e7bf81daa9 Woops, fix spec
f 2b010a4a1f One last tweak
```

After doing that, all my work is now in one unified commit with a helpful message for future developers to discover.

```
$ git log -n3
commit 3735ddb5e50316869ec3b96974dd2babee0801f1 (HEAD -> hard-work)
Author: My Name <me@gmail.com>
Date:   Thu Nov 7 09:35:18 2019 -0500

    Fix the bug that caused X

    Story: link to story

    More information on why this change was made

# Other unrelated commits
```

That works, but git has some features that can help us with this workflow to avoid having to name commits that we have to manually fixup later. There are flags you can pass to [git-commit](https://git-scm.com/docs/git-commit) to tell it that you either want to `--fixup` or `--squash` this commit automatically. For those commits I added after the main one, I could have done `git commit --fixup 3735ddb5e50316` where that numbers and letters are the SHA of the main commit. No throw away commit message needed! If I had done this, I would have a git history that looked like:

```
$ git log --oneline -n3
4a5e93e675 (HEAD -> hard-work) fixup! Fix the bug that caused X
95e48fd49a fixup! Fix the bug that caused X
3735ddb5e5 Fix the bug that caused X
```

Awesome, this signals our intention for these commits as fixups. The real magic comes in when we rebase using the autosquash option `git rebase -i --autosquash origin/master`. Now, since we have already signaled that those commits will be fixups, the interactive page we are presented with will already list those commits as fixups!

```
pick 3735ddb5e5 Fix the bug that caused X
fixup 95e48fd49a fixup! Fix the bug that caused X
fixup 4a5e93e675 fixup! Fix the bug that caused X
```

Sometimes, I'll skip the middle step entirely and if I make a change after making my initial commit I'll just use `git commit --amend` to immediately make my changes a part of the original commit. Note that if you are using `--amend` or `rebase` you will need to force push your branch using `git push -f` and if someone is working with you on this branch, they will not be able to just pull the branch down using `git pull` (but more on that next).

That is my basic daily workflow in Git. There are great resources out there with more detail on [autosquashing](https://thoughtbot.com/blog/autosquashing-git-commits), [writing good commit messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html), and [setting up templates for your commit messages](https://thoughtbot.com/blog/better-commit-messages-with-a-gitmessage-template) that I have found helpful toward the end of effectively telling a story with my git history.

## But What About Pairing On The Same Branch?

Whether you are actually pairing or if you are just reviewing someone else branch locally, using `--amend` and `rebase` can change how you need to approach retrieving the latest work from the shared repository. The reason is because those commands "re-write history" in git. If someone else has an old copy of your branch locally, this can cause problems because git now can't figure out what it should do because the two histories are different. Typically, re-writing history is considered a "Bad Thing" for any shared branches because git can no longer figure out accurately where the common histories diverge. Assuming though that we are working on a PR that hasn't been merged into a larger shared branch (like "master") it's our chance to craft the history before it's set in stone by being merged and shared.

When pairing, if we want to switch drivers what options do we have?

Option 1 is to use fixup commits as shown above. Using this option allows us to commit a chunk of work with the intention to clean it up later and we can still `git pull` the branch down until it's rebased. One time this is particularly useful is when you are pairing and someone has to step away. In that case, it can be helpful to put the changes in a fixup commit so that when they come back they can clearly see what has changed. This can also come in handy during an asynchronous code review when you make a change based on some feedback you receive. If you put it in a fixup commit, it's clear to the reviewer both what changes where made and the intention to clean up the commit when the collaboration is finished.

But having a bunch of fixup commits would start to get annoying and make merge conflict resolution more difficult if that was our only tool. Option 2 is to just go straight to using `--amend` on the main commit when it's time to switch drivers. Here is the key though, the new driver won't be able to just pull the branch down using `git pull` because the commit was changed. What we really want to do is just reset what we have locally to be the latest version in the remote repository and we can do just that! Here is what that looks like:

```
# Time to switch drivers.
# Let's assume you already have already made the first commit and we are adding to it.
# On the current drivers machine run:
git ci --amend
# Change the message or don't and save
git push -f

# Now on the new driver's machine on this same branch
git fetch
git reset --hard origin/branch-name-here
```


That's all there is to it! It's key that you make sure to fetch before resetting though to make sure you have the latest they just pushed up. There are a couple of shortcuts you can use here. First, if you don't want to edit the commit message now you can skip that step using `git ci --amend --no-edit`. If the upstream branch is configured for your current branch there is a shortcut there too. Instead of typing out the branch's name you can use `@{u}` (think u for "upstream"). Now we have:

```
# Current driver
git ci --amend --no-edit
git push -f

# New driver
git reset --hard @{u}
```

If you need to set the upstream, you can run `git branch -u origin/my-branch-name`

## Once Upon A Commit

Those are some tricks and tips I've learned while trying to pair and still tell effective stories with my git history. Just remember, be careful when using commands that re-write history. They are great tools when you are working on a branch that is not branched off of by others but be aware that these tools are "sharp knives" and can cause a headache if you use them on a branch others are building off of (like master).

If you are careful to craft your commit messages to tell a clear and comprehensive story, maybe you will be the future developer to be pleasantly surprised by a well written message and cohesive changeset when you `git blame` a mysterious line of code you are working so hard to understand and debug.
