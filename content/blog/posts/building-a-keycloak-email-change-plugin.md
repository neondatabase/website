---
title: Building a Keycloak Email Change Plugin
description: >-
  How to extend Keycloak to securely handle email change events and sync
  external systems
excerpt: >-
  In this post, I’ll share my experience creating a custom Keycloak plugin that
  adds functionality for email change events. This plugin solves a common
  integration challenge: how to trigger actions in your application when users
  change their email addresses through Keycloak. The Pr...
date: '2025-04-09T23:18:26'
updatedOn: '2025-04-09T23:18:32'
category: engineering
categories:
  - engineering
authors:
  - adi-griever
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-a-keycloak-email-change-plugin/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Building a Keycloak Email Change Plugin - Neon
  description: >-
    Learn how we built a Keycloak extension that notifies external systems when
    email changes occur.
  keywords: []
  noindex: false
  ogTitle: Building a Keycloak Email Change Plugin - Neon
  ogDescription: >-
    Learn how we built a Keycloak extension that notifies external systems when
    email changes occur.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-a-keycloak-email-change-plugin/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-keycloak-email-change-plugin/neon-email-change-1-1-1024x576-96ac6966.jpg)

In this post, I’ll share my experience creating a custom Keycloak plugin that adds functionality for email change events. This plugin solves a common integration challenge: how to trigger actions in your application when users change their email addresses through Keycloak.

## The Problem: Keeping Systems in Sync After Email Changes

While Keycloak provides excellent user management capabilities out of the box, including email change functionality, it doesn’t natively support notifying external systems when these changes occur. This can be problematic when you need to sync user data across multiple services or perform specific actions after an email change is confirmed.

## Building a Keycloak Plugin to Hook Into Email Change Events

