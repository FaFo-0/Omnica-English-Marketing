---
name: meta-ads-small-budget
description: How Omnica English plans, tests, reads and scales Meta (Instagram/Facebook) ads on a small budget. Use whenever FaFo asks about ads, boosting, ad results, budgets, creatives to test, Pixel, or what to do next with an ad.
---

# Meta ads on a small budget: the Omnica playbook

Based on Sergio Cardenas's method ("How to Scale Facebook Ads on a Low Budget (Post-Andromeda)", youtube.com/watch?v=rBD9xJswb5k), adapted to Omnica: online 1-to-1 English lessons, Russian-speaking adults in Central Asia, $5–15/day, leads via WhatsApp (and later the website with the Pixel). This is a summary of his ideas, not his words.

## The core idea
Since the Andromeda update, Meta uses the **creative itself** as targeting. The popular advice is "launch 15–20 creatives and let the AI pick", and that only works at $1,000+/day. **On a small budget Meta pours 80–90% of the spend into 1–2 ads, the rest get cents, and they never prove anything.** So we decide where every dollar goes: test fairly, keep the 2–5 winners, cut the rest ("cut the fat"), then build the next test on proven winners.

## Our method (FaFo, 2026-11-23)
FaFo's brother runs his school this way (about 150 students), and FaFo chose it for Omnica:
- **Meta Ads Manager** through a Facebook Page and an ad account, not "Boost" from Instagram.
- **The website is the destination.** Ads send people to `omnicaenglish.com/?lang=ru`; they read the offers there and message FaFo from the site (WhatsApp / Telegram) or sign up.
- **The Meta Pixel** on the website measures page views, taps on WhatsApp/Telegram/«Записаться», and sign-ups. A new Pixel has no history, so start by optimizing for landing-page views and switch to a conversion event (Contact / Lead) once it has a few dozen.
- Creatives to start with: the Mustafa ad and Sally's Reel, maybe a third.
- Still measure **cost per trial booked**, not clicks.

## Step 1: Creative test (CT)
- **One campaign, budget at campaign level (CBO), broad targeting.** No interests: the only variable is the creative.
  - Omnica: Kazakhstan (or the tested country), Russian, adults. Keep Advantage+ audience on, unless leads skew to the wrong ages.
- **3–5 genuinely different creatives**, not small edits of one. Our budget can't fund 16 like his example.
- **Give every ad the same exposure.** Watch impressions and **manually turn each ad off once it reaches the cap** (minimum 1,000; ideally 2,000–3,000). This forces Meta to spend on the others.
  - Budget maths: at our current CPM of ~$18, 1,000 impressions ≈ $18. So 4 ads × 1,000 ≈ $72 ≈ 8 days at $9/day. Fewer ads are better than a cap below 1,000.
- **The scorecard,** once all ads reach the cap:
  - **3-second hook rate** (3-s plays ÷ views): does it stop the scroll? Good is 40%+.
  - **CTR / link CTR:** does it make people act? 3× differences between ads are common.
  - **CPM:** some creatives cost 3× more to show. That's a real cost.
  - **Cost per conversation started** (WhatsApp) or cost per landing-page view (website).
  - **Omnica's real metric: qualified conversations → trials booked.** A cheap ad that brings job seekers is a loser. Tag every WhatsApp lead: student / job seeker / spam, and trial booked yes or no.
- **A winner** finished the cap *and* produced the behaviour we want. A great result after $3 is not a winner yet; let the test finish.
- **Output:** a short list of 2–5 winners, and a list of losers to switch off.

## Step 2: Cut the fat
Turn off everything that isn't a winner. The account looks smaller, but each dollar now goes to proven ads. Never add new creatives to the live winners' campaign; new ideas go into the next creative test.

## Step 3: Destination test (his "landing test", LT)
Same winning creative, different destination, one ad set per destination:
- WhatsApp (Messages goal), vs
- the website homepage `omnicaenglish.com/?lang=ru` (needs the Meta Pixel: page view, tap on «Записаться на пробный урок» / WhatsApp / Telegram, sign-up), vs
- a Meta lead form (name + phone inside Instagram).

Cold traffic often converts better on a page with proof (the homepage: demos, the mistakes card, FAQ) than on the most direct path. Test, don't assume. Compare **cost per trial booked**.

## Step 4: Scale
Only after winners are proven: raise the budget **10–20% every 2–3 days**, and only while cost per result has been stable for 3+ days. Big jumps restart the learning phase. Keep running new creative tests in parallel, because winners wear out in weeks.

## Rules for every ad
- **Don't edit a running ad** (budget, audience, caption): it restarts learning. Stopping is allowed.
- **Day 1 is noise.** Judge at the cap (CT), or after 2–3 days (single ad). Stop rule for a single ad: no student conversations after ~$25–30, or more than ~$8 per conversation.
- **No prices in creatives or captions** (they differ by country). A dated sale («−20% до 31 декабря») only in the country where it applies.
- **Music must be ad-safe,** or the Reel can't be boosted.
- **Learner-facing hooks.** A video that centres the teacher («Это Салли, преподаватель…») attracts job seekers. Open with the learner's problem («Учите слова, но не можете заговорить?»).
- **Reply in WhatsApp within minutes**; every conversation is paid for.
- **Write down every test:** dates, budget, creatives, scorecard, winners. Keep it in `content/<piece>/brief.md` or `ads/` in this repo.

## History
- **2026-11-20: Ad 1.** Sally's Reel boosted from Instagram, WhatsApp messages, Kazakhstan 22–45 (Advantage+ on), $9/day × 6 days. Day 1: $6.57, reach 357 (CPM ≈ $18), 36% hook rate, 1 conversation (a job seeker), 36% of viewers aged 45+. This is our creative #1 baseline. Next: a creative test with 3–4 learner-facing creatives at an equal impression cap.
- **2026-11-22: Ad 1 paused by FaFo** at $11.06: 654 views, reach 599 (CPM ≈ $18), hook rate 33% (214 of 654), 2 conversations at $5.53 each (one job seeker; one real enquiry, «можно узнать подробнее», on Instagram Direct, no reply yet), 1 follow, 0 trials booked. Below the 1,000-impression minimum, so it's a weak read. Takeaways: the opening loses two-thirds of viewers in the first 3 seconds, and the teacher-centred video attracted a job seeker. Next: a creative test with learner-facing hooks (Mustafa ad; Sally with a new hook; a «5 ошибок» Reel; a screen demo), equal impression caps.
- **2026-11-23: Ad 1 stopped** (resumed, then hit the stop rule). Final: $16.87, reach 786, 931 views (CPM ≈ $21), hook rate 31%, 2 conversations (both on day 1) = $8.44 each (above the $8 limit), 12 profile visits, 2 follows, 0 trials. Organic reach of the same Reel (friends' shares) did better than paid. **Verdict:** a teacher-introduction video works organically, among people who trust the sharer, but not as cold paid traffic. No more paid spend until new learner-facing creatives exist. Benchmark for Kazakhstan: about $5–8 per conversation started.
