---
layout: post
title: Braces vs do/end in Ruby
---

The notation that I use for writing blocks in Ruby has been something that up until now I've taken for granted. Early on I learned the rule of thumb that if a block was a one liner, you use braces; but if it spanned multiple lines you use do/end.

```ruby
people.each { |person| person.say_hi }
# Vs
people.each do |person|
  person.say_hi
  person.chat
  person.say_goodbye
end
```

The two notations aren't exactly equivalent (curly braces have a higher parser precedence than do/end) but for most cases they should be virtually interchangeable.

Recently though, I was introduced to a different take on when to use braces vs do/end and so it seemed like it would be fun to explore this a bit. The basic idea is that if a block is primarily used for it's return value then use curly braces, but if the block is primarily used for it's side effects then use do end.

The first blog I read on the topic was on [Avdi Grimm's blog](http://devblog.avdi.org/2011/07/26/the-procedurefunction-block-convention-in-ruby/) and he pointed to an older post by Jim Weirich; also pointing to him as being the possible origin for the idea. Jim's post isn't available on his site anymore, but fortunately the internet archive has it... I'll quote his whole post here since he does such a great job of succinctly introducing the idea.

> The big remaining question on Ruby coding style is: When should you used { } for blocks, and when should you use do/end?

> Blocks in Ruby may be written with brace delimeters or do/end delimiters. There is a subtle difference in precedence between the two versions, but for most work the two are identical.

> So which way do you go?

> Some folk use { } for one-liners and do/end for multi-liners. Others stick exclusively to either { } or do/end. I tried all of the above, but was never really satisified with any of the guidelines.

> Here is the guideline I use now:

>    Use { } for blocks that return values
>    Use do / end for blocks that are executed for side effects

> This has the advantage of using the choice of block delimiter to convey a little extra information. Here’s some examples.

>```ruby
>  # block used only for side effect
>  list.each do |item| puts item end
>
>  # Block used to return test value
>  list.find { |item| item > 10 }
>
>  # Block value used to build new value
>  list.collect { |item| "-r" + item  }
>```

> Of course, if precedence makes a difference, use the type of block that makes sense. This is just a guideline after all.

> But I have found the distinction to be useful.  

-- <cite>Jim Weirich</cite> from the [internet archive](https://web.archive.org/web/20140221124509/http://onestepback.org/index.cgi/Tech/Ruby/BraceVsDoEnd.rdoc)

Sounds intriguing to me, let's try some more example's on for size.

```ruby
names.collect { |o|
  if options[o].blank?
    []
  else
    make_option("-", options[o], type)
  end
}
```

Yep, that sure feels weird on first glance as well; habits do die hard. But if I was to look at this knowing the convention it would be clear that I was using the return value to build my new value. Additionally, if I was to chain further methods that used this return value... the braces syntax feel a little more natural to my when appending the additional methods.

```ruby
names.collect { |o|
  if options[o].blank?
    []
  else
    make_option("-", options[o], type)
  end
}.each do |name| puts name end

# As opposed to

names.collect do |o|
  if options[o].blank?
    []
  else
    make_option("-", options[o], type)
  end
end.each { |name| puts name }
```

```ruby
# Bonus! Both in one line.
names.map { |name| '-' + name }.each do |name| puts name end
```

```ruby
options.merge!(MyThing.config) do |_key, option, _config| option end

Rails.backtrace_cleaner.add_silencer do |line| line =~ /my_noisy_library/ end
```

The last two examples are kind of my best guess, 
