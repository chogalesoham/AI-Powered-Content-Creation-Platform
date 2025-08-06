import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Heart,
  Copy,
  Eye,
  Sparkles,
  Wand2,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  User,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import TemplateEditorModal from "../components/TemplateEditorModal";

const templates = [
  // Company Updates (10 templates)
  {
    id: 1,
    title: "Milestone Announcement",
    description: "Celebrate company achievements and milestones",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "High",
    preview: `🚀 Excited to share a major milestone: We've just hit [NUMBER] [METRIC]!\n\nWhen we started [COMPANY] [TIME] ago, this felt like a distant dream. Today, it's reality.\n\nHere's what this taught me:\n• [LESSON 1]\n• [LESSON 2]\n• [LESSON 3]\n\nTo our incredible [AUDIENCE]: thank you for believing in our vision.\n\n#StartupJourney #Milestone`,
    likes: 1240,
    uses: 89,
  },
  {
    id: 2,
    title: "Team Growth",
    description: "Announce new team members and expansion",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `🎉 Thrilled to welcome [NAME] to the [COMPANY] family as our new [POSITION]!\n\n[NAME] brings [EXPERIENCE/SKILLS] and will be leading [RESPONSIBILITIES].\n\nWhat excites me most:\n✨ [QUALITY 1]\n✨ [QUALITY 2]\n✨ [QUALITY 3]\n\nWe're growing fast and always looking for exceptional talent. Know someone who'd be a great fit?\n\n#TeamGrowth #Hiring #Welcome`,
    likes: 567,
    uses: 45,
  },
  {
    id: 3,
    title: "Company Values",
    description: "Share your company culture and values",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `What makes [COMPANY] special isn't just what we build—it's how we build it.\n\nOur core values:\n\n🎯 [VALUE 1]: [EXPLANATION]\n🤝 [VALUE 2]: [EXPLANATION]\n💡 [VALUE 3]: [EXPLANATION]\n🚀 [VALUE 4]: [EXPLANATION]\n\nThese aren't just words on a wall. They guide every decision we make.\n\nWhat values drive your organization?\n\n#CompanyCulture #Values #Leadership`,
    likes: 423,
    uses: 32,
  },
  {
    id: 4,
    title: "Office Life",
    description: "Show behind-the-scenes office culture",
    category: "Company Updates",
    platform: "Instagram",
    engagement: "High",
    preview: `Another day at [COMPANY] HQ! 🏢\n\n📸 Swipe to see:\n• Morning standup energy ☕\n• [TEAM] crushing their goals 💪\n• Lunch & learn session 🧠\n• Friday celebration vibes 🎉\n\nBuilding something amazing with an amazing team! 🚀\n\n#OfficeLife #TeamWork #Culture #[COMPANY]Life`,
    likes: 892,
    uses: 156,
  },
  {
    id: 5,
    title: "Partnership Announcement",
    description: "Announce strategic partnerships and collaborations",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "High",
    preview: `🤝 Excited to announce our partnership with [PARTNER COMPANY]!\n\nTogether, we're [COLLABORATION GOAL] to better serve [TARGET AUDIENCE].\n\nWhat this means for you:\n• [BENEFIT 1]\n• [BENEFIT 2]\n• [BENEFIT 3]\n\nBig things happen when great companies work together. Can't wait to share what we're building!\n\n#Partnership #Collaboration #Innovation`,
    likes: 734,
    uses: 67,
  },
  {
    id: 6,
    title: "Company Achievement",
    description: "Celebrate awards, recognitions, and achievements",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "High",
    preview: `🏆 Honored to share that [COMPANY] has been recognized as [AWARD/RECOGNITION]!\n\nThis achievement belongs to our entire team who [EFFORT/DEDICATION].\n\nSpecial thanks to:\n👏 [TEAM/PERSON 1] for [CONTRIBUTION]\n👏 [TEAM/PERSON 2] for [CONTRIBUTION]\n👏 [TEAM/PERSON 3] for [CONTRIBUTION]\n\nThis is just the beginning. Onward and upward! 🚀\n\n#Achievement #TeamWork #Recognition`,
    likes: 1156,
    uses: 89,
  },
  {
    id: 7,
    title: "Quarterly Update",
    description: "Share quarterly business updates and progress",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `Q[NUMBER] in the books! Here's what [COMPANY] accomplished:\n\n📈 Growth:\n• [METRIC 1]: [RESULT]\n• [METRIC 2]: [RESULT]\n• [METRIC 3]: [RESULT]\n\n🎯 Key Wins:\n• [ACHIEVEMENT 1]\n• [ACHIEVEMENT 2]\n• [ACHIEVEMENT 3]\n\n🔮 Looking ahead to Q[NEXT]:\n• [GOAL 1]\n• [GOAL 2]\n• [GOAL 3]\n\nThank you to our team and customers for making this possible!\n\n#QuarterlyUpdate #Growth #Progress`,
    likes: 445,
    uses: 34,
  },
  {
    id: 8,
    title: "Office Move",
    description: "Announce office relocation or expansion",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `📍 Big news: [COMPANY] is moving to a new home!\n\nAfter [TIME PERIOD] at [OLD LOCATION], we're excited to announce our move to [NEW LOCATION].\n\nWhy the move?\n• [REASON 1]\n• [REASON 2]\n• [REASON 3]\n\nOur new address: [ADDRESS]\n\nCan't wait to welcome you to our new space! 🏢\n\n#NewOffice #Growth #Expansion`,
    likes: 323,
    uses: 23,
  },
  {
    id: 9,
    title: "Company Anniversary",
    description: "Celebrate company milestones and anniversaries",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "High",
    preview: `🎂 [NUMBER] years ago today, [COMPANY] was born!\n\nFrom [HUMBLE BEGINNING] to [CURRENT STATE], it's been an incredible journey.\n\nSome highlights:\n✨ [YEAR]: [MILESTONE]\n✨ [YEAR]: [MILESTONE]\n✨ [YEAR]: [MILESTONE]\n✨ [CURRENT YEAR]: [CURRENT MILESTONE]\n\nTo everyone who's been part of this journey—THANK YOU! Here's to the next [NUMBER] years! 🥂\n\n#Anniversary #Milestone #Gratitude`,
    likes: 987,
    uses: 78,
  },
  {
    id: 10,
    title: "Remote Work Update",
    description: "Share updates about remote work policies and culture",
    category: "Company Updates",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `🏠 Remote work update from [COMPANY]:\n\nAfter [TIME PERIOD] of remote/hybrid work, here's what we've learned:\n\n✅ What's working:\n• [SUCCESS 1]\n• [SUCCESS 2]\n• [SUCCESS 3]\n\n🔄 What we're improving:\n• [IMPROVEMENT 1]\n• [IMPROVEMENT 2]\n• [IMPROVEMENT 3]\n\nOur commitment: [POLICY/APPROACH]\n\nHow is your organization adapting to the future of work?\n\n#RemoteWork #FutureOfWork #WorkCulture`,
    likes: 612,
    uses: 45,
  },

  // Thought Leadership (10 templates)
  {
    id: 11,
    title: "Industry Insight",
    description: "Share industry insights and expert opinions",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "Very High",
    preview: `The biggest mistake I see [TARGET] make?\n\nThey focus on [WRONG APPROACH], not [RIGHT APPROACH].\n\nLast week, I [PERSONAL ANECDOTE]. Here's what I learned:\n\n[INSIGHT 1]\n[INSIGHT 2]\n[INSIGHT 3]\n\nThe shift? From [OLD WAY] to [NEW WAY].\n\nWhat's your experience with this?`,
    likes: 2103,
    uses: 156,
  },
  {
    id: 12,
    title: "Industry Commentary",
    description: "React to news and trends in your industry",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "Very High",
    preview: `Hot take on [RECENT NEWS/TREND]:\n\nEveryone's talking about [SURFACE LEVEL OBSERVATION], but they're missing the real story.\n\nHere's what's actually happening:\n\n1. [DEEPER INSIGHT 1]\n2. [DEEPER INSIGHT 2]\n3. [DEEPER INSIGHT 3]\n\nThis will impact [AUDIENCE] because [REASON].\n\nMy prediction: [FUTURE OUTCOME]\n\nThoughts?`,
    likes: 1876,
    uses: 134,
  },
  {
    id: 13,
    title: "Future Predictions",
    description: "Share predictions about industry future",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "High",
    preview: `🔮 My predictions for [INDUSTRY] in [YEAR]:\n\n1️⃣ [PREDICTION 1]\nWhy: [REASONING]\n\n2️⃣ [PREDICTION 2]\nWhy: [REASONING]\n\n3️⃣ [PREDICTION 3]\nWhy: [REASONING]\n\nThe companies that adapt to these changes will thrive. Those that don't... well, we've seen this story before.\n\nWhat's your take? Am I missing something?\n\n#FutureTrends #[INDUSTRY] #Innovation`,
    likes: 1234,
    uses: 89,
  },
  {
    id: 14,
    title: "Contrarian View",
    description: "Challenge popular opinions with data-backed insights",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "Very High",
    preview: `Unpopular opinion: [CONTRARIAN STATEMENT]\n\nI know this goes against conventional wisdom, but hear me out.\n\nThe data shows:\n📊 [DATA POINT 1]\n📊 [DATA POINT 2]\n📊 [DATA POINT 3]\n\nMy theory: [EXPLANATION]\n\nThis matters because [IMPACT].\n\nReady to challenge your assumptions?\n\n#Contrarian #DataDriven #[INDUSTRY]`,
    likes: 1567,
    uses: 112,
  },
  {
    id: 15,
    title: "Lessons Learned",
    description: "Share hard-earned lessons from experience",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "High",
    preview: `[NUMBER] lessons I wish I knew [TIME] ago:\n\n💡 [LESSON 1]\n[BRIEF EXPLANATION]\n\n💡 [LESSON 2]\n[BRIEF EXPLANATION]\n\n💡 [LESSON 3]\n[BRIEF EXPLANATION]\n\n💡 [LESSON 4]\n[BRIEF EXPLANATION]\n\n💡 [LESSON 5]\n[BRIEF EXPLANATION]\n\nWhich one resonates most with your experience?\n\n#LessonsLearned #Experience #Growth`,
    likes: 987,
    uses: 145,
  },
  {
    id: 16,
    title: "Industry Myths",
    description: "Debunk common industry misconceptions",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "High",
    preview: `Let's bust some [INDUSTRY] myths:\n\n❌ Myth: [MYTH 1]\n✅ Reality: [TRUTH 1]\n\n❌ Myth: [MYTH 2]\n✅ Reality: [TRUTH 2]\n\n❌ Myth: [MYTH 3]\n✅ Reality: [TRUTH 3]\n\nThese misconceptions cost businesses [COST/IMPACT].\n\nTime to set the record straight.\n\nWhat other myths should we address?\n\n#MythBusting #[INDUSTRY] #Truth`,
    likes: 1345,
    uses: 98,
  },
  {
    id: 17,
    title: "Framework Share",
    description: "Share a useful framework or methodology",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "Very High",
    preview: `The [FRAMEWORK NAME] framework that changed how I approach [PROBLEM]:\n\n🔹 Step 1: [ACTION]\n[BRIEF DESCRIPTION]\n\n🔹 Step 2: [ACTION]\n[BRIEF DESCRIPTION]\n\n🔹 Step 3: [ACTION]\n[BRIEF DESCRIPTION]\n\n🔹 Step 4: [ACTION]\n[BRIEF DESCRIPTION]\n\nResult: [OUTCOME]\n\nTry this framework and let me know how it works for you!\n\n#Framework #Methodology #[TOPIC]`,
    likes: 2234,
    uses: 189,
  },
  {
    id: 18,
    title: "Market Analysis",
    description: "Provide deep market analysis and insights",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "High",
    preview: `Deep dive: The [MARKET/INDUSTRY] landscape in [YEAR]\n\n📈 Market size: [SIZE]\n📊 Growth rate: [RATE]\n🎯 Key players: [PLAYERS]\n\n🔍 What's driving growth:\n• [DRIVER 1]\n• [DRIVER 2]\n• [DRIVER 3]\n\n⚠️ Challenges ahead:\n• [CHALLENGE 1]\n• [CHALLENGE 2]\n• [CHALLENGE 3]\n\n💡 Opportunities for [TARGET AUDIENCE]:\n[OPPORTUNITY DESCRIPTION]\n\n#MarketAnalysis #[INDUSTRY] #Insights`,
    likes: 1678,
    uses: 76,
  },
  {
    id: 19,
    title: "Technology Impact",
    description: "Discuss how technology is changing your industry",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "High",
    preview: `How [TECHNOLOGY] is reshaping [INDUSTRY]:\n\n🔄 Before:\n• [OLD WAY 1]\n• [OLD WAY 2]\n• [OLD WAY 3]\n\n⚡ Now:\n• [NEW WAY 1]\n• [NEW WAY 2]\n• [NEW WAY 3]\n\n🚀 What's next:\n• [FUTURE 1]\n• [FUTURE 2]\n• [FUTURE 3]\n\nThe companies adapting fastest are seeing [BENEFIT].\n\nHow is your organization preparing for this shift?\n\n#Technology #Innovation #[INDUSTRY]`,
    likes: 1456,
    uses: 87,
  },
  {
    id: 20,
    title: "Success Principles",
    description: "Share principles for success in your field",
    category: "Thought Leadership",
    platform: "LinkedIn",
    engagement: "High",
    preview: `The [NUMBER] principles that separate successful [PROFESSIONALS] from the rest:\n\n1️⃣ [PRINCIPLE 1]\n[EXPLANATION]\n\n2️⃣ [PRINCIPLE 2]\n[EXPLANATION]\n\n3️⃣ [PRINCIPLE 3]\n[EXPLANATION]\n\n4️⃣ [PRINCIPLE 4]\n[EXPLANATION]\n\n5️⃣ [PRINCIPLE 5]\n[EXPLANATION]\n\nMaster these, and you'll be in the top [PERCENTAGE]%.\n\nWhich principle do you struggle with most?\n\n#Success #Principles #[FIELD]`,
    likes: 1789,
    uses: 134,
  },

  // Personal (10 templates)
  {
    id: 21,
    title: "Behind the Scenes",
    description: "Show the human side of your business",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `A day in the life of a [ROLE]:\n\n6:30 AM - [MORNING ROUTINE]\n8:00 AM - [WORK ACTIVITY]\n10:00 AM - [MEETINGS/CALLS]\n2:00 PM - [CORE WORK]\n4:00 PM - [TEAM TIME]\n6:00 PM - [WRAP UP]\n\nBuilding [COMPANY] isn't just about the end result. It's about enjoying the journey.\n\nWhat does your typical day look like?`,
    likes: 567,
    uses: 43,
  },
  {
    id: 22,
    title: "Personal Story",
    description: "Share a personal story with business lessons",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "High",
    preview: `[TIME] ago, I [SITUATION].\n\nI thought [INITIAL THOUGHT].\n\nI was wrong.\n\nHere's what actually happened:\n[STORY DETAILS]\n\nThe lesson? [KEY LESSON]\n\nThis changed how I approach [AREA].\n\nSometimes our biggest failures become our greatest teachers.\n\nWhat's a failure that taught you something valuable?\n\n#PersonalStory #Lessons #Growth`,
    likes: 1234,
    uses: 89,
  },
  {
    id: 23,
    title: "Work-Life Balance",
    description: "Share insights about maintaining work-life balance",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `How I maintain work-life balance as a [ROLE]:\n\n🌅 Morning: [ROUTINE]\n💼 Work: [APPROACH]\n🏠 Evening: [ROUTINE]\n🛌 Night: [ROUTINE]\n\nKey principles:\n• [PRINCIPLE 1]\n• [PRINCIPLE 2]\n• [PRINCIPLE 3]\n\nIt's not perfect, but it works for me.\n\nWhat's your approach to work-life balance?\n\n#WorkLifeBalance #Wellness #Productivity`,
    likes: 789,
    uses: 67,
  },
  {
    id: 24,
    title: "Career Journey",
    description: "Share your career path and transitions",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "High",
    preview: `My career journey in [NUMBER] acts:\n\n🎬 Act 1: [EARLY CAREER]\n[DESCRIPTION]\n\n🎬 Act 2: [MID CAREER]\n[DESCRIPTION]\n\n🎬 Act 3: [CURRENT]\n[DESCRIPTION]\n\nKey transitions:\n• [TRANSITION 1]: [LESSON]\n• [TRANSITION 2]: [LESSON]\n• [TRANSITION 3]: [LESSON]\n\nCareer paths aren't linear. Embrace the plot twists.\n\nWhat's been your biggest career plot twist?\n\n#CareerJourney #Growth #Transitions`,
    likes: 1456,
    uses: 112,
  },
  {
    id: 25,
    title: "Mentorship",
    description: "Share thoughts on mentoring and being mentored",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `The best advice I ever received:\n\n"[ADVICE]"\n\nThis came from [MENTOR] when I was [SITUATION].\n\nAt first, I didn't understand. But [TIME] later, it clicked.\n\nHere's how it changed my approach:\n• [CHANGE 1]\n• [CHANGE 2]\n• [CHANGE 3]\n\nNow I pass this wisdom to others.\n\nWhat's the best advice you've ever received?\n\n#Mentorship #Advice #Wisdom`,
    likes: 678,
    uses: 45,
  },
  {
    id: 26,
    title: "Failure Story",
    description: "Share a failure and what you learned from it",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "High",
    preview: `My biggest professional failure:\n\n[FAILURE DESCRIPTION]\n\nThe impact:\n• [CONSEQUENCE 1]\n• [CONSEQUENCE 2]\n• [CONSEQUENCE 3]\n\nWhat I learned:\n💡 [LESSON 1]\n💡 [LESSON 2]\n💡 [LESSON 3]\n\nHow it changed me:\n[TRANSFORMATION]\n\nFailure isn't the opposite of success—it's part of it.\n\nWhat failure taught you the most?\n\n#Failure #Lessons #Growth`,
    likes: 1567,
    uses: 134,
  },
  {
    id: 27,
    title: "Morning Routine",
    description: "Share your morning routine and productivity tips",
    category: "Personal",
    platform: "Instagram",
    engagement: "Medium",
    preview: `My 6 AM morning routine ☀️\n\n✅ [ACTIVITY 1] - [TIME]\n✅ [ACTIVITY 2] - [TIME]\n✅ [ACTIVITY 3] - [TIME]\n✅ [ACTIVITY 4] - [TIME]\n✅ [ACTIVITY 5] - [TIME]\n\nWhy this works:\n• [BENEFIT 1]\n• [BENEFIT 2]\n• [BENEFIT 3]\n\nHow you start your day sets the tone for everything else 💪\n\n#MorningRoutine #Productivity #Wellness #Success`,
    likes: 892,
    uses: 78,
  },
  {
    id: 28,
    title: "Book Recommendation",
    description: "Recommend books that influenced your thinking",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `📚 Book that changed my perspective: "[BOOK TITLE]" by [AUTHOR]\n\nKey takeaways:\n\n1️⃣ [TAKEAWAY 1]\n[EXPLANATION]\n\n2️⃣ [TAKEAWAY 2]\n[EXPLANATION]\n\n3️⃣ [TAKEAWAY 3]\n[EXPLANATION]\n\nHow I applied it:\n[APPLICATION]\n\nResult: [OUTCOME]\n\nHighly recommend for anyone in [FIELD/SITUATION].\n\nWhat book has influenced your thinking recently?\n\n#BookRecommendation #Learning #Growth`,
    likes: 445,
    uses: 34,
  },
  {
    id: 29,
    title: "Weekend Projects",
    description: "Share personal projects and hobbies",
    category: "Personal",
    platform: "Instagram",
    engagement: "Medium",
    preview: `Weekend project: [PROJECT] 🛠️\n\nWhat started as [INITIAL IDEA] turned into [ACTUAL OUTCOME].\n\nThe process:\n📋 Planning\n🔨 Building\n🎨 Creating\n✨ Finishing touches\n\nWhy I love side projects:\n• [REASON 1]\n• [REASON 2]\n• [REASON 3]\n\nWhat are you building this weekend?\n\n#WeekendProject #Creating #Passion #DIY`,
    likes: 567,
    uses: 23,
  },
  {
    id: 30,
    title: "Gratitude Post",
    description: "Express gratitude and appreciation",
    category: "Personal",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `Feeling grateful today 🙏\n\nFor:\n• [GRATITUDE 1]\n• [GRATITUDE 2]\n• [GRATITUDE 3]\n• [GRATITUDE 4]\n• [GRATITUDE 5]\n\nIn the hustle of building [COMPANY/CAREER], it's easy to forget how much we have to be thankful for.\n\nTaking a moment to appreciate the journey, the people, and the opportunities.\n\nWhat are you grateful for today?\n\n#Gratitude #Appreciation #Mindfulness`,
    likes: 789,
    uses: 56,
  },

  // Educational (10 templates)
  {
    id: 31,
    title: "Quick Tip Thread",
    description: "Share bite-sized valuable insights",
    category: "Educational",
    platform: "Twitter",
    engagement: "High",
    preview: `🧵 [NUMBER] [TOPIC] tips that will [BENEFIT]:\n\n1/ [TIP 1 - KEY POINT]\n\n2/ [TIP 2 - KEY POINT]\n\n3/ [TIP 3 - KEY POINT]\n\n4/ [TIP 4 - KEY POINT]\n\n5/ [TIP 5 - KEY POINT]\n\nWhich tip resonated most with you?`,
    likes: 892,
    uses: 234,
  },
  {
    id: 32,
    title: "How-To Guide",
    description: "Create step-by-step educational content",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "High",
    preview: `How to [SKILL/TASK] in [TIME FRAME]:\n\n📋 Step 1: [ACTION]\n[BRIEF EXPLANATION]\n\n📋 Step 2: [ACTION]\n[BRIEF EXPLANATION]\n\n📋 Step 3: [ACTION]\n[BRIEF EXPLANATION]\n\n📋 Step 4: [ACTION]\n[BRIEF EXPLANATION]\n\n📋 Step 5: [ACTION]\n[BRIEF EXPLANATION]\n\n💡 Pro tip: [BONUS TIP]\n\nSave this for later and share with someone who needs it!\n\n#HowTo #Tutorial #[TOPIC]`,
    likes: 1456,
    uses: 189,
  },
  {
    id: 33,
    title: "Common Mistakes",
    description: "Highlight common mistakes and how to avoid them",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "High",
    preview: `[NUMBER] common [TOPIC] mistakes (and how to fix them):\n\n❌ Mistake 1: [MISTAKE]\n✅ Fix: [SOLUTION]\n\n❌ Mistake 2: [MISTAKE]\n✅ Fix: [SOLUTION]\n\n❌ Mistake 3: [MISTAKE]\n✅ Fix: [SOLUTION]\n\n❌ Mistake 4: [MISTAKE]\n✅ Fix: [SOLUTION]\n\n❌ Mistake 5: [MISTAKE]\n✅ Fix: [SOLUTION]\n\nWhich mistake have you made before?\n\n#Mistakes #Learning #[TOPIC]`,
    likes: 1234,
    uses: 167,
  },
  {
    id: 34,
    title: "Tool Recommendation",
    description: "Recommend useful tools and resources",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `🛠️ [NUMBER] tools that will [BENEFIT]:\n\n1️⃣ [TOOL 1]\n• What it does: [FUNCTION]\n• Why I love it: [REASON]\n• Best for: [USE CASE]\n\n2️⃣ [TOOL 2]\n• What it does: [FUNCTION]\n• Why I love it: [REASON]\n• Best for: [USE CASE]\n\n3️⃣ [TOOL 3]\n• What it does: [FUNCTION]\n• Why I love it: [REASON]\n• Best for: [USE CASE]\n\nWhich tools are in your toolkit?\n\n#Tools #Productivity #Resources`,
    likes: 987,
    uses: 123,
  },
  {
    id: 35,
    title: "Beginner Guide",
    description: "Create beginner-friendly educational content",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `New to [TOPIC]? Start here 👇\n\n🎯 What is [TOPIC]?\n[SIMPLE EXPLANATION]\n\n📚 Essential concepts:\n• [CONCEPT 1]: [EXPLANATION]\n• [CONCEPT 2]: [EXPLANATION]\n• [CONCEPT 3]: [EXPLANATION]\n\n🚀 Getting started:\n1. [FIRST STEP]\n2. [SECOND STEP]\n3. [THIRD STEP]\n\n📖 Resources:\n• [RESOURCE 1]\n• [RESOURCE 2]\n• [RESOURCE 3]\n\nQuestions? Ask in the comments!\n\n#Beginner #[TOPIC] #Learning`,
    likes: 678,
    uses: 89,
  },
  {
    id: 36,
    title: "Myth vs Reality",
    description: "Educational content debunking myths",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "High",
    preview: `[TOPIC] Myths vs Reality:\n\n🚫 MYTH: [MYTH 1]\n✅ REALITY: [REALITY 1]\n\n🚫 MYTH: [MYTH 2]\n✅ REALITY: [REALITY 2]\n\n🚫 MYTH: [MYTH 3]\n✅ REALITY: [REALITY 3]\n\n🚫 MYTH: [MYTH 4]\n✅ REALITY: [REALITY 4]\n\nThese misconceptions hold people back from [GOAL].\n\nTime to set the record straight!\n\nWhat other myths should we bust?\n\n#MythBusting #Education #[TOPIC]`,
    likes: 1345,
    uses: 145,
  },
  {
    id: 37,
    title: "Case Study",
    description: "Share detailed case studies and analysis",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "High",
    preview: `📊 Case Study: How [COMPANY/PERSON] achieved [RESULT]\n\n🎯 Challenge:\n[PROBLEM DESCRIPTION]\n\n💡 Strategy:\n• [APPROACH 1]\n• [APPROACH 2]\n• [APPROACH 3]\n\n📈 Results:\n• [METRIC 1]: [RESULT]\n• [METRIC 2]: [RESULT]\n• [METRIC 3]: [RESULT]\n\n🔑 Key Takeaways:\n1. [LESSON 1]\n2. [LESSON 2]\n3. [LESSON 3]\n\nWhat would you have done differently?\n\n#CaseStudy #Strategy #Results`,
    likes: 1567,
    uses: 134,
  },
  {
    id: 38,
    title: "Skill Development",
    description: "Guide for developing specific skills",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `How to develop [SKILL] in [TIME FRAME]:\n\n📅 Week 1-2: [FOUNDATION]\n• [ACTIVITY 1]\n• [ACTIVITY 2]\n• [ACTIVITY 3]\n\n📅 Week 3-4: [PRACTICE]\n• [ACTIVITY 1]\n• [ACTIVITY 2]\n• [ACTIVITY 3]\n\n📅 Week 5-6: [APPLICATION]\n• [ACTIVITY 1]\n• [ACTIVITY 2]\n• [ACTIVITY 3]\n\n📅 Week 7-8: [MASTERY]\n• [ACTIVITY 1]\n• [ACTIVITY 2]\n• [ACTIVITY 3]\n\n🎯 Success metrics: [METRICS]\n\nReady to level up?\n\n#SkillDevelopment #Learning #Growth`,
    likes: 890,
    uses: 78,
  },
  {
    id: 39,
    title: "Resource Roundup",
    description: "Curate and share valuable resources",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `📚 [TOPIC] Resource Roundup:\n\n📖 Books:\n• [BOOK 1] by [AUTHOR]\n• [BOOK 2] by [AUTHOR]\n• [BOOK 3] by [AUTHOR]\n\n🎧 Podcasts:\n• [PODCAST 1]\n• [PODCAST 2]\n• [PODCAST 3]\n\n🌐 Websites:\n• [WEBSITE 1]\n• [WEBSITE 2]\n• [WEBSITE 3]\n\n🎥 Courses:\n• [COURSE 1]\n• [COURSE 2]\n• [COURSE 3]\n\nBookmark this post for later!\n\nWhat resources would you add?\n\n#Resources #Learning #[TOPIC]`,
    likes: 567,
    uses: 67,
  },
  {
    id: 40,
    title: "FAQ Post",
    description: "Answer frequently asked questions",
    category: "Educational",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `[TOPIC] FAQ - Your questions answered:\n\n❓ Q: [QUESTION 1]\n💡 A: [ANSWER 1]\n\n❓ Q: [QUESTION 2]\n💡 A: [ANSWER 2]\n\n❓ Q: [QUESTION 3]\n💡 A: [ANSWER 3]\n\n❓ Q: [QUESTION 4]\n💡 A: [ANSWER 4]\n\n❓ Q: [QUESTION 5]\n💡 A: [ANSWER 5]\n\nStill have questions? Drop them in the comments!\n\n#FAQ #Questions #[TOPIC]`,
    likes: 445,
    uses: 56,
  },

  // Product (5 templates)
  {
    id: 41,
    title: "Product Launch",
    description: "Announce new features or products",
    category: "Product",
    platform: "Twitter",
    engagement: "High",
    preview: `🎉 [PRODUCT/FEATURE] is now live!\n\nAfter [TIME PERIOD] of building, we're excited to share [MAIN BENEFIT].\n\n✨ What's new:\n• [FEATURE 1]\n• [FEATURE 2]\n• [FEATURE 3]\n\nTry it now: [LINK]\n\nWould love your feedback! 👇`,
    likes: 445,
    uses: 67,
  },
  {
    id: 42,
    title: "Feature Spotlight",
    description: "Highlight specific product features",
    category: "Product",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `🔍 Feature Spotlight: [FEATURE NAME]\n\n💡 What it does:\n[DESCRIPTION]\n\n🎯 Why we built it:\n[PROBLEM IT SOLVES]\n\n✨ How it helps you:\n• [BENEFIT 1]\n• [BENEFIT 2]\n• [BENEFIT 3]\n\n📊 Early results:\n• [METRIC 1]\n• [METRIC 2]\n• [METRIC 3]\n\nReady to try it? [CTA]\n\n#Product #Features #Innovation`,
    likes: 567,
    uses: 45,
  },
  {
    id: 43,
    title: "Customer Success Story",
    description: "Share how customers are using your product",
    category: "Product",
    platform: "LinkedIn",
    engagement: "High",
    preview: `💪 Customer Success Story:\n\n[CUSTOMER NAME] was struggling with [PROBLEM].\n\nUsing [PRODUCT], they:\n• [ACHIEVEMENT 1]\n• [ACHIEVEMENT 2]\n• [ACHIEVEMENT 3]\n\n📈 Results:\n• [METRIC 1]: [IMPROVEMENT]\n• [METRIC 2]: [IMPROVEMENT]\n• [METRIC 3]: [IMPROVEMENT]\n\n"[CUSTOMER QUOTE]" - [CUSTOMER NAME], [TITLE]\n\nSee how [PRODUCT] can help you: [LINK]\n\n#CustomerSuccess #Results #[PRODUCT]`,
    likes: 789,
    uses: 89,
  },
  {
    id: 44,
    title: "Product Update",
    description: "Share product improvements and updates",
    category: "Product",
    platform: "Twitter",
    engagement: "Medium",
    preview: `📱 Product Update: [VERSION/UPDATE NAME]\n\n🆕 New:\n• [NEW FEATURE 1]\n• [NEW FEATURE 2]\n• [NEW FEATURE 3]\n\n🔧 Improved:\n• [IMPROVEMENT 1]\n• [IMPROVEMENT 2]\n• [IMPROVEMENT 3]\n\n🐛 Fixed:\n• [BUG FIX 1]\n• [BUG FIX 2]\n\nUpdate now: [LINK]\n\n#ProductUpdate #NewFeatures`,
    likes: 334,
    uses: 23,
  },
  {
    id: 45,
    title: "Behind the Product",
    description: "Show the development process and team",
    category: "Product",
    platform: "Instagram",
    engagement: "Medium",
    preview: `Behind the scenes: Building [FEATURE] 🛠️\n\nFrom idea to reality in [TIME PERIOD]\n\n📋 Planning phase\n💻 Development sprint\n🎨 Design iterations\n🧪 Testing & feedback\n🚀 Launch day!\n\nOur amazing team made this happen:\n👩‍💻 [TEAM MEMBER 1] - [ROLE]\n👨‍💻 [TEAM MEMBER 2] - [ROLE]\n👩‍🎨 [TEAM MEMBER 3] - [ROLE]\n\n#BehindTheScenes #ProductDevelopment #Team`,
    likes: 456,
    uses: 34,
  },

  // Marketing (5 templates)
  {
    id: 46,
    title: "Social Proof",
    description: "Share testimonials and social proof",
    category: "Marketing",
    platform: "LinkedIn",
    engagement: "High",
    preview: `🌟 What our customers are saying:\n\n"[TESTIMONIAL 1]"\n- [CUSTOMER 1], [COMPANY 1]\n\n"[TESTIMONIAL 2]"\n- [CUSTOMER 2], [COMPANY 2]\n\n"[TESTIMONIAL 3]"\n- [CUSTOMER 3], [COMPANY 3]\n\n📊 The numbers speak too:\n• [STAT 1]\n• [STAT 2]\n• [STAT 3]\n\nReady to join them? [CTA]\n\n#SocialProof #Testimonials #CustomerLove`,
    likes: 678,
    uses: 78,
  },
  {
    id: 47,
    title: "Contest Announcement",
    description: "Announce contests and giveaways",
    category: "Marketing",
    platform: "Instagram",
    engagement: "Very High",
    preview: `🎉 GIVEAWAY TIME! 🎉\n\nWe're giving away [PRIZE] to celebrate [OCCASION]!\n\n🏆 Prize: [DETAILED PRIZE DESCRIPTION]\n💰 Value: [PRIZE VALUE]\n\nHow to enter:\n1️⃣ Follow @[ACCOUNT]\n2️⃣ Like this post\n3️⃣ Tag [NUMBER] friends\n4️⃣ Share to your story\n\n📅 Ends: [DATE]\n🎯 Winner announced: [DATE]\n\nGood luck! 🍀\n\n#Giveaway #Contest #[BRAND]`,
    likes: 1234,
    uses: 156,
  },
  {
    id: 48,
    title: "Limited Time Offer",
    description: "Promote time-sensitive offers and deals",
    category: "Marketing",
    platform: "Twitter",
    engagement: "High",
    preview: `⏰ LIMITED TIME: [OFFER] ends in [TIME]!\n\n🔥 Get [DISCOUNT]% off [PRODUCT/SERVICE]\n\n✨ What's included:\n• [BENEFIT 1]\n• [BENEFIT 2]\n• [BENEFIT 3]\n\n💰 Save [AMOUNT] when you act now!\n\nUse code: [PROMO CODE]\n\nClaim your discount: [LINK]\n\n⏳ Hurry, offer expires [DATE]!\n\n#LimitedTime #Sale #Discount`,
    likes: 567,
    uses: 89,
  },
  {
    id: 49,
    title: "Brand Story",
    description: "Share your brand origin and mission",
    category: "Marketing",
    platform: "LinkedIn",
    engagement: "Medium",
    preview: `The story behind [BRAND] 📖\n\nIt started [TIME] ago when [FOUNDER] noticed [PROBLEM].\n\n💡 The idea:\n[SOLUTION CONCEPT]\n\n🚀 The journey:\n• [MILESTONE 1]\n• [MILESTONE 2]\n• [MILESTONE 3]\n• [MILESTONE 4]\n\n🎯 Our mission:\n[MISSION STATEMENT]\n\n💪 Today we're [CURRENT STATUS] and helping [TARGET AUDIENCE] achieve [GOAL].\n\nWhat's your brand story?\n\n#BrandStory #Mission #Journey`,
    likes: 445,
    uses: 56,
  },
  {
    id: 50,
    title: "User Generated Content",
    description: "Feature content created by your community",
    category: "Marketing",
    platform: "Instagram",
    engagement: "High",
    preview: `📸 Community Spotlight! \n\nLook at this amazing [CONTENT TYPE] from @[USERNAME]!\n\n🌟 They're using [PRODUCT/SERVICE] to [USE CASE]\n\nWhat we love about this:\n• [ASPECT 1]\n• [ASPECT 2]\n• [ASPECT 3]\n\nWant to be featured? \n📩 Tag us in your posts\n📱 Use #[HASHTAG]\n\nWe love seeing how you use [PRODUCT]!\n\n#UserGeneratedContent #Community #Featured`,
    likes: 789,
    uses: 123,
  },
];

