import {
    get,
    set,
    lock,
} from '~utils/storage';
import errorAction from '~database/utils/errorAction';
import transformDataForDb from '~database/utils/transformDataForDb';
import transformDataFromDb from '~database/utils/transformDataFromDb';

export default async function setData(
    data,
    {
        name,
        key,
        subFieldsKey,
        fields,
        forceUpdate = false,
        ignoreDuplicate = false,
    } = {},
) {
    if (!key) {
        return errorAction(`'key' must be presented to save '${name}' data`);
    }

    return lock(
        key,
        async () => {
            let storageData = await get(key);
            let ignored = false;

            if (storageData
              && (!subFieldsKey || storageData[subFieldsKey])
            ) {
                if (ignoreDuplicate) {
                    ignored = true;
                } else if (!forceUpdate) {
                    const {
                        id,
                    } = data;
                    const info = id ? `id "${id}"` : `key "${key}"`;
                    return errorAction(`Model '${name}' with ${info} already exists.`);
                }
            }

            let modified = [];
            if (!ignored) {
                storageData = !subFieldsKey
                    ? transformDataForDb(fields, data)
                    : {
                        ...storageData,
                        [subFieldsKey]: transformDataForDb(fields, data),
                    };
                await set({
                    [key]: storageData,
                });
                modified = [key];
            }

            return {
                data: {
                    [key]: !subFieldsKey
                        ? transformDataFromDb(fields, storageData)
                        : {
                            [subFieldsKey]: transformDataFromDb(fields, storageData[subFieldsKey]),
                        },
                },
                storage: {
                    [key]: !subFieldsKey
                        ? storageData
                        : {
                            [subFieldsKey]: storageData[subFieldsKey],
                        },
                },
                modified,
            };
        },
    );
}