# Ominca English — Simple Tracking Plan

## Purpose
Know which content and channel produces **qualified trial bookings**, then package purchases. Do not optimise for follower count or video views alone.

## Primary conversion
`qualified_trial_booking`

A lead is qualified when they have consented to contact, stated an English-learning goal, and asked for or booked a trial lesson.

## Source mapping
| Touchpoint | Source to record | Link / implementation |
|---|---|---|
| Instagram profile | `instagram_profile` | Use the **Instagram profile link** in `channel-links.md` until the platform sign-up URL is live. |
| Instagram Reel/carousel | `instagram_organic` | Use a campaign-specific tracked link in bio; record the post code in the lead log if they DM |
| Instagram DM | `instagram_dm` | Ask “Откуда вы узнали об Ominca English?” only if source is unknown |
| WhatsApp | `whatsapp` | Use the source-labelled channel links in `channel-links.md`; copy the source from the pre-filled message into the lead log. |
| Telegram | `telegram_bot` | Deep-link to `[PLATFORM LINK]?utm_source=telegram&utm_medium=bot&utm_campaign=launch` |
| Referral | `referral` | Record referrer name only with permission; never infer it |
| Paid Meta test (later) | `meta_paid` | Separate campaign/ad-set/creative values and a test-specific UTM |

## Required lead-log fields
Use `lead-log.csv` initially or move the same fields into the platform CRM when the final source of truth is chosen:
- Date/time, source, consent, goal, level, availability.
- Trial booked/attended.
- Package discussed/purchased.
- Next follow-up date and owner.

## Weekly review (15 minutes)
1. Count qualified trial bookings by source.
2. Count attended trials and packages sold by source.
3. Identify the content/creative attached to the highest-intent leads.
4. Make one decision: keep, change hook/CTA, improve booking route, or pause.

## Before paid ads
Paid ads remain blocked until all five are true:
- [ ] Public platform/trial URL works on mobile.
- [ ] Trial booking is recorded as a conversion.
- [ ] Follow-up owner and response-time standard exist.
- [ ] The 1,500 ₸ trial, package duration, and lesson duration are published accurately.
- [ ] A fixed test budget, date range, and stop rule are approved.
