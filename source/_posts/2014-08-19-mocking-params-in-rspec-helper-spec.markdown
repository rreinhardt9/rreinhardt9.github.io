---
layout: post
title: "Mocking params in rspec helper spec"
date: 2014-08-19 09:20:57 -0400
comments: true
categories: [Rspec, Rails]
---

I wrote a helper recently that looked something like:

``` Ruby
module UsersHelper
  def my_button_path
    if params[:my_param]
      some_path
    else
      another_path
    end
  end
end
```
Simple helper, simple to test right? Well so I thought until I tried. I started with:

```Ruby
require 'spec_helper'

describe UsersHelper do

  context "with no params" do
    it "should return some_path" do
      helper.my_button_path.should == some_path
    end
  end

  context "with my_param true" do
    it  "should return another_path" do
      helper.my_button_path.should == another_path
    end
  end
end
```
But how do I pass the params to my helper? Hmm. I'll spare you all the attempts along the way, but [this stackoverflow question](http://stackoverflow.com/questions/1440866/what-am-i-doing-wrong-with-this-rspec-helper-test) helped me to the final answer:

```Ruby Solution!
require 'spec_helper'

describe UsersHelper do

  context "with no params" do
    it "should return some_path" do
      helper.my_button_path.should == some_path
    end
  end

  context "with my_param true" do
    it  "should return another_path" do
      params = { :my_param => true }
      helper.stub!(:params).and_return(params)
      helper.my_button_path.should == another_path
    end
  end
end
```
Back in the green!
