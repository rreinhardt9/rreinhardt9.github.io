---
layout: post
title: Leveraging Documentation for AI Tools
category:
- ruby
- AI
date: 2025-10-02 11:29 -0400
---
Memories of the past prepare us for the future. If every day we had to re-learn how to tie our shoes, brush our teeth, walk, and a million other things we've learned over the years then it would be hard for us to make any progress beyond that. Using AI coding tools can feel a bit like this today, where every new feature or bug fix requires the tool to re-learn how the codebase is structured, how a particular class or method works, what kinds of preferences you have, what CLI tools it has at its disposal and when they are helpful. The tool ends up spending quite a bit of work just to acquire the context it needs before it even gets to making meaningful changes.

But like so many things, if you look at it in the right light these problems aren't new. When a new developer starts work on a new codebase or in an area of the code they haven't worked in recently, they too need to re-acquire the context needed before they begin work. Whether human or AI tool, we need these connections to the past to understand the future.

When using AI tools (as without) lost context costs you time and money. The more research the AI tool has to do to learn your code structure the more money you'll be spending in tokens that could have been used for more productive ends. If the tool then forgets what it's learned from session to session (or even just when compacting memory) the time and money you spent on research is lost for any future use.

To help solve the human problem, we work to make our code easy to understand and add documentation to aid in the journey; documenting patterns and calling out pitfalls. I would put forth that we can leverage this same solution for AI and in the process help both machine and human get the knowledge and context they need faster.

## Overall Strategy

We want our documentation to be there when it's needed without being too heavy to consume up front. We could place all of our documentation in a single file (perhaps the main README) but that file is going to get really big really fast. You or the AI tool are going to need to sort through lots of irrelevant information to find what you are looking for and this gets expensive fast in either case. Instead, we want to make our documentation discoverable in the moment of need:

- **Inline Documentation**: this will be our first line of defence. Documenting public methods and classes is going to be most discoverable and likely to stay up to date since it's right next to the code it's describing.
- **README for the project**: This will serve as our main entry point. We'll import it into tool specific files (like CLAUDE.md). It will contain references to other places things can be found in our documentation as well as describe our main documentation strategy.
- **READMEs in subdirectories**: Sometimes subsystems have things we want to describe that are too specific for the main README but too general for in-inline documentation. For these, we can utilize READMEs in subdirectories that contain information specific to that area of the code.
- **docs/ directory**: In many projects, you might choose to have a separate docs/ directory containing things like style guides and other general documentation. To make use of these, we can link back to them in the main README so they can be referenced as needed.
- **~/ENGINEERING.md**: This file will be used to store your own personal engineering preferences so that AI codes more in your style. It's also a nice chance to take stock of what principles are important to you. It can be included in local tool specific memory files like `~/.claude/CLAUDE.md` to make the tools aware.
- **Project File**: When working on a larger project, starting a file to contain your objective and progress can help AI stay focused on the task at hand and remember relevant information along the way.

Let's look at these some more detail!

## Inline Documentation

Inline documentation has been a best practice for a long time already to help share context with anyone reading your code; using AI tools only makes it more relevant. For our strategy it's going to be our first line of defence. Any machine or human looking at the code is going to have that documentation available right there making it very discoverable. Since it's right next to the code it's discussing, it's also much more likely to be kept up to date as the code changes.

As with any good inline documentation, avoid just describing the implementation but instead focus on documenting usage, examples, and gotchas. The documentation can also help point to other relevant classes using things like `@see` tags in Yardoc.

Not only can AI make use of the documentation to get context faster, it can also help keep the documentation up to date and appropriately document new public methods and classes!

We can make sure AI is aware of and uses inline documentation by making a note of it in our memory strategy described in the main README file that we'll look at in a little more detail next.

## Project README

We've been adding READMEs to our projects forever to help engineers get up and running quicker. We don't need new tool specific solutions like CLAUDE.md, we just need make sure our AI tools know where to look for this foundational document!

