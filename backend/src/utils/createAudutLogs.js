import { AuditLog } from "../models/auditLog.model.js"

export const createAuditLog = async ({
  user,
  action,
  entityType,
  entityId,
  oldData = null,
  newData = null, //updated entry
  session = null, //
}) => {
  await AuditLog.create(
    [
      {
        user,
        action,
        entityType,
        entityId,
        oldData,
        newData,
      },
    ],
    session ? { session } : {},
  );
};
