---
title: How to build AI-powered apps using Postgres and DronaHQ
description: A guide to building an AI app with DronaHQ
excerpt: >-
  AI, no-code, and low-code have captured the world’s imagination. Developers
  now have an easier time adding new features than ever before. These new tools
  have really made a difference for developers, helping them build bigger
  systems, and do it all much faster. In this article, I...
date: '2024-01-17T12:15:36'
updatedOn: '2024-02-29T14:51:59'
category: community
categories:
  - community
authors:
  - aaikansh-agrawal
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-ai-powered-apps-using-postgres-and-dronahq/cover.png
  alt: null
isFeatured: false
seo:
  title: How to build AI-powered apps using Postgres and DronaHQ - Neon
  description: A guide to building an AI app with DronaHQ
  keywords: []
  noindex: false
  ogTitle: How to build AI-powered apps using Postgres and DronaHQ - Neon
  ogDescription: >-
    AI, no-code, and low-code have captured the world’s imagination. Developers
    now have an easier time adding new features than ever before. These new
    tools have really made a difference for developers, helping them build
    bigger systems, and do it all much faster. In this article, I want to draw
    your attention to internal tools. Internal […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-ai-powered-apps-using-postgres-and-dronahq/cover.png
---

<img src="https://cdn.neonapi.io/public/images/pages/blog/how-to-build-ai-powered-apps-using-postgres-and-dronahq/image-15-1024x576-d9e3f056.png" alt="Post image" />

AI, no-code, and low-code have captured the world’s imagination. Developers now have an easier time adding new features than ever before. These new tools have really made a difference for developers, helping them build bigger systems, and do it all much faster.

In this article, I want to draw your attention to internal tools. Internal operations that power the lifeblood of your organization, are often running on overly complex systems, or outdated legacy tools, or managed over hard to manage spreadsheets and email threads. While decision-makers see the need for optimized internal tools, often those projects never see the light of the day as more critical projects take priority.

Developers need a fast and reliable way to build digital tools that help them store & manage their data, build frontend on stored databases, and leverage new-age APIs (think OpenAI) without any of the code complexities and all of the powerful capabilities. And these scenarios are precisely where low-code technology is lending a helping hand.

## How can AI and low code help you boost operations?

Let’s think as a sales manager who has got tons of leads captured in a single day but all with different intentions. Traditionally, managing lead details involves toggling between databases, CRM systems, and email platforms, resulting in a fragmented workflow. This would require a unified frontend that manages all leads at the same time.

With low-code, the complexities of traditional coding are minimized, allowing developers to visually design the interface and workflows. Using drag-and-drop elements, developers can seamlessly integrate features like lead capture forms, data tables, and interactive dashboards. The low-code approach accelerates the development process, enabling developers to focus on business logic rather than intricate coding.

Now adding AI power to it and making the conversation with leads more personalized can help the sales team acquire the lead. Low code tools have started integrating AI APIs into their platform helping developers to quickly connect to AI models and build AI-powered applications smoothly.

**To demonstrate it better, let’s consider this example:**

Your growth team needs a tool that allows them to read lead information stored in your database to better manage lead communications and they’d like to send personalized emails to said leads. To make the experience more in line with modern-day practices, they’d also like an AI feature that auto-generates the email subject line and body.

Let’s see how we can use Neon, [DronaHQ](https://www.dronahq.com/), and OpenAI APIs to build this solution in under an hour.

## What we will do

Neon does more than just store data. It keeps things organized, safe, and can handle a lot of information as your needs get bigger. Whether you’re working with leads, user info, or complicated transactions, Neon is built to manage everything smoothly.

On the other hand, DronaHQ, a low-code app development platform lets you build the frontend on top of Neon. With [100+ ready UI controls](https://www.dronahq.com/controls/) and a ready connector for Neon, you can build dynamic forms, dashboards, portals, and more with drag-and-drop simplicity. Additionally, DronaHQ simplifies the integration of AI into your applications by providing a ready [OpenAI connector](https://docs.dronahq.com/reference/connectors/openai/).

With DronaHQ, developers can manage data, automate tasks, and connect seamlessly with their existing systems. DronaHQ heavy-lift app development & deployment tasks with built-in features like user management, SSO, security, environments, version history, audit logs, and analytics.

The possibilities are endless. In this guide, we will walk you through connecting Neon to DronaHQ and building a lead management frontend on top of data stored in Neon that allows you to send AI-generated personalized emails to every lead.

What we need to do is:

1. Set up a database on Neon
2. Connecting Neon to DronaHQ
3. Building lead management app on DronaHQ
4. Adding OpenAI connector and connecting with Gmail

## Setting up Neon

**Step 1:** Register on Neon and initiate a new project

Go to Neon’s website, [make an account](https://console.neon.tech/), and then create a new project on Neon. This project will act as the behind-the-scenes engine for your DronaHQ app.

**Step 2:** Get the connection string

<img src="https://lh7-us.googleusercontent.com/jg46orQydj_Fxs_M1FbAXw_TFvy5Ap6gWtGSwe2WdE586tuozHGdneTBdI81bU02CL7jncihDk2TEk2TWZQmqEmcX6KWOGZEQG9OSm7ngs_OeLuw2K12Ubm9zGJ-fjSrKe-iRi4wzYXchiJNevAYQgE" alt="Post image" width="540" height="285" />

Upon successful project creation in Neon, proceed to the project dashboard. Within this dashboard, locate the essential connection string associated with your database. The connection string helps in establishing the link between Neon and DronaHQ.

## Connecting Neon to DronaHQ

Go to [DronaHQ studio](https://studio.dronahq.com/), log in to your account, or else [sign up](https://www.dronahq.com/signup/) for an account.

After successfully signing in/signing up:

**Step 1:** Adding Neon as a data source in DronaHQ

1. Search for connectors in DronaHQ studio, and select PostgreSQL

<img src="https://lh7-us.googleusercontent.com/oNDN0QLgSsqT8sBwaXA-w4Z_pm1Tjz7DbccODlS3d1KiOcZwWnjwDme4QGzBC_IcsR0JkIChYX83YJynCUwPMxRy279ZDWFFeyP0vobHXMPUUVU6k7fm8VGkHMcoZ_mvmTJrGUJNHWmJhkJglXDDi6U" alt="Post image" width="540" height="285" />

<img src="https://lh7-us.googleusercontent.com/qTd_8Iva9tbT3l5GaRpnzHxtmEPHkAxHHLixbQl-R2weaf9-BdGXz-mkFuhth3H6PwTQ88nc9yWUyQkjGspJEZ6WC6b5pB8YOekTGUzS4L1mJSpI3Wtg8E-1y8pLGGdAltAsg6mq6OnJIm2jjCVBDNM" alt="Post image" width="540" height="285" />

2. Enter the connector name.
3. Now input the connection string.
4. Click on Test and save.

With the connector configured, you’ll find it listed under the custom database connectors. To retrieve data or perform additional actions, simply click on the “Add query” option once your connection is established.

**Step 2:** Adding queries to the Neon connector

<img src="https://lh7-us.googleusercontent.com/kdcekhp6sfYvjzl48iCNKIqDgy_cJmYN7yUPoatm1tQot1jN0miw1fSA8_Jrhe72QGqWZOAAuVcHRTeOj7E9c_qGMT2E7Vh_zWHcxwmSYodOvwY_ixXbcYd56uL9McFQ_1O8OoHONgBKB5H8E6r-uto" alt="Post image" width="540" height="285" />

Within this interface, you have the flexibility to incorporate both simple and complex queries. On the screen’s right-hand side, you’ll encounter a list of tables sourced from the database. By expanding these tables, you gain visibility into the fields associated with each. For our specific use case, it’s essential to configure two distinct queries:

1. Insert Data
2. Retrieve Data

## Building lead management app on DronaHQ

**Step 1:** Designing table UI for a lead management app

1. Navigate to the “Apps” section in the left menu and initiate the app-building process by clicking on the “+” sign.
2. Once your app is created, drag the table grid control from the controls section.

<img src="https://lh7-us.googleusercontent.com/sRXscdhNFPaJPcGXkP5TXgfM0jhsuLwNEDlF8a5abZfGkDoZen_uLoKLcqgpFTz3OldCFolaAnu9t4oFRUbu7NTMOJiZLaAK51Wh7cQJKV2z_b8a_x6uXiM794M4qm6zp8emHuDOeqyWFw6IxEliY0I" alt="Post image" width="540" height="285" />

3. Access its data binding properties, and choose ‘Quick Select’ followed by ‘Connector Library.’

<img src="https://lh7-us.googleusercontent.com/r9Yb6rmRwYfYSua3YvYnaA_AFcAxBEpt_TO0AwLmvrg-baiRr-7H3nm9UiC5_xnNEt87M9Lwm_VRcEkwTEW20rFM6CtFf6AnnHCWV-d1kEvwCXCI0Z5XSK-qPW6cia_DTiKilGZ51mGBfrgKU2eGAic" alt="Post image" width="540" height="285" />

4. A new tray will appear at the bottom, providing you with the interface to establish the data binding for your Table Grid. We’ve prepared a set of Data queries, created to fetch our sales lead data directly from the Neon database.

<img src="https://lh7-us.googleusercontent.com/UEr38cEpW0gP2sl3L1jeaB5vWqc9fhd8cUQcCNT5xVk-aYZd2m52cZBA1B9F0In7nr2J-wwE_ud9l-dtVNBwRkaBNWsTqtDeqaXVDDFPgCs9WiaMQ3MN-LYLxkmXFT5ucPxlytPBHwJtF12QHi-yMMo" alt="Post image" width="540" height="285" />

5. Next, leverage the options in the right sidebar section to customize the columns in your Table Grid. This allows you to specify the columns you wish to include, hide, or remove from your table grid control.

<img src="https://lh7-us.googleusercontent.com/izJVBAyNDwwfsfBOMVCMod3WxSoYLfhfiIWxMTkpmwGSC1LHmFKs7jvf7Z8ywRmTOep1tJ5gk4IqZR9eq9REwwt0kZ_PiAzisZUn6EeH37R88vQ-njx7Dl8s1ldrc2Yo9xnxSGWcacRp2bDtCc7HKqg" alt="Post image" width="540" height="285" />

6. Additionally, customize the Table Grid properties to activate features such as search, filter, and sorting. Easily enable CRUD operations and more by simply toggling the corresponding switches.

<img src="https://lh7-us.googleusercontent.com/KtqUWbC4WOR8K3FrNycMAxej7k6KreRCBj0ejPfbG0tV-ofeQSDhFVSx-696flLue4mnNpVlnMkBbKfgg64fEo90X9zXSWzfmA8X4oEDMqAG34hDlZV_6p6NgMXDHTmducPtl5lJlcm4lz8fwTvDFl0" alt="Post image" width="540" height="285" />

7. Now once the table grid is configured, add a detailed view control to fetch the table grid details into it. In the data-bind section for detailed view control, we have used \{\{tablegridname.PROPERTIES.SELECTEDROWS\}\} query. When you click on any row in the table grid, all the specific details of that row will be displayed in detailed view control.
8. In the detailed view, we will add a button control named “Contact”. We will add a navigation to the email screen. That contact button will navigate to the email screen.

<img src="https://lh7-us.googleusercontent.com/8-9GIORRRosa1L1kD6B5eAp83WQV6YBn0RAyYUr8gQtL_FWeGVaZFkAx0FXv8-onjMPVRDpOrBIP_VVHPoQLn71JMEysSa3WAlOaDgcD1jOHeltmK79IWw-ASACvX8tilU6Dmr0GtQOb2C9YFiZTr4A" alt="Post image" width="540" height="285" />

**Step 2: Creating an email interface for a leads management app**

1. Now to send AI-generated emails, we will build an email screen that will let you send emails to the selected contact from the table grid.
2. To build the email screen, we will select the “Tray” screen option from the screens available and we will use UI controls such as text input, rich text editor, and buttons.

<img src="https://lh7-us.googleusercontent.com/IT5OYwpw2ycD_iko-DWXAhSHefA4ArkB6rKT8Kbjfr5WOVBFpiTqE__J1WX8V4frETsjaTWoP6a0jv7lkWbXDPjdjtXmBqAaNaI0-Ah-UgxkxI7_7XAXBhoEkQLtf5D_4iNwv8nDqLjcC62s502aZBU" alt="Post image" width="540" height="285" />

## Adding OpenAI connector and connecting with Gmail

Now once the email screen is configured, we will connect it with the OpenAI connector to generate emails.

**Step 1: Bind data to controls**

1. For the email UI control, click on the data-bind option and write a query that will take the selected email from the table grid. The query used was \{\{tablegridname.email\}\}

<img src="https://lh7-us.googleusercontent.com/U6dDeG__UqMkyunDAuqVRciXKkL_vr9bRrrl-IkUfWjZ_r-DnXBWhYJQ1k390ecEWw2v8aXZGD6u0OCRyLsxVvjn2Lnqx18JLttwmkcboFlHvJNGwxKXaA1EVIJ92V_r_yGQOBzZw-sDRdw2HCcicaw" alt="Post image" width="540" height="285" />

2. For the subject and email body, we will connect the respective controls with OpenAI to generate the data from AI.
3. Go to the screen open action of the email screen.

<img src="https://lh7-us.googleusercontent.com/n3GMYJBObcrs8GYGNJvR0fMQbPZwkseBNp7fP4zeE4OQZeox5baZbzz-tHRYpfJS4g1rQt7B-CUNv01X6v2-QRmr7UD9Lynz7td5hPhuUK6CKi-M7qUuE0FxxiAkBKQzO-p9f-CWHPpJeZ_RU4RJjqs" alt="Post image" width="540" height="285" />

4. Now in the screen_open action, select server-side action, add the OpenAI connector, select GenerateText action then select environment and continue.

<img src="https://lh7-us.googleusercontent.com/RzeSNluhQ9CdIpPxgEQIcRRjxAtmHhuc6-c9JxmrAj7GV4le7s5dw1BKcHjxnnYZtW7uGjhiiTxLELM9v-xQNAbILpmXvjLj6e-139tv7Fdqazgcunz6Ex_o-Q6ak7jSlhZBy7DFCZIRnEGVl_Ikhns" alt="Post image" width="540" height="285" />

5. Select the model like here we have “text-davinci-003”. Then input the prompt for the email subject line. Click Continue.
6. Give the action name, then add a variable give it a name, and select “output.choices.text”. Click on finish.

<img src="https://lh7-us.googleusercontent.com/sTpaAUyN0sM5310ZEUN12RM-oYekBGvJDg-2uVkO8E6-1CGI8CECVo-PCPwVyzPLZvptDEFUV9pTE9_bYGvSA6arha22TySivc0q9zd5PZul6OMwPuE1VBKb1KLFMr7vma8LmR4CuwnhfJVSVA2Qgxg" alt="Post image" width="540" height="285" />

7. Now in the success branch, we have added an on-screen action for JS code. In the JS code add a keyword for openAI connector and give a test value. Here our test value string had extra characters/symbols, so the below JS code removes the extra symbols.

<img src="https://lh7-us.googleusercontent.com/TYCcYsF8fyWN1ttObbh8BTnV6xxQfI0tBB0xJBgrDwCt7JanIoPmqHLVD-XIfWrA85d_4Mvx8oOzmLQy9G11_zeMIz2uevMwZNHQbVoFIUFez8AYbb45Vn5xnWuneZ8DOW7HGQB3vzSi_KH4RGNt2bc" alt="Post image" width="540" height="285" />

8. Click continue and add a variable, here we have named it “Subject”. Click finish.

<img src="https://lh7-us.googleusercontent.com/51T8zA1G_ab1loE4v5O6PMosCFuGihtvTzsJUUPeh_xJ7clsiqAxnE78NDQf3K87_aMLBnQeUgTou8iccFUdYfnS6Xl-lSKcExxSCksOwopDZV5S8Ahvb1JKP7b2Ua5DHFUim76RRIxFxuzBhTnMI3E" alt="Post image" width="540" height="285" />

9. Now the same method repeats for generating the email body. First, select OpenAI connector from action, then select the model and give it a prompt for the email body. Click continue then add a variable with the value “Output.choices.text”
10. The next step is to add a JS code action in the success branch. Create a variable give it a test value and continue. Then create a variable as we did as “Body”.

<img src="https://lh7-us.googleusercontent.com/5hTziyN9qqnqp878Mv1iNhLqHoODDHZ13Ance87kg1UdmBMMcFMTTupYm29n9x03gZDUvceK2lw8UTdA4-PQOLDusVMOAsw4hBEfA4MlmecrO9mB5WBhOizt-6fwIAyXF4vJpdlViBQOp63RYC3bM98" alt="Post image" width="540" height="285" />

11. Now in the email screen, we have used an input control for the subject line and a rich text editor for the email body.
12. Now the final step is to set the control value. Select the on-screen action of “Set control value”.

Select the subject input control and give it the value that comes from the JS code. Here we have named it as the subject so the value would be “JSCODE.subject”. And same for _rich text editor_ for email bodies.

<img src="https://lh7-us.googleusercontent.com/NauNi197nzlckO-Hnp6gNDu-pDBuDb9N536FCPhqTdYFfCtduX5P6OWvG6wKYyHz4fNFbekK77K7N8kMMnH2lJN-DkKWv6fZU7-giBPvzjsfGLLlPDNiheUCLHuIxbIL0kNpHqAsmDuADgz6XBVGoTM" alt="Post image" width="540" height="285" />

13. The final action flow will look like this.

<img src="https://lh7-us.googleusercontent.com/5LShNVMaffu49riQI_xMw_wkeTRhoW4BPJP7wuPeb0hwilGHx5F2tXNO4jbmXbTpgoOq43B9zZ0K2Omd8gCPN6DTukfqrZlNcejYZGMz1aTPnojlicw88Agt2bnknQQjvFGmTPungQi4GeeEXL7wCwI" alt="Post image" width="540" height="285" />

**Step 2: Connecting with Gmail**

1. Now we will add an email action for every user who clicks on the “Send mail” button.
2. Click on the button and select actions, then go to server-side action and select [Gmail connector](https://docs.dronahq.com/reference/connectors/gmail/). Select the account and then fill in the input details with keywords.

<img src="https://lh7-us.googleusercontent.com/EjbqiDw0yAC3x3e-a2TKT2N4WDa7hqiToCdoOMSZxL9sfRrcVDiV8pvFIcHvJ404TLAEWeQoF4qEIeQal-oSOILkCQc1EXKPtaztRDwkpp5mcoLoqbeZjEx2hrx73pu8by5OJnPOQHYjcUvZA-RRxkY" alt="Post image" width="540" height="285" />

Once all these steps are done, you are ready to send AI-generated emails to respective email IDs.

Watch this video to understand more about adding an OpenAI connector.

## Conclusion

There’s so much you can do with AI, and every AI has an API that you can connect internally and build frontend applications on it. For buyers like CTOs, CIOs, or IT leaders, putting AI capabilities in their apps is a smart move. It helps make better decisions, makes things run smoother, and improves how users experience the apps. With AI, they’re not just solving today’s problems but also making sure their apps stay updated and competitive in the tech world.

Lastly, from setting up connectors to fine-tuning Table Grids, it’s all about making your apps smart and efficient. With Neon’s backbone and DronaHQ’s simplicity, you’re now capable of adding AI power to your data stored in Neon.

[Get started](https://www.dronahq.com/signup/) with DronaHQ today!
