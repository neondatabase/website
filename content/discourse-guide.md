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

To post as another user, a user with Admin privileges needs to "impersonate" the user. Admins can impersonate any user from the Discourse. Simply head to the specific user's page and click the impersonate button. This can be used to troubleshoot a specific user's problems with th Discourse setup or alternatively to post as the system user.

To impersonate a user:

1. Go to their user page in the Discourse community and click the Admin button.

![image](https://user-images.githubusercontent.com/29986707/192566193-ee1f5e43-8af1-4be3-b915-ad6cb62d7b0b.png)

2. Scroll down to the bottom of this page and click the `Impersonate` button.
![image](https://user-images.githubusercontent.com/29986707/192566311-5d123bb5-ffda-435c-83c7-70135197bf59.png)

3. You can now use Discourse as the user you are impersonating.

When you're finished impersonating the chosen user, you need to log out of Discourse, and log back in with your regular account to get back to your profile. Not all staff accounts can impersonate the system user, some will get an error if they attempt to.


The recommended way to post as the system user, you need to create a post with your regular account then use a Staff account ( either Admin or Moderator) to change ownership of the post to system.

To change ownership of a post:

1. Choose the wrench icon at the bottom of a post.

![image](https://user-images.githubusercontent.com/29986707/192567565-fb1d0ea2-48da-4838-89ea-ed10e4c1a218.png)

2. Select `Change Ownership` from the menu.

![image](https://user-images.githubusercontent.com/29986707/192564158-70f48416-7b2f-43ce-879b-d1a47837b568.png)

3. Choose a user to change ownership to.

![image](https://user-images.githubusercontent.com/29986707/192564832-d0b0184d-9279-49a0-88ef-8b133807e9f1.png)

### Staff Category

The Staff Category is only visible to Admins and Moderators, so this can be used for internal discussion about Discourse posts/users. It also has tips about the default Discourse setup.

