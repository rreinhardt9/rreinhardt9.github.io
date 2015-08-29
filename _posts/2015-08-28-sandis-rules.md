---
layout: post
title:  "Sandi's Rules"
date:   2015-08-28 20:34:00
category: ["Ruby", "Sandi Metz"]
---

Sandi Metz' [POODR](http://www.poodr.com/) is probably my favorite book on object oriented design; it encapsulates so many ideas that I want to keep top of mind in a practical, succinct, and fun manner.

Recently, in a Ruby Rogues [podcast](http://devchat.tv/ruby-rogues/087-rr-book-clubpractical-object-oriented-design-in-ruby-with-sandi-metz) she outlined several rules that she tends to give people who want some rules. Good design is something that I strive for... but when I heard the rules that she outlined, I realized that my personal bar just got raised. Without further ado, the rules:

1. Your class can be no longer that 100 lines of code
2. Your methods can be no longer than 5 lines of code (she wanted 4 but figured she had to give 5 :-) )
3. You can pass no more than 4 parameters, and you can't just pass in one big hash.
4. In your controller, you can only instantiate one object in an action
5. Your view can only use one instance variable

Breaking the rules is allowed, but only if you can convince your "pair"/ person reviewing your code of you reasons for doing so and they agree with you.

Time to rise to the challenge! It seems like these rules will provide a good "canary in the coal mine" when it comes to poor design. I feel like I'll be looking at my code using a different lens, and I'm excited to see where it takes me.
