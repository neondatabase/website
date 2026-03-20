---
title: >-
  Handling Protected Health Information Under HIPAA: Best Practices for
  Developers
description: You’re in HIPAA territory. Here’s how not to blow It
excerpt: >-
  You’re building a healthtech app. Maybe you’ve decided to take on the insane
  complexity of electronic health records, or maybe you’re building an app for
  doctors to communicate with patients, or perhaps you’re creating a platform
  for managing clinical trials. Whatever your specif...
date: '2025-06-13T15:36:17'
updatedOn: '2025-09-30T13:26:44'
category: workflows
categories:
  - workflows
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/hipaa-best-practices-for-developers/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Handling Protected Health Information Under HIPAA: Best Practices for
    Developers - Neon
  description: >-
    Get some tips on how to navigate HIPAA as a developer. Including best
    practices for storing, de-identifying, and securing PHI in your app.
  keywords: []
  noindex: false
  ogTitle: >-
    Handling Protected Health Information Under HIPAA: Best Practices for
    Developers - Neon
  ogDescription: >-
    Get some tips on how to navigate HIPAA as a developer. Including best
    practices for storing, de-identifying, and securing PHI in your app.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/hipaa-best-practices-for-developers/social.jpg
source:
  wpId: 10021
  wpSlug: hipaa-best-practices-for-developers
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/hipaa-best-practices-for-developers/neon-hipaa-1024x576-5757ec55.jpg)

