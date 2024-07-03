export declare const DEFAULT_LOADER = "module";
export declare const LOADER_NAME_META = "loader:name";
export declare const ArtusInjectPrefix = "artus#";
export declare enum ArtusInjectEnum {
    Application = "artus#application",
    Config = "artus#config",
    DefaultContainerName = "artus#default_container",
    Frameworks = "artus#framework-config",
    LifecycleManager = "artus#lifecycle-manager",
    Packages = "artus#packages"
}
export declare enum ARTUS_DEFAULT_CONFIG_ENV {
    DEV = "development",
    PROD = "production",
    DEFAULT = "default"
}
export declare enum ScanPolicy {
    NamedExport = "named_export",
    DefaultExport = "default_export",
    All = "all"
}
export declare const ARTUS_EXCEPTION_DEFAULT_LOCALE = "en";
export declare const ARTUS_SERVER_ENV = "ARTUS_SERVER_ENV";
export declare const HOOK_NAME_META_PREFIX = "hookName:";
export declare const HOOK_FILE_LOADER = "appHook:fileLoader";
export declare const HOOK_CONFIG_HANDLE = "appHook:configHandle::";
export declare const DEFAULT_EXCLUDES: string[];
export declare const FRAMEWORK_PATTERN = "framework.*";
export declare const PLUGIN_CONFIG_PATTERN = "plugin.*";
export declare const PACKAGE_JSON = "package.json";
export declare const PLUGIN_META_FILENAME = "meta.json";
export declare const EXCEPTION_FILENAME = "exception.json";
export declare const DEFAULT_LOADER_LIST_WITH_ORDER: string[];
export declare const DEFAULT_CONFIG_DIR = "src/config";
export declare const SHOULD_OVERWRITE_VALUE = "shouldOverwrite";