When using Claude for example, this can be accomplished by importing the README into your project's CLAUDE.md file like:

```markdown
@README.md
```

Underneath that, you can still add anything that might be relevant for that specific tool in it's tool file; but otherwise we're now free to keep general project information in the main README where it can be used by any human or AI tool.

One thing that might be a helpful addition to the README is a specific section for AI tools to store their context in. Some of the things it might want to store might not make as much sense for a larger audience, so we can create a section of the README called something like "AI Context Notes" and then inform AI that this is the section it should feel free to store context in for later reference.

The README should list common commands to do things like start the server, run the tests, etc which also adds these things to AI's repertoire. It can contain links to other documentation to make it more discoverable. It can also contain high-level descriptions of the architecture of the app and the major objects in it.

Let's look at one possible example.

````markdown
# My App Name

## Overview
Brief description of the app

## Getting Started
- How to get the project up and running

## Common Commands

### Running Tests
```bash
# Run all tests
bundle exec rspec

# Run a specific test
bundle exec rspec spec/path/to/test_file.rb

# Run tests with specific line number
bundle exec rspec spec/path/to/test_file.rb:42
```

### Starting Server
```bash
bundle exec rails server
```

## Architecture & Patterns
In this section, describe the major systems and objects as needed to give an overview of the app's architecture.

## Related Documentation
- **[style_guide_overview.md](docs/style_guide/style_guide_overview.md)**
- **[engineering_practices.md](docs/style_guide/engineering_practices.md)**: Development workflow and best practices
- **[ui_library.md](docs/style_guide/ui_library.md)**: UI components and design system

## AI Context Notes

### Memory Discovery Protocol
When working in any directory:
1. Look for inline documentation on the method or class
2. Look for README.md in current directory first
3. Check parent directories up to project root for additional context
4. Focus on "AI Context Notes" sections for AI-specific guidance
5. Reference @docs/style_guide/ files for coding standards
6. Update README files when learning new patterns

### Memory System Architecture
This project uses a hierarchical memory system:
- **Inline Documentation**: Documentation on public methods and classes describes usage and examples
- **Project Memory**: This README.md serves both humans and AI tools
- **User Memory**: `~/.claude/CLAUDE.md` for personal preferences
- **Directory Memory**: README.md files in subsystem directories
- **Memory Imports**: Use `@path/to/import` syntax for modular organization

````
This is really just an example and you should definitely make it your own in your own project. Be sure to consider what would be helpful to both humans and any potential AI tools. The cleaner and more organized and informative you can make it, the better for everyone!

The sections on memory discovery and architecture in the README are critical to what we are trying to accomplish. These sections make AI tools aware of where it can obtain memory files and the information it needs.

## Subsystem README

As your app grows, you will likely get to a point where whole subsystems of your app may take quite a bit to explain on their own. Or potentially that part of the app contains a specific pattern you would like to see followed (like, for example, a directory containing web-components for the UI library). In cases like these, you can choose to create a README in that subdirectory. Here's a quick example for one in the Web-components directory:

```markdown
# Web Components

[Web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
make use of the browser native [customElements API](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements) to create custom elements to be used on a page just like standard HTML elements (or, in some cases, to extend existing HTML elements).

## Structure of this Directory

In this directory, you will find subdirectories that contain the JS and CSS to
define an individual component. There will also be a README file in that
directory with a description and examples of usage.

## Creating a new component

If you are creating a new component, you will need to import it's files in the
index.js and index.scss files found in this top level directory.

## AI Context Notes
- Some note based on something AI learned while implementing a web component
```

And here's a possible example for a complicated subsystem:

```markdown
# Payment Processing

## Overview
This module contains all code that pertains to the processing of payments (for plans, new products, etc).

## Quick Start
- Key files and their purposes
- Common operations
- Where to find examples

## Architecture & Patterns
- All payment processors should respond to `#process_payment`
- There is a shared spec example testing the interface for a payment processor in 'spec/shared_examples/payment_processor.rb'

