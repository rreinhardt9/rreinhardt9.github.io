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
4. In your controller, you can only instantiate one object in an action
5. Your view can only use one instance variable

Breaking the rules is allowed, but only if you can convince your "pair"/ person reviewing your code of you reasons for doing so and they agree with you.

The first isn't so bad, but number two.... wow. I thought it was rough keeping below rubocop's threshold which I think was about 10. But imagine if you stuck to this! Goodbye mongo pandora's box methods chock full of crazy conditional stuff going on. You can't even fit an if/else in there if you wanted. Imagine how much more read-able the resulting code would be with a collection of small, well named methods.

Number three makes sense. Four and five seemed crazy restrictive to me until I thought about the hoops I have to jump through to make things work when I start juggling multiple objects in controllers and instance variables in views. Before long, it's nearly impossible to wade through all that out of place logic.

Time to brush off the copy off POODR and rise to the challenge! It seems like these rules will provide a good "canary in the coal mine" when it comes to poor design in my code. I feel like I'll be looking at my code using a different lens, and I'm excited to see where it takes me.
