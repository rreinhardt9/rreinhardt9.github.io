---
layout: post
title: How to Move Fast (and not slow down)
---

# Focus
- What is the desired outcome?
- Don't go for perfect, go for better. Instead of asking "what is perfect" "ask is this better than what we have right now?"
- Set a circuit breaker to make sure you don't exceed your appetite.
- Think big, work small.

First, you have to find your focus. What does success look like?

When I'm running, I have to set achievable milestones for me to reach on longer runs. I might be running 3 miles, but I'm first going to be focused on mile 1. It might be true that I want to run a 9 minute mile for the whole run but I'm focused on running a 9 minute mile in the first mile at the start.

To find a focus we'll need to think in terms of outcomes. How do we want to make the world better? Why is this worth spending our precious time on? It's also important that this outcome can be understood by everyone involved; it's important that there isn't missing context or opaque jargon that prevents your teammates from participating.

We'll then need to ground that outcome in reality; no matter how important we think our idea is we don't have an infinite appetite in time to reach that outcome. Once we've clearly defined the outcome we want to see in the world we need to figure out what our appetite is for achieving that. To help with that process, think inside the box; a time box that is. Instead of asking "what does perfect look like" ask "what can I do in 3 or 6 weeks and would that be better than right now?". This has several benefits:

- It makes us focus on what is most important in our idea
- It guides us to sharing something quicker with others rather than working toward a big "grand reveal"
- It sets a "circuit breaker" to prevent us from continuing to work on a project that has gone off the rails.

But what about the "perfect" version? How do we account for a larger vision when we are working in time boxes? We have to "think big, work small". We can have and share a vision for the future that is constantly evolving as we "think big", and this will serve as our continuing inspiration as we "work small" to deliver another small part of that vision. The vision will be gauzy and malleable while the work we do in the time box will be clear and specific.


At any given time there are many things in flux for a team so you need to pick out something stable and within sight for you to focus on. In yoga when doing a practicing a balance position you choose a "drishti" (something stable and unmoving to focus on) to give you a point of reference as the rest of you wobbles. For a project, this can be a set period of time that can act for us as our drishti during a project. Inspired by Basecamp's "Shape Up", I've found it helpful to work in cycles that are long enough to accomplish non trivial work but short enough that you can feel the end (our drishti) from the beginning (about 5-6 weeks in practice).

# Build It Right
- Don't build tomorrows tech debt
- Balance between building for tomorrow and short sighted solving todays problem
- Only build what you need
- Ask if you would be OK if it was left the way you've built it.
- Think big, work small.

It's much easier to move fast when an app is young and there is little existing work to stand in your way. But over time if you are to able to continue to move fast will depend on how you work today.

This is difficult and it involves decisions made by everyone on a team (not just engineers).

You can err on the side of overbuilding. When this happens, you are trying to anticipate the needs of the future rather than focusing on what you know today. When this happens, you spend considerable amount of time building stuff for a future you imagine which will slow you down. It will likely slow you down again later when you arrive at that future and it turns out the future was different from how you imagined it. A good way to help avoid this is, instead of trying to imagine the future, but for the use case you know TODAY but do so knowing that you will need to change and evolve in the future. Structure your code and app so that it is not brittle and can handle future change.

Another way you can err is by building the "house of cards" in which you optimize for speed and ease today at the expense of the future. It's important to distinguish this from building just what what you need today. At the end of every time box you should ask yourself, would I be OK if this was the finished product? If you can answer yes, then you are finding a sustainable balance. If instead you answer "no" and feel like there are things you are not comfortable with as a finished product then you might be slowly building the tech debt of tomorrow. Shipping code that is well structured, understandable, documented, and tested is something that you can do over and over in a sustainable way; skimping here in order to boost short term productivity will allow you to burn bright in the beginning but lead to frustration and slowness in the long term.

This is another area that the mantra "think big, work small" can help us. We can think big and imagine all the ways that our code *might* need to change but when we actually go to write it we need to work small by building only what we need and building it "right".

# Collaborate
- Clear lines of communication are essential to moving fast; team size for a project can effect this (diminishing returns)
- Collaborate in the moment of need instead of passing messages whenever possible.
- Communicate at the site of the subject (most times that's not slack).
- All parties at the table; no handoffs
- Share the real thing.

How a team's members relate is essential to it's productivity. When your team is just you or you and another person, this comes naturally because there aren't that many points of communication. But, as your team grows to include different specialists (Project Managers, Designers, Quality Assurance) this introduces more points of communication.

This leads directly to the first thought, which is that for any given project larger teams introduce larger inefficiencies. On it's face, a team of 10 working on the same project should do it faster than a team of 3. In reality, the team of 10 now has much larger communication needs that will lead to that team not being nearly as efficient as the team of three (even if they manage to do it slightly faster). A good way to illustrate this would be to draw 3 dots and then connect each of the dots to the other with lines. Now repeat the exercise with the 10 dots and you can start to visualize the additional lines of communication needed by the larger team. My current rule of thumb is that once you start getting larger than about 3 people on a project (designers, engineers, QA) you start to get diminishing returns for the additional investment; you might be a bit faster but not linearly with your additional investment.

It's important to collaborate in the moment of need and at the site of the subject whenever possible. For example, if you are working with a designer on a page in your application, instead of passing screenshots back and forth can you instead work together in real time while building and tweaking the code? Instead of expecting another engineer to review your code only once it's been completed, can you instead pair program to write that code or at least on key parts? Instead of handing off a ticket to QA for testing, can you instead plan your work together and include them in the building process?

One thing all of these examples have in common is that instead of having a process of hand-offs that could become bottle necks, you are all sitting at the same table to solve a common problem. Instead of "passing off" something to another party, we share responsibility for pushing it forward together.

Another thing is that the communication happens as close to the subject as possible. The worst case scenario is to have a conversation without context (for example, in a random Slack thread or group zoom meeting). If instead, you have that conversation on the story ticket representing a change, that is closer to the subject and provides context for that discussion. Even better might be to have that conversation next to a specific change in the code. The ultimate would be to communicate in real time with the change in question in front of you. The closer your communication happens to the subject at hand, the more fast and efficient your team will be able to operate.

Another way that you can do this is to share the "real thing" as much as possible. Instead of sharing a high quality mockup when discussing a page, build a base as soon as possible and share the real page when having discussions. By doing so, you allow reality push back on and inform you.

# Embrace Change
- You will discover new information that will change your plans; this is good. Optimize for change.
- You may discover that a project you thought was important isn't top priority right now.
- Stay light, make change easy in the way you plan projects. (third order benefits a hazard here)
- Leave the baggage; archive your backlog. If it's important to somebody, they will bring it up and prioritize it.
- Have a plan for how you will assimilate new information as a team during a project.
- Focus on how to succeed; don't form parties and take it personally.
- You won't get it right; learn and change through retros

# Summary

Build something small that is better than today and that leaves a solid foundation for tomorrow in close collaboration with a small party of co-conspirators and eagerly expect and respond to change.