# Related Documentation
- Links to @docs/ files
- External resources

## AI Context Notes

### Recent Patterns Discovered
- Pattern: New payment processors should use single table inheritance from the base PaymentProcessor

## Recent Changes
- We now explicitly round down to the nearest cent when calculating payments
```
## Integrating Existing Documentation

Often a project will have other places documentation is stored and if you have that, let's make sure it's more discoverable by human engineers and AI by providing links! In some of the examples I referenced a `docs/` directory. Perhaps in your project this directory contains style guide information as well as descriptions of various major systems. If you have this, be sure to place links to them in the readme that's most appropriate so that they can be discovered and leveraged or updated as needed. You've already put the work in to create that documentation, make sure you're getting all the use you can out of it!

By linking to your coding conventions and style guide docs in your project README, you're helping your tools stick to the agreements you've made as a team and therefore reducing the amount of re-work you'll need to do at the end.

## Your Engineering Philosophy

Writing code isn't a purely mechanical exercise, you as the author leverage your craft and experience to make it really shine. If you're using an AI tool, you've experienced how much time you can lose trying to explain to it why it should favor one approach over another; or you've experienced the frustration of needing to manually clean up a less than optimal implementation from AI so that it matches your definition of good code.

To help avoid this round and round, we can help the tool better understand how to code _in your style_ by creating an ENGINEERING.md that contains notes on all the things that are important to YOU as an individual engineer (and that AI can add to as it learns more about you). It can also provide an interesting point of reflection for you as you consider what your engineering philosophy is.

This can be a hard one to put together; I experienced a bit of writer's block at the beginning. To help get me started I explained what I wanted to create to AI and asked it to interview me about my approach to engineering and what patterns were important to me, then assemble the results into an initial ENGINEERING.md. Doing this gave me a starting point, but I'm still not happy with the representation and want to go back and spend more time crafting this file in the future. Here's an example of some of what is in my (far from finished) ENGINEERING.md:

````markdown
# Ross Reinhardt - Engineering Philosophy

## Core Principles

### Object-Oriented Design First
I strongly favor proper object-oriented programming over procedural patterns. I actively avoid service objects as they become dumping grounds for procedural logic that obscures domain objects and concepts that should be modeled explicitly.

### Interface-Driven Development
I focus on the interfaces between objects and the messages being sent. I prefer "tell, don't ask" patterns - instead of querying an object and updating its state, I send it a message about what happened (e.g., `job_updated`) and let it handle the response.

### Command/Query Separation
- **Query methods** (return values) should have no side effects
- **Command methods** (side effects) should not return values we depend on
- Command methods often return `self` to avoid accidental dependence on return values

## Code Organization & Patterns

### Domain Modeling
When encountering business logic, I ask "who would I send this message to?" to identify the appropriate object. If no existing object fits, I look for new domain objects that emerge from the problem space.

### Rails/Ruby Preferences
- **Vanilla Rails/Ruby**: Stick to standard patterns whenever possible
- **Callbacks**: Use model callbacks with async processing to avoid blocking saves
- **Concerns**: Only use for clear, shared concepts (e.g., `Archivable`). Never as junk drawers to hide code
- **Helpers**: Rarely used, only for generic, reusable frontend utilities
- **Presenters**: For complex page-level view logic
- **Decorators**: Use SimpleDelegator for context-specific object behavior

### Architecture Guidelines
- Follow Sandi Metz's Rules for Developers
- Watch for Law of Demeter violations
- Prefer dependency injection to reduce coupling
- Avoid `stub_any_instance_of` and `stub_chain` - they indicate coupling issues

## Testing Philosophy

### Test-Driven Development
Always lead with tests, whether debugging or building new features. Start with "outside-in" approach:
1. Begin with failing feature test
2. Follow exceptions to lower levels (request specs, unit tests)
3. Work back "out" to ensure higher-level tests pass
4. Repeat cycle

### Test Organization
- **Feature specs**: Comprehensive but expensive - use sparingly for smoke testing happy paths
- **Request specs**: Integration-style testing for edge cases, preferred over controller specs
- **Unit tests**: Abundant and cheap for testing individual objects and edge cases
- **Test pyramid**: More unit tests at base, fewer integration tests, minimal feature tests at top

### Testing Patterns
- Use `describe` instead of `RSpec.describe`
- Keep nesting minimal - prefer flat structure over deep context nesting
- Factory preferences: `build` > `build_stubbed` > `create` (only when necessary)
- **Integration specs**: No mocks/stubs - test end-to-end system behavior
- **Unit specs**: Mock other objects, use as refactoring opportunity
- **Duck typing**: Create shared examples for any role-playing objects
- Use `instance_double` over generic mock objects

### Sandi Metz Testing Guidelines
- **Incoming queries**: Test expected results, don't test outgoing queries
- **Incoming commands**: Test direct public side effects
- **Outgoing commands**: Test that expected messages are sent
- Never assert on messages an object sends to itself

## Code Quality Standards

### Review Criteria
- Code is easy to understand and open to change
- No Law of Demeter violations
- Comprehensive test coverage
- Rubocop compliance
- Public methods documented with YARD (markdown format)
- Classes have top-level documentation

### Documentation Philosophy
- **YARD Documentation**: All public methods and classes require YARD documentation using markdown format
- **Focus on Usage**: Document **what** the method is for and **when** to call it, not **how** it works
- **Complete Tags**: Include proper `@param` and `@return` tags with types and descriptions
- **Context over Implementation**: Provide high-level context for consumers, not implementation details
- **Self-Documenting Code**: Code should be clear through names and structure
- **Minimal External Docs**: Avoid external documentation that can become outdated
- **Living Documentation**: Inline docs serve both humans and AI tools, update when understanding changes

### Red Flags
- Procedural code stuffed into service objects
- Violations of Sandi's Rules
- Heavy coupling between objects
- Missing tests or poor test quality

## Communication & Workflow

### Git Practices
- Clear, informative commit history
- Follow commit template guidelines
- Top-line summary + JIRA ticket + detailed body
- Commits should tell a story of the change

### Gem Selection
- Actively maintained and frequently updated
- High usage stats indicating community adoption
- Well-documented with clear APIs

### Performance Philosophy
- Optimize for readability first
- Only optimize for performance when absolutely necessary
- If performance optimization maintains readability (e.g., eliminating N+1), implement it

### Refactoring Approach
- Leave working code alone unless actively working in that area
- When making changes, evaluate if refactoring would make the change easier
- Refactor to improve understandability
- Use refactoring as opportunity to reduce coupling

## Development Tools & CLI Utilities

### JIRA CLI
I have the JIRA CLI configured locally, which AI tools should leverage for:
- **Ticket Research**: Retrieve detailed information about any JIRA ticket including descriptions, acceptance criteria, and comments
- **Context Gathering**: Understand requirements and background when starting work on a ticket
- **History Tracking**: Research the evolution of features or bug fixes through ticket discussions and updates
- **Requirement Clarification**: Access stakeholder feedback and technical discussions captured in ticket comments

### GitHub CLI (`gh`)
The GitHub CLI is available for comprehensive repository operations:
- **Pull Request Management**: Create, review, and research pull requests with full context
- **Repository Insights**: Understand project history, contributors, and development patterns
- **Issue Research**: Investigate related issues, discussions, and their resolution history
- **Workflow Automation**: Streamline common GitHub operations like creating PRs with proper templates and metadata
- **Code History**: Research commit history, blame information, and change context

### AI Usage Patterns
AI tools should proactively use these utilities:
- **Initial Research Phase**: When starting any ticket, fetch JIRA details and research related PRs/issues
- **Context Building**: Before making changes, understand the full history and requirements
- **PR Creation**: Use `gh` to create well-formatted PRs with appropriate context and links
- **Code Investigation**: Leverage both tools to understand why code exists and how it evolved
- **Documentation**: Reference ticket numbers and PR links in commits and documentation

#### RSpec Execution Preferences
When running RSpec tests, AI tools should optimize for token efficiency while maintaining useful feedback:

**Default Command Pattern**:
```bash
bundle exec rspec --format progress --deprecation-out /dev/null spec/path/to/file_spec.rb
```

**Rationale**:
- `--format progress` uses dots (`.`) instead of full test descriptions, reducing output by 40-50%
- `--deprecation-out /dev/null` suppresses repeated deprecation warnings that add noise
- For large test suites, this can save thousands of tokens per run
- Test descriptions are still visible in the spec file itself when context is needed

**When to Use Documentation Format**:
- Debugging failing tests where you need context about what was being tested
- Exploring unfamiliar test suites to understand coverage
- Override with: `bundle exec rspec --format documentation spec/path/to/file_spec.rb`

Both show the same essential information (2 passing examples), but progress format is dramatically more token-efficient for AI processing.

---

*This document captures my core engineering philosophy and preferences. It serves as a guide for how I approach software development and can inform AI tools about my preferred patterns and practices.*
````
Toward the end of this file, you can see that I also use this opportunity to inform AI of the CLI tools I make use of in my workflow and when they could come in handy so that it knows it can leverage them as well (without me constantly needing to remind it).

I've also noted some AI specific information at the end about how I want it to approach project, and ways it can run specs that reduce the output from the run to save tokens.

## Project Files

The final type of memory I'm going to look at here is project focused memory files. For projects that span more than just some basic back and forth a project file can give be a helpful artifact to hold the context of that what it is you are trying to do. Without this, AI can start to forget what it was trying to accomplish or you can end up having to repeat a lot of context when a session gets interrupted.

I've experimented with two different approaches for starting a project:

The first approach would be to create the project document ahead of time giving an overview of the project, it's goals, and a rough overview of what it would entail. This might be an artifact from your planning processes like a Project Brief document. When starting the project, you tell your AI tool to refer to that project document and save it's context back to the file as it works.

Another way would be just to tell AI to create a file documenting the project plan when you are conversing with it about a new project. It'll create a new file and use it to manage it's memory of the current project. If you are coming back to a new session later, you can refer to that document in your prompt to quickly regain the context you had before in a previous session.

Using a project file on more complex projects can result in behavior that is more focused and less wandering. Once you are done with the project, you can just delete the project file as needed (or use it to have AI update related documentation/READMEs with relevant context before it's deleted).

## Checking Your Context

With all this work on memory files, it helps to know what context your AI tools have at that moment. If you are using Claude, you can run the slash command `/context` which will list in its output all the memory files it currently knows about. This can be helpful as you set things up to make sure the memory files are actually being picked up as you want them to be.


## Remember Me to One Who Codes There

Using the strategies above for documentation that are mostly already best practices in our craft, we'll be able to make use of AI tools in a focused, efficient, and tool agnostic manner.

Maintaining this documentation and saving learnings will become something we do regularly to continue to add value. In a future post I'll look at some custom commands that we could leverage to help us with obtaining and saving these learnings from our sessions. In the meanwhile, I can share this [post by Thomas Landgraf](https://thomaslandgraf.substack.com/p/claude-codes-memory-working-with) that I found inspirational and which discusses some custom prompts that can be used in these ways.

Done right, the value we build with this documentation will be something that benefits not just us, but our team, and even future engineers working on the code base we never meet. By leveraging classic and proven forms of documentation, these memories will survive the hype cycle for any particular tool and prepare us for a future yet unwritten.

