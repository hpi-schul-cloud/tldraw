import { TDAsset } from "@tldraw/tldraw";
import { API } from "../configuration/api/api.configuration";

export const handleAssets = async (
  assetsBeforeCallback: TDAsset[],
  assetsAfterCallback: TDAsset[],
) => {
  const assetsToRestore = filterUniqueAssetsById(
    assetsBeforeCallback,
    assetsAfterCallback,
  );
  for (const asset of assetsToRestore) {
    await assetRestore(asset);
  }

  const assetsToDelete = filterUniqueAssetsById(
    assetsAfterCallback,
    assetsBeforeCallback,
  );
  for (const asset of assetsToDelete) {
    await deleteAsset(asset);
  }
};

const filterUniqueAssetsById = (
  referenceAssets: TDAsset[],
  assetsToFilter: TDAsset[],
) => {
  const assetIds = referenceAssets.map((asset) => asset.id);
  const uniqueAssets = assetsToFilter.filter(
    (asset) => !assetIds.includes(asset.id),
  );

  return uniqueAssets;
};

const assetRestore = async (asset: TDAsset) => {
  const fileRecordId = getFileRecordId(asset);

  if (fileRecordId) {
    const fileRestoreUrl = API.FILE_RESTORE.replace(
      "FILERECORD_ID",
      fileRecordId,
    );

    await fetch(fileRestoreUrl, {
      method: "POST",
    });
  }
};

export const deleteAsset = async (asset: TDAsset): Promise<void> => {
  const fileRecordId = getFileRecordId(asset);

  if (fileRecordId) {
    const fileDeleteUrl = API.FILE_DELETE.replace(
      "FILERECORD_ID",
      fileRecordId,
    );

    await fetch(fileDeleteUrl, {
      method: "DELETE",
    });
  }
};

const getFileRecordId = (asset: TDAsset): string | undefined => {
  const fileRecordIdRegex = /\/api\/v3\/file\/download\/([a-f0-9]{24})\//;
  const match = asset.src.match(fileRecordIdRegex);

  if (match) {
    return match[1];
  }
};
