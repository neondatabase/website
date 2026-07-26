---
title: The Transplant Story That Sparked a Hackathon Project
description: >-
  NephroCompass is a tool built by a kidney transplant survivor, powered by a
  lightweight pipeline on the Neon Data API
excerpt: >-
  “I’ve worked with Postgres, Snowflake, and AWS in my professional environment,
  but for building a side project, I wanted something easier to set up. It
  hardly took me 10 minutes to understand how to link Neon with my application
  and how to make my ML workflows connect to it” (Dee...
date: '2025-12-11T18:00:13'
updatedOn: '2025-12-11T18:11:34'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-transplant-story-that-sparked-a-hackathon-project/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The Transplant Story That Sparked a Hackathon Project - Neon
  description: >-
    How a transplant survivor built NephroCompass, an open-source AI tool for
    early CKD detection powered by machine learning and the Neon Data API.
  keywords: []
  noindex: false
  ogTitle: The Transplant Story That Sparked a Hackathon Project - Neon
  ogDescription: >-
    How a transplant survivor built NephroCompass, an open-source AI tool for
    early CKD detection powered by machine learning and the Neon Data API.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-transplant-story-that-sparked-a-hackathon-project/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-transplant-story-that-sparked-a-hackathon-project/neon-transplant-story-1024x576-c067515d.jpg)

<blockquote>
<p><strong>“I’ve worked with Postgres, Snowflake, and AWS in my professional environment, but for building a side project, I wanted something easier to set up. It hardly took me 10 minutes to understand how to link Neon with my application and how to make my ML workflows connect to it” </strong><br></br><br></br>(<a href="https://www.linkedin.com/in/deepti-bahel/">Deepti Bahel</a>, Data Engineer and creator of <a href="https://medium.com/@baheldeepti/nephrocompass-how-my-own-kidney-transplant-inspired-an-ai-powered-ckd-early-warning-system-1ed40483bec5">NephroCompass</a>)</p>
</blockquote>

The most interesting projects on Neon’s Free Plan always start as personal side projects that developers build to solve a problem they’ve lived themselves. [NephroCompass](https://nephrocompass.streamlit.app/) is one of the most touching ones: an open-source clinical decision support tool built by a data engineer to help detect Chronic Kidney Disease (CKD) risk earlier.

## How NephroCompass Began: Making Kidney Disease Risk Visible

NephroCompass didn’t start as a startup idea. Unfortunately, it began with a life-changing medical event. A few years ago, its creator [Deepti Bahel](https://www.linkedin.com/in/deepti-bahel/) went from feeling healthy to becoming a sudden kidney transplant patient, with “no clear explanation” for why her kidneys had failed. There were no dramatic symptoms, no early warning signs, just a silent decline that ended in emergency surgery and a lifetime of follow-ups.

As she navigated dialysis, transplant recovery, and a routine of constant lab work, one question stayed with her: _Why did no one catch this earlier?_

As a data engineer, she saw a gap that felt both technical and personal. Early signals do exist in routine lab results (markers like GFR, ACR, hemoglobin, creatinine) but patients and clinicians often don’t have tools that interpret those values proactively.

That question eventually turned into a hackathon project. Deepti brought together her medical experience, a CKD dataset shared by a collaborator at Stanford University, and the data science tools she uses every day.

And NephroCompass was born.

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-transplant-story-that-sparked-a-hackathon-project/image-8-1024x582-bbbca36b.png)

NephroCompass is an end-to-end clinical decision support tool that combines several layers of intelligence:

- **Predictive modeling.** It uses [XGBoost](https://xgboost.ai/), [random forest](https://en.wikipedia.org/wiki/Random_forest), and [logistic regression](https://en.wikipedia.org/wiki/Logistic_regression) models trained on a curated CKD dataset. Each model returns a probability score, e.g. a 0.985 likelihood of CKD for a given set of lab values.
- **Explainable AI (SHAP).** SHAP ([Shapley Additive Explanations](https://shap.readthedocs.io/en/latest/)) is a method based on cooperative game theory that explains how much each feature contributes to a model’s prediction. NephroCompass uses SHAP to show why a model flagged someone as high-risk (e.g. elevated creatinine, low GFR, high ACR, or other contributing factors). Each prediction is paired with these feature attributions so clinicians and researchers can get transparency into the model’s reasoning.
- **LLM-powered guidance.** An integrated agent uses the stored results to generate red flags, follow-up steps, and high-level lifestyle suggestions, always paired with clear disclaimers.
- **Historical tracking.** Lab inputs, model predictions, and usage logs are stored behind the scenes, enabling model retraining and ongoing improvement.

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-transplant-story-that-sparked-a-hackathon-project/image-9-1024x545-e10a4686.png)

Behind the interface, NephroCompass relies on a lightweight Postgres setup powered by the [Neon Data API](https://neon.com/docs/data-api/get-started).

## Building on Neon

NephroCompass originally started as a hackathon project, which meant Deepti needed something she could set up quickly and depend on. So she created a [Neon free account](https://console.neon.tech/signup), got the Postgres connection URL, plugged it into [SQLAlchemy](https://www.sqlalchemy.org/)’s `create_engine`, and began structuring her tables. From there, the [Data API](https://neon.com/docs/data-api/get-started) became the single interface she used for reading and writing data.

### A workflow built entirely around the Data API

<blockquote>
<p>“All these AI models and the base data behind that are stored in Neon. Whatever entries I am making in the system, they are all getting stored in the Neon database” <em>(<a href="https://www.linkedin.com/in/deepti-bahel/">Deepti Bahel</a>, Data Engineer and creator of <a href="https://medium.com/@baheldeepti/nephrocompass-how-my-own-kidney-transplant-inspired-an-ai-powered-ckd-early-warning-system-1ed40483bec5">NephroCompass</a>)</em></p>
</blockquote>

Using the Data API, every part of NephroCompass’ workflow runs through the same pipeline:

- Pulling the cleaned CKD dataset into Python to trainmodels
- Using SQLAlchemy and the connection URL from Neon to create structured tables for predictions and logs
- Storing every inference the app runs, including the inputs, outputs, and SHAP explanations
- Retrieving stored data whenever the ML pipeline needs to refresh the models
- Fetching historical results for the agent that generates next-step recommendations

### Lightweight but scalable

NephroCompass is a small project that started in a hackathon, but the data patterns are real – and Deepti is already thinking ahead. She’s planning to turn NephroCompass into a publicly usable app, so she needed something she knew could scale. And after someone close to her shared prostate cancer data, she began planning a second version of the tool using similar techniques. The same Neon setup will support that work too.

## Get Started

If you’re working on your own open-source side project, Neon can give you the Postgres setup you need at every step of the way. [Create a project on the Free Plan](https://console.neon.tech/signup) and start building.

<Admonition type="tip" title="Apply to the Open Source Program">
We sponsor qualifying open source projects that start on our Free Plan, increasing their resource limits and helping them grow. If you’re building in public, scaling, and could use a little headroom, apply to our Open Source Program [here](https://neon.com/programs/open-source).
</Admonition>

_A big thank you to Deepti Bahel for sharing her story and for choosing Neon. You can connect with her_ [via Linkedin](https://www.linkedin.com/in/deepti-bahel) _and read her posts on_ [Medium](https://medium.com/@baheldeepti)_._
