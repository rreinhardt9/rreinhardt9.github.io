---
layout: post
title:  "Sandi's Rules"
category: "Ruby"
---

Sandi Metz' [POODR](http://www.poodr.com/) is probably my favorite book on object oriented design. I think I'm going to put it on an annual reading cycle because it encapsulates many ideas that I want to keep top of mind in a practical, succinct, and fun manner.

Recently, in a Ruby Rogues [podcast](http://devchat.tv/ruby-rogues/087-rr-book-clubpractical-object-oriented-design-in-ruby-with-sandi-metz) she outlined several rules that she tends to give people who want some rules. Good design is something that I really work towards... but when I heard the rules that she outlined, I realized that I have to set the bar even higher. Without further ado, the rules:

1. Your class can be no longer that 100 lines of code
2. Your methods can be no longer than 5 lines of code (she wanted 4 but figured she had to give 5)
3. You can pass no more than 4 parameters, and you can't just pass in one big hash.
4. In your controller, you can only instantiate one object
5. Your view can only use one instance variable
