---
layout: post
title: A Simple Value Object For Ranking
category: ["Ruby", "Rails", "OOP"]
---

A fun little challenge that arose recently while working on the idea of ranking for a 'team competition' was how to represent the rank itself. A team is 'ahead' in rank if they have more activity.

Initially, to find the rank of a particular team I wrote a query to return all the teams in the order of teams that had the most activity to the least and then found the position of the current team in that array. `most_activity_desc` is a scope that makes the above query. There was another method to turn that index into a ordinal representation of the rank.

```ruby
Class Team < ActiveRecord::Base
  belongs_to :challenge
  has_many :activities

  scope :most_activity_desc, -> # Returns teams in order of most activity desc

  def rank
    rank_index ? (rank_index + 1).ordinalize : ''
  end

  private

  def rank_index
    challenge.teams.most_activity_desc.index(self)
  end
end
```

This works, but `Team` now has knowledge of what it means to be a rank. It knows that to create a rank from a zero base index we need to add one. It knows that if the index is `nil`, then the rank is an empty string; otherwise it needs to be the result of calling rails' `#ordinalize` method on the rank value. In addition we need that same knowledge in another place ranking individuals on a team. It sure would be nice to extract what it means to be a rank so that we can share it around and make it easy to test. One possible solution would be to introduce a `Rank` 'value object'.

What is a value object exactly? Martin Fowler's site succinctly describes them this way:

> A small simple object, like money or a date range, whose equality isn't based on identity.

> ~ [martinfowler.com](http://martinfowler.com/eaaCatalog/valueObject.html)

So if you have two objects that have the same values, then

```ruby
obj1 == obj2 # true
```

Additionally, the objects should be immutable; if two objects were once equal... they should always be equal. ~ [c2.com](http://c2.com/cgi/wiki?ValueObjectsShouldBeImmutable)

Great! Let's make the `Rank` value object. Here's the first pass:

```ruby
# Rank is a value object that represents an ordinal ranking
class Rank
  # Initialize a Rank from a zero base index
  def self.from_index(index)
    new(index&.+ 1)
  end

  def initialize(value)
    @value = value
  end

  def to_s
    value ? value.ordinalize : ''
  end

  private

  attr_reader :value
end
```

This is kind of a crazy use of the new Ruby 2.3 `#&.`, but none the less I was excited to sneak it in there. If `index` is nil, it will call `.new` with nil; otherwise it will add 1 and initialize a new `Rank` with the result.

With this, we can now initialize a Rank from an index

```ruby
Rank.from_index(2)
=> #<Rank:0x007fb611f4dcf0 @value=3>
```

and output the appropriate string representation

```ruby
r = Rank.from_index(2)
r.to_s # "3rd"
```

and test ranks for equality

```ruby
r = Rank.new(2)
r2 = Rank.new(2)
r == r2 # false
```

Err, or maybe we have more work to do. We are still comparing for equality using the objects themselves. To be a value object, we need override the `#==` and `#eql?` methods so that we are comparing equality using the value of the objects.

```ruby
# Rank is a value object that represents an ordinal ranking
class Rank
  attr_reader :value

  # Initialize a Rank from a zero base index
  def self.from_index(index)
    new(index&.+ 1)
  end

  def initialize(value)
    @value = value
  end

  def ==(other)
    value == other.value
  end
  alias :eql? :==

  def to_s
    value ? value.ordinalize : ''
  end
end
```

```ruby
r = Rank.new(2)
r2 = Rank.new(2)
r == r2 # true
r.eql? r2 # true
```

Awesome! Really this is all we need for our current case; but we can't compare two grade for anything but equality. What if we want to see which rank is greater than the other so that we could do things like sort based on rank? We are just a Ruby mixin away :-)

```ruby
# Rank is a value object that represents an ordinal ranking
class Rank
  include Comparable
  attr_reader :value
  alias :eql? :==

  # Initialize a Rank from a zero base index
  def self.from_index(index)
    new(index&.+ 1)
  end

  def initialize(value)
    @value = value
  end

  def <=>(other)
    value <=> other.value
  end

  def to_s
    value ? value.ordinalize : ''
  end
end
```

In order to use `Comparable`, all we have to do is define `#<=>` and then we get all the comparison operators and the method `#between?`. Also, I left the alias for `#eql?`. With `Comparable`, we can do all kinds of cool things now:

```ruby
r = Rank.new(1)
r2 = Rank.new(2)
a = [r2, r]

r == r2 # false
r < r2 # true
r >= r2 # false
a # [#<Rank:0x007fb6112fbda8 @value=2>, #<Rank:0x007fb611333ac8 @value=1>]
a.sort # [#<Rank:0x007fb611333ac8 @value=1>, #<Rank:0x007fb6112fbda8 @value=2>]
```

So there it is... a fun little value object for `Rank` that we can now use anywhere we need something that acts like a rank! Also, it makes testing much faster and easier because a `Rank` can now be tested just like any other object. Here's the start of a simple test in the context of Rails:

```ruby
require 'test_helper'

class RankTest < ActiveSupport::TestCase
  describe '.from_index' do
    it 'initializes a Rank from a zero base index 0' do
      Rank.from_index(0).value.must_equal '1'
    end

    it 'initializes a Rank from a zero base index 5' do
      Rank.from_index(5).value.must_equal '6'
    end

    it 'initializes a Rank from a nil index' do
      Rank.from_index(nil).value.must_equal nil
    end
  end

  describe '#to_s' do
    it "returns the Rank as '1st' for a value of 1" do
      Rank.new(1).to_s.must_equal '1st'
    end

    it "returns the Rank as '2nd' for a value of 2" do
      Rank.new(2).to_s.must_equal '2nd'
    end

    it "returns the Rank as '3rd' for a value of 3" do
      Rank.new(3).to_s.must_equal '3rd'
    end

    it "returns the Rank as '4th' for a value of 4" do
      Rank.new(4).to_s.must_equal '4th'
    end

    it "returns the Rank as '' for a value of nil" do
      Rank.new(nil).to_s.must_equal ''
    end
  end
end
```

Happy 4th of July!
