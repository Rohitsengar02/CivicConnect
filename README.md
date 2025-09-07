# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Super Admin Setup

To use the super admin features (like approving district admins), you must first create a super admin user in Firebase Authentication and then create a corresponding document in Firestore.

1.  **Create the User:** Go to your Firebase Console -> Authentication -> Users and add a new user with the email and password you have set in your `.env` file for `NEXT_PUBLIC_SUPER_ADMIN_EMAIL` and `NEXT_PUBLIC_SUPER_ADMIN_PASSWORD`.
2.  **Get the UID:** Copy the UID of the user you just created.
3.  **Update Environment:** Paste the UID into the `NEXT_PUBLIC_SUPER_ADMIN_UID` variable in your `.env` file.
4.  **Run the Setup Script:** Run the following command in your terminal to create the necessary Firestore document for the super admin:
    ```bash
    node src/lib/create-super-admin.js
    ```

After completing these steps, you will be able to log in as the super admin and approve/reject district admin applications.
