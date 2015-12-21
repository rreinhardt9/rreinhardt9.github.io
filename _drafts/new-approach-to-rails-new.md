---
layout: post
title:  "New Approach to rails new"
date:   2015-12-19 12:00:00
category: ["Ruby", "Rails"]
---

The way that I learned (and have always seen it taught) to start a new rails project was the old familiar:

```bash
$ gem install rails
$ rails new worldchangingapplication
$ cd ../worldchangingapplication
```

but now, my world has been turned upside-down after some good discussions with @moorecp that challenged me to rethink how I manage gems and start rails projects in a world with bundler.

First off, rethinking were I stash all those shiny ruby gems. My typical approach had been to create a new gemset for each project using RVM and then switch gemsets when switching projects, which is a familiar workflow to many I'm sure. But here is a mind bending thought; why not keep the project's dependencies… with the project in the vendor/bundle directory! We can add vendor/bundle to our .gitignore so that we don't clutter up our repo with the gems (although you can use bundler to add a vendor/cache if you wish). Here's some of the benefits I've been realizing with this approach:

First, we I need to remove a project I just delete the project's directory and all of it's gems are sent packing at the same time. Before, I would have to remember separately to go and delete the project's gemset.

When debugging it's nice to have the gems the project is using right there in vendor/bundle so that I can jump into their source code and get to the bottom of things. Obviously you can still look at a gem's source code when they are installed in a gemset or wherever... it just takes a few extra steps to find the gem you are looking for and is no where near as convenient.

Now that I'm using the power of Bundle and keeping my gems in my project's directory, I can use a simple solution for switching rubies like rbenv (or just keep using rvm... but just for switching rubies)

This new approach to dependencies alone was a big win for me; the hardest part was breaking the news to my trusty gemsets (We've had many good years together and accomplished much, but I feel we've grown apart...). But wait, back to starting a new rails project. Now that gemsets and I have parted, the first step where I `gem install rails` is going to clutter up my ruby with the rails gem... and I would rather keep it with all my other gems for the project in vendor/bundle. Enter the new rails new:

```bash
$ mkdir worldchangingapplication
$ cd worldchangingapplication
$ bundle init
# Edit Gemfile and uncomment rails
$ bundle --path vendor/bundle
$ rails new .
# Just select Y to override Gemfile when prompted
# Add 'vendor/bundle' to .gitconfig
```

Ok, I'll admit it's not as flashy and short as the standard example. Even though it's a bit more verbose, this approach is putting us in bundler's driver seat. We create our own directory ahead of time and initialize bundler. This just creates a empty Gemfile for us with rails already added and commented out. Open the new Gemfile and make sure that rails is added as the only gem. Now comes the beautiful part; we'll run bundler with the --path flag set to vendor/bundle to tell bundler that we want to install the gems for our bundle there. Bundle will add this setting to the project's .bundle/config so that in the future, we don't have to add the path flag and it will still know to install in vendor/bundle. Finally, we use rails new... but we just specify the path as the current directory ("."). It will ask if you want to override the Gemfile you just created, and you'll want to say yes.

Now your off and running with a new project using bundler, and all your gems are being kept within the project's directory. Leaving the project? Delete the directory and all the gems go too. Working on multiple projects? Jump between them with ease and don't worry about gems from one project interfering with another. Need to jump into a gem to see how it works? It's right at your finger tips... almost like it's a part of your own code... which I guess it sort of is in a way.

I've been trying this new approach to rails new with several new rails projects recently, and have been loving it.