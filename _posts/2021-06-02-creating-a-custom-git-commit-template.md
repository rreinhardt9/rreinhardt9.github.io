---
layout: post
title: Creating a Custom Git Commit Template
date: 2021-06-02 21:08 -0400
---

If you write commit messages every day, you might find it helpful to have a
template to help you format your messages. I've found a template helpful for
including the names of co-authors I work with often so that I don't have to look
them up every time and for making sure my commits follow the format expected by
the rest of my team. Setting one up is very easy!

In this quick tip I'll show you how to set a template for an individual
repository as well as globally.

## Local Commit Template

To set a template up locally, first `cd` to your project's directory. Now create
a template file at `.git/.gitmessage.txt`. The name of the template file can be
whatever you want it to be as long as it matches what we set in the
configuration later.

The contents of the template can also be whatever you want it to be! Lines that
begin with a `#` are comments and will not appear in the final commit message.

Here is my current template. I pair often and so I include `Co-authored-by` tags
for the people I commonly pair with. When I pair with one of them, I just
uncomment the line for them (remove the `#`). In GitHub, `Co-authored-by` tags
will make the pictures of collaborators appear on the commit with the main
author, which is pretty cool. On my current team we will include a link to the
story from our project tracking software in the commits, so I include a prompt
for that in my template. I also included a link to a handy blog post as a
reference for writing good commit messages.
```


Story:


# Co-authored-by: Bea <bea@acme.com>
# Co-authored-by: Abby <abby@acme.com>
# Co-authored-by: Juan <juan@acme.com>
# Guide: https://thoughtbot.com/blog/5-useful-tips-for-a-better-commit-message
```

Now, set this file as your commit template for the current repository using:
```
$ git config commit.template .git/.gitmessage.txt
```

The next time you make a commit in that repo, (eg. `git commit`) you will see
your template when Git opens your editor for creating the commit message.

## Global Commit Template

Recently, I've been working on several projects across several repos and I
didn't want to have to set up the same template in each. Thankfully, we can set
up a global template!

This time, we'll put the template file in the home directory `~/.gitmessage.txt`
and then set our global git configuration to look for it:
```
$ git config --global commit.template ~/.gitmessage.txt
```
That's it! Local git configuration supersedes global, so if you want to add
local templates on specific repos you still can and they will be used instead of
the global template.
