## Discourse Guide

### Changing the Discourse Configuration

If you need to change the Discourse configuration, or install plugins, you'll need to access the `app.yaml` file in Digital Ocean.
To do that launch the Digital Ocean command line and use the following commands:

```
cd /var/discourse
nano containers/app.yml
```
You'll need the above command anytime you want to install plugins or make other configuration changes like moving to a new domain, or mail server.

### Updating Discourse
To update Discourse using the command line in Digital Ocean, use the command: 

`|cd /var/discourse
./launcher rebuild app`

This update should be handled approximately every 3-4 months, it contains changes that aren't available in the GUI.  

To update Discourse from the GUI, a user with admin privileges can head to the Admin Dashboard, where they will see the current Discourse version and they can update Discourse with one-click when there is an available update.

### Impersonating Users

To post as another user, a user with Admin privileges needs to "impersonate" the user. Admins can impersonate any user from the Discourse. Simply head to the specific user's page and click the impersonate button.

To post as the system user, you need to create a post with your regular account then use a Staff account ( either Admin or Moderator) to change ownership of the post to system.
