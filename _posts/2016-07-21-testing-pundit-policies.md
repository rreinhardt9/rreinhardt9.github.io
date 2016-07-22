---
layout: post
title: Testing Pundit Policies
category: ['pundit', 'testing', 'ruby']
permalink: '/pundit/testing/ruby/2016/07/21/testing-pundit-policies'
---

CanCan has been an awesome standby for authorization in many of the projects I've been involved with; but I've had my eye on Pundit and really appreciate the 'just plain old Ruby objects' approach. So on a couple of recent projects I made the jump. So far, it's been awesome; but that's a post for another day :-).

One of the first challenges that I ran into was developing a strategy for testing my policies. Both of my projects are using MiniTest, one uses spec via the 'minitest-spec-rails' gem and the other is just plain vanilla with the additions that Rails provides. FactoryGirl is used in both cases.

### General Structure

In each policy test, the basic structure I've begun using is

```ruby
# MiniTest
require 'test_helper'

class SomethingPolicyTest < ActiveSupport::TestCase
  setup do
    # Setup needed for all tests... maybe build different record for testing
    # against
  end

  test 'a user can' do
    # test the things a user can do
  end

  test 'a user can not' do
    # test the things a user can not do
  end

  test 'user scope' do
    # test the scope of a user
  end

  test 'an admin can' do
    # test the things an admin can do
  end

  # ...
end

```

```ruby
#MiniTest::Spec
require 'test_helper'

class SomethingPolicyTest < ActiveSupport::TestCase
  let(:something) { build :something }
  let(:another_something) { build :another_something }

  describe 'user' do
    let(:user) { build :user }

    it 'can' do
      # test what a user can do
      # More on `must_permit` and `wont_permit` later :-)
      something.must_permit user, [:new?, :create?, :edit?, :update?]
    end

    it 'can not' do
      # test what a user can't do
      something.wont_permit user, :destroy?
    end

    describe 'scope' do
      it 'includes something' do
        # test things about the user scope
      end
    end
  end

  describe 'admin' do
    let(:admin) { build :admin }
    # same stuff for an admin or other role
  end
end
```

This has been kind of a nice starting point, but I frequently deviate from this pattern if it makes sense or as the list of things they can or can not do gets longer and more complex.

### Custom Assertions

How do we make assertions about a policy? Well, a policy is just a Ruby class... so all we have to do is instantiate the policy and call it's instance methods. Pundit provides a nice class method `.policy` for instantiating a policy. It infers the name of the policy from the class of the given record and then instantiates the policy using the user and record passed in. So in order to test our policy, we could make assertions using the result of calling methods on the policy.

```ruby
# ...
  test 'user can' do
    assert Pundit.policy(user, record).show?
  end

  # or spec

  it 'can' do
    Pundit.policy(user, record).show?.must_equal true
  end
```

But this isn't going to give meaningful error messages and contains a lot of boilerplate code. To help make things clearer, lets write custom MiniTest assertions to help test our policy. I've defined these in `test/helpers/pundit.rb` and then required that file in `test_helper.rb`

```ruby
module MiniTest
  module Assertions
    ##
    # Fails unless there is a Pundit policy for the user and record and permits
    # the action.
    # user: instance of User
    # record: instance or class of object being authorized
    # action: string or symbol of the action being authorized or array of
    #         strings/ symbols

    def assert_permit(user, record, actions)
      actions = Array(actions)

      actions.each do |action|
        msg = "User #{user.inspect} should be permitted to #{action} #{record}, but isn't permitted"
        assert Pundit.policy!(user, record).public_send(action), msg
      end
    end

    ##
    # Same as `assert_permit` except it fails if user IS permitted for the
    # record and action

    def refute_permit(user, record, actions)
      actions = Array(actions)

      actions.each do |action|
        msg = "User #{user.inspect} should NOT be permitted to #{action} #{record}, but is permitted"
        refute Pundit.policy!(user, record).public_send(action), msg
      end
    end
  end
end
```

