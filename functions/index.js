/**
 * POS Enterprise — Firebase Cloud Functions
 *
 * Triggers:
 *    onCreateUserProfile → auto-creates Firebase Auth user when
 *    a document is added to ent-users collection.
 *
 * Deploy:
 *    cd functions && npm install && cd ..
 *    firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const COL_USERS = functions.config().pos?.users_collection || "ent-users";

/**
 * When an admin creates a user profile in Firestore,
 * automatically create the corresponding Firebase Auth user
 * so they can log in immediately.
 *
 * Firestore doc fields expected:
 *   name, email, role?, password?, branchId?
 */
exports.onCreateUserProfile = functions.firestore
  .document(`${COL_USERS}/{docId}`)
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const email = data.email;
    const password = data.password;

    if (!email) {
      functions.logger.warn("No email in user profile doc, skipping Auth creation");
      return;
    }

    // If no password set, generate a random one (user can reset via Forgot Password)
    const authPassword = password || generateTempPassword();

    try {
      const userRecord = await admin.auth().createUser({
        uid: context.params.docId, // use same ID as Firestore doc
        email: email,
        emailVerified: false,
        password: authPassword,
        displayName: data.name || email.split("@")[0],
        disabled: false,
      });

      functions.logger.info(`Auth user created: ${userRecord.uid} (${email})`);

      // Update the Firestore doc with the Auth UID (same as docId)
      await snap.ref.update({
        uid: userRecord.uid,
        authCreatedAt: Date.now(),
        // Remove plain password from Firestore doc after Auth is created
        password: admin.firestore.FieldValue.delete(),
      });

      functions.logger.info(`Profile updated with uid for ${email}`);
    } catch (error) {
      functions.logger.error(`Failed to create Auth user for ${email}:`, error);
    }
  });

/**
 * On user delete from Firestore → disable/delete Auth user too.
 */
exports.onDeleteUserProfile = functions.firestore
  .document(`${COL_USERS}/{docId}`)
  .onDelete(async (snap, context) => {
    const data = snap.data();
    const uid = data?.uid || context.params.docId;

    try {
      await admin.auth().deleteUser(uid);
      functions.logger.info(`Auth user deleted: ${uid}`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        functions.logger.warn(`Auth user not found for deletion: ${uid}`);
      } else {
        functions.logger.error(`Failed to delete Auth user ${uid}:`, error);
      }
    }
  });

function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let pwd = "PosTemp1!"; // prefix ensures complexity
  for (let i = 0; i < 8; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}
