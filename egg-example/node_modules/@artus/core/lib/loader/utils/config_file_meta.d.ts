export interface ConfigFileMeta {
    env: string;
    namespace?: string;
}
export declare const getConfigMetaFromFilename: (filename: string) => ConfigFileMeta;