const categories = [
  "All",
  "Company Updates",
  "Thought Leadership",
  "Personal",
  "Educational",
  "Product",
  "Marketing",
  "Events",
  "Recruitment",
  "Customer Success",
  "Industry News",
];
const platforms = [
  "All",
  "LinkedIn",
  "Twitter",
  "Instagram",
  "Facebook",
  "TikTok",
  "YouTube",
];

interface UserTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  uses: number;
  likes: number;
}

export default function Templates() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const [copySuccess, setCopySuccess] = useState<number | null>(null);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [showUserTemplates, setShowUserTemplates] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<UserTemplate | null>(
    null
  );

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    const matchesPlatform =
      selectedPlatform === "All" || template.platform === selectedPlatform;

    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const filteredUserTemplates = userTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    const matchesPlatform =
      selectedPlatform === "All" || template.platform === selectedPlatform;

    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const displayTemplates = showUserTemplates
    ? filteredUserTemplates
    : filteredTemplates;

  const toggleFavorite = (templateId: number) => {
    setFavorites((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const useTemplate = (template: any) => {
    // Normalize template structure for the modal
    const normalizedTemplate = {
      id: template.id || Date.now(),
      title: template.title || "Untitled Template",
      description: template.description || "No description available",
      category: template.category || "Personal",
      platform: template.platform || "LinkedIn",
      preview: template.preview || template.content || "No content available",
    };

    setSelectedTemplate(normalizedTemplate);
    setIsModalOpen(true);
  };

  const handleCopyTemplate = async (template: any) => {
    try {
      await navigator.clipboard.writeText(template.preview);
      setCopySuccess(template.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy content. Please try again.");
    }
  };

  const handleTemplateSave = async (editedContent: string) => {
    if (isCreatingTemplate) {
      // Create new user template
      await createUserTemplate(editedContent);
    } else if (editingTemplate) {
      // Update existing user template
      await updateUserTemplate(editingTemplate.id, editedContent);
    } else {
      // Save as new user template from existing template
      await saveAsUserTemplate(editedContent);
    }
  };

  const createUserTemplate = async (content: string) => {
    try {
      const templateData = {
        title: selectedTemplate?.title || "My Custom Template",
        description:
          selectedTemplate?.description || "Custom template created by user",
        category: selectedTemplate?.category || "Personal",
        platform: selectedTemplate?.platform || "LinkedIn",
        content: content,
        isPublic: false,
      };

      const response = await api.post("/templates/user", templateData);

      if (response.data.success) {
        setUserTemplates((prev) => [...prev, response.data.template]);
        console.log("User template created successfully");
      }
    } catch (error) {
      console.error("Failed to create user template:", error);
    }
  };

  const saveAsUserTemplate = async (content: string) => {
    try {
      const templateData = {
        title: `${selectedTemplate?.title} (My Version)`,
        description: `Customized version of ${selectedTemplate?.title}`,
        category: selectedTemplate?.category || "Personal",
        platform: selectedTemplate?.platform || "LinkedIn",
        content: content,
        isPublic: false,
      };

      const response = await api.post("/templates/user", templateData);

      if (response.data.success) {
        setUserTemplates((prev) => [...prev, response.data.template]);
        console.log("Template saved to your templates");
      }
    } catch (error) {
      console.error("Failed to save user template:", error);
    }
  };

  const updateUserTemplate = async (templateId: string, content: string) => {
    try {
      const response = await api.put(`/templates/user/${templateId}`, {
        content: content,
        updatedAt: new Date().toISOString(),
      });

      if (response.data.success) {
        setUserTemplates((prev) =>
          prev.map((template) =>
            template.id === templateId
              ? {
                  ...template,
                  content: content,
                  updatedAt: new Date().toISOString(),
                }
              : template
          )
        );
        console.log("User template updated successfully");
      }
    } catch (error) {
      console.error("Failed to update user template:", error);
    }
  };

  const deleteUserTemplate = async (templateId: string) => {
    try {
      const response = await api.delete(`/templates/user/${templateId}`);

      if (response.data.success) {
        setUserTemplates((prev) =>
          prev.filter((template) => template.id !== templateId)
        );
        console.log("User template deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete user template:", error);
    }
  };

  const loadUserTemplates = async () => {
    try {
      const response = await api.get("/templates/user");

      if (response.data.success) {
        setUserTemplates(response.data.templates);
      }
    } catch (error) {
      console.error("Failed to load user templates:", error);
      // Fallback to empty array if API fails
      setUserTemplates([]);
    }
  };

  useEffect(() => {
    if (user?.niche && user?.goals) {
      generateAIContentIdeas();
    }
    loadUserTemplates();
  }, [user]);

  const generateAIContentIdeas = async () => {
    if (!user?.niche || !user?.goals) return;

    setLoadingAI(true);
    try {
      const response = await api.post("/ai/content-ideas", {
        niche: user.niche,
        goals: user.goals,
        count: 5,
      });

      if (response.data.success) {
        setAiSuggestions(response.data.ideas);
      }
    } catch (error) {
      console.error("Failed to generate AI content ideas:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  // Use the comprehensive categories and platforms from the top of the file

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Content Templates
              </h1>
              <p className="text-gray-600">
                High-performing post formats proven to drive engagement
              </p>
            </div>
          </div>
        </div>

        {/* Template Type Toggle */}
        <div className="mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setShowUserTemplates(false)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showUserTemplates
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Default Templates ({filteredTemplates.length})
            </button>
            <button
              onClick={() => setShowUserTemplates(true)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showUserTemplates
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              My Templates ({filteredUserTemplates.length})
            </button>
          </div>
        </div>

        {/* AI Content Ideas */}
        {user?.niche && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Content Ideas for {user.niche}
                </h2>
              </div>
              <button
                onClick={generateAIContentIdeas}
                disabled={loadingAI}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {loadingAI ? "Generating..." : "Generate New Ideas"}
              </button>
            </div>

            {loadingAI ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-purple-600">
                  Generating personalized content ideas...
                </span>
              </div>
            ) : aiSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiSuggestions.map((idea: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-purple-100"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {idea.platform}
                      </span>
                      <button
                        onClick={() => useTemplate(idea)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Use Idea
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Click "Generate New Ideas" to get personalized content
                  suggestions based on your niche and goals.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Templates
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayTemplates.map((template) => {
            const isUserTemplate = "createdAt" in template;
            const templateId =
              typeof template.id === "string"
                ? template.id
                : template.id.toString();

            return (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {template.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isUserTemplate && (
                        <>
                          <button
                            onClick={() => {
                              setEditingTemplate(template as UserTemplate);
                              setSelectedTemplate({
                                id: template.id,
                                title: template.title,
                                description: template.description,
                                category: template.category,
                                platform: template.platform,
                                preview: template.content,
                              });
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            title="Edit template"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this template?"
                                )
                              ) {
                                deleteUserTemplate(templateId);
                              }
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => toggleFavorite(Number(template.id))}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(Number(template.id))
                            ? "text-red-500 bg-red-50 hover:bg-red-100"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(Number(template.id))
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.platform === "LinkedIn"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {template.platform}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {template.category}
                    </span>
                    {!isUserTemplate && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          (template as any).engagement === "Very High"
                            ? "bg-green-100 text-green-800"
                            : (template as any).engagement === "High"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {(template as any).engagement} Engagement
                      </span>
                    )}
                    {isUserTemplate && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        <Star className="w-3 h-3 inline mr-1" />
                        My Template
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Preview
                      </span>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-6">
                      {isUserTemplate
                        ? template.content
                        : (template as any).preview}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👍 {template.likes.toLocaleString()}</span>
                      <span>📝 {template.uses} uses</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopyTemplate(template)}
                        className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
                          copySuccess === template.id
                            ? "text-green-600 border-green-300 bg-green-50"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {copySuccess === template.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => useTemplate(template)}
                        className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayTemplates.length === 0 && (
          <div className="text-center py-12">
            {showUserTemplates ? (
              <>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No user templates found
                </h3>
                <p className="text-gray-600 mb-4">
                  {userTemplates.length === 0
                    ? "You haven't created any templates yet. Create your first template to get started!"
                    : "Try adjusting your search or filters to find your templates."}
                </p>
                <button
                  onClick={() => {
                    setIsCreatingTemplate(true);
                    setSelectedTemplate({
                      id: "new",
                      title: "New Template",
                      description: "Create your own custom template",
                      category: "Personal",
                      platform: "LinkedIn",
                      preview:
                        "Start writing your template here...\n\nUse [PLACEHOLDER] for dynamic content.",
                    });
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Template
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No templates found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </>
            )}
          </div>
        )}

        {/* Template Editor Modal */}
        <TemplateEditorModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsCreatingTemplate(false);
            setEditingTemplate(null);
          }}
          template={selectedTemplate}
          onSave={handleTemplateSave}
        />
      </div>
    </div>
  );
}