This opens up the MiniTest::Assertions module and defines two newly minted assertions. Under the hood it uses `Pundit.policy` like we were before. I chose to use the 'bang' version, `.policy!`, so that if the policy is not yet defined, we get a meaningful error message. Otherwise we would simply get a nil class error. `#public_send` is used to dynamically call the given 'action' method on the policy. `#public_send` is used because I only want to test the public methods available in the policy, not any private helper stuff I might have defined.

We now have a much more descriptive error message for when our assertion fails. I used `#.inspect` with `user` in the error message so that you can see the attributes of the user when you are debugging a test... although if this is too much info you could play around with what makes most sense for you. `Array()` is used to convert whatever we pass into the 'action' parameter to an array, if possible; this way we can choose to pass in a single action or an array of actions.

With these new assertions, we can now use them like

```ruby
test 'a user can' do
  assert_permit user, record, :show?
  # or
  assert_permit user, record, [:new?, :create?, :edit?, :update?]
  # or
  assert_permit user, Record, :new?
end
```

and then you would get a helpful error message like:

```
  User #<User id: nil, email: "test558484455@example.com", password_digest: "$2a$04$u0rOr5nwXzYHcydrVJZq.ONO5bKnZj2AoSIjE6Touw/...", role: 2, organization_id: 1> should be permitted to update? #<Something:0x007fc71ca58ff8>, but isn't permitted
```

But we don't want to leave the MiniTest:Spec-ers without an expectation to hide these assertions in. Fortunately, it is wonderfully easy to turn an assertion into an expectation. At the bottom of `test/helpers/pundit.rb` we'll add the following

```ruby
module Minitest
  module Expectations
    ##
    # See `assert_permit`
    # Use like `record.must_permit user, action`

    infect_an_assertion :assert_permit, :must_permit

    ##
    # See `refute_permit`
    # Use like `record.wont_permit user, action`

    infect_an_assertion :refute_permit, :wont_permit
  end
end
```

and that's it! We can now use our expectations in our tests:

```ruby
it 'can' do
  something.must_permit user, :show?
  # or
  something.must_permit user, [:new?, :create?, :edit?, :update?]
  # or
  Something.must_permit user, :new?
end
```

### Testing Scope

Testing scope is pretty straight forward. Pundit provides `.policy_scope` for retrieving records using the scope, so all we have to do is make sure that we only get the records we expect to get and not the others. For example:

```ruby
describe 'scope' do
  attr_accessor :another_thing, :result, :thing
  let(:user) { create :user }

  before do
    @thing = create :thing, user: user
    @another_thing = create :another_thing
    @result = Pundit.policy_scope!(user, Thing)
  end

  it 'includes a thing' do
    result.must_include thing
  end

  it 'wont include another thing' do
    result.wont_include another_thing
  end
end
```

### The End!

This pretty much sums up how I test my Pundit policies. I'll leave you with a complete copy of my `test/helpers/pundit.rb`. Happy testing!

```ruby
module MiniTest
  module Assertions
    ##
    # Fails unless there is a Pundit policy for the user and record and permits
    # the action.
    # user: instance of User
    # record: instance or class of object being authorized
    # action: string or symbol of the action being authorized or array of
    #         strings/ symbols

    def assert_permit(user, record, actions)
      actions = Array(actions)

      actions.each do |action|
        msg = "User #{user.inspect} should be permitted to #{action} #{record}, but isn't permitted"
        assert Pundit.policy!(user, record).public_send(action), msg
      end
    end

    ##
    # Same as `assert_permit` except it fails if user IS permitted for the
    # record and action

    def refute_permit(user, record, actions)
      actions = Array(actions)

      actions.each do |action|
        msg = "User #{user.inspect} should NOT be permitted to #{action} #{record}, but is permitted"
        refute Pundit.policy!(user, record).public_send(action), msg
      end
    end
  end
end

module MiniTest
  module Expectations
    ##
    # See `assert_permit`
    # Use like `record.must_permit user, action`

    infect_an_assertion :assert_permit, :must_permit

    ##
    # See `refute_permit`
    # Use like `record.wont_permit user, action`

    infect_an_assertion :refute_permit, :wont_permit
  end
end
```
