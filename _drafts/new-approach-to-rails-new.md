---
layout: post
title:  "New Approach to rails new"
date:   2015-12-19 12:00:00
category: ["Ruby", "Rails"]
---

Sometimes we are presented with exciting new ways to approach a familiar task, and that happened for me recently regarding how I approach a new rails (or other web framework project).

The way that I learned (and have always seen it taught) to start a new rails project was the old familiar:

```bash
$ gem install rails
$ rails new worldchangingapplication
$ cd ../worldchangingapplication
```

This has served us well over the years; particularly in a world without bundler where you would probably be managing rvm gemsets to keep your gems from stepping on each other.