To address this challenge, I developed a custom Keycloak extension (plugin) that enhances the built-in email update process. The plugin is implemented as a Keycloak Service Provider Interface ([SPI](https://www.keycloak.org/docs/latest/server_development/index.html#_providers)).

Keycloak supports many possible interface extensions allowing addition of custom functionality. More interfaces we take advantage of for example are [AbstractClaimMapper](https://www.keycloak.org/docs-api/latest/javadocs/org/keycloak/broker/oidc/mappers/AbstractClaimMapper.html) to receive `identity_provider_uid` (the unique identifier provided by identity providers) and `org.keycloak.authentication.Authenticator` to create a custom step for authentication flow.

The extension consists of two main components:

1. **A REST endpoint (`update-user-email`)** – This allows the backend to initiate an email change request. It verifies the request, generates an email verification token, and sends a confirmation email to the new address.
2. **A token handler (`NeonUpdateEmailActionTokenHandler`)** – This processes the token when the user clicks the confirmation link, verifies the email update, and ensures data consistency by updating external systems accordingly.

## How It Works

### 1. User Requests an Email Change

When a user requests to change their email, our backend calls the `update-user-email` endpoint. This is implemented as part of a [`RealmResourceProvider`](https://www.keycloak.org/docs-api/latest/javadocs/org/keycloak/services/resource/RealmResourceProvider.html):

```java
@PUT
@Path("/update-user-email/{clientId}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public Response updateUserEmail(@PathParam("clientId") String clientId, String newEmail) {
    auth.require(AccountRoles.MANAGE_ACCOUNT);
    event.event(EventType.UPDATE_EMAIL).detail(Details.CONTEXT, UserProfileContext.ACCOUNT.name());

    UserModel userFromToken = getUserFromToken(session);
    UserModel user = session.users().getUserById(realm, userFromToken.getId());

    if (user == null) {
        return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
    }

    NeonUpdateEmailActionToken actionToken = new NeonUpdateEmailActionToken(
        user.getId(),
        Time.currentTime() + TIMEOUT,
        user.getEmail(), newEmail, clientId, true
    );

    UriInfo uriInfo = session.getContext().getUri();
    String link = Urls.actionTokenBuilder(uriInfo.getBaseUri(), actionToken.serialize(session, realm, uriInfo), clientId, "", "")
        .build(realm.getName()).toString();

    try {
        session.getProvider(EmailTemplateProvider.class)
            .setRealm(realm)
            .setUser(user)
            .sendEmailUpdateConfirmation(link, TimeUnit.SECONDS.toMinutes(TIMEOUT), newEmail);
    } catch (EmailException e) {
        LOG.error("Failed to send email for email update", e);
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }

    return Response.ok().entity("Email sent successfully").build();
}

private UserModel getUserFromToken(KeycloakSession keycloakSession) {
        AccessToken accessToken = Tokens.getAccessToken(keycloakSession);
        if (accessToken.getSessionId() == null) {
            return TokenManager.lookupUserFromStatelessToken(keycloakSession, realm, accessToken);
        }

        UserSessionProvider sessions = keycloakSession.sessions();
        UserSessionModel userSession = sessions.getUserSession(realm, accessToken.getSessionId());

        if (userSession == null) {
            userSession = sessions.getOfflineUserSession(realm, accessToken.getSessionId());
        }

        return userSession.getUser();
    }
```

This method:

- Ensures the user is authorized.
- Generates an email verification token.
- Sends a confirmation email to the new address with a verification link.

### 2. User Confirms the Change

- When the user clicks the verification link, the `NeonUpdateEmailActionTokenHandler` processes the request. This class is based on [UpdateEmailActionTokenHandler](https://github.com/keycloak/keycloak/blob/66f0d2ff1db6f5ec442b0ddab4580bdd652d8877/services/src/main/java/org/keycloak/authentication/actiontoken/updateemail/UpdateEmailActionTokenHandler.java).
- The function `handleToken` gets invoked on email verification link confirmation.
- As part of the email change functionality, we decided to unlink all existing social provider links the user has, as they are based on the email, and by changing the email, the associations with those providers could cause confusion by pointing to the wrong account, potentially causing authentication issues.

```java
@Override
    public Response handleToken(
        NeonUpdateEmailActionToken token,
        ActionTokenContext<NeonUpdateEmailActionToken> tokenContext
    ) {
        KeycloakSession session = tokenContext.getSession();

        AuthenticationSessionModel authenticationSession = tokenContext.getAuthenticationSession();
        UserModel user = authenticationSession.getAuthenticatedUser();

        LoginFormsProvider forms = session
            .getProvider(LoginFormsProvider.class)
            .setAuthenticationSession(authenticationSession)
            .setUser(user);

        String newEmail = token.getNewEmail();

        UserProfile emailUpdateValidationResult;
        try {
            emailUpdateValidationResult = UpdateEmail.validateEmailUpdate(session, user, newEmail);
        } catch (ValidationException pve) {
            return forms.setErrors(Validation.getFormErrorsFromValidation(pve.getErrors()))
                .createErrorPage(Response.Status.BAD_REQUEST);
        }

        UpdateEmail.updateEmailNow(tokenContext.getEvent(), user, emailUpdateValidationResult);

        if (Boolean.TRUE.equals(token.getLogoutSessions())) {
            AuthenticatorUtil.logoutOtherSessions(token, tokenContext);
        }

        tokenContext.getEvent().success();

        // verify user email as we know it is valid as this entry point would never have gotten here.
        user.setEmailVerified(true);

        // remove any required actions to update or verify their email as we know it is now verified and updated
        user.removeRequiredAction(UserModel.RequiredAction.UPDATE_EMAIL);
        tokenContext.getAuthenticationSession().removeRequiredAction(UserModel.RequiredAction.UPDATE_EMAIL);
        user.removeRequiredAction(UserModel.RequiredAction.VERIFY_EMAIL);
        tokenContext.getAuthenticationSession().removeRequiredAction(UserModel.RequiredAction.VERIFY_EMAIL);

        // unlink all social providers links from Keycloak
        RealmModel realm = session.getContext().getRealm();
        UserProvider users = session.users();
        users.getFederatedIdentitiesStream(realm, user)
            .forEach(link -> users.removeFederatedIdentity(realm, user, link.getIdentityProvider()));

        try {
            String oldEmail = token.getOldEmail();
            notifyExternalService(user, newEmail, oldEmail);
        } catch (SQLException e) {
            throw new RuntimeException("ERROR updating database after email change for keycloak user " + user.getId(), e);
        }

        return forms.setAttribute("messageHeader", forms.getMessage("emailUpdatedTitle"))
            .setSuccess("emailUpdated", newEmail)
            .createInfoPage();
    }
```

This handler:

- Validates the token and the new email.
- Updates the email in Keycloak.
- Verifies the email to prevent additional verification prompts.

### 3. External Systems are Updated

To maintain data consistency, we update our backend systems after the email change.

`notifyExternalService` takes care of updating our external service.

## How to Set Up the Plugin in Your Keycloak Instance

To use the plugin, you’ll need to:

1. Add a text file that points to the added provider: `META-INF/services/org.keycloak.services.resource.RealmResourceProviderFactory`
2. Build and deploy the plugin jar to your Keycloak instance:

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-keycloak-email-change-plugin/image-6-1024x156-4632ecda.png)

3\. Use update-user-email API extension to on user request to change email.

## Final Thoughts

By leveraging Keycloak’s extensibility, this solution provides a secure and efficient way to manage email updates while keeping external systems in sync. It ensures that users go through a verification process before their email is changed and that all relevant systems reflect the update without manual intervention.
