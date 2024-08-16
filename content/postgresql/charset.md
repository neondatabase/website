[#id](#CHARSET)

## Chapter 24. Localization

**Table of Contents**

- [24.1. Locale Support](locale)

  - [24.1.1. Overview](locale#LOCALE-OVERVIEW)
  - [24.1.2. Behavior](locale#LOCALE-BEHAVIOR)
  - [24.1.3. Selecting Locales](locale#LOCALE-SELECTING-LOCALES)
  - [24.1.4. Locale Providers](locale#LOCALE-PROVIDERS)
  - [24.1.5. ICU Locales](locale#ICU-LOCALES)
  - [24.1.6. Problems](locale#LOCALE-PROBLEMS)

- [24.2. Collation Support](collation)

  - [24.2.1. Concepts](collation#COLLATION-CONCEPTS)
  - [24.2.2. Managing Collations](collation#COLLATION-MANAGING)
  - [24.2.3. ICU Custom Collations](collation#ICU-CUSTOM-COLLATIONS)

- [24.3. Character Set Support](multibyte)

  - [24.3.1. Supported Character Sets](multibyte#MULTIBYTE-CHARSET-SUPPORTED)
  - [24.3.2. Setting the Character Set](multibyte#MULTIBYTE-SETTING)
  - [24.3.3. Automatic Character Set Conversion Between Server and Client](multibyte#MULTIBYTE-AUTOMATIC-CONVERSION)
  - [24.3.4. Available Character Set Conversions](multibyte#MULTIBYTE-CONVERSIONS-SUPPORTED)
  - [24.3.5. Further Reading](multibyte#MULTIBYTE-FURTHER-READING)

This chapter describes the available localization features from the point of view of the administrator. PostgreSQL supports two localization facilities:

- Using the locale features of the operating system to provide locale-specific collation order, number formatting, translated messages, and other aspects. This is covered in [Section 24.1](locale) and [Section 24.2](collation).

- Providing a number of different character sets to support storing text in all kinds of languages, and providing character set translation between client and server. This is covered in [Section 24.3](multibyte).
