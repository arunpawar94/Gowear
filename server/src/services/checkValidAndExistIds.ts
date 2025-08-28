import mongoose, { Model, Document, ProjectionType } from "mongoose";

interface CheckIdsResult<T> {
  invalidIds: string[];
  invalidIdsCount: number;
  validIds: string[];
  validIdsCount: number;
  existingDocs: (Document & T)[];
  existingDocsCount: number;
}

export default async function checkValidAndExistIds<T extends Document>(
  ids: string[],
  idsModel: Model<T>,
  projection: ProjectionType<T> = "_id"
): Promise<CheckIdsResult<T>> {
  const invalidIds = ids.filter(
    (id: string) => !mongoose.Types.ObjectId.isValid(id)
  );
  const validIds = ids.filter((id: string) =>
    mongoose.Types.ObjectId.isValid(id)
  );
  if (validIds.length > 0) {
    const existingDocs = await idsModel.find(
      { _id: { $in: validIds } },
      projection
    );
    return {
      invalidIds: invalidIds,
      invalidIdsCount: invalidIds.length,
      validIds,
      validIdsCount: validIds.length,
      existingDocs,
      existingDocsCount: existingDocs.length,
    };
  } else {
    return {
      invalidIds: invalidIds,
      invalidIdsCount: invalidIds.length,
      validIds,
      validIdsCount: validIds.length,
      existingDocs: [],
      existingDocsCount: 0,
    };
  }
}
