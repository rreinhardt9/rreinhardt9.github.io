---
layout: post
title:  "Capybara::Poltergeist::StatusFailError: Request failed to reach server"
date:   2015-11-06 12:00:00
category: ["Ruby", "Capybara", "Poltergeist", "PhantomJS"]
---

Recently, I started out on a new project using Capybara with Poltergeist as the JS driver. I set up PhantomJS with the latest version, which is 2.0 now.

One of my fellow devs on the project wrote some tests that passed fine for him, but for me... I consistently saw this error when running the test:

```bash
Capybara::Poltergeist::StatusFailError: Request failed to reach server, check DNS and/or server status
```

Confusingly, it would also pass occasionally when running the test by itself. Nothing really seemed different between the others tests that worked... except the page that was being tested contained an iframe with an embedded youtube video. But why was it passing for the other dev on the project? When he ran `phantomjs -v` he was running 1.9.2. When I tried running phantomjs 1.9.8 with the test suite, things ran fine.

I don't understand yet all of what is causing phantomjs 2.0.0 to encounter this error, but it seems that there is some different behavior behind the `visit` command that is not playing nice with my external resource in the iframe.

Poltergeist has a concept of blacklisting urls, so my final solution to make the test work with phantomjs 2 was to blacklist the youtube url in my setup block for tests that where to use the JS driver:

```ruby
setup do
  DatabaseCleaner.start
  Capybara.current_driver = Capybara.javascript_driver
  # Blacklist unnecessary external resources to increase performance and
  # prevent issues with poltergeist 2.0.0 when using `visit`
  page.driver.browser.url_blacklist = ['https://www.youtube.com']
end
```

Really, it's probably good for test performance as well... since we aren't really concerned with testing the youtube link in this case.

Another thing that I considered, what adding conditional  logic in the view so that the iframe would not be displayed when `Rails.env.test?` was true. I didn't opt for this solution because I didn't want code in the views that was there just to make the test suite work... I would rather have that code someplace like the test_helper where it's purpose is clearer.
