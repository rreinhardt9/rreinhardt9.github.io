---
layout: post
title: The Return of the Eigenclass
category:
- ruby
date: 2020-06-22 11:33 -0400
---
So many times once I've learned how to do something, I'll find myself doing it but maybe not fully understanding what I'm doing. Ruby class method definitions are one of these things for me; I do it all the time but it wasn't until recently that a light bulb went of and I reached a deeper understanding of what I was REALLY doing. Here is that journey, which started with looking for a way to stub methods in ruby tests.

## Taking a Shortcut

While writing some tests in Minitest, I was looking for a way to stub methods on an instance of an object either because the method has side effects I want to avoid in my test or because I want to control the environment of the object under test. Let's say we have two classes, `Runner` and `Race`. We want to test `Race`, but don't want all the runners to have to run the full marathon for this test. The implementation could look like:

```ruby
class Runner
  def initialize(name)
    @name = name
  end

  def run_marathon
    puts "#{@name} is running a long way"
  end
end

class Race
  def initialize(runners)
    @runners = Array(runners)
  end

  def start
    @runners.each(&:run_marathon)
  end
end

runner_m = Runner.new("Martin")
runner_l = Runner.new("Lila")

Race.new([runner_m, runner_l]).start
```
Running this file gives you:
```bash
$ ruby ./runners.rb
Martin is running a long way
Lila is running a long way
```

Both runners are running the full race. You can "stub" a method on a ruby object by redefining it on the instance of the object. We'll use this method to make Martin take a shortcut.

```ruby
class Runner
  # Runner hasn't changed...
end

class Race
  # Race hasn't changed...
end

runner_m = Runner.new("Martin")
runner_l = Runner.new("Lila")

# Make Martin take a shortcut
def runner_m.run_marathon
  puts "#{@name} is taking a shortcut"
end

Race.new([runner_m, runner_l]).start
```

Running the file now shows Martin taking a shortcut

```bash
$ ruby ./runners.rb
Martin is taking a shortcut
Lila is running a long way
```

## Bringing the Class

This is pretty cool! We are using plain old ruby techniques to stub `#run_marathon` for Martin so that he doesn't have to run the full marathon! This is now my go-to stubbing method when writing tests in Minitest or TestUnit. But I recognized that `def object.method` syntax from somewhere, hmm. Oh yeah! Defining a class method like `def self.method`. This is something we all do every day! Let's improve the API of our runner object to add a `::named` class method we can use to initialize a new runner instead of calling `::new` directly.

```ruby
class Runner
  def self.named(name)
    new(name)
  end

  # The rest of Runner...
end

class Race
  # Race hasn't changed...
end

runner_m = Runner.named("Martin")
runner_l = Runner.named("Lila")

Race.new([runner_m, runner_l]).start
```
Running this we get
```bash
$ ruby ./runners.rb
Martin is running a long way
Lila is running a long way
```
Great! Everything in Ruby is an object; here `Runner` is an instance of `Class`. We can use the same notation that we used to redefine a method on an instance of `Runner` to redefine a class method on `Runner` because it is itself an instance of the `Class` object.
```ruby
class Runner
  # No change...
end

class Race
  # No change...
end

def Runner.named(name)
  new(name + " (participant)")
end

runner_m = Runner.named("Martin")
runner_l = Runner.named("Lila")

Race.new([runner_m, runner_l]).start
```
```bash
$ ruby ./runners.rb
Martin (participant) is running a long way
Lila (participant) is running a long way
```

We've redefined the class method to have "(participant)" after each of the names. What we did here was open up the "singleton" object `Runner` and change the `named` method. A singleton is a "pattern that restricts the instantiation of a class to one "single" instance" ([wikipedia](https://en.wikipedia.org/wiki/Singleton_pattern)); so there is and will only ever be one instance of `Class` representing `Runner`. When we first load our ruby program a single instance of `Class` is created for `Runner` and is accessed via the `Runner` constant. These single instances are also called "metaclass" or "eigenclass" (eigen - "own" or "individual") which are also pretty cool sounding. I might actually watch something called "The Return of the Eigenclass" (would the return just be self? lol).

Here, saying `def Runner.named` looks pretty weird. But when used inside a class it looks very familiar to many Rubyists. The way we initially defined `::named` is doing this very thing using `self` (and `self` just represents the singleton `Runner`)
```ruby
class Runner
  def self.named(name)
    new(name)
  end

  # The rest...
end
```

It turns out, this is common enough that Ruby [provides a notation for this](https://ruby-doc.org/core-2.7.1/doc/syntax/modules_and_classes_rdoc.html#label-Singleton+Classes). Instead of using `def Runner.named` we can use `class << object`. That's `class <<` followed by the singleton object.
```ruby
class << Runner
  def named(name)
    new(name + " (participant)")
  end
end
```

This leads us to the final step in the journey; understanding the `class << self` syntax. I have often seen and understood it as an alternative to writing `def self.method`, but I never really felt comfortable with it.

When we use the `class << object` notation inside of the runner class we can use `self` and so it becomes

```ruby
class Runner
  class << self
    def named(name)
      new(name + " (participant)")
    end
  end

  def initialize(name)
    @name = name
  end

  def run_marathon
    puts "#{@name} is running a long way"
  end
end
```

So now it's clear; what we are doing here is just opening up a singleton representing the `Runner` object so that we can add methods to it using that special Ruby syntax for doing so and just like we did with our more literal `def Runner.named` example. Since we are actually inside the `Runner` object, we can use `self` to access the singleton. Although the syntax is a little more intimidating at first, it's not as scary once you understand what it's representing.

## The Journey's End

This is what clicked for me! Just like redefining a method on an instance of `Runner` (like we did to make Martin take a shortcut), we are "opening up" the singleton representing `Runner` to define additional methods (class methods; or methods on the `Runner` singleton).

After discovering this and feeling more familiar, I've actually started to prefer it. For one, you don't have to type `self.` as a prefix for each of the class method names. It also keeps the class methods nicely grouped together. Where it really shines for me is when I want to define private class methods.

```ruby
class Runner
  class << self
    def named(name)
      new(name + suffix)
    end

    private

    def suffix
      " (participant)"
    end
  end

  def initialize(name)
    @name = name
  end

  def run_marathon
    puts "#{@name} is running a long way"
  end
end
```

We can use the private keyword just like we would in any other Ruby class! This came in handy when I had some complex Rails "scopes" I was defining (they are defined as class methods) and I wanted to break some of the logic out into their own methods for understandabilty (but keep them private, so that they weren't exposed to the public API).

We now have a great way to stub methods using plain old Ruby, a better understanding of the `class << object` notation used for accessing the singleton class of an object instead of using `def self.method`, and another great tool in our Ruby toolbox that we can use whenever we need to redefine a method on any instance of an object.