<Admonition type="tip" title="Need HIPAA Compliance?">
To enable HIPAA compliance and get a BAA, follow the instructions in [Neon HIPAA compliance](https://neon.com/docs/security/hipaa) documentation.
</Admonition>

You’re building a healthtech app. Maybe you’ve decided to take on the insane complexity of electronic health records, or maybe you’re building an app for doctors to communicate with patients, or perhaps you’re creating a platform for managing clinical trials.

Whatever your specific use case, if you’re handling any health information that could identify a patient, you’re in HIPAA territory, and the stakes couldn’t be higher. A single data breach or compliance failure can [result in millions of dollars in fines](https://www.freshpaint.io/blog/ignorance-is-no-longer-an-excuse-a-timeline-of-events-around-tracking-technologies-in-healthcare), a destroyed reputation, and, most importantly, a violation of patient trust.

[Neon is now HIPAA-compliant](https://neon.com/blog/hipaa). That means you can securely store and process Protected Health Information (PHI) in a Neon Postgres database backed by our security framework that includes encryption at rest and in transit, role-based access controls, and continuous audit logging.

But, to quote [DBA StackExchange](https://dba.stackexchange.com/questions/345901/best-way-to-achieve-hipaa-compliance-in-a-postgressql-for-patient-data), _“The database is just part of it.”_ Developers, DBAs, data analysts, and data engineers—anyone who might touch sensitive health data—needs to understand HIPAA compliance. Here, we aim to provide you with the background on HIPAA and PHI, so you have the knowledge and ability to handle data proficiently, securely, and in compliance with HIPAA regulations, which is what distinguishes compliant applications from costly violations.

## What is PHI?

[Protected Health Information (PHI)](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html#what) is any _“individually identifiable health information”_ that relates to a person’s health status, provision of healthcare, or payment for healthcare, when held by a covered entity or its associate. In practice, this means that if a piece of health data can be linked to a specific person, it is PHI and is regulated under U.S. HIPAA law.

So, a record like this:

- Name: John Smith
- DOB: 5/12/1985
- Diagnosis: Diabetes
- Treatment date: 3/15/2023
- Facility: Chicago General Hospital

Contains multiple pieces of PHI. Not just the medical diagnosis, but also the name, birth date, treatment date, and facility name. Even seemingly innocent data can become PHI when linked to health information, such as a ZIP code combined with a prescription refill date, an email address in a therapy appointment system, or an IP address logged during a telehealth visit.

This starts to give a clue on why everyone in the data chain needs to understand PHI:

- Is the developer using the IP address for debugging API requests? That IP becomes PHI when logged alongside patient portal activity.
- Is the DBA running a performance query that includes patient names in the execution plan? Those query logs now contain PHI.
- Is the data analyst creating a dashboard showing appointment patterns by ZIP code? If those ZIPs are too granular (like 90210), they could identify specific patients.
- Is the data engineer building an ETL pipeline that temporarily stores complete patient records in a staging table? That staging environment needs the same HIPAA protections as production.

When you are building for healthcare, trivial development practices become compliance nightmares—like using production data to debug issues, storing patient emails in application logs, or including real names in test fixtures.

### What are HIPAA Identifiers?

HIPAA defines 18 specific identifiers that, when connected to health data, make it PHI:

| HIPAA identifier                    | Description / Example                                                                                                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                            | Any patient name (full name or parts of it).                                                                                                                                                                                     |
| **Geographic data**                 | All subdivisions smaller than a state (street address, city, county, precinct, ZIP)._HIPAA Safe Harbor allows using the first 3 digits of ZIP code_ **_only_** _if the population in that area is >20,000; otherwise use `000`_. |
| **Dates (except year)**             | Any dates related to an individual (birth date, admission/discharge dates, date of death, etc.), and **any age over 89** (must be aggregated as 90 or older).                                                                    |
| **Telephone numbers**               | Any phone number (mobile, home, etc.)                                                                                                                                                                                            |
| **Fax numbers**                     | <br />Quick adjustments for both scaling up and down                                                                                                                                                                             |
| **Email addresses**                 | Personal email addresses.                                                                                                                                                                                                        |
| **Social Security numbers**         | U.S. SSNs.                                                                                                                                                                                                                       |
| <br />**Medical record numbers**    | Patient record identifiers.                                                                                                                                                                                                      |
| **Health plan beneficiary numbers** | Insurance or health plan IDs.                                                                                                                                                                                                    |
| **Account numbers**                 | Any account numbers (e.g., billing account).                                                                                                                                                                                     |
| **Certificate/license numbers**     | Professional license or certificate numbers.                                                                                                                                                                                     |
| **Vehicle identifiers**             | Vehicle IDs and serials, including license plate numbers.                                                                                                                                                                        |
| **Device identifiers**              | Device IDs/serial numbers (e.g., implant serials).                                                                                                                                                                               |
| **Web URLs**                        | Web resource locators identifying a person (personal URLs).                                                                                                                                                                      |
| **IP addresses**                    | Internet Protocol addresses linked to an individual.                                                                                                                                                                             |
| **Biometric IDs**                   | Biometric identifiers (fingerprints, voice prints, retinal scans, etc.)                                                                                                                                                          |
| **Full-face photos**                | Full-face photographs and any comparable images of a person.                                                                                                                                                                     |
| **Unique identifying features**     | _Any other_ unique characteristic, code, or identifier that could be tied to a person.                                                                                                                                           |

If health information contains any of the above identifiers (even initials or partial data), it is considered “identified” (and thus PHI). PHI is not just medical test results or diagnoses. It includes any personal detail linked to health data. For example, a lab result tagged only with a patient’s initials and birthdate is still PHI because those are identifying elements. Developers must assume that any combination of health info with personal identifiers is PHI and handle it with the highest care.

## De-Identifying PHI: Safe Harbor vs. Expert Determination

When building healthcare applications, you’ll often need to de-identify data for analytics, testing, or research purposes. HIPAA provides [two methods](https://www.hhs.gov/hipaa/for-professionals/special-topics/de-identification/index.html) to transform PHI into non-PHI data that can be used more freely:

### Safe Harbor Method: The Developer-Friendly Checklist

Safe Harbor is the “just remove these 18 things” approach. It’s prescriptive and straightforward to implement programmatically, making it perfect for most development scenarios.

How it works: Remove all 18 HIPAA identifiers from your dataset. If nothing remains that could identify a person, the data is de-identified.

```python
# Before Safe Harbor (PHI)
patient_record = {
    "name": "John Smith",
    "dob": "1985-05-12",
    "diagnosis": "Diabetes",
    "zip_code": "90210",
    "admission_date": "2023-03-15"
}

# After Safe Harbor (De-identified)
de_identified_record = {
    "patient_id": "HASH_7f3a9b2c",  # Random identifier
    "birth_year": 1985,              # Only year retained
    "diagnosis": "Diabetes",
    "zip_code": "902**",            # First 3 digits only
    "admission_year": 2023          # Only year retained
}
```

- Pros: Easy to implement, verify, and audit. You can write a script that strips these fields.
- Cons: Data loses specificity—no dates beyond year, limited geographic info, which may reduce analytical value.

### Expert Determination: The Data Science Approach

Expert Determination uses statistical methods to ensure re-identification risk is “minimal” while preserving more data utility.

How it works: A qualified expert applies techniques like:

- Date shifting (offsetting all dates by a random number of days)
- Geographic aggregation (county instead of ZIP)
- Age bucketing (45-50 instead of exact age)
- K-anonymity (ensuring each record matches at least K others)

```python
# Before Expert Determination (PHI)
patient_record = {
    "age": 45,
    "diagnosis_date": "2023-03-15",
    "zip_code": "90210",
    "rare_condition": "Progeria"
}

# After Expert Determination (De-identified with more utility)
expert_de_identified = {
    "age_group": "40-50",
    "days_since_diagnosis": 287,  # Relative date
    "region": "Los Angeles County",
    "condition_category": "Rare genetic disorder"
}
```

The expert certifies that combinations of these quasi-identifiers appear in multiple patients, preventing unique identification.

- Pros: Retains more analytical value—you can still see temporal patterns and geographic trends.
- Cons: Requires statistical expertise, formal risk analysis, and documentation.

### Practical Tips for Developers

1. Default to Safe Harbor for test data, development environments, and basic analytics. It’s foolproof if implemented correctly.
2. Watch out for free text. A note saying “45-year-old engineer at Tesla” contains identifiers. Free text fields need special handling or exclusion.
3. Consider Limited Datasets as a middle ground. These retain some identifiers (like dates) but remove direct identifiers (names, contacts). They’re still PHI but useful for research under data use agreements.
4. Automate where possible. Build de-identification into your data pipelines:

```sql
-- Example: Creating a de-identified view
CREATE VIEW patients_deidentified AS
SELECT
  MD5(patient_id) as patient_hash,
  EXTRACT(YEAR FROM birth_date) as birth_year,
  LEFT(zip_code, 3) || '**' as zip_prefix,
  diagnosis_code
FROM patients;
```

5\. Remember: De-identification isn’t just deletion. A 103-year-old with a rare disease on a specific date is still identifiable even without a name. Think about combinations of data points.<br /><br />_When in doubt, strip it out._ It’s better to have less detailed, fully de-identified data than to accidentally leak PHI through an obscure combination of quasi-identifiers.

## Best Practices for Handling PHI in Development

Consider these non-negotiable requirements, not optional guidelines.

### Encryption & Storage

- **Always encrypt PHI at rest and in transit**. Use AES-256 for data at rest and TLS 1.2+ for all network communications. Never store encryption keys in source code—use a dedicated key management service like AWS KMS or HashiCorp Vault. [Neon does this for you](https://neon.com/docs/security/hipaa).
- **Never use real PHI in dev/test environments**. Use synthetic or properly de-identified data for development and testing. If production data is necessary for debugging, require formal approval, use it in an isolated environment, and wipe it immediately after use.
- **Secure all backups and archives**. Encrypt database dumps and backup files before storage, and treat them with the same security controls as production data. When decommissioning storage devices that contain PHI, use secure wiping tools or physical destruction methods.

### Access Control & Authentication

- **Enforce unique user IDs and strong authentication**. Never allow shared accounts for PHI access—every user needs a unique, auditable identity. Implement multi-factor authentication (MFA) for all systems handling PHI, especially patient portals and admin interfaces.
- **Implement role-based access control (RBAC) with the principle of least privilege**. Users should only access the minimum PHI necessary for their job function. A lab technician entering results doesn’t need access to complete patient histories, and a billing clerk doesn’t require clinical notes. [Neon does this for you](https://neon.com/docs/security/hipaa).
- **Set aggressive session timeouts**. PHI applications should automatically log out users after short periods of inactivity. Use secure session management with HttpOnly and Secure flags on cookies, and never expose session IDs in URLs.

### API & Integration Security

- **Never put PHI in URLs or query parameters**. URLs end up in server logs, browser history, and monitoring tools—use POST requests with PHI in the request body instead. Always use opaque identifiers (UUIDs) rather than revealing patient names or record numbers in API paths.
- **Require authentication for all PHI endpoints**. No public API endpoints should ever return PHI—use OAuth 2.0, API keys with specific scopes, or signed tokens. Validate authorization on the server side for every request; never trust client-side checks alone.
- **Vet all third-party integrations for HIPAA compliance**. Any external service that touches PHI needs a Business Associate Agreement (BAA) and proven security controls. (e.g., [Neon has a BAA to conform with HIPAA compliance](https://neon.com/docs/security/hipaa)). This includes seemingly innocuous services such as email providers, SMS gateways, error tracking, and analytics tools.

### Logging & Monitoring

- **Log all PHI access but not PHI content**. Record who accessed what record and when, but avoid logging the actual medical data—log “User X viewed Patient #123” not “User X viewed John Doe’s HIV results.” Treat audit logs as sensitive data with restricted access and long retention periods (six years or more).
- **Actively monitor for suspicious patterns**. Set up alerts for unusual access patterns, such as bulk record downloads, after-hours access, or employees viewing records outside their department. Many insider breaches involve snooping on family members or celebrities—your monitoring should catch this.
- **Never send PHI to external logging services**. Avoid accidentally exposing PHI through error logs, debug output, or monitoring tools. If you must log errors involving PHI, mask or hash sensitive values before they reach any third-party service.

Neon uses [PGAudit](https://www.pgaudit.org/) for [extensive, HIPAA-compliant audit logging](https://neon.com/blog/postgres-logging-vs-pgaudit).

### Development Practices

- **Implement de-identification early in your pipeline**. Build Safe Harbor de-identification into your data export tools—it’s easier to strip the 18 identifiers programmatically than to handle PHI everywhere. For test data generation, use this de-identified production data or fully synthetic datasets.
- **Sanitize all free text fields**. Clinical notes and comments often contain hidden identifiers like “45-year-old Tesla engineer” that violate de-identification. Either exclude free text from de-identified datasets or use NLP tools to detect and redact identifying information.
- **Plan for incident response from day one**. Build features to quickly revoke API keys, deactivate user accounts, and generate compliance reports. You should be able to answer “who accessed what and when” within minutes, not hours, when investigating a potential breach.

### Common Pitfalls to Avoid

- **Watch out for metadata leaks**. Patient photos contain PHI in EXIF data, file names might include patient names, and browser caching can expose sensitive data on shared computers. Set Cache-Control: no-store headers and sanitize all file metadata.
- **Don’t forget about client-side security**. Mobile apps storing PHI need device-level encryption and PIN/biometric protection. Web apps should clear sensitive data from memory when not in use and avoid storing PHI in localStorage or browser databases.
- **Remove all debug endpoints before production**. That /dumpAllRecords test route or admin backdoor will eventually be found by attackers. Utilize environment-specific configurations and automated checks to prevent debug features from reaching production systems.

Implementing these practices isn’t just about avoiding fines; it’s about maintaining the trust patients place in you when they share their most intimate health information.

## Building with Trust

Developing with PHI is challenging. It should be. This is your users’ most sensitive data. You need to treat every piece of health information as if it were your medical record—because someday, it might be.

Many common mistakes come from treating health data “like any other data”. The technical requirements we’ve covered—encryption, access controls, audit logging, secure APIs—are table stakes. What matters more is building a security-first culture where every developer understands that a single leaked database query, an accidentally logged parameter, or a carelessly configured backup can destroy patient trust and your company’s reputation.

Your users are trusting you with information they might not even share with family members. Honor that trust by making security and privacy non-negotiable requirements, not nice-to-have features. In healthcare technology, there’s no such thing as being too careful with PHI.

---

_[Neon](https://neon.com/) is the serverless Postgres platform built for developers, with autoscaling, braching, instant restores and (of course) HIPAA compliance. [Get started with our Free Plan](https://console.neon.tech/signup) and reach out to us for any questions or assistance._
