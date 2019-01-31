---
layout: post
title: Low Pain Data Migrations In Rails
category: ["Rails", "Migrations", "Ruby"]
---

### *In search of a good way to update existing data in a mature Rails application*

There have been many times where I've encountered the need to change some data in response to a change our application. As the project and team I've been working on have grown the need for a robust method to run these data migrations has as well.

What I'm referring to as a "data migration" is just some code that makes changes to data in your system. It's not making changes to the actual structure of your database, but changing the records in it. For example, maybe you had some data stored as an attribute on a model but now that same information is being moved out to a related record. That is to differentiate it from a "Rails migration" which is just the normal migration files that you use in your rails app for managing the state of your database.

I've been looking for a way to do data migrations that:

- runs automatically in most environments including developer's local environments and non production environments to reduce burden imposed on the team
- can run alongside production traffic without interruption
- provides the option to run the migration on demand in production separate from deploys so that we could run the migration at an off time without having to perform a full deploy
- allows the Rails migration to continue to work without updating if the code for the data migration changes or is removed
- is easy to test

Rake tasks are a handy way to run some code in a testable way; what if we called a rake task from a migration? That seems like a good place to start! Putting the data migration in a rake task would also help isolate the rails migration from the data migration code itself (which in some cases might included calls to an external library that could break if the library's API changed or we stopped using the library). It can be a pain to have to go back and update old migrations just because a method or a class changed names in your code years after the migration was run.

Here is a first attempt at our rake task data migration:

```ruby
class CreateFooBarPermissionParity < ActiveRecord::Migration[5.0]

  def up
    say_with_time "Creating parity between old and new verions of foo bar permission" do
      Rake::Task["permission:create_foo_bar_parity"].invoke
    end
  end

  def down
    say "Nothing to do"
  end
end
```
`say` and `say_with_time` are just helpful little methods that `ActiveRecord::Migration` provides us to output information from our migration. If we tried to run the migration after the rake task had been removed, we would get a helpful error telling us that the task could not be found (but the migration would still break because of the missing task). Since running migrations is a normal part of a Rails application's life cycle, this method has advantages over a stand alone rake task because we do not need to remember to run it manually in all environments; our data migration code would be run when the rails migrations are run as a normal part of the life cycle of your app.

Putting the data in a temporary rake task has other advantages as well. If the need arises later to re-run the task to fix an issue we can call our task from the command line ad hoc. The task can also be used as a tool while you are working on the feature! Many times while working on a feature I might end up with my local data in a crazy state and having the rake task to call and get my data back in a particular state can be really helpful. For me the rake task has been easier to test as well; while you can write tests for migrations it feels more intuitive to me to write a spec for a rake task containing the data migration.

Just using the rake task in the migration helps us meet several of the goals we had for our data migration! An important one to consider next is that when this data migration runs in production it should not interfere with production traffic. Since each rails migration runs in it's own transaction by default, there is the potential that we could create locks in the database during a long running data migration that could tie up records in the database and have a noticeable effect our our users. That would happen because the production traffic would be forced to wait on any records it needed to access while our giant migration transaction finished. Yikes! I can say from experience that this leads to Bad Things :-). To avoid this it would be a good rule of thumb to disable the transaction that surrounds the rails migration so that we can handle adding transactions explicitly where they are needed for either data integrity or performance (care should be given though that the transactions are as small as possible if you need them at all). You can do this by adding `disable_ddl_transaction!` to the top of your rails migration. Now we have:

```ruby
class CreateFooBarPermissionParity < ActiveRecord::Migration[5.0]
  disable_ddl_transaction!

  def up
    say_with_time "Creating parity between old and new verions of foo bar permission" do
      Rake::Task["permission:create_foo_bar_parity"].invoke
    end
  end

  def down
    say "Nothing to do"
  end
end
```
While it's nice that we get a helpful error message if the rake task no longer exists and the Rails migration is run, most of the time a data migration is just needed to update the state of existing data in the database and will be completely removed when we are finished with it so it would be nice if we handled this common situation gracefully. We can handle this case by rescuing the exception and outputing a message from our rails migration. A missing rake task will raise a generic `RuntimeError` which is not specific enough to target (we don't want to rescue all `RuntimeError`s), but what we can do is match on the message from the exception to make sure that it's coming from a missing rake task:

```ruby
class CreateFooBarPermissionParity < ActiveRecord::Migration[5.0]
  disable_ddl_transaction!

  def up
    say_with_time "Creating parity between old and new verions of foo bar permission" do
      Rake::Task["permission:create_foo_bar_parity"].invoke
    end
  rescue RuntimeError => e
    raise unless e.message =~ /^Don't know how to build task/

    say "Rake task 'permission:create_foo_bar_parity' did not run because it doesn't exist"
  end

  def down
    say "Nothing to do"
  end
end
```

Sometimes we would prefer to run a data migration at an off time in production just to play things safe (nobody likes to watch the app go up in flames). But we would still like it to run automatically in all of our other environments that are not production and might have less traffic and risk. For this purpose, we could check for an environment variable and if we find it we would skip running the rake task in that environment with a message reminding you to run it manually. This would allow us to define which environments it should not run in as a part of the rails migrations while still allowing it to run by default in all other environments. That leads us to this final iteration:

```ruby
class CreateFooBarPermissionParity < ActiveRecord::Migration[5.0]
  disable_ddl_transaction!

  def up
    if ENV["SKIP_DATA_MIGRATIONS"]
      say "Skipping rake task, please run 'permission:create_foo_bar_parity' manually"
    else
      say_with_time "Creating parity between old and new verions of foo bar permission" do
        Rake::Task["permission:create_foo_bar_parity"].invoke
      end
    end
  rescue RuntimeError => e
    raise unless e.message =~ /^Don't know how to build task/

    say "Rake task 'permission:create_foo_bar_parity' did not run because it doesn't exist"
  end

  def down
    say "Nothing to do"
  end
end
```
You could make the name of the variable what ever works best for you. With that environment variable set, we can deploy at a hight traffic time to production without effecting users and run the data migration at night when traffic is slower without needing the full deploy process. We may not need this option in all cases, but it's nice to have it if we need it; especially if your process for deploying code requires some work.

This configuration has helped me get as close as I've ever been to having a painless way to update data across multiple environments. Hopefully some of the ideas might prove helpful to you too!

