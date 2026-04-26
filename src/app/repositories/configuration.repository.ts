export abstract class ConfigurationRepository {
  abstract getBoolean(key: string): Promise<boolean>;
  abstract getString(key: string): Promise<string>;
}
