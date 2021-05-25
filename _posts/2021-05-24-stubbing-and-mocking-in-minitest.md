---
layout: post
title: Stubbing and Mocking in MiniTest
category:
- ruby
- testing
date: 2021-05-24 23:16 -0400
---
When I started using MiniTest one of the things I struggled with was how to mock
and stub objects when constructing my tests. Here are a few patterns I've
collected over time and now find helpful when stubbing and mocking in MiniTest.

## Basic MiniTest Stub

MiniTest comes with a way to stub a value for a test. Here is a classic example
stubbing time:

```ruby
Time.stub :now, Time.new(2012, 11, 14).utc do
  MyObject.new.are_we_there_yet?
end
```

In this example, the `:now` method on the `Time` object is stubbed so that it
always returns the same time while testing `MyObject`.

`#stub` takes a few arguments, the first is the method you wish to stub and the
second is the value it should return when it's called. This second value can
also be an object that responds to `#call` and if it does the return value is
the result of calling the object. Which leads us to a second pattern.

## Turn Your Stub Into a Spy

Since we can supply an object that responds to call for our stub, let's turn our
stub into a "spy". Spies not only return a canned answer but are concerned with
_how_ they are called. To do this, we can use a Ruby lambda. Inside of our
lambda we'll make some assertions about the arguments the stubbed method is
called with.

```ruby
test "Disabling Alerts" do
  command = AlertsPause.new(user)
  response = nil

  args_checker = lambda do |args|
    assert_equal "1234qwfp", args[:user_id]
    assert_equal "team1234", args[:group_id]
  end

  Connection.stub :disable_notifications, args_checker do
    response = command.response
  end

  assert_match(/paused alerts/, response[:text])
end
```
In this example we are using a lambda to ensure that `disable_notifications`
gets called with the expected arguments. When the `disable_notifications` method
is called on `Connection`, `args_checker` will be called with the arguments
passed to that method. Inside the lambda we use assertions to "spy" on the
caller of this method and make sure it passes us the arguments we are expecting.

One other thing to note here, if you are using this approach and want to make
assertions on the result of something called within the `stub` block, you have
to declare the local variable before the block for it to be available in the
scope outside of the block. In this example `response` is used in this way; it
is declared and set to `nil` at the beginning of the spec, assigned in the
block, and the used in an assertion at the end.

## MiniTest::Mock
MiniTest::Mocks are object doubles you can use as a stand-in for some other
object. Their use is really simple:

```ruby
status = MiniTest::Mock.new
status.expect :fine?, true
checker = EverythingsFineChecker.new(status)

checker.is_everything_fine?
# => true

status.verify
```

We can use `#expect` to stub methods and set return values on our mock object.
If we want it to spy for us, we can call `verify` at the end to make sure that
the stub was actually called. The first argument of expect is the method to
stub, the second is the value to return, and the third is optional and can be an
array of arguments. If we want to stub a method `set_speed` that accepts an
argument of speed, we might do it like this for a speed of 55:

```ruby
car = MiniTest::Mock.new
car.expect :set_speed, car, [55]
```

## Return a MiniTest::Mock from a Stub
You can combine stubs and mocks! In this example, a client is stubbed so that
it returns a mock client when it's initialized. The `mock_client` is stubbing a
call to `list_all` to always return an empty array.

```ruby
mock_client = MiniTest::Mock.new
mock_client.expect :list_all, []

Client::Request.stub :new, mock_client do
  # do something using the client
end
```

## Using Standard Ruby Objects as Test Doubles

We can also use plain old Ruby in our test! One example of this is using a test
object created in the test as a stand-in for something else. Here we create a
mock client object that responds to `list` with some pre-canned answers and then
use dependency injection to pass it into our job instead of one that might make
real requests to an API

```ruby
class ProcessingTest < MiniTest::Unit::TestCase
  class MockClient
    def list(page:)
      case page
      when 1
        ["item 1", "item 2"]
      when 2
        ["item 3", "item 4"]
      else
        []
      end
    end
  end

  test "Process Items" do
    ProcessingJob.new(client: MockClient.new).perform

    # assert something
  end
end
```

## Redefine Methods on Ruby Objects

Here is a cool trick you might remember from [another one of my recent
posts](https://www.reinhardt.io/ruby/2020/06/22/the-return-of-the-eigenclass.html),
using plain Ruby you can redefine a method on any object. We can use that in a
test to stub methods! Here is an example of stubbing some methods on an instance
of `team`, one of which raises an exception.

```ruby
team = Team.create(name: "Engineering")
def team.active?; true; end
def team.add_member(*args); raise TeamError::NotAuthorized; end

TeamFinder.stub :engineering_team, team do
  # Do something
end
# assert something
```

In that example, team is stubbed so that it always returned `true` for `active?`
and so that it will raise an exception when calling `add_member`.

The syntax is a little weird at first, but you're likely familiar with defining
class methods like:

```ruby
def self.say_hello
  puts "hello"
end
```

This is the same thing! `self` in this case refers to the instance of class
representing the object and you are defining the "say_hello" method on it.

Using this technique is pretty powerful because it lets you quickly stub methods
on any object and is especially handy when you have several methods to stub. The
cool part is, it's just Ruby!

## Use The Tests, Luke

There are some patterns I've found helpful when writing tests in MiniTest. If
you find that you are having to stub and mock a lot or that you are stubbing
things to return other stubbed things that return other stubbed things it could
mean that your class [knows too much about other
objects](https://en.wikipedia.org/wiki/Law_of_Demeter) in your system. I've
found it helpful to use this pain when I encounter it as an indicator that I
should re-consider some closely coupled objects and find ways to make them less
coupled.
